"use client"; // ✅ must be the very first line

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, PlusCircle, FileText, Users, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function HRLayout({ children }) {
	const pathname = usePathname();

	const navLinks = [
		{
			href: "/hr/dashboard",
			label: "Overview",
			icon: <Briefcase className="w-4 h-4" />,
		},
		{
			href: "/hr/dashboard/post-job",
			label: "Post Job",
			icon: <PlusCircle className="w-4 h-4" />,
		},
		{
			href: "/hr/dashboard/manage-jobs",
			label: "Manage Jobs",
			icon: <FileText className="w-4 h-4" />,
		},
		{
			href: "/hr/dashboard/applicants",
			label: "Applicants",
			icon: <Users className="w-4 h-4" />,
		},
	];

	// Optional logout handler
	const handleLogout = async () => {
		await supabase.auth.signOut();
		toast.success("Logged out successfully");
		window.location.href = "/hrlogin";
	};

	return (
		<>
			<Navbar />
			<div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
				{/* Sidebar */}
				<aside className="md:w-64 w-full bg-white border rounded-lg shadow-sm h-fit md:sticky md:top-20">
					<nav className="flex flex-col divide-y">
						{navLinks.map((link) => {
							const active = pathname === link.href;
							return (
								<Link
									key={link.href}
									href={link.href}
									className={`flex items-center gap-3 px-5 py-3 transition-colors ${
										active
											? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600"
											: "hover:bg-gray-50 text-gray-700"
									}`}>
									{link.icon}
									{link.label}
								</Link>
							);
						})}
						{/* Logout Button */}
						<button
							onClick={handleLogout}
							className="flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition-colors">
							<LogOut className="w-4 h-4" />
							Logout
						</button>
					</nav>
				</aside>

				{/* Main content area */}
				<section className="flex-1 bg-white border rounded-lg shadow-sm p-6 min-h-[70vh]">
					{children}
				</section>
			</div>
			<Footer />
		</>
	);
}
