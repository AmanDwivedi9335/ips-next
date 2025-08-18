import "./globals.css";

export const metadata = {
	title: "Safety Equipment Store - Professional Safety Gear",
	description:
		"Your trusted source for professional safety equipment, protective gear, and industrial safety solutions.",
};

export default function RootLayout({ children }) {
        return (
                <html lang="en">
                        <body className="antialiased">{children}</body>
                </html>
        );
}
