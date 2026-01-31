import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    // 1. Get the "Mood" text sent from the Frontend
    const { prompt } = await req.json();

    // 2. Enhance the prompt for "Cinematic" look
    const enhancedPrompt = `Cinematic film still, ${prompt}, 8k resolution, highly detailed, dramatic lighting, 35mm film grain`;

    console.log("Attempting to generate image...");
    console.log("Key exists?", !!process.env.STABILITY_API_KEY); // Should say 'true'
    console.log("Key starts with:", process.env.STABILITY_API_KEY?.substring(0, 5)); // Should show 'sk-...'

    // 3. Call the SDXL API (Using Stability AI as example)
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [{ text: enhancedPrompt }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        },
      }
    );

    // 4. Send the image data back to the Frontend
    const imageBase64 = response.data.artifacts[0].base64;
    return NextResponse.json({ image: `data:image/png;base64,${imageBase64}` });

  } catch (error) {
    console.error("Image Gen Error:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}