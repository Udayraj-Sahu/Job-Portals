"use client";

import { useEffect, useState } from "react";
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

	// protect page
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
			toast.success("Job posted");
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
			toast.success("Deleted");
			fetchData();
		} else toast.error("Delete failed");
	};

	return (
		<>
			<Navbar />
			<main className="max-w-7xl mx-auto px-4 py-8">
				<DashboardView jobs={jobs} applications={applications} />
				<div className="grid md:grid-cols-2 gap-8 mt-8">
					<form
						onSubmit={onCreate}
						className="space-y-3 border rounded-lg p-4 bg-white">
						<h2 className="text-xl font-semibold">Post a Job</h2>
						<input
							className="border p-2 w-full rounded"
							placeholder="Job Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
						<input
							className="border p-2 w-full rounded"
							type="number"
							min={1}
							placeholder="Positions"
							value={positions}
							onChange={(e) => setPositions(e.target.value)}
						/>
						<input
							className="border p-2 w-full rounded bg-white"
							type="file"
							accept="image/*"
							onChange={(e) =>
								setFile(e.target.files?.[0] || null)
							}
						/>
						<button
							disabled={loading}
							className="bg-[#16A34A] text-white px-4 py-2 rounded-lg">
							{loading ? "Posting..." : "Post Job"}
						</button>
					</form>

					<div className="space-y-4">
						<MyJobsView jobs={jobs} />
						<div className="space-y-2">
							<h2 className="text-xl font-semibold">Manage</h2>
							<ul className="bg-white rounded-lg divide-y">
								{jobs.map((j) => (
									<li
										key={j.id}
										className="p-3 flex items-center gap-3">
										<span className="font-medium">
											{j.title}
										</span>
										<span className="text-sm text-gray-500 ml-auto">
											Positions: {j.positions || 1}
										</span>
										<button
											onClick={() => onDelete(j.id)}
											className="px-3 py-1 bg-red-600 text-white rounded-lg">
											Delete
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
