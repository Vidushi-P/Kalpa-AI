// ... inside app/api/chat/route.ts ...

    // Make sure 'text' is defined above, for example:
    const text: string = ""; // TODO: Assign the actual scene text here

    const systemPrompt = `
      You are an expert Cinematographer for Indian Cinema (Tollywood).
      Analyze the scene and provide technical direction.
      
      CRITICAL CONTEXT:
      - This is a Telugu movie context.
      - "Bride's attire" = Saree & Jewelry.
      
      Return a STRICT JSON object with these 7 keys:
      1. "emotion": (1-2 words)
      2. "tone": (Genre tone)
      3. "mood": (Atmosphere description)
      4. "visual_prompt": (Detailed image generation prompt)
      5. "analysis_text": (Subtext explanation)
      
      // --- NEW FIELDS ---
      6. "camera_style": (Technical angle advice. e.g., "Low Angle / Dutch Tilt", "Wide Master Shot", "Extreme Close-up")
      7. "lighting_style": (Lighting direction. e.g., "High Contrast Chiaroscuro", "Soft Diffused Moonlight", "Harsh Top Light")
      
          SCENE TEXT:
          "${text.substring(0, 1500)}" 
        `;

    // ... (Ollama call remains the same) ...

    // Update the Fallback Logic in case AI fails
    let aiData: {
      emotion: string;
      tone: string;
      mood: string;
      camera_style: string;
      lighting_style: string;
      visual_prompt: string;
      analysis_text: string;
    };

    // Assume 'aiResponse' is the variable holding the AI's raw response content as a string
    let aiRawContent: string = ""; // TODO: Assign the actual AI response string here, e.g., from Ollama call

    try {
      aiData = JSON.parse(aiRawContent);
    } catch (e) {
      aiData = {
        emotion: "Intense",
        tone: "Dramatic",
        mood: "High tension atmosphere.",
        // Default Technical Advice
        camera_style: "Handheld / Shaky Cam",
        lighting_style: "Low Key / Silhouettes",
        visual_prompt: "Cinematic film still, South Indian movie, dramatic lighting",
        analysis_text: "The scene implies a moment of instability."
      };
    }