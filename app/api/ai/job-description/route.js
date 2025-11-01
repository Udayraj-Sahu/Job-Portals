import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const { title, location, experience, salary, positions, image_url } =
			await req.json();

		if (!process.env.OPENROUTER_API_KEY) {
			throw new Error("OPENROUTER_API_KEY is missing");
		}

		const prompt = `
      You are an HR assistant who writes job descriptions based on a company's provided image and job details.


      Based on the visual content and the job details below:
      - Job Title: ${title}
      - Location: ${location || "Not specified"}
      - Experience Required: ${experience || "Any"}
      - Salary Range: ${salary || "Negotiable"}
      - Open Positions: ${positions || 1}

      Write a detailed, professional, and visually inspired job description including:
      - Role Overview
      - Responsibilities
      - Required Skills
    `;

		const response = await fetch(
			"https://openrouter.ai/api/v1/chat/completions",
			{
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
								"You are an HR assistant who writes engaging and accurate job descriptions.",
						},
						{ role: "user", content: prompt },
					],
					temperature: 0.7,
				}),
			}
		);

		if (!response.ok) {
			const errText = await response.text();
			console.error("OpenRouter error:", errText);
			throw new Error("Failed to fetch from OpenRouter API");
		}

		const data = await response.json();
		const content = data?.choices?.[0]?.message?.content?.trim();

		if (!content) {
			console.error(
				"OpenRouter empty response:",
				JSON.stringify(data, null, 2)
			);
			throw new Error("No description generated from AI");
		}

		return NextResponse.json({ description: content });
	} catch (error) {
		console.error("AI route error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
