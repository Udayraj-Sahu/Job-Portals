import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const { title, location, experience, salary, positions, image_url } =
			await req.json();

		if (!process.env.OPENROUTER_API_KEY) {
			throw new Error("OPENROUTER_API_KEY is missing");
		}

		const prompt = `
      You are an HR assistant who writes professional and balanced job descriptions in Hindi and English.

      Based on the following job details, write a medium-length (around 5–6 lines) bilingual job description:
      - Job Title: ${title}
      - Location: ${location || "Not specified"}
      - Experience Required: ${experience || "Any"}
      - Salary Range: ${salary || "Negotiable"}
      - Open Positions: ${positions || 1}
      - Image URL: ${image_url || "None"}

      ✍️ Format:
      1️⃣ Write 5–6 lines in **Hindi** first — use a professional, HR-style tone.  
      2️⃣ Then write the same meaning in **English** — polished and natural.  
      
      The description should include:
      - A short overview of the role  
      - Main responsibilities  
      - Required skills and qualifications  
      - Tone: Formal, clear, and inviting.
    `;

		const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "meta-llama/llama-3.1-8b-instruct",
				messages: [
					{
						role: "system",
						content:
							"You are an HR expert who writes medium-length, formal bilingual (Hindi + English) job descriptions for corporate use.",
					},
					{ role: "user", content: prompt },
				],
				temperature: 0.65,
				max_tokens: 500,
			}),
		});

		if (!response.ok) {
			const errText = await response.text();
			console.error("OpenRouter error:", errText);
			throw new Error("Failed to fetch from OpenRouter API");
		}

		const data = await response.json();
		const content = data?.choices?.[0]?.message?.content?.trim();

		if (!content) {
			console.error("OpenRouter empty response:", JSON.stringify(data, null, 2));
			throw new Error("No description generated from AI");
		}

		return NextResponse.json({ description: content });
	} catch (error) {
		console.error("AI route error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
