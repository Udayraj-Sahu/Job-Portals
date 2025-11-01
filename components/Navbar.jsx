"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const isActive = (path) => pathname === path;

	return (
		<motion.nav
			initial={{ y: -40, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm backdrop-blur-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-2 hover:opacity-90 transition-opacity">
						<motion.div
							whileHover={{ rotate: 10 }}
							className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
							<Briefcase className="w-6 h-6 text-white" />
						</motion.div>
						<span className="font-bold text-xl text-[#111827]">
							JobPortal
						</span>
					</Link>

					{/* Desktop Links */}
					<div className="hidden md:flex items-center gap-6">
						<Link
							href="/"
							className={`px-3 py-2 rounded-md transition-colors ${
								isActive("/")
									? "text-blue-600 bg-blue-50"
									: "text-[#111827] hover:text-blue-600"
							}`}>
							Home
						</Link>
						<Link
							href="/jobs"
							className={`px-3 py-2 rounded-md transition-colors ${
								isActive("/jobs")
									? "text-blue-600 bg-blue-50"
									: "text-[#111827] hover:text-blue-600"
							}`}>
							Jobs
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
						<motion.div
							initial={false}
							animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
							transition={{ duration: 0.3 }}>
							{mobileMenuOpen ? (
								<X className="w-6 h-6 text-gray-900" />
							) : (
								<Menu className="w-6 h-6 text-gray-900" />
							)}
						</motion.div>
					</button>
				</div>

				{/* Mobile Menu */}
				<AnimatePresence>
					{mobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
							className="md:hidden border-t border-gray-100 py-4">
							<div className="flex flex-col gap-3">
								<Link
									href="/"
									className={`px-3 py-2 rounded-md transition-colors ${
										isActive("/")
											? "text-blue-600 bg-blue-50"
											: "text-[#111827] hover:text-blue-600"
									}`}
									onClick={() => setMobileMenuOpen(false)}>
									Home
								</Link>
								<Link
									href="/jobs"
									className={`px-3 py-2 rounded-md transition-colors ${
										isActive("/jobs")
											? "text-blue-600 bg-blue-50"
											: "text-[#111827] hover:text-blue-600"
									}`}
									onClick={() => setMobileMenuOpen(false)}>
									Jobs
								</Link>
								<Link
									href="/hrlogin"
									onClick={() => setMobileMenuOpen(false)}
									className="px-3">
									<Button
										variant="outline"
										className="w-full rounded-lg border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
										HR Login
									</Button>
								</Link>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.nav>
	);
}
