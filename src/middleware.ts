import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    // Paths that require authentication
    const protectedPaths = ['/explain', '/notes', '/quiz'];

    const isProtectedPath = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    if (isProtectedPath) {
        if (!token) {
            // No token found, redirect to login
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_change_me');
            await jwtVerify(token, secret);
            // Token is valid, allow request
            return NextResponse.next();
        } catch (err) {
            // Token invalid or expired, redirect to login
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('auth_token'); // Clear invalid cookie
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/explain/:path*', '/notes/:path*', '/quiz/:path*'],
};
