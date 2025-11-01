"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", positions: 1 });

  const fetchJobs = async () => {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data.jobs || []);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this job?")) return;
    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Job deleted successfully");
      fetchJobs();
    } else toast.error("Failed to delete job");
  };

  const handleEdit = (job) => {
    setEditing(job.id);
    setForm({ title: job.title, positions: job.positions });
  };

  const handleUpdate = async (id) => {
    const res = await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Job updated successfully");
      setEditing(null);
      fetchJobs();
    } else toast.error("Update failed");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-5xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mt-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-semibold mb-6 text-gray-900"
      >
        Manage Job Posts
      </motion.h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No job posts found.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          <AnimatePresence>
            {jobs.map((job, index) => (
              <motion.li
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="py-5"
              >
                {editing === job.id ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <input
                      className="border border-gray-300 p-2 flex-1 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                    <input
                      className="border border-gray-300 p-2 w-24 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      type="number"
                      min="1"
                      value={form.positions}
                      onChange={(e) =>
                        setForm({ ...form, positions: e.target.value })
                      }
                    />
                    <button
                      onClick={() => handleUpdate(job.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    layout
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <Link
                        href={`/hr/dashboard/manage-jobs/${job.id}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {job.title}
                      </Link>
                      <p className="text-gray-500 text-sm mt-1">
                        Positions: {job.positions} •{" "}
                        <span className="text-gray-400">
                          {job.location || "N/A"}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(job)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(job.id)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  );
}
