"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { JobCard } from "@/components/JobCard";
import { SearchFilters } from "@/components/SearchFilters";

export default function HomePage() {
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [keyword, setKeyword] = useState("");
	const [location, setLocation] = useState("");
	const [experience, setExperience] = useState("all");

	const fetchJobs = async (filters = {}) => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				keyword: filters.keyword || "",
				location: filters.location || "",
				experience: filters.experience || "all",
			}).toString();

			const res = await axios.get(`/api/jobs?${params}`);
			setJobs(res.data.jobs || []);
		} catch (error) {
			toast.error("Failed to fetch jobs.");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchJobs();
	}, []);

	const handleSearch = async () => {
		const promise = async () => {
			await fetchJobs({ keyword, location, experience });
		};

		toast.promise(promise(), {
			loading: "Searching for jobs...",
			success: "Jobs updated!",
			error: "Search failed.",
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			{/* Heading */}
			<motion.h1
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="text-3xl font-bold text-center mb-8 text-gray-900">
				Find Your Next Opportunity
			</motion.h1>

			{/* Search Filters */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="mb-10 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
				<SearchFilters
					keyword={keyword}
					location={location}
					experience={experience}
					onKeywordChange={setKeyword}
					onLocationChange={setLocation}
					onExperienceChange={setExperience}
					onSearch={handleSearch}
				/>
			</motion.div>

			{/* Job Listings */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
				className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{loading ? (
					/* Animated skeleton loader */
					<div className="col-span-full flex flex-col items-center py-16 text-gray-400">
						<motion.div
							animate={{ opacity: [0.4, 1, 0.4] }}
							transition={{ duration: 1.5, repeat: Infinity }}
							className="h-6 w-40 bg-gray-200 rounded-lg mb-3"
						/>
						<p>Loading jobs...</p>
					</div>
				) : jobs.length === 0 ? (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="col-span-full text-center text-gray-500 py-10">
						No jobs found. Try adjusting your filters.
					</motion.p>
				) : (
					<AnimatePresence>
						{jobs.map((job, index) => (
							<motion.div
								key={job.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ delay: index * 0.05 }}>
								<JobCard job={job} />
							</motion.div>
						))}
					</AnimatePresence>
				)}
			</motion.div>
		</motion.div>
	);
}
