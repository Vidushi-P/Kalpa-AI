export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma:4b", 
        // This is where the "Training" happens via Instructions
        prompt: `You are a Cinematography Advisor. Analyze this script snippet: "${prompt}"
                 
                 Provide advice based on these 4 pillars:
                 1. Camera Style Advisor: Suggest angles (e.g., Low angle to show power, Close-up for intimacy).
                 2. Emotion: Identify the core feeling.
                 3. Tone: The creative "vibe" (e.g., Gritty, Surreal, Playful).
                 4. Atmosphere: The environmental feeling (e.g., Claustrophobic, Ethereal).

                 Return ONLY a JSON object:
                 {
                   "camera_advisor": "...",
                   "emotion": "...",
                   "tone": "...",
                   "atmosphere": "..."
                 }`,
        stream: false,
      }),
    });

    const data = await response.json();
    const rawResponse = data.response || ""; 

    // Extract the JSON block
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const cleanJson = JSON.parse(jsonMatch[0]);
      return Response.json(cleanJson);
    } else {
      // Emergency Fallback
      return Response.json({
        camera_advisor: "Suggest standard Eye-level shot",
        emotion: "Neutral",
        tone: "Naturalistic",
        atmosphere: "Standard"
      });
    }

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}