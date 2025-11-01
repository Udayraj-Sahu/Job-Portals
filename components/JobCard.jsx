"use client";

import { MapPin, Briefcase, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ContactButtons } from "./ContactButtons";

export function JobCard({ job }) {
	return (
		<Card className="hover:shadow-lg transition-shadow duration-300 border border-border rounded-lg">
			<CardContent className="p-6">
				<div className="flex flex-col gap-4">
					<div>
						<h3 className="mb-2">{job.title}</h3>
						<p className="text-[#6B7280] line-clamp-2">
							{job.description}
						</p>
					</div>

					<div className="flex flex-wrap gap-4">
						<div className="flex items-center gap-2 text-[#6B7280]">
							<MapPin className="w-4 h-4 text-[#2563EB]" />
							<span className="text-sm">
								{job.location || "—"}
							</span>
						</div>
						<div className="flex items-center gap-2 text-[#6B7280]">
							<Briefcase className="w-4 h-4 text-[#16A34A]" />
							<span className="text-sm">
								{job.experience || "—"}
							</span>
						</div>
						{job.salary ? (
							<div className="flex items-center gap-2 text-[#6B7280]">
								<DollarSign className="w-4 h-4 text-[#FBBF24]" />
								<span className="text-sm">{job.salary}</span>
							</div>
						) : null}
					</div>

					<div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
						<ContactButtons
							email={job.email}
							phone={job.phone}
							size="sm"
						/>
						<Link href={`/job/${job.id}`} className="sm:ml-auto">
							<Button className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg">
								View Details
							</Button>
						</Link>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
