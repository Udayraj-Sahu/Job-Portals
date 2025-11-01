"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

			// upload new image if changed
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

	if (loading) return <p className="p-6">Loading job details...</p>;

	return (
		<div className="max-w-2xl mx-auto bg-white border rounded-lg p-6 shadow-sm">
			<h1 className="text-2xl font-bold mb-4">Edit Job</h1>
			<form onSubmit={handleUpdate} className="space-y-4">
				<input
					type="text"
					name="title"
					placeholder="Job Title"
					className="border p-2 w-full rounded"
					value={job.title}
					onChange={handleChange}
					required
				/>

				<div className="grid grid-cols-2 gap-3">
					<input
						type="number"
						name="positions"
						placeholder="Positions"
						className="border p-2 rounded"
						value={job.positions}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="location"
						placeholder="Location"
						className="border p-2 rounded"
						value={job.location}
						onChange={handleChange}
					/>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<input
						type="text"
						name="experience"
						placeholder="Experience (e.g. 2-5 yrs)"
						className="border p-2 rounded"
						value={job.experience}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="salary"
						placeholder="Salary (optional)"
						className="border p-2 rounded"
						value={job.salary}
						onChange={handleChange}
					/>
				</div>

				<div>
					{job.image_url && (
						<img
							src={job.image_url}
							alt="Job"
							className="h-40 w-full object-cover rounded mb-2"
						/>
					)}
					<input
						type="file"
						accept="image/*"
						className="border p-2 rounded bg-white w-full"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
					/>
				</div>

				<div className="space-y-2">
					<textarea
						name="description"
						placeholder="Job Description"
						rows={6}
						className="border p-2 w-full rounded"
						value={job.description}
						onChange={handleChange}
					/>
					<button
						type="button"
						onClick={handleGenerateDesc}
						disabled={saving}
						className="px-3 py-1 bg-blue-600 text-white rounded-lg">
						{saving ? "Generating..." : "Regenerate with AI"}
					</button>
				</div>

				<div className="flex justify-between gap-3">
					<button
						type="submit"
						disabled={saving}
						className="bg-green-600 text-white px-4 py-2 rounded-lg">
						{saving ? "Saving..." : "Save Changes"}
					</button>
					<button
						type="button"
						onClick={() => router.push("/hr/dashboard/manage-jobs")}
						className="bg-gray-300 px-4 py-2 rounded-lg">
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
