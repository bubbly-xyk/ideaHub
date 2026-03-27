import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [GithubProvider({
          clientId: process.env.GITHUB_ID,
          clientSecret: process.env.GITHUB_SECRET,
        })]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),
    CredentialsProvider({
      id: "credentials",
      name: "邮箱登录",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const { rows } = await pool.query(
          "SELECT * FROM users WHERE email = $1 AND provider = 'email'",
          [credentials.email]
        );
        const user = rows[0];
        if (!user || !user.password_hash) return null;
        if (!user.email_verified) throw new Error("EMAIL_NOT_VERIFIED");
        const valid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!valid) throw new Error("INVALID_PASSWORD");
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar ?? null,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          if (user.email) {
            // Has email: upsert by email
            await pool.query(
              `INSERT INTO users (id, name, avatar, email, provider, provider_id, email_verified, points, joined_at)
               VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, TRUE, 0, NOW())
               ON CONFLICT (email) DO UPDATE
               SET name = EXCLUDED.name, avatar = EXCLUDED.avatar, provider_id = EXCLUDED.provider_id`,
              [user.name ?? "User", user.image ?? "", user.email, account.provider, account.providerAccountId]
            );
          } else {
            // No email (e.g. GitHub private email): upsert by provider_id
            await pool.query(
              `INSERT INTO users (id, name, avatar, email, provider, provider_id, email_verified, points, joined_at)
               VALUES (gen_random_uuid(), $1, $2, NULL, $3, $4, TRUE, 0, NOW())
               ON CONFLICT (provider_id) DO UPDATE
               SET name = EXCLUDED.name, avatar = EXCLUDED.avatar`,
              [user.name ?? "User", user.image ?? "", account.provider, account.providerAccountId]
            );
          }
        } catch (err) {
          console.error("signIn callback error:", err);
          // Don't block sign-in on DB error
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        try {
          let rows;
          if (user.email) {
            ({ rows } = await pool.query("SELECT id FROM users WHERE email = $1", [user.email]));
          }
          if (account?.providerAccountId && (!rows || rows.length === 0)) {
            ({ rows } = await pool.query("SELECT id FROM users WHERE provider_id = $1", [account.providerAccountId]));
          }
          if (rows?.[0]) token.userId = rows[0].id;
        } catch (err) {
          console.error("jwt callback error:", err);
        }
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.userId as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
