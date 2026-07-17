import { v } from "convex/values"
import { mutation } from "./_generated/server"
import { getUserByIdentity, getProfileForUser } from "./model"

const ALEX = {
  name: "Alex Carter",
  username: "alex-carter",
  profile: {
    headline: "Frontend Developer | React enthusiast",
    about: "Frontend developer who loves building clean, responsive UIs with React and Next.js. Passionate about pixel-perfect design and great user experience. Always looking to learn and grow.",
    location: "London UK",
    targetRole: "Next.js AI Engineer",
    openToWork: true
  },
  experiences: [
    {
      title: "Frontend Developer",
      company: "Brightwave Health",
      companySlug: "brightwave-health",
      startDate: "2022-03",
      endDate: undefined,
      description: "Build and maintain the patient-facing web app in React and Next.js. Ship responsive, accessible UI with TypeScript and Tailwind CSS, and collaborate closely with design.",
      location: "London, UK"
    },
    {
      title: "Junior Frontend Developer",
      company: "Palette Studio",
      companySlug: "palette-studio",
      startDate: "2022-06",
      endDate: "2022-02",
      description: "Developed reusable React component libraries and marketing pages. Improves Lighthouse performance scores and championed a move to TypeScript.",
      location: "London, UK"
    }
  ],
  education: [
    {
      school: "University of Manchester",
      degree: "BSc",
      field: "Computer Science",
      startYear: "2016",
      endYear: "2020",
      description: "First-class honours. Final-year project: a real-time collaborative whiteboard in React."
    }
  ],
  appliedJobTitle: "Full Stack AI Developer",
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "CSS",
    "Tailwind CSS",
    "HTML"
  ],
  weakOutreach: {
    tone: "generic",
    connectionMessage: "Hi, I'd like to add you to my professional network on CareerConnect.",
    recruiterDm: "Hello, I saw you're hiring and I'm interested in the role. I have frontend experience. Let me know if we can chat. Thanks!",
    subject: "Interested in your open role"
  },
  savedJobTitle: "AI Engineer"
} as const

export const becomeAlex = mutation({
  args: {},
  returns: v.object({ ok: v.boolean() }),
  handler: async ctx => {
    const me = await getUserByIdentity(ctx)
    if (me === null) {
      throw new Error("Not authenticated - sign in before running the demo")
    }

    const userPatch: { name: string; username?: string } = { name: ALEX.name }
    if (me.username !== ALEX.username) {
      const clash = await ctx.db
        .query("users")
        .withIndex("by_username", q => q.eq("username", ALEX.username))
        .unique()
      if (clash === null) {
        userPatch.username = ALEX.username
      }
    }
    await ctx.db.patch(me._id, userPatch)

    const existingProfile = await getProfileForUser(ctx, me._id)
    if (existingProfile === null) {
      await ctx.db.insert("profiles", {
        userId: me._id,
        headline: ALEX.profile.headline,
        about: ALEX.profile.about,
        location: ALEX.profile.location,
        targetRole: ALEX.profile.targetRole,
        openToWork: ALEX.profile.openToWork,
        coverImageUrl: undefined
      })
    } else {
      await ctx.db.patch(existingProfile._id, {
        headline: ALEX.profile.headline,
        about: ALEX.profile.about,
        location: ALEX.profile.location,
        targetRole: ALEX.profile.targetRole,
        openToWork: ALEX.profile.openToWork
      })
    }

    const oldExperiences = await ctx.db
      .query("experiences")
      .withIndex("by_userId", q => q.eq("userId", me._id))
      .collect()
    for (const exp of oldExperiences) {
      await ctx.db.delete(exp._id)
    }
    for (const exp  of ALEX.experiences) {
      const linkedCompany = await ctx.db
        .query("companies")
        .withIndex("by_slug", q => q.eq("slug", exp.companySlug))
        .unique()
      await ctx.db.insert("experiences", {
        userId: me._id,
        title: exp.title,
        company: exp.company,
        companyId: linkedCompany?._id,
        startDate: exp.startDate,
        description: exp.description,
        location: exp.location
      })
    }

    const oldEducation = await ctx.db
      .query("education")
      .withIndex("by_userId", q => q.eq("userId", me._id))
      .collect()
    for (const edu of oldEducation) {
      await ctx.db.delete(edu._id)
    }
    for (const edu of ALEX.education) {
      await ctx.db.insert("education", {
        userId: me._id,
        school: edu.school,
        degree: edu.degree,
        field: edu.field,
        startYear: edu.startYear,
        endYear: edu.endYear,
        description: edu.description
      })
    }

    const oldSkills = await ctx.db
      .query("skills")
      .withIndex("by_userId", q => q.eq("userId", me._id))
      .collect()
    for (const skill of oldSkills) {
      await ctx.db.delete(skill._id)
    }
    for (const skillName of ALEX.skills) {
      await ctx.db.insert("skills", {
        userId: me._id,
        name: skillName,
        endorsements: 0
      })
    }

    let targetJob = null
    for await (const job of ctx.db.query("jobs")) {
      if (job.title === ALEX.savedJobTitle) {
        targetJob = job
        break
      }
    }
    if (targetJob !== null) {
      const already = await ctx.db
        .query("savedJobs")
        .withIndex("by_user_and_job", q => 
          q.eq("userId", me._id).eq("jobId", targetJob._id)
        )
        .unique()
      if (already === null) {
        await ctx.db.insert("savedJobs", {
          userId: me._id,
          jobId: targetJob._id,
          savedAt: Date.now()
        })
      }
    }

    let appliedJob = null
    for await (const job of ctx.db.query("jobs")) {
      if (job.title === ALEX.appliedJobTitle && job.status !== "closed") {
        appliedJob = job
        break
      }
    }
    if (appliedJob !== null) {
      const existingApplication = await ctx.db
        .query("applications")
        .withIndex("by_user_and_job", q => 
          q.eq("userId", me._id).eq("jobId", appliedJob._id)
        )
        .unique()
      if (existingApplication === null) {
        await ctx.db.insert("applications", {
          jobId: appliedJob._id,
          userId: me._id,
          companyId: appliedJob.companyId,
          coverNote: "Hi! I'm a frontend developer with strong React/Next.js experience, working toward AI engineering. I'd love to bring my UI craft to your team while going deep on the AI SDK.",
          status: "submitted",
          createdAt: Date.now(),
          updatedAt: Date.now()
        })
      }
    }

    const existingDrafts = await ctx.db
      .query("outreachDrafts")
      .withIndex("by_userId", q => q.eq("userId", me._id))
      .collect()
    const hasWeakDraft = existingDrafts.some(
      d => d.connectionMessage === ALEX.weakOutreach.connectionMessage
    )
    if (!hasWeakDraft) {
      await ctx.db.insert("outreachDrafts", {
        userId: me._id,
        jobId: targetJob?._id,
        recruiterId: undefined,
        tone: ALEX.weakOutreach.tone,
        connectionMessage: ALEX.weakOutreach.connectionMessage,
        recruiterDm: ALEX.weakOutreach.recruiterDm,
        subject: ALEX.weakOutreach.subject,
        status: "draft",
        createdAt: Date.now()
      })
    }

    return { ok: true }
  }
})