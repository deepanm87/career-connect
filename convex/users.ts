import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import {
  getUserByIdentity,
  getProfileForUser,
  createUserFromIdentity,
  userDocValidator,
  profileDocValidator
} from "./model"

export const getCurrentUser = query({
  args: {},
  returns: v.union(
    v.object({
      user: userDocValidator,
      profile: v.union(profileDocValidator, v.null())
    }),
    v.null()
  ),
  handler: async ctx => {
    const user = await getUserByIdentity(ctx)
    if (user === null) {
      return null
    }
    const profile = await getProfileForUser(ctx, user._id)
    return { user, profile}
  }
})

export const upsertCurrentUser = mutation({
  args: {},
  returns: userDocValidator,
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (identity === null) {
      throw new Error("Not authenticated")
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", identity.subject))
      .unique()

    const name = 
      identity.name ??
      (typeof identity.givenName === "string" ? identity.givenName : null) ??
      identity.nickname ?? "New Member"
    const email = identity.email ?? `${identity.subject}@users.noreply`
    const imageUrl = typeof identity.pictureUrl === "string" ? identify.pictureUrl : undefined

    if (existing !== null) {
      const patch: {
        name?: string
        email?: string
        imageUrl?: string
      } = {}
      if (existing.name !== name) {
        patch.name = name
      }
      if (existing.email !== email) {
        patch.email = email
      }
      if (
        imageUrl !== undefined &&
        existing.imageStorageId === undefined &&
        existing.imageUrl !== imageUrl
      ) {
        patch.imageUrl = imageUrl
      }
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(existing._id, patch)
      }
      const refreshed = await ctx.db.get(existing._id)
      if (refreshed === null) {
        throw new Error("User vanished during upsert")
      }
      return refreshed
    }

    return await createUserFromIdentity(ctx, identity)
  }
})