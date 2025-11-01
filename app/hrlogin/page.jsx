"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

export default function HRLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSignup, setIsSignup] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			if (isSignup) {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
				});
				if (error) throw error;

				if (data?.user) {
					const { id, email: userEmail } = data.user;
					await supabase
						.from("hr_profiles")
						.insert([{ auth_id: id, email: userEmail }]);
				}

				toast.success("Account created successfully!");
				router.push("/hr/dashboard");
			} else {
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;

				const { user } = data;
				if (user) {
					const { data: existing, error: checkError } = await supabase
						.from("hr_profiles")
						.select("id")
						.eq("auth_id", user.id)
						.single();

					if (checkError && checkError.code === "PGRST116") {
						await supabase
							.from("hr_profiles")
							.insert([{ auth_id: user.id, email: user.email }]);
					}
				}

				toast.success("Login successful!");
				router.push("/hr/dashboard");
			}
		} catch (err) {
			console.error(err);
			toast.error(err.message || "Something went wrong!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Navbar />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] to-[#EEF2F7] px-4">
				<motion.form
					onSubmit={handleSubmit}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="w-full max-w-md bg-white/90 backdrop-blur-md border border-gray-100 p-8 rounded-2xl shadow-lg space-y-6">
					{/* Title */}
					<motion.h1
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="text-3xl font-semibold text-center text-gray-900">
						{isSignup ? "Create HR Account" : "HR Login"}
					</motion.h1>

					{/* Input Fields */}
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email Address
							</label>
							<input
								type="email"
								placeholder="hr@company.com"
								className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Password
							</label>
							<input
								type="password"
								placeholder="••••••••"
								className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
					</div>

					{/* Submit Button */}
					<motion.button
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						type="submit"
						disabled={loading}
						className={`w-full py-2.5 font-medium text-white rounded-lg shadow-md transition-all ${
							isSignup
								? "bg-green-600 hover:bg-green-700"
								: "bg-blue-600 hover:bg-blue-700"
						}`}>
						{loading
							? isSignup
								? "Creating Account..."
								: "Logging in..."
							: isSignup
							? "Sign Up"
							: "Login"}
					</motion.button>

					{/* Toggle Login/Signup */}
					<p className="text-center text-gray-600 text-sm">
						{isSignup
							? "Already have an account?"
							: "Don’t have an account?"}{" "}
						<button
							type="button"
							onClick={() => setIsSignup(!isSignup)}
							className="text-blue-600 hover:underline font-medium">
							{isSignup ? "Login here" : "Sign up here"}
						</button>
					</p>
				</motion.form>
			</motion.div>

			<Footer />
		</>
	);
}
