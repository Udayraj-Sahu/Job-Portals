"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from 'axios'
import { JobCard } from "@/components/JobCard";
import { SearchFilters } from "@/components/SearchFilters";

// Placeholder data until your API is connected
const placeholderJobs = [
	{
		id: "1",
		title: "Frontend Developer",
		description:
			"Developing and maintaining user-facing features using React.js...",
		location: "Remote",
		experience: "3-5 years",
		salary: "$120k",
		contactEmail: "hr@google.com",
		contactPhone: "1234567890",
	},
	{
		id: "2",
		title: "Backend Engineer",
		description:
			"Design and implement scalable backend services and APIs...",
		location: "New York, NY",
		experience: "5+ years",
		salary: "$150k",
		contactEmail: "hr@meta.com",
		contactPhone: "1234567890",
	},
];

export default function HomePage() {
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);

	// State for filters
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
            setJobs(res.data.jobs);
        } catch (error) {
            toast.error("Failed to fetch jobs.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

	useEffect(()=>{
		fetchJobs();
	},[])

	const handleSearch = () => {
		const promise = async () => {
			// TODO: Replace with your API call including filter params
			console.log("Searching jobs with filters:", {
				keyword,
				location,
				experience,
			});
			await new Promise((res) => setTimeout(res, 1000));
			// In a real app, you would set the jobs state with the API response
			return { keyword, location, experience };
		};

		toast.promise(promise, {
			loading: "Searching for jobs...",
			success: "Jobs list updated!",
			error: "Search failed.",
		});
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 className="text-3xl font-bold mb-4 text-center">
				Find Your Next Opportunity
			</h1>
			<div className="mb-8">
				<SearchFilters
					keyword={keyword}
					location={location}
					experience={experience}
					onKeywordChange={setKeyword}
					onLocationChange={setLocation}
					onExperienceChange={setExperience}
					onSearch={handleSearch}
				/>
			</div>
			<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{loading ? (
					<p>Loading jobs...</p>
				) : (
					jobs.map((job) => <JobCard key={job.id} job={job} />)
				)}
			</div>
		</div>
	);
}
