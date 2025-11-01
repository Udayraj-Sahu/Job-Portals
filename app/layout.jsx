import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";
export const metadata = {
	title: "HR Job Portal",
	description: "Public job browsing + HR dashboard",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-gray-50">{children}</body>
		</html>
	);
}
