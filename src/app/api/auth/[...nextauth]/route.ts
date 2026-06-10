import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { ProductService } from "@/database/services/ProductService"; // For DB access
import { getDb } from "@/lib/db";
import { User, UserRole } from "@/database/entities/User";
import { OTPService } from "@/lib/auth/otp";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Phone OTP",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phoneNumber || !credentials?.otp) return null;

        // VERIFICATION LOGIC
        const isValidOTP = await OTPService.verifyOTP(credentials.phoneNumber, credentials.otp);

        if (isValidOTP) {
          const db = await getDb();
          const userRepo = db.getRepository(User);

          let user = await userRepo.findOne({
            where: { phoneNumber: credentials.phoneNumber },
          });

          if (!user) {
            // Create new user if not exists
            user = userRepo.create({
              phoneNumber: credentials.phoneNumber,
              phoneVerified: true,
              role: UserRole.USER,
            });
            await userRepo.save(user);
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const db = await getDb();
        const userRepo = db.getRepository(User);

        let dbUser = await userRepo.findOne({
          where: { googleId: user.id },
        });

        if (!dbUser) {
          // Check if user exists by email
          dbUser = await userRepo.findOne({
            where: { email: user.email! },
          });

          if (dbUser) {
            dbUser.googleId = user.id;
            await userRepo.save(dbUser);
          } else {
            // Create new user
            const newUser = userRepo.create({
              name: user.name ?? undefined,
              email: user.email ?? undefined,
              googleId: user.id,
              avatar: user.image ?? undefined,
              role: UserRole.USER,
            });
            dbUser = await userRepo.save(newUser);
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
