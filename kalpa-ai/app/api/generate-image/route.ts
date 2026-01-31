import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    // --- SMART ENHANCER LOGIC ---
    
    // 1. Base Quality Keywords (Always apply these)
    const baseStyle = "Cinematic film still, 8k resolution, highly detailed, 35mm film grain, masterpiece, photorealistic";

    // 2. Vibe Detector (Adds specific lighting based on context)
    let lighting = "dramatic lighting, depth of field"; // Default

    const p = prompt.toLowerCase();

    if (p.includes("night") || p.includes("dark") || p.includes("fear") || p.includes("shadow")) {
        // HORROR / THRILLER VIBE
        lighting = "volumetric fog, moonlight, dark teal and orange color grading, low key lighting, mysterious atmosphere";
    } else if (p.includes("love") || p.includes("warm") || p.includes("sun") || p.includes("day")) {
        // ROMANCE / DRAMA VIBE
        lighting = "natural sunlight, soft shadows, warm tones, golden hour, emotional atmosphere";
    } else if (p.includes("run") || p.includes("fight") || p.includes("gun") || p.includes("fast")) {
        // ACTION VIBE
        lighting = "high contrast, motion blur, dynamic angle, gritty texture";
    }

    // 3. Combine it all
    // Format: [Style] + [Content/Prompt] + [Lighting/Vibe]
    const finalPrompt = `${baseStyle}, ${prompt}, ${lighting}`;
    
    // -------------------------------

    console.log("🎨 Generating with Smart Prompt:", finalPrompt); 

    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [{ text: finalPrompt }],
        cfg_scale: 7, // How strictly to follow the prompt (7 is balanced)
        height: 768,
        width: 1344,  // <--- This is the widest allowed Cinematic Ratio (approx 16:9)  // Cinematic Aspect Ratio (16:9 approx) instead of Square
        samples: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        validateStatus: () => true,
      }
    );

    if (response.status !== 200) {
      console.error("Stability API Error:", response.data);
      throw new Error(JSON.stringify(response.data));
    }

    const imageBase64 = response.data.artifacts[0].base64;
    return NextResponse.json({ image: `data:image/png;base64,${imageBase64}` });

  } catch (error: any) {
    console.error("Image Gen Error:", error.message);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}