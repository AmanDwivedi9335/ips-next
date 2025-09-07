import "./globals.css";
import Script from "next/script";

export const metadata = {
	title: "Safety Equipment Store - Professional Safety Gear",
	description:
		"Your trusted source for professional safety equipment, protective gear, and industrial safety solutions.",
};

export default function RootLayout({ children }) {
        return (
                <html lang="en" suppressHydrationWarning>
                        <head>
                                <Script id="fdprocessedid-cleanup" strategy="beforeInteractive">
                                        {
                                                `(function(){const remove=()=>document.querySelectorAll('[fdprocessedid]').forEach(el=>el.removeAttribute('fdprocessedid'));remove();new MutationObserver(remove).observe(document.documentElement,{subtree:true,childList:true});})();`
                                        }
                                </Script>
                        </head>

                        <body className="antialiased" suppressHydrationWarning>{children}</body>
                </html>
        );
}
