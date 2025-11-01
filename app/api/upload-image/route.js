import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🧠 Use service role key — bypasses RLS
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
	try {
		const formData = await req.formData();
		const file = formData.get("file");

		if (!file) {
			return NextResponse.json(
				{ error: "No file uploaded" },
				{ status: 400 }
			);
		}

		const fileExt = file.name.split(".").pop();
		const fileName = `job-${Date.now()}.${fileExt}`;
		const filePath = `jobs/${fileName}`;

		// Convert uploaded File (from formData) into a buffer
		const buffer = Buffer.from(await file.arrayBuffer());

		// Upload to Supabase Storage
		const { error } = await supabase.storage
			.from("job-images")
			.upload(filePath, buffer, {
				contentType: file.type,
				upsert: false,
			});

		if (error) throw error;

		const { data } = supabase.storage
			.from("job-images")
			.getPublicUrl(filePath);

		return NextResponse.json({ publicUrl: data.publicUrl });
	} catch (err) {
		console.error("Upload failed:", err.message);
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
