import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import crypto from "crypto";
const same = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (c) => {
        const em = process.env.ADMIN_EMAIL, pw = process.env.ADMIN_PASSWORD;
        if (!em || !pw || !c?.email || !c?.password) return null;
        if (same(String(c.email).trim().toLowerCase(), em.toLowerCase()) && same(c.password, pw))
          return { id: "admin", name: "Admin", email: em, role: "admin" };
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) { if (user) token.role = user.role; return token; },
    session({ session, token }) { session.user.role = token.role; return session; },
  },
});
