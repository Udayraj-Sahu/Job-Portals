"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const isActive = (path) => pathname === path;

	return (
		<nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link
						href="/"
						className="flex items-center gap-2 hover:opacity-80 transition-opacity">
						<div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
							<Briefcase className="w-6 h-6 text-white" />
						</div>
						<span className="font-bold text-xl text-[#111827]">
							JobPortal
						</span>
					</Link>

					<div className="hidden md:flex items-center gap-6">
						<Link
							href="/"
							className={`px-3 py-2 rounded-md transition-colors ${
								isActive("/")
									? "text-[#2563EB] bg-[#EFF6FF]"
									: "text-[#111827] hover:text-[#2563EB]"
							}`}>
							Home
						</Link>
						<Link
							href="/jobs"
							className={`px-3 py-2 rounded-md transition-colors ${
								isActive("/jobs")
									? "text-[#2563EB] bg-[#EFF6FF]"
									: "text-[#111827] hover:text-[#2563EB]"
							}`}>
							Jobs
						</Link>
						<Link href="/hrlogin">
							<Button variant="outline" className="rounded-lg">
								HR Login
							</Button>
						</Link>
					</div>

					<button
						className="md:hidden p-2 rounded-md hover:bg-[#F3F4F6]"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
						{mobileMenuOpen ? (
							<X className="w-6 h-6 text-[#111827]" />
						) : (
							<Menu className="w-6 h-6 text-[#111827]" />
						)}
					</button>
				</div>

				{mobileMenuOpen && (
					<div className="md:hidden py-4 border-t border-border">
						<div className="flex flex-col gap-2">
							<Link
								href="/"
								className={`px-3 py-2 rounded-md transition-colors ${
									isActive("/")
										? "text-[#2563EB] bg-[#EFF6FF]"
										: "text-[#111827] hover:text-[#2563EB]"
								}`}
								onClick={() => setMobileMenuOpen(false)}>
								Home
							</Link>
							<Link
								href="/jobs"
								className={`px-3 py-2 rounded-md transition-colors ${
									isActive("/jobs")
										? "text-[#2563EB] bg-[#EFF6FF]"
										: "text-[#111827] hover:text-[#2563EB]"
								}`}
								onClick={() => setMobileMenuOpen(false)}>
								Jobs
							</Link>
							<Link
								href="/hrlogin"
								onClick={() => setMobileMenuOpen(false)}>
								<Button
									variant="outline"
									className="w-full rounded-lg">
									HR Login
								</Button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
