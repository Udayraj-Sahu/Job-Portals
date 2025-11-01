"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
				// ✅ HR Sign Up
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
				});
				if (error) throw error;

				// ✅ Store HR info in hr_profiles table
				if (data?.user) {
					const { id, email: userEmail } = data.user;
					const { error: insertError } = await supabase
						.from("hr_profiles")
						.insert([{ auth_id: id, email: userEmail }]);
					if (insertError && insertError.code !== "23505") {
						console.error(
							"Profile insert error:",
							insertError.message
						);
					}
				}

				toast.success("Account created successfully!");
				router.push("/hr/dashboard");
			} else {
				// ✅ HR Login
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;

				// ✅ Check if HR exists in hr_profiles; if not, add it
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
			<form
				onSubmit={handleSubmit}
				className="max-w-sm mx-auto mt-16 space-y-4 p-8 border rounded bg-white shadow-sm">
				<h1 className="text-2xl font-bold text-center">
					{isSignup ? "HR Sign Up" : "HR Login"}
				</h1>

				<input
					type="email"
					placeholder="Email"
					className="border p-2 w-full rounded"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					className="border p-2 w-full rounded"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>

				<button
					type="submit"
					disabled={loading}
					className="bg-[#2563EB] text-white px-4 py-2 rounded-lg w-full">
					{loading
						? isSignup
							? "Creating Account..."
							: "Logging in..."
						: isSignup
						? "Sign Up"
						: "Login"}
				</button>

				<p className="text-center text-gray-600 text-sm">
					{isSignup
						? "Already have an account?"
						: "Don't have an account?"}{" "}
					<button
						type="button"
						onClick={() => setIsSignup(!isSignup)}
						className="text-[#2563EB] hover:underline font-medium">
						{isSignup ? "Login here" : "Sign up here"}
					</button>
				</p>
			</form>
			<Footer />
		</>
	);
}
