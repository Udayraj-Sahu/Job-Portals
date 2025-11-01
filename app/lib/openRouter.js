export async function generateJobDescription(title) {
	const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
						"You are an HR assistant writing concise, clear job descriptions with responsibilities and requirements.",
				},
				{
					role: "user",
					content: `Write a compelling job description for the role: ${title}. Include role overview, responsibilities, required skills, and application steps.`,
				},
			],
			temperature: 0.6,
		}),
	});
	const data = await res.json();
	return data?.choices?.[0]?.message?.content || "";
}
