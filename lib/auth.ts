import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { admin } from "better-auth/plugins"
import { prisma } from "@/lib/prisma"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      address: {
        type: "string",
        required: false,
        input: true,
      },
      country: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  plugins: [admin()],

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const count = await prisma.user.count()
          if (count === 0) {
            return { data: { ...user, role: "admin" } }
          }
          return { data: user }
        },
      },
    },
  },

  trustedOrigins: ["http://localhost:3000"],
})
