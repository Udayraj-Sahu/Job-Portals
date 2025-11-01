"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function DashboardView({ jobs, applications }) {
	const totalJobs = jobs.length;
	const activeJobs = jobs.filter((job) => job.isActive !== false).length;
	const totalApplicants = applications.length;

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.1, delayChildren: 0.2 },
		},
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.4, ease: "easeOut" },
		},
	};

	return (
		<motion.div
			initial="hidden"
			animate="show"
			variants={containerVariants}
			className="max-w-5xl mx-auto">
			<motion.h1
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="text-2xl font-semibold mb-8 text-gray-900">
				Dashboard Overview
			</motion.h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				<motion.div
					variants={cardVariants}
					whileHover={{ scale: 1.03 }}>
					<Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all bg-white">
						<CardContent className="p-6 flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500">
									Total Jobs
								</p>
								<h2 className="text-2xl font-bold text-gray-900">
									{totalJobs}
								</h2>
							</div>
							<div className="p-3 rounded-lg bg-blue-50">
								<Briefcase className="w-6 h-6 text-blue-600" />
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					variants={cardVariants}
					whileHover={{ scale: 1.03 }}>
					<Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all bg-white">
						<CardContent className="p-6 flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500">
									Active Jobs
								</p>
								<h2 className="text-2xl font-bold text-gray-900">
									{activeJobs}
								</h2>
							</div>
							<div className="p-3 rounded-lg bg-green-50">
								<Briefcase className="w-6 h-6 text-green-600" />
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					variants={cardVariants}
					whileHover={{ scale: 1.03 }}>
					<Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all bg-white">
						<CardContent className="p-6 flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500">
									Applicants
								</p>
								<h2 className="text-2xl font-bold text-gray-900">
									{totalApplicants}
								</h2>
							</div>
							<div className="p-3 rounded-lg bg-yellow-50">
								<Briefcase className="w-6 h-6 text-yellow-500" />
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</motion.div>
	);
}
