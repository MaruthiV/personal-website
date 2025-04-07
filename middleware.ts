import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware ensures that when navigating back to the home page,
// we maintain the "started" state if the user has already started the experience
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add a header to indicate that the user has visited the site
  // This will be used to determine if we should show the landing page or the navigation menu
  if (!request.cookies.has("hasVisited")) {
    response.cookies.set("hasVisited", "true", {
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })
  }

  return response
}

// Only run this middleware on the home page
export const config = {
  matcher: "/",
}

