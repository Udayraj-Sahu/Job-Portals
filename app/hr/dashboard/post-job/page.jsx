"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../../lib/supabaseClient";
import { toast } from "sonner";

export default function PostJobPage() {
	const [title, setTitle] = useState("");
	const [positions, setPositions] = useState(1);
	const [location, setLocation] = useState("");
	const [experience, setExperience] = useState("");
	const [salary, setSalary] = useState("");
	const [file, setFile] = useState(null);
	const [desc, setDesc] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [loading, setLoading] = useState(false);

	// Upload image
	const uploadImage = async () => {
		if (!file) {
			toast.error("Please select an image first!");
			return null;
		}

		try {
			const formData = new FormData();
			formData.append("file", file);

			const res = await fetch("/api/upload-image", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();

			if (data?.publicUrl) {
				toast.success("Image uploaded successfully!");
				return data.publicUrl;
			} else {
				toast.error("Image upload failed!");
				console.error("Upload error:", data);
				return null;
			}
		} catch (err) {
			console.error("Error uploading image:", err);
			toast.error("Failed to upload image.");
			return null;
		}
	};

	// Generate AI description
	const handleGenerateDesc = async () => {
		if (!file || !title)
			return toast.error(
				"Please upload an image and enter a job title first!"
			);

		setLoading(true);
		try {
			const imgUrl = imageUrl || (await uploadImage());
			if (!imgUrl) throw new Error("Image upload failed.");
			setImageUrl(imgUrl);

			const res = await fetch("/api/ai/job-description", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title,
					location,
					experience,
					salary,
					positions,
					image_url: imgUrl,
				}),
			});

			const data = await res.json();
			if (data?.description) {
				setDesc(data.description);
				toast.success("AI generated description based on the image!");
			} else {
				toast.error("Failed to generate AI description.");
			}
		} catch (error) {
			console.error(error);
			toast.error("Error generating AI description.");
		} finally {
			setLoading(false);
		}
	};

	// Submit job
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const imgUrl = imageUrl || (await uploadImage());
			if (!imgUrl) throw new Error("Image upload failed.");

			const res = await fetch("/api/jobs", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title,
					description: desc,
					positions: Number(positions),
					image_url: imgUrl,
					location,
					experience,
					salary,
				}),
			});

			if (!res.ok) throw new Error("Job insert failed");

			toast.success("Job posted successfully!");
			// Reset form
			setTitle("");
			setPositions(1);
			setLocation("");
			setExperience("");
			setSalary("");
			setFile(null);
			setImageUrl("");
			setDesc("");
		} catch (err) {
			console.error(err);
			toast.error("Failed to post job.");
		} finally {
			setLoading(false);
		}
	};

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
				Post a New Job
			</motion.h1>

			<motion.form
				onSubmit={handleSubmit}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="space-y-5">
				{/* Job Title */}
				<div>
					<label className="text-sm font-medium text-gray-700">
						Job Title
					</label>
					<input
						type="text"
						placeholder="e.g. React Developer"
						className="mt-1 border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>

				{/* Positions & Location */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="text-sm font-medium text-gray-700">
							Positions
						</label>
						<input
							type="number"
							placeholder="e.g. 2"
							className="mt-1 border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							value={positions}
							onChange={(e) => setPositions(e.target.value)}
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700">
							Location
						</label>
						<input
							type="text"
							placeholder="e.g. Bangalore"
							className="mt-1 border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
					</div>
				</div>

				{/* Experience & Salary */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="text-sm font-medium text-gray-700">
							Experience
						</label>
						<input
							type="text"
							placeholder="e.g. 1-3 years"
							className="mt-1 border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							value={experience}
							onChange={(e) => setExperience(e.target.value)}
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700">
							Salary
						</label>
						<input
							type="text"
							placeholder="e.g. ₹6 LPA"
							className="mt-1 border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							value={salary}
							onChange={(e) => setSalary(e.target.value)}
						/>
					</div>
				</div>

				{/* Upload Image */}
				<div>
					<label className="text-sm font-medium text-gray-700">
						Upload Job Image
					</label>
					<input
						type="file"
						accept="image/*"
						className="mt-1 border border-gray-300 p-2.5 rounded-lg bg-white w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
					/>
				</div>

				{/* Description */}
				<div>
					<label className="text-sm font-medium text-gray-700">
						Job Description
					</label>
					<textarea
						placeholder="Job Description (can be AI generated)"
						rows={6}
						className="mt-1 border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					/>

					<motion.button
						type="button"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleGenerateDesc}
						disabled={loading}
						className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm">
						{loading
							? "Generating..."
							: "Generate Description with AI"}
					</motion.button>
				</div>

				{/* Submit */}
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.97 }}
					type="submit"
					disabled={loading}
					className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-all shadow-sm w-full">
					{loading ? "Posting..." : "Post Job"}
				</motion.button>
			</motion.form>
		</motion.div>
	);
}
