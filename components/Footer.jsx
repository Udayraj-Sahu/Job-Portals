"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
	return (
		<motion.footer
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="bg-white border-t border-gray-100 mt-12 py-6 text-gray-500">
			<div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
				<p className="text-center md:text-left">
					© {new Date().getFullYear()}{" "}
					<span className="font-medium text-gray-700">
						HR Job Portal
					</span>
					. All rights reserved.
				</p>

				<div className="flex gap-4 justify-center md:justify-end">
					<Link
						href="/privacy"
						className="hover:text-blue-600 transition-colors">
						Privacy Policy
					</Link>
					<Link
						href="/terms"
						className="hover:text-blue-600 transition-colors">
						Terms
					</Link>
					<a
						href="mailto:support@hrjobportal.com"
						className="hover:text-blue-600 transition-colors">
						Contact
					</a>
				</div>
			</div>
		</motion.footer>
	);
}
