import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(_req, { params }) {
	const { id } = await params;
	const { data, error } = await supabase
		.from("jobs")
		.select("*")
		.eq("id", id)
		.single();
	if (error)
		return NextResponse.json({ error: error.message }, { status: 404 });
	return NextResponse.json({ job: data });
}

export async function PATCH(req, { params }) {
	const { id } = await params;
	const patch = await req.json();
	const { data, error } = await supabase
		.from("jobs")
		.update(patch)
		.eq("id", id)
		.select()
		.single();
	if (error)
		return NextResponse.json({ error: error.message }, { status: 400 });
	return NextResponse.json({ job: data });
}

export async function DELETE(_req, { params }) {
	const { id } = await params;
	const { error } = await supabase.from("jobs").delete().eq("id", id);
	if (error)
		return NextResponse.json({ error: error.message }, { status: 400 });
	return NextResponse.json({ ok: true });
}
