"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";



export default function DashboardView({
	jobs,
	applications,
}) {
	const totalJobs = jobs.length;
	const activeJobs = jobs.filter((job) => job.isActive !== false).length; // assume isActive field
	const totalApplicants = applications.length;

	return (
		<div>
			<h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>
			<div className="grid grid-cols-3 gap-6">
				<Card>
					<CardContent className="p-6 flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">Total Jobs</p>
							<h2 className="text-xl font-bold">{totalJobs}</h2>
						</div>
						<Briefcase className="w-6 h-6 text-blue-500" />
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6 flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">Active Jobs</p>
							<h2 className="text-xl font-bold">{activeJobs}</h2>
						</div>
						<Briefcase className="w-6 h-6 text-green-500" />
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6 flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">Applicants</p>
							<h2 className="text-xl font-bold">
								{totalApplicants}
							</h2>
						</div>
						<Briefcase className="w-6 h-6 text-yellow-500" />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
