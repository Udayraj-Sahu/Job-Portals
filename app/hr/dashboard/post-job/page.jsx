"use client";

import { useState } from "react";
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

	// 🧠 Upload image to Supabase first
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

	// 🧠 Generate AI description using uploaded image + form info
	const handleGenerateDesc = async () => {
		if (!file || !title)
			return toast.error(
				"Please upload an image and enter a job title first!"
			);

		setLoading(true);
		try {
			// Upload image if not uploaded yet
			const imgUrl = imageUrl || (await uploadImage());
			if (!imgUrl) throw new Error("Image upload failed.");
			setImageUrl(imgUrl);

			// Call AI route with job info + image URL
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

	// ✅ Handle final form submission
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
			// Reset
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
		<div className="max-w-2xl mx-auto bg-white rounded-lg border p-6 shadow-sm">
			<h1 className="text-2xl font-bold mb-4">Post a New Job</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="text"
					placeholder="Job Title"
					className="border p-2 w-full rounded"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>

				<div className="grid grid-cols-2 gap-3">
					<input
						type="number"
						placeholder="Positions"
						className="border p-2 rounded"
						value={positions}
						onChange={(e) => setPositions(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Location"
						className="border p-2 rounded"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<input
						type="text"
						placeholder="Experience (e.g. 2-5 yrs)"
						className="border p-2 rounded"
						value={experience}
						onChange={(e) => setExperience(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Salary (optional)"
						className="border p-2 rounded"
						value={salary}
						onChange={(e) => setSalary(e.target.value)}
					/>
				</div>

				<input
					type="file"
					accept="image/*"
					className="border p-2 rounded bg-white"
					onChange={(e) => setFile(e.target.files?.[0] || null)}
				/>

				<div className="space-y-2">
					<textarea
						placeholder="Job Description (AI generated)"
						rows={6}
						className="border p-2 w-full rounded"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					/>
					<button
						type="button"
						onClick={handleGenerateDesc}
						disabled={loading}
						className="px-3 py-1 bg-blue-600 text-white rounded-lg">
						{loading
							? "Generating..."
							: "Generate Description with AI"}
					</button>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">
					{loading ? "Posting..." : "Post Job"}
				</button>
			</form>
		</div>
	);
}
