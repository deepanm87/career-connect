import { v } from "convex/values"
import { mutation } from "./_generated/server"
import type { MutationCtx } from "./_generated/server"
import type { Id } from "./_generated/dataModel"
import {
  getUserByIdentity,
  getProfileForUser,
  assertCompanyAdmin
} from "./model"
import { UserKey } from "lucide-react"

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async ctx => {
    const me = await getUserByIdentity(ctx)
    if (me === null) {
      throw new Error("Not authenticated")
    }
    return await ctx.storage.generateUploadUrl()
  }
})

async function urlFor(
  ctx: MutationCtx,
  storageId: Id<"_storage">
): Promise<string> {
  const url = await ctx.storage.getUrl(storageId)
  if (url === null) {
    throw new Error("Uploaded file not found")
  }
  return url
}

async function deleteOld(
  ctx: MutationCtx,
  storageId: Id<"_storage"> | undefined,
): Promise<void> {
  if (storageId === undefined) {
    return
  }
  try {
    await ctx.storage.delete(storageId)
  } catch {

  }
}

export const setMyAvatar = mutation({
  args: { storageId: v.optional(v.id("_storage")) },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const me = await getUserByIdentity(ctx)
    if (me === null) {
      throw new Error("Not authenticated")
    }
    await deleteOld(ctx, me.imageStorageId)
    if (args.storageId === undefined) {
      await ctx.db.patch(me._id, {
        imageUrl: undefined,
        imageStorageId: undefined
      })
      return null
    }
    const url = await urlFor(ctx, args.storageId)
    await ctx.db.patch(me._id, {
      imageUrl: url,
      imageStorageId: args.storageId
    })
    return url
  }
})

export const setMyProfileCover = mutation({
  args: { storageId: v.optional(v.id("_storage")) },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const me = await getUserByIdentity(ctx)
    if (me === null) {
      throw new Error("Not authenticated")
    }
    const profile = await getProfileForUser(ctx, me._id)
    if (profile === null) {
      throw new Error("Profile not found")
    }
    await deleteOld(ctx, profile.coverImageStorageId)
    if (args.storageId === undefined) {
      await ctx.db.patch(profile._id, {
        coverImageUrl: undefined,
        coverImageStorageId: undefined
      })
      return null
    }
    const url = await urlFor(ctx, args.storageId)
    await ctx.db.patch(profile._id, {
      coverImageUrl: url,
      coverImageStorageId: args.storageId
    })
    return url
  }
})

export const setCompanyLogo = mutation({
  args: {
    companyId: v.id("companies"),
    storageId: v.optional(v.id("_storage"))
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const { company } = await assertCompanyAdmin(ctx, args.companyId)
    await deleteOld(ctx, company.logoStorageId)
    if (args.storageId === undefined) {
      await ctx.db.patch(company._id, {
        logoUrl: undefined,
        logoStorageId: undefined
      })
      return null
    }
    const url = await urlFor(ctx, args.storageId)
    await ctx.db.patch(company._id, {
      logoUrl: url,
      logoStorageId: args.storageId
    })
    return url
  }
})

export const setCompanyCover = mutation({
  args: {
    companyId: v.id("companies"),
    storageId: v.optional(v.id("_storage"))
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const { company } = await assertCompanyAdmin(ctx, args.companyId)
    await deleteOld(ctx, company.coverImageStorageId)
    if (args.storageId === undefined) {
      await ctx.db.patch(company._id, {
        coverImageUrl: undefined,
        coverImageStorageId: undefined
      })
      return null
    }
    const url = await urlFor(ctx, args.storageId)
    await ctx.db.patch(company._id, {
      coverImageUrl: url,
      coverImageStorageId: args.storageId
    })
    return url
  }
})

