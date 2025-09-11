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

                        <body className="antialiased" suppressHydrationWarning>{children}</body>
                </html>
        );
}
