// test-ai.js
async function test() {
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: "INT. DARK ROOM - NIGHT. A candle flickers. He is afraid." })
        });
        const data = await response.json();
        console.log("AI RESPONSE:", data);
    } catch (err) {
        console.error("ERROR: Make sure 'npm run dev' is running!", err.message);
    }
}
test();