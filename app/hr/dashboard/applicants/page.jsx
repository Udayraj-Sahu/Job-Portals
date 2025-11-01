"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "../../../lib/supabaseClient";

export default function ApplicantsPage() {
	const [applications, setApplications] = useState([]);
	const [jobs, setJobs] = useState([]);
	const [selectedJob, setSelectedJob] = useState("all");
	const [loading, setLoading] = useState(true);

	// Load jobs + applications
	useEffect(() => {
		const fetchData = async () => {
			try {
				const jobsRes = await fetch("/api/jobs");
				const jobsData = await jobsRes.json();
				setJobs(jobsData.jobs || []);

				const appsRes = await supabase.from("applications").select(`
          id,
          name,
          phone,
          email,
          created_at,
          job_id,
          jobs(title)
        `);

				if (appsRes.error) throw appsRes.error;
				setApplications(appsRes.data || []);
			} catch (e) {
				toast.error("Failed to load applicants");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const filteredApps =
		selectedJob === "all"
			? applications
			: applications.filter((a) => a.job_id === selectedJob);

	if (loading)
		return (
			<div className="p-10 text-center text-gray-500 animate-pulse">
				Loading applicants...
			</div>
		);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="max-w-6xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mt-8">
			<motion.h1
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="text-2xl font-semibold mb-6 text-gray-900">
				Job Applications
			</motion.h1>

			{/* Filter */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
				<label className="font-medium text-gray-700">
					Filter by Job:
				</label>
				<select
					className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full sm:w-auto"
					value={selectedJob}
					onChange={(e) => setSelectedJob(e.target.value)}>
					<option value="all">All Jobs</option>
					{jobs.map((job) => (
						<option key={job.id} value={job.id}>
							{job.title}
						</option>
					))}
				</select>
			</motion.div>

			{/* Table */}
			{filteredApps.length === 0 ? (
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-gray-500 text-center py-10">
					No applicants found for this selection.
				</motion.p>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
					<table className="min-w-full border-collapse bg-white text-left text-sm text-gray-600">
						<thead className="bg-gray-50 text-gray-700 text-sm font-medium">
							<tr>
								<th className="py-3 px-4 border-b">Name</th>
								<th className="py-3 px-4 border-b">Email</th>
								<th className="py-3 px-4 border-b">Phone</th>
								<th className="py-3 px-4 border-b">
									Job Applied
								</th>
								<th className="py-3 px-4 border-b">
									Applied On
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredApps.map((a, idx) => (
								<motion.tr
									key={a.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.05 }}
									className="hover:bg-blue-50 transition-colors border-b last:border-0">
									<td className="py-3 px-4 font-medium text-gray-900">
										{a.name}
									</td>
									<td className="py-3 px-4">{a.email}</td>
									<td className="py-3 px-4">{a.phone}</td>
									<td className="py-3 px-4 text-blue-600 font-medium">
										{a.jobs?.title || "-"}
									</td>
									<td className="py-3 px-4 text-gray-500 text-sm">
										{new Date(
											a.created_at
										).toLocaleDateString()}
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</motion.div>
			)}
		</motion.div>
	);
}
