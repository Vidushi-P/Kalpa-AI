import { NextResponse } from 'next/server';
import ollama from 'ollama';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // 1. DYNAMIC SYSTEM PROMPT
    // We explicitly tell Gemma to avoid generic words like "Intense" unless it's actually intense.
    const systemPrompt = `
      You are a legendary Film Director for Indian Cinema (Tollywood). 
      Analyze the specific details of this movie scene.

      RULES:
      1. Do NOT use generic words like "Intense" or "Dramatic" unless the scene is actually a fight or thriller.
      2. If the scene is calm, say "Calm". If it is sad, say "Melancholic".
      3. "Bride" = Saree & Jewelry.
      4. "House" = Indian Architecture.

      OUTPUT FORMAT:
      Return ONLY a raw JSON object. Do not write "Here is the JSON" or use Markdown.
      {
        "emotion": "Specific emotion (e.g., 'Quiet Despair', 'Joyful Reunion')",
        "tone": "Specific tone (e.g., 'Rustic Drama', 'Romantic Comedy')",
        "mood": "Atmosphere description",
        "visual_prompt": "Visual description for image generation (mention lighting, colors, Indian context)",
        "analysis_text": "Brief subtext explanation",
        "camera_style": "Specific camera angle (e.g., 'Low Angle', 'Wide Master', 'Handheld')",
        "lighting_style": "Specific lighting (e.g., 'Golden Hour', 'Cold Blue Moonlight', 'Warm Interior')"
      }

      SCENE TEXT:
      "${text.substring(0, 2000)}" 
    `;

    // 2. CALL GEMMA WITH HIGH CREATIVITY
    const response = await ollama.chat({
      model: 'gemma3:4b', 
      messages: [{ role: 'user', content: systemPrompt }],
      format: 'json', // Force JSON mode
      options: {
        temperature: 0.9, // High creativity (prevents repetitive answers)
        top_p: 0.9,       // Diverse vocabulary
        seed: Math.floor(Math.random() * 10000) // Random seed to ensure every click is different
      }
    });

    let aiRawContent = response.message.content;
    console.log("🧠 Gemma Raw Output:", aiRawContent); 

    // 3. ROBUST JSON CLEANER
    let aiData;
    try {
      // Step A: Remove Markdown wrappers like ```json ... ```
      let cleanJson = aiRawContent.replace(/```json/g, "").replace(/```/g, "").trim();

      // Step B: Extract the JSON object using Regex (Finds the first '{' and last '}')
      const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
         aiData = JSON.parse(jsonMatch[0]);
      } else {
         throw new Error("No JSON found in response");
      }

    } catch (e) {
      console.error("❌ JSON Parse Failed. Falling back to Dynamic Logic.");
      
      // DYNAMIC FALLBACK: 
      // Instead of hardcoding "Suspense", we try to guess based on the text length or keywords
      // This ensures even errors look slightly different.
      const isNight = text.toLowerCase().includes("night");
      aiData = {
        emotion: "Undetermined",
        tone: "General Cinema",
        mood: isNight ? "Dark and mysterious" : "Bright and open",
        visual_prompt: `Cinematic film still, ${isNight ? 'night scene' : 'day scene'}, south indian cinema style`,
        analysis_text: "The AI could not fully process the subtext, but the scene context is preserved.",
        camera_style: "Standard Wide Shot",
        lighting_style: isNight ? "Moonlight" : "Natural Light"
      };
    }

    return NextResponse.json(aiData);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}