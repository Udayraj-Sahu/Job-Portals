"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function MyJobsView({ jobs }) {
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.3, ease: "easeOut" },
		},
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="show"
			className="max-w-4xl mx-auto">
			<motion.h1
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="text-2xl font-semibold mb-6 text-gray-900">
				My Posted Jobs
			</motion.h1>

			{jobs.length === 0 ? (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}>
					<Card className="border border-gray-100 shadow-sm bg-white rounded-2xl">
						<CardContent className="p-6 text-gray-600 flex items-center justify-center gap-2 text-center">
							<Briefcase className="w-5 h-5 text-gray-400" />
							<span>You haven’t posted any jobs yet.</span>
						</CardContent>
					</Card>
				</motion.div>
			) : (
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="space-y-4">
					{jobs.map((job) => (
						<motion.div
							key={job.id}
							variants={cardVariants}
							whileHover={{
								scale: 1.02,
								boxShadow: "0px 6px 15px rgba(0,0,0,0.05)",
							}}
							whileTap={{ scale: 0.98 }}>
							<Card className="border border-gray-100 bg-white rounded-2xl transition-all">
								<CardContent className="p-6 text-gray-800 space-y-2">
									<h2 className="font-bold text-lg text-gray-900">
										{job.title}
									</h2>
									<p className="text-gray-600 leading-relaxed line-clamp-2">
										{job.description}
									</p>
									<p className="text-sm text-gray-500 flex items-center gap-1">
										📍 {job.location}
									</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</motion.div>
			)}
		</motion.div>
	);
}
