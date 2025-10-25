import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/movies', '/create', '/edit'];

// Define public routes that don't require authentication
const publicRoutes = ['/'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Get the token from cookies (in production) or from the request
  // For now, we'll check if the user is trying to access a protected route
  // and redirect them to login if they're not authenticated
  
  if (isProtectedRoute) {
    // In a real app, you would check for a valid JWT token in cookies
    // For now, we'll let the client-side handle the authentication check
    // This middleware will be enhanced when we implement proper JWT tokens
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
