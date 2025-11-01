"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";



export default function MyJobsView({ jobs }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">My Posted Jobs</h1>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-gray-600">
            <Briefcase className="inline w-5 h-5 mr-2" />
            You haven’t posted any jobs yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6 text-gray-800">
                <h2 className="font-bold text-lg">{job.title}</h2>
                <p>{job.description}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
