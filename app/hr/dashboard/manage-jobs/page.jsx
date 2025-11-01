"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
export default function ManageJobsPage() {
	const [jobs, setJobs] = useState([]);
	const [editing, setEditing] = useState(null);
	const [form, setForm] = useState({ title: "", positions: 1 });

	const fetchJobs = async () => {
		const res = await fetch("/api/jobs");
		const data = await res.json();
		setJobs(data.jobs || []);
	};

	useEffect(() => {
		fetchJobs();
	}, []);

	const handleDelete = async (id) => {
		if (!confirm("Delete this job?")) return;
		const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
		if (res.ok) {
			toast.success("Deleted");
			fetchJobs();
		} else toast.error("Delete failed");
	};

	const handleEdit = (job) => {
		setEditing(job.id);
		setForm({ title: job.title, positions: job.positions });
	};

	const handleUpdate = async (id) => {
		const res = await fetch(`/api/jobs/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		if (res.ok) {
			toast.success("Updated");
			setEditing(null);
			fetchJobs();
		} else toast.error("Update failed");
	};

	return (
		<div className="max-w-4xl mx-auto bg-white p-6 rounded-lg border shadow-sm">
			<h1 className="text-2xl font-bold mb-6">Manage Job Posts</h1>
			{jobs.length === 0 && <p>No job posts found.</p>}
			<ul className="divide-y">
				{jobs.map((job) => (
					<li key={job.id} className="py-4">
						{editing === job.id ? (
							<div className="flex flex-col sm:flex-row gap-3">
								<input
									className="border p-2 flex-1 rounded"
									value={form.title}
									onChange={(e) =>
										setForm({
											...form,
											title: e.target.value,
										})
									}
								/>
								<input
									className="border p-2 w-24 rounded"
									type="number"
									value={form.positions}
									onChange={(e) =>
										setForm({
											...form,
											positions: e.target.value,
										})
									}
								/>
								<button
									onClick={() => handleUpdate(job.id)}
									className="bg-green-600 text-white px-3 py-2 rounded-lg">
									Save
								</button>
								<button
									onClick={() => setEditing(null)}
									className="bg-gray-300 px-3 py-2 rounded-lg">
									Cancel
								</button>
							</div>
						) : (
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
								<div>
									<Link
										href={`/hr/dashboard/manage-jobs/${job.id}`}
										className="font-semibold text-blue-600 hover:underline">
										{job.title}
									</Link>
									<p className="text-gray-500 text-sm">
										Positions: {job.positions} —{" "}
										{job.location || "N/A"}
									</p>
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => handleEdit(job)}
										className="px-3 py-1 bg-blue-600 text-white rounded-lg">
										Edit
									</button>
									<button
										onClick={() => handleDelete(job.id)}
										className="px-3 py-1 bg-red-600 text-white rounded-lg">
										Delete
									</button>
								</div>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
