import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
	// ✅ Create server-side Supabase client using the Service Role Key
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY
	);

	console.log(
		"Service key prefix:",
		process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 8)
	);

	try {
		const body = await req.json();
		const {
			title,
			description,
			positions,
			image_url,
			location,
			experience,
			salary,
		} = body;

		// ✅ Insert job
		const { data, error } = await supabase.from("jobs").insert([
			{
				title,
				description,
				positions,
				image_url,
				location,
				experience,
				salary,
			
			},
		]);

		if (error) {
			console.error("Insert error:", error.message);
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json({ success: true, data });
	} catch (err) {
		console.error("Server error:", err.message);
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

export async function GET() {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY
	);

	const { data, error } = await supabase
		.from("jobs")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}

	return NextResponse.json({ jobs: data });
}
