"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { generateJobDescription } from "../../lib/openRouter";
import DashboardView from "@/components/DashboardView";
import MyJobsView from "@/components/MyJobsView.jsx";

export default function Dashboard() {
	const [session, setSession] = useState(null);
	const [jobs, setJobs] = useState([]);
	const [applications, setApplications] = useState([]);
	const [title, setTitle] = useState("");
	const [positions, setPositions] = useState(1);
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);

	// Protect page
	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => setSession(data.session));
	}, []);

	const fetchData = async () => {
		const qs = await fetch("/api/jobs");
		const jd = await qs.json();
		setJobs(jd.jobs || []);
	};

	const fetchApplicants = async (jobId) => {
		const res = await fetch(`/api/applications/by-job/${jobId}`);
		const data = await res.json();
		return data.applications || [];
	};

	const refreshAllApplicants = async () => {
		const all = [];
		for (const j of jobs) {
			const a = await fetchApplicants(j.id);
			all.push(...a);
		}
		setApplications(all);
	};

	useEffect(() => {
		fetchData();
	}, []);
	useEffect(() => {
		if (jobs.length) refreshAllApplicants();
	}, [jobs]);

	const onCreate = async (e) => {
		e.preventDefault();
		if (!session) return toast.error("Please login again.");
		setLoading(true);
		try {
			let image_url = "";
			if (file) {
				const path = `jobs/${Date.now()}-${file.name}`;
				const { error: upErr } = await supabase.storage
					.from("job-images")
					.upload(path, file);
				if (upErr) throw upErr;
				const { data } = supabase.storage
					.from("job-images")
					.getPublicUrl(path);
				image_url = data.publicUrl;
			}

			const description = await generateJobDescription(title);

			const res = await fetch("/api/jobs", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title,
					positions: Number(positions),
					image_url,
					description,
				}),
			});
			if (!res.ok) throw new Error();
			toast.success("Job posted successfully!");
			setTitle("");
			setPositions(1);
			setFile(null);
			fetchData();
		} catch (e) {
			toast.error("Failed to post job");
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async (id) => {
		if (!confirm("Delete this job?")) return;
		const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
		if (res.ok) {
			toast.success("Deleted successfully!");
			fetchData();
		} else toast.error("Delete failed");
	};

	return (
		<>
			<main className="max-w-7xl mx-auto px-4 py-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}>
					<DashboardView jobs={jobs} applications={applications} />
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="grid md:grid-cols-2 gap-8 mt-10">
					{/* Create Job Form */}
					<motion.form
						onSubmit={onCreate}
						className="space-y-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
						whileHover={{ scale: 1.01 }}>
						<h2 className="text-xl font-semibold text-gray-900">
							Post a New Job
						</h2>
						<input
							className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							placeholder="Job Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
						<input
							className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							type="number"
							min={1}
							placeholder="Positions"
							value={positions}
							onChange={(e) => setPositions(e.target.value)}
						/>
						<input
							className="border border-gray-300 p-2.5 w-full rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							type="file"
							accept="image/*"
							onChange={(e) =>
								setFile(e.target.files?.[0] || null)
							}
						/>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							disabled={loading}
							className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-all shadow-sm">
							{loading ? "Posting..." : "Post Job"}
						</motion.button>
					</motion.form>

					{/* Jobs Overview + Manage */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="space-y-6">
						<MyJobsView jobs={jobs} />
						<div className="space-y-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
							<h2 className="text-xl font-semibold text-gray-900">
								Manage Jobs
							</h2>
							<AnimatePresence>
								{jobs.length === 0 ? (
									<p className="text-gray-500 text-sm py-3">
										No jobs posted yet.
									</p>
								) : (
									<ul className="divide-y divide-gray-100">
										{jobs.map((j, i) => (
											<motion.li
												key={j.id}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0 }}
												transition={{ delay: i * 0.05 }}
												className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
												<div>
													<p className="font-medium text-gray-900">
														{j.title}
													</p>
													<p className="text-sm text-gray-500">
														Positions:{" "}
														{j.positions || 1}
													</p>
												</div>
												<motion.button
													whileHover={{
														scale: 1.05,
													}}
													whileTap={{
														scale: 0.95,
													}}
													onClick={() =>
														onDelete(j.id)
													}
													className="sm:ml-auto px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-sm">
													Delete
												</motion.button>
											</motion.li>
										))}
									</ul>
								)}
							</AnimatePresence>
						</div>
					</motion.div>
				</motion.div>
			</main>

			<Footer />
		</>
	);
}
