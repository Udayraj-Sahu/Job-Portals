"use client";

import { motion } from "framer-motion";
import { MapPin, Briefcase, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ContactButtons } from "./ContactButtons";

export function JobCard({ job }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{
				scale: 1.02,
				boxShadow: "0px 8px 24px rgba(0,0,0,0.05)",
			}}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="rounded-xl">
			<Card className="border border-gray-100 rounded-2xl bg-white transition-all duration-300 overflow-hidden">
				<CardContent className="p-6 flex flex-col gap-4">
					{/* Title + Description */}
					<div>
						<h3 className="text-lg font-semibold text-gray-900 mb-1 tracking-tight">
							{job.title}
						</h3>
						<p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
							{job.description}
						</p>
					</div>

					{/* Meta Info */}
					<div className="flex flex-wrap gap-4 text-sm text-gray-500">
						<div className="flex items-center gap-2">
							<MapPin className="w-4 h-4 text-blue-600" />
							<span>{job.location || "—"}</span>
						</div>
						<div className="flex items-center gap-2">
							<Briefcase className="w-4 h-4 text-green-600" />
							<span>{job.experience || "—"}</span>
						</div>
						{job.salary && (
							<div className="flex items-center gap-2">
								<DollarSign className="w-4 h-4 text-amber-400" />
								<span>{job.salary}</span>
							</div>
						)}
					</div>

					{/* Buttons */}
					<div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
						<ContactButtons
							email={job.email}
							phone={job.phone}
							size="sm"
							className="w-full sm:w-auto"
						/>
						<Link href={`/job/${job.id}`} className="sm:ml-auto">
							<Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">
								View Details
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
