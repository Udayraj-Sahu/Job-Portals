"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Briefcase, DollarSign } from "lucide-react";

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
				toast.error("Failed to load job details.");
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
			toast.success("Application submitted successfully!");
			setForm({ name: "", phone: "", email: "" });
		} catch {
			toast.error("Failed to submit application.");
		}
	};

	return (
		<>
			<Navbar />

			<main className="max-w-3xl mx-auto px-4 py-10">
				{loading ? (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center text-gray-500">
						Loading job details...
					</motion.p>
				) : !job ? (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center text-gray-500">
						Job not found.
					</motion.p>
				) : (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, ease: "easeOut" }}
						className="space-y-8">
						{/* Job Header */}
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className="space-y-3">
							<h1 className="text-3xl font-bold text-gray-900">
								{job.title}
							</h1>
							<div className="flex flex-wrap gap-4 text-gray-600 text-sm">
								<div className="flex items-center gap-2">
									<MapPin className="w-4 h-4 text-blue-500" />
									<span>
										{job.location || "Not specified"}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Briefcase className="w-4 h-4 text-green-500" />
									<span>{job.experience || "N/A"}</span>
								</div>
								{job.salary && (
									<div className="flex items-center gap-2">
										<DollarSign className="w-4 h-4 text-yellow-500" />
										<span>{job.salary}</span>
									</div>
								)}
							</div>
						</motion.div>

						{/* Job Image */}
						{job.image_url && (
							<motion.img
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
								src={job.image_url}
								alt={job.title}
								className="w-full h-64 object-cover rounded-xl shadow-sm"
							/>
						)}

						{/* Job Description */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
							<h2 className="text-lg font-semibold mb-3 text-gray-900">
								Job Description
							</h2>
							<p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
								{job.description}
							</p>
							<p className="text-sm text-gray-500 mt-3">
								Positions Available:{" "}
								<span className="font-medium text-gray-800">
									{job.positions || 1}
								</span>
							</p>
						</motion.div>

						{/* Application Form */}
						<motion.form
							onSubmit={submit}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
							className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
							<h2 className="text-xl font-semibold text-gray-900">
								Apply for this Job
							</h2>

							<div className="grid gap-3 sm:grid-cols-2">
								<input
									className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
									placeholder="Full Name"
									required
									value={form.name}
									onChange={(e) =>
										setForm({
											...form,
											name: e.target.value,
										})
									}
								/>
								<input
									className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
									placeholder="Phone Number"
									required
									value={form.phone}
									onChange={(e) =>
										setForm({
											...form,
											phone: e.target.value,
										})
									}
								/>
							</div>

							<input
								className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
								placeholder="Email"
								type="email"
								required
								value={form.email}
								onChange={(e) =>
									setForm({
										...form,
										email: e.target.value,
									})
								}
							/>

							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								type="submit"
								className="bg-blue-600 text-white px-5 py-2.5 rounded-lg w-full shadow-sm hover:bg-blue-700 transition-all">
								Submit Application
							</motion.button>
						</motion.form>
					</motion.div>
				)}
			</main>

			<Footer />
		</>
	);
}
