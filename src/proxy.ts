// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password"];

// Map route prefixes → required permission
// If a user navigates to a route, they must have that permission
const PROTECTED_ROUTES: { path: string; permission: string }[] = [
  { path: "/admin", permission: "can_view_all_departments" },
  { path: "/expenses/all", permission: "can_view_all_expenses" },
  { path: "/expenses/pending", permission: "can_decide_expense" },
  { path: "/reconciliations/all", permission: "can_view_all_reconciliations" },
  { path: "/reconciliations/review", permission: "can_review_reconciliation" },
  { path: "/topup/mine", permission: "can_view_own_topups" },
  { path: "/topup", permission: "can_view_all_topups" },
  { path: "/account", permission: "can_view_petty_cash_account" },
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get("refresh_token");
  const isAuthenticated = !!refreshToken;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Not logged in → redirect to login
  if (!isAuthenticated && !isPublicRoute)
    return NextResponse.redirect(new URL("/login", request.url));

  // Already logged in → redirect away from login
  if (isAuthenticated && isPublicRoute)
    return NextResponse.redirect(new URL("/", request.url));

  // Check permission for protected routes
  if (isAuthenticated) {
    const permissionsCookie = request.cookies.get("permissions")?.value;
    const permissions: string[] = permissionsCookie
      ? JSON.parse(permissionsCookie)
      : [];

    const matchedRoute = PROTECTED_ROUTES.find((route) =>
      pathname.startsWith(route.path),
    );

    if (matchedRoute && !permissions.includes(matchedRoute.permission)) {
      // Redirect back to home — they don't have access
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
