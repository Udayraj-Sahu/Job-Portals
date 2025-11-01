import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
	const { job_id, name, phone, email } = await req.json();
	if (!job_id || !name || !phone || !email) {
		return NextResponse.json({ error: "Missing fields" }, { status: 400 });
	}
	const { data, error } = await supabase
		.from("applications")
		.insert({ job_id, name, phone, email })
		.select()
		.single();
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ application: data }, { status: 201 });
}
