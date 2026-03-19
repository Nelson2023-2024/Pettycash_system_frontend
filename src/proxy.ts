import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//routes that don't need authentication. Any route not in this list is considered protected.
const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password"];

//This function runs automatically on every incoming request before the page loads
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get("refresh_token");
  const isAuthenticated = !!refreshToken; // The !! converts it to a boolean — if the cookie exists isAuthenticated is true, if not it's false
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  //Not logged in, trying to access a protected page. immediately redirected to /login before the page ever renders.
  if (!isAuthenticated && !isPublicRoute)
    return NextResponse.redirect(new URL("/login", request.url));

  // Already logged in, trying to access login/signup.Example: authenticated user visits /login → redirected to / so they don't see the login form again.
  if (isAuthenticated && isPublicRoute)
    return NextResponse.redirect(new URL("/", request.url));

  //Everything is fine. Let the request through normally. This means either an authenticated user accessing a protected route, or an unauthenticated user accessing a public route.
  return NextResponse.next();
}

export const config = {
  //Tells Next.js **which routes to run this function on**. The regex pattern says "run on everything EXCEPT `_next/static` (JS/CSS files), `_next/image` (optimised images), `favicon.ico`, and `api` routes." Without this, proxy would run on every single asset request which would be wasteful and could break things.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
