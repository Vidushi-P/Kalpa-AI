import { NextResponse } from 'next/server';
import ollama from 'ollama';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: 'No text' }, { status: 400 });

    // --- LOGGING STEP 1: See what scene we are analyzing ---
    console.log("\n🔹 [1. INPUT] Scene Text received:", text.substring(0, 50) + "...");

    const systemPrompt = `
      You are a Visual Director for an Indian Movie.
      Analyze the script scene to create a precise Image Generation Prompt.

      CRITICAL RULES FOR "visual_prompt":
      1. IGNORE DIALOGUE. Do not draw what characters *say*. Draw where they *are* and what they *do*.
      2. FOCUS on the Scene Heading (e.g., "INT. OFFICE") and Action Lines to generate the visual.
      3. CULTURAL CONTEXT: "Man" = Indian features. "Village" = Indian rural setting. "City" = Indian urban setting. "Bride" = Saree.
      4. FORMAT: "[Subject] + [Action] + [Setting] + [Lighting]".

      Return a STRICT JSON object:
      {
        "emotion": "1-2 words (e.g., 'Shocked')",
        "tone": "Genre tone (e.g., 'Action Thriller')",
        "mood": "Atmosphere description",
        "visual_prompt": "A detailed, literal description of the visible scene. Start with 'A South Indian...'. Example: 'A South Indian man sitting in a modern corporate office, typing on a laptop, harsh fluorescent lighting'.",
        "analysis_text": "Brief subtext explanation",
        "camera_style": "Camera angle that best captures the intent of the scene",
        "lighting_style": "Lighting type that enhances the mood"
      }

      SCENE TEXT:
      "${text.substring(0, 1500)}" 
    `;

    // --- LOGGING STEP 2: Verify the Prompt sent to Gemma ---
    // console.log("🔸 [2. PROMPT] Sending to Gemma:", systemPrompt); 

    const response = await ollama.chat({
      model: 'gemma3:4b', 
      messages: [{ role: 'user', content: systemPrompt }],
      format: 'json', 
      options: { temperature: 0.7 } 
    });

    let aiRawContent = response.message.content;

    // --- LOGGING STEP 3: See exactly what Gemma replied ---
    console.log("🔹 [3. GEMMA OUTPUT] Raw Response:", aiRawContent);

    let aiData;
    try {
      let cleanJson = aiRawContent.replace(/```json/g, "").replace(/```/g, "").trim();
      const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         aiData = JSON.parse(jsonMatch[0]);
      } else {
         throw new Error("No JSON found");
      }
    } catch (e) {
      console.error("❌ JSON Parse Error. Using Fallback.");
      aiData = {
        visual_prompt: `South Indian cinema scene, ${text.substring(0, 100).replace(/\n/g, " ")}`,
        mood: "Cinematic",
        emotion: "Dramatic",
        tone: "Movie",
        camera_style: "Wide Shot",
        lighting_style: "Natural"
      };
    }

    return NextResponse.json(aiData);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}