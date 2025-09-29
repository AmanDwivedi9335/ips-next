import { NextResponse } from "next/server";

function decodeJwtPayload(token) {
        const [, payload] = token.split(".");
        if (!payload) return null;

        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
        try {
                const json = atob(padded);
                return JSON.parse(json);
        } catch (error) {
                return null;
        }
}

function clearAuthAndRedirect(req) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.set({
                name: "auth_token",
                value: "",
                path: "/",
                maxAge: 0,
        });
        return response;
}

export function middleware(req) {
        const token = req.cookies.get("auth_token")?.value;
        const { pathname } = new URL(req.url);
        const isAdminRoute = pathname.startsWith("/admin");

        if (!token) {
                return clearAuthAndRedirect(req);
        }

        const payload = decodeJwtPayload(token);
        if (!payload) {
                return clearAuthAndRedirect(req);
        }

        if (isAdminRoute && payload.userType !== "admin") {
                return clearAuthAndRedirect(req);
        }

        return NextResponse.next();
}

// Apply to protected routes
export const config = {
        matcher: ["/dashboard/:path*", "/account/:path*", "/admin/:path*"],
};
