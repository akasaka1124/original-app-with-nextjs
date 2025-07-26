import type { NextAuthConfig } from "next-auth";

const guestRoutes = ["/", "/login", "/register"];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnMainPage = guestRoutes.every(
        (guestRoute) => nextUrl.pathname !== guestRoute,
      );
      if (isOnMainPage) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
