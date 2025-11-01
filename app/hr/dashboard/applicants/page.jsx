"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabaseClient";

export default function ApplicantsPage() {
	const [applications, setApplications] = useState([]);
	const [jobs, setJobs] = useState([]);
	const [selectedJob, setSelectedJob] = useState("all");
	const [loading, setLoading] = useState(true);

	// Load all jobs and applications
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

	if (loading) return <p className="p-6">Loading applicants...</p>;

	return (
		<div className="max-w-5xl mx-auto bg-white border rounded-lg shadow-sm p-6">
			<h1 className="text-2xl font-bold mb-6">Job Applications</h1>

			{/* Filter dropdown */}
			<div className="flex items-center gap-3 mb-4">
				<label className="font-medium">Filter by Job:</label>
				<select
					className="border p-2 rounded"
					value={selectedJob}
					onChange={(e) => setSelectedJob(e.target.value)}>
					<option value="all">All Jobs</option>
					{jobs.map((job) => (
						<option key={job.id} value={job.id}>
							{job.title}
						</option>
					))}
				</select>
			</div>

			{filteredApps.length === 0 ? (
				<p className="text-gray-500">
					No applicants found for this selection.
				</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full border border-gray-200 rounded-lg">
						<thead className="bg-gray-100 text-gray-700">
							<tr>
								<th className="py-2 px-3 border">Name</th>
								<th className="py-2 px-3 border">Email</th>
								<th className="py-2 px-3 border">Phone</th>
								<th className="py-2 px-3 border">
									Job Applied
								</th>
								<th className="py-2 px-3 border">Applied On</th>
							</tr>
						</thead>
						<tbody>
							{filteredApps.map((a) => (
								<tr key={a.id} className="hover:bg-gray-50">
									<td className="py-2 px-3 border">
										{a.name}
									</td>
									<td className="py-2 px-3 border">
										{a.email}
									</td>
									<td className="py-2 px-3 border">
										{a.phone}
									</td>
									<td className="py-2 px-3 border text-blue-600 font-medium">
										{a.jobs?.title || "-"}
									</td>
									<td className="py-2 px-3 border text-gray-500 text-sm">
										{new Date(
											a.created_at
										).toLocaleDateString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
