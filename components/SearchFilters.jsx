"use client";

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
	return (
		<div className="grid gap-3 grid-cols-1 md:grid-cols-4">
			<Input
				placeholder="Keyword (e.g. React, Designer)"
				value={keyword}
				onChange={(e) => onKeywordChange(e.target.value)}
			/>
			<Input
				placeholder="Location"
				value={location}
				onChange={(e) => onLocationChange(e.target.value)}
			/>
			<Select value={experience} onValueChange={onExperienceChange}>
				<SelectTrigger>
					<SelectValue placeholder="Experience" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All</SelectItem>
					<SelectItem value="0-2">0-2 years</SelectItem>
					<SelectItem value="2-5">2-5 years</SelectItem>
					<SelectItem value="5+">5+ years</SelectItem>
				</SelectContent>
			</Select>
			<Button onClick={onSearch}>Search</Button>
		</div>
	);
}
