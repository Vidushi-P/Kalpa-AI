🎬 Kalpa.AI: Neural Script-to-Screen Engine
Kalpa.AI is a next-generation pre-production suite designed for filmmakers and storytellers. It leverages Local LLMs and Generative AI to transform raw screenplays into structured cinematic blueprints, featuring emotional arc mapping and automated visual storyboarding.

🚀 Core Features
🧠 Atmospheric Intelligence
Analyzes the subtext of every scene to extract Mood, Tone, and Emotion. It automatically suggests Lighting Schemes and Camera Styles based on the narrative heartbeat of the script.

📈 Dynamic Narrative Mapping
Visualizes the script's pacing through a scene-to-scene Emotional Arc Graph. It quantifies dramatic tension on a scale of 1–10, allowing directors to see where the story peaks and breathes.

📍 Character & Location Synergy
Tracks character evolution relative to their physical environments. The system identifies how specific events at specific locations impact the narrative flow.

🖼️ Neural Storyboarding
Translates AI-analyzed metadata into high-fidelity visual frames. By piping emotional data into image generation APIs, it creates a visual roadmap for the production team.

🛠️ Technical Stack
Frontend: Next.js 15 (App Router), Tailwind CSS v4, Lucide React.

Data Visualization: Recharts (for Emotional Arc Mapping).

Local AI Engine: Ollama running Gemma:4b (Privacy-first script analysis).

Image Generation: Pollinations / SDXL API integration.

Architecture: Hybrid Local-Cloud (Local Inference + Cloud UI).

💻 Installation & Setup
1. Prerequisites
Node.js v22+

Ollama (for local AI processing)

2. Local AI Setup
Install and run the Gemma model:

Bash
ollama run gemma:4b
3. Clone & Install
Bash
git clone https://github.com/YourUsername/Kalpa-AI.git
cd Kalpa-AI
npm install
4. Run the Development Server
Bash
npm run dev
Open http://localhost:3000 to see the dashboard.

📂 Project Structure
Plaintext
Kalpa-AI/
├── public/              # Static assets (logo.jpg, etc.)
├── src/
│   ├── app/
│   │   ├── api/        # Chat & Image Generation routes
│   │   ├── components/ # Logo, InsightCard, TechCard, Graph
│   │   └── page.tsx    # Main Dashboard Logic
└── package.json        # Dependencies & Scripts
⚖️ Why Kalpa.AI?
Privacy-First: Your script stays on your hardware. We use local LLMs (Gemma:4b) so your creative IP never leaves your machine.

Zero Cost Analysis: No expensive tokens or subscription fees for script analysis.

Cinematic Logic: Built by engineers who understand film language—lighting, camera angles, and emotional subtext.
