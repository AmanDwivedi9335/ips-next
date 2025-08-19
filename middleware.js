import { NextResponse } from "next/server";

export function middleware(req) {
        const token = req.cookies.get("auth_token")?.value;

        if (!token) {
                return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
}

// Apply to protected routes
export const config = {
        matcher: ["/dashboard/:path*", "/account/:path*"],
};
