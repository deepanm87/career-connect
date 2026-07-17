import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    username: v.string(),
    createdAt: v.number()
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_username", ["username"]),
  
  profiles: defineTable({
    userId: v.id("users"),
    headline: v.string(),
    about: v.string(),
    location: v.string(),
    pronouns: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    targetRole: v.optional(v.string()),
    openToWork: v.boolean(),
    coverImageUrl: v.optional(v.string()),
    coverImageStorageId: v.optional(v.id("_storage")),
    embedding: v.optional(v.array(v.float64())),
    embeddingText: v.optional(v.string())
  }).index("by_userId", ["userId"]),

  experiences: defineTable({
    userId: v.id("users"),
    title: v.string(),
    company: v.string(),
    companyId: v.optional(v.id("companies")),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    description: v.string(),
    location: v.optional(v.string())
  }).index("by_userId", ["userId"]),

  education: defineTable({
    userId: v.id("users"),
    school: v.string(),
    degree: v.string(),
    field: v.string(),
    startYear: v.string(),
    endYear: v.optional(v.string()),
    description: v.optional(v.string())
  }).index("by_userId", ["userId"]),

  skills: defineTable({
    userId: v.id("users"),
    name: v.string(),
    endorsements: v.number()
  }).index("by_userId", ["userId"]),

  skillEndorsements: defineTable({
    skillId: v.id("skills"),
    endorserId: v.id("users"),
  }).index("by_skill_and_endorser", ["skillId", "endorserId"]),

  companies: defineTable({
    name: v.string(),
    slug: v.string(),
    logoUrl: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    coverImageUrl: v.optional(v.string()),
    coverImageStorageId: v.optional(v.id("_storage")),
    industry: v.string(),
    size: v.string(),
    location: v.string(),
    about: v.string(),
    websiteUrl: v.optional(v.string()),
    orgId: v.optional(v.string()),
    ownerId: v.optional(v.id("users"))
  })
    .index("by_slug", ["slug"])
    .index("by_orgId", ["orgId"])
    .index("by_ownerId", ["ownerId"]),
  
  jobs: defineTable({
    title: v.string(),
    companyId: v.id("companies"),
    recruiterId: v.optional(v.id("recruiters")),
    createdBy: v.optional(v.id("users")),
    status: v.optional(v.union(v.literal("open"), v.literal("closed"))),
    salaryMin: v.number(),
    salaryMax: v.number(),
    currency: v.string(),
    skillsRequired: v.array(v.string()),
    seniority: v.union(
      v.literal("intern"),
      v.literal("junior"),
      v.literal("mid"),
      v.literal("senior"),
      v.literal("staff"),
      v.literal("principal")
    ),
    workMode: v.union(
      v.literal("remote"),
      v.literal("hybrid"),
      v.literal("onsite")
    ),
    location: v.string(),
    description: v.string(),
    postedAt: v.number(),
    embedding: v.optional(v.array(v.float64()))
  })
    .index("by_companyId", ["companyId"])
    .index("by_seniority", ["seniority"])
    .index("by_workMode", ["workMode"]),

  applications: defineTable({
    jobId: v.id("jobs"),
    userId: v.id("users"),
    companyId: v.id("companies"),
    coverNote: v.optional(v.string()),
    status: v.union(
      v.literal("submitted"),
      v.literal("reviewed"),
      v.literal("interviewing"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("withdrawn")
    ),
    statusHistory: v.optional(
      v.array(
        v.object({
          status: v.union(
            v.literal("submitted"),
            v.literal("reviewed"),
            v.literal("interviewing"),
            v.literal("offer"),
            v.literal("rejected"),
            v.literal("withdrawn")
          ),
          at: v.number()
        })
      )
    ),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_job", ["jobId"])
    .index("by_user", ["userId"])
    .index("by_user_and_job", ["userId", "jobId"])
    .index("by_company", ["companyId"]),

  posts: defineTable({
    authorId: v.id("users"),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    editedAt: v.optional(v.number()),
    kind: v.union(
      v.literal("update"),
      v.literal("hiring"),
      v.literal("hot_take"),
      v.literal("launch")
    ),
    likeCount: v.number(),
    commentCount: v.number()
  }).index("by_author", ["authorId"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    content: v.string()
  }).index("by_post", ["postId"]),

  likes: defineTable({
    postId: v.id("posts"),
    userId: v.id("users")
  })
    .index("by_post_and_user", ["postId", "userId"])
    .index("by_user", ["userId"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users")
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_follower_and_following", ["followerId", "followingId"]),

  notifications: defineTable({
    userId: v.id("users"),
    actorId: v.optional(v.id("users")),
    type: v.union(
      v.literal("like"),
      v.literal("comment"),
      v.literal("follow"),
      v.literal("endorsement"),
      v.literal("application"),
      v.literal("application_status")
    ),
    message: v.string(),
    postId: v.optional(v.id("posts")),
    jobId: v.optional(v.id("jobs")),
    applicationId: v.optional(v.id("applications")),
    read: v.boolean(),
    createdAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "read"]),

  savedJobs: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobs"),
    savedAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_user_and_job", ["userId", "jobId"]),
  
  recruiters: defineTable({
    userId: v.optional(v.id("users")),
    name: v.string(),
    title: v.string(),
    companyId: v.id("companies"),
    imageUrl: v.optional(v.string()),
    email: v.optional(v.string())
  }).index("by_company", ["companyId"]),

  outreachDrafts: defineTable({
    userId: v.id("users"),
    jobId: v.optional(v.id("jobs")),
    recruiterId: v.optional(v.id("recruiters")),
    tone: v.optional(v.string()),
    connectionMessage: v.string(),
    recruiterDm: v.string(),
    subject: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("saved")),
    createdAt: v.number()
  }).index("by_userId", ["userId"]),

  profileDrafts: defineTable({
    userId: v.id("users"),
    headline: v.string(),
    about: v.string(),
    experienceBullets: v.array(v.string()),
    suggestedSkills: v.array(v.string()),
    explanation: v.string(),
    targetRole: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("saved"),
      v.literal("applied")
    ),
    createdAt: v.number()
  }).index("by_userId", ["userId"]),

  careerPlans: defineTable({
    userId: v.id("users"),
    goal: v.string(),
    summary: v.optional(v.string()),
    phases: v.array(
      v.object({
        period: v.union(v.literal("30"), v.literal("60"), v.literal("90")),
        focus: v.string(),
        milestones: v.array(v.string())
      })
    ),
    weeklyMilestones: v.array(v.string()),
    projectIdeas: v.array(v.string()),
    skillsToLearn: v.array(v.string()),
    jobsToApplyFirst: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("saved")),
    createdAt: v.number()
  }).index("by_userId", ["userId"]),

  aiRuns: defineTable({
    userId: v.id("users"),
    feature: v.union(
      v.literal("profile_optimizer"),
      v.literal("job_matcher"),
      v.literal("outreach_writer"),
      v.literal("career_plan")
    ),
    status: v.string(),
    sessionId: v.optional(v.string()),
    createdAt: v.number()
  }).index("by_userId", ["userId"])
})