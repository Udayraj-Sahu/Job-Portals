"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function JobDetailPage() {
	const { id } = useParams();
	const [job, setJob] = useState(null);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState({ name: "", phone: "", email: "" });

	useEffect(() => {
		const load = async () => {
			try {
				const res = await fetch(`/api/jobs/${id}`);
				const data = await res.json();
				setJob(data.job || null);
			} catch (e) {
				toast.error("Failed to load job.");
			} finally {
				setLoading(false);
			}
		};
		if (id) load();
	}, [id]);

	const submit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/applications", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ job_id: id, ...form }),
			});
			if (!res.ok) throw new Error();
			toast.success("Application submitted!");
			setForm({ name: "", phone: "", email: "" });
		} catch {
			toast.error("Submit failed");
		}
	};

	return (
		<>
			<Navbar />
			<main className="max-w-3xl mx-auto px-4 py-10">
				{loading ? (
					<p>Loading...</p>
				) : !job ? (
					<p>Job not found.</p>
				) : (
					<div className="space-y-6">
						<h1 className="text-3xl font-bold">{job.title}</h1>
						{job.image_url ? (
							<img
								src={job.image_url}
								alt={job.title}
								className="w-full h-64 object-cover rounded-lg"
							/>
						) : null}
						<p className="whitespace-pre-wrap text-gray-700">
							{job.description}
						</p>
						<p className="text-sm text-gray-500">
							Positions: {job.positions || 1}
						</p>

						<form
							onSubmit={submit}
							className="space-y-3 border rounded-lg p-4 bg-white">
							<h2 className="text-xl font-semibold">Apply</h2>
							<input
								className="border p-2 w-full rounded"
								placeholder="Full Name"
								required
								value={form.name}
								onChange={(e) =>
									setForm({ ...form, name: e.target.value })
								}
							/>
							<input
								className="border p-2 w-full rounded"
								placeholder="Phone Number"
								required
								value={form.phone}
								onChange={(e) =>
									setForm({ ...form, phone: e.target.value })
								}
							/>
							<input
								className="border p-2 w-full rounded"
								placeholder="Email"
								type="email"
								required
								value={form.email}
								onChange={(e) =>
									setForm({ ...form, email: e.target.value })
								}
							/>
							<button className="bg-[#2563EB] text-white px-4 py-2 rounded-lg">
								Submit
							</button>
						</form>
					</div>
				)}
			</main>
			<Footer />
		</>
	);
}
