"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "../../../../lib/supabaseClient";
import { generateJobDescription } from "../../../../lib/openRouter";
import { toast } from "sonner";

export default function EditJobPage() {
	const { id } = useParams();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [file, setFile] = useState(null);
	const [job, setJob] = useState({
		title: "",
		description: "",
		positions: 1,
		location: "",
		experience: "",
		salary: "",
		image_url: "",
	});

	useEffect(() => {
		const load = async () => {
			try {
				const res = await fetch(`/api/jobs/${id}`);
				const data = await res.json();
				if (!res.ok) throw new Error(data.error);
				setJob(data.job || {});
			} catch (e) {
				toast.error("Failed to load job details.");
			} finally {
				setLoading(false);
			}
		};
		if (id) load();
	}, [id]);

	const handleChange = (e) => {
		setJob({ ...job, [e.target.name]: e.target.value });
	};

	const handleGenerateDesc = async () => {
		if (!job.title) return toast.error("Enter a title first!");
		setSaving(true);
		const text = await generateJobDescription(job.title);
		setJob({ ...job, description: text });
		setSaving(false);
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			let image_url = job.image_url;

			if (file) {
				const path = `jobs/${Date.now()}-${file.name}`;
				const { error: uploadError } = await supabase.storage
					.from("job-images")
					.upload(path, file);
				if (uploadError) throw uploadError;
				const { data } = supabase.storage
					.from("job-images")
					.getPublicUrl(path);
				image_url = data.publicUrl;
			}

			const payload = {
				...job,
				image_url,
				positions: Number(job.positions),
			};

			const res = await fetch(`/api/jobs/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) throw new Error();
			toast.success("Job updated successfully!");
			router.push("/hr/dashboard/manage-jobs");
		} catch (err) {
			toast.error("Failed to update job.");
		} finally {
			setSaving(false);
		}
	};

	if (loading)
		return (
			<p className="p-6 text-gray-500 animate-pulse">
				Loading job details...
			</p>
		);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mt-8">
			<motion.h1
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="text-2xl font-semibold mb-6 text-gray-900">
				Edit Job
			</motion.h1>

			<motion.form
				onSubmit={handleUpdate}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="space-y-5">
				{/* Title */}
				<div>
					<label className="text-sm font-medium text-gray-700">
						Job Title
					</label>
					<input
						type="text"
						name="title"
						placeholder="e.g. Frontend Developer"
						className="mt-1 border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
						value={job.title}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Positions + Location */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="text-sm font-medium text-gray-700">
							Positions
						</label>
						<input
							type="number"
							name="positions"
							className="mt-1 border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							value={job.positions}
							onChange={handleChange}
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700">
							Location
						</label>
						<input
							type="text"
							name="location"
							className="mt-1 border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							value={job.location}
							onChange={handleChange}
						/>
					</div>
				</div>

				{/* Experience + Salary */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="text-sm font-medium text-gray-700">
							Experience
						</label>
						<input
							type="text"
							name="experience"
							placeholder="e.g. 2-5 yrs"
							className="mt-1 border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							value={job.experience}
							onChange={handleChange}
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700">
							Salary
						</label>
						<input
							type="text"
							name="salary"
							placeholder="e.g. ₹5 LPA"
							className="mt-1 border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							value={job.salary}
							onChange={handleChange}
						/>
					</div>
				</div>

				{/* Image Upload */}
				<div>
					<label className="text-sm font-medium text-gray-700">
						Job Image
					</label>
					{job.image_url && (
						<motion.img
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3 }}
							src={job.image_url}
							alt="Job Image"
							className="h-40 w-full object-cover rounded-lg mt-2 mb-3 shadow-sm"
						/>
					)}
					<input
						type="file"
						accept="image/*"
						className="border border-gray-300 p-2.5 rounded-lg bg-white w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
					/>
				</div>

				{/* Description */}
				<div>
					<label className="text-sm font-medium text-gray-700">
						Job Description
					</label>
					<textarea
						name="description"
						placeholder="Describe the role, responsibilities, and requirements..."
						rows={6}
						className="mt-1 border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
						value={job.description}
						onChange={handleChange}
					/>
					<motion.button
						type="button"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleGenerateDesc}
						disabled={saving}
						className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm">
						{saving ? "Generating..." : "Regenerate with AI"}
					</motion.button>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-between gap-3">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.97 }}
						type="submit"
						disabled={saving}
						className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-all shadow-sm">
						{saving ? "Saving..." : "Save Changes"}
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.97 }}
						type="button"
						onClick={() => router.push("/hr/dashboard/manage-jobs")}
						className="bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-all shadow-sm">
						Cancel
					</motion.button>
				</div>
			</motion.form>
		</motion.div>
	);
}
