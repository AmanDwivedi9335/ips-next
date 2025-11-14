import "./globals.css";
import Script from "next/script";

export const metadata = {
	title: " Industrial Print Solutions",
	description:
		"Order best quality poster and sign for industrial purpose",
};

export default function RootLayout({ children }) {
        return (
                <html lang="en" suppressHydrationWarning>
                        {/* test  */}
                        <head>
                                <script
                                        dangerouslySetInnerHTML={{
                                                __html: `(function(){const o=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){if(n==='fdprocessedid')return;o.call(this,n,v);};const r=()=>document.querySelectorAll('[fdprocessedid]').forEach(e=>e.removeAttribute('fdprocessedid'));r();new MutationObserver(r).observe(document.documentElement,{subtree:true,childList:true,attributes:true});})();`,
                                        }}
                                />
                        </head>

                        <body className="antialiased" suppressHydrationWarning>
                                <Script id="disable-context-menu" strategy="afterInteractive">
                                        {`
                                                document.addEventListener('contextmenu', (event) => {
                                                        event.preventDefault();
                                                });
                                        `}
                                </Script>
                                <noscript>
                                        <style>{`
                                                body {
                                                        margin: 0;
                                                }

                                                body > * {
                                                        display: none !important;
                                                }

                                                body::before {
                                                        content: "No Cheating!! Enable Javascript first to load this page.";
                                                        display: flex;
                                                        align-items: center;
                                                        justify-content: center;
                                                        min-height: 100vh;
                                                        padding: 2rem;
                                                        text-align: center;
                                                        font-size: 1.5rem;
                                                        font-weight: 600;
                                                        font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                                                        background: #0f172a;
                                                        color: #f8fafc;
                                                }
                                        `}</style>
                                </noscript>
                                {children}
                        </body>
                </html>
        );
}
