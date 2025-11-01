"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function SearchFilters({
	keyword,
	location,
	experience,
	onKeywordChange,
	onLocationChange,
	onExperienceChange,
	onSearch,
}) {
	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				staggerChildren: 0.1,
				duration: 0.4,
				ease: "easeOut",
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 10 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="show"
			className="grid gap-3 grid-cols-1 md:grid-cols-4 bg-white p-4 rounded-2xl shadow-md border border-gray-100">
			<motion.div variants={itemVariants}>
				<Input
					placeholder="Keyword (e.g. React, Designer)"
					value={keyword}
					onChange={(e) => onKeywordChange(e.target.value)}
					className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
				/>
			</motion.div>

			<motion.div variants={itemVariants}>
				<Input
					placeholder="Location"
					value={location}
					onChange={(e) => onLocationChange(e.target.value)}
					className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
				/>
			</motion.div>

			<motion.div variants={itemVariants}>
				<Select value={experience} onValueChange={onExperienceChange}>
					<SelectTrigger className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all">
						<SelectValue placeholder="Experience" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="0-2">0-2 years</SelectItem>
						<SelectItem value="2-5">2-5 years</SelectItem>
						<SelectItem value="5+">5+ years</SelectItem>
					</SelectContent>
				</Select>
			</motion.div>

			<motion.div
				variants={itemVariants}
				whileHover={{ scale: 1.03 }}
				whileTap={{ scale: 0.97 }}>
				<Button
					onClick={onSearch}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">
					Search
				</Button>
			</motion.div>
		</motion.div>
	);
}
