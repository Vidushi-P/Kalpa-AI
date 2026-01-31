import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // WE USE A PROMISE WRAPPER BECAUSE PDF2JSON IS EVENT-BASED
    const parsedText = await new Promise<string>((resolve, reject) => {
      const parser = new PDFParser(null, true); // true means "Text Only"

      parser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));

      parser.on("pdfParser_dataReady", () => {
        // Get raw text content
        const text = (parser as any).getRawTextContent();
        resolve(text);
      });

      parser.parseBuffer(buffer);
    });

    // LOGIC: Split text into scenes (Looking for INT. or EXT.)
    // Note: pdf2json outputs text slightly differently, so we clean it up
    const cleanedText = parsedText.replace(/----------------Page \(\d+\) Break----------------/g, "");
    
    const rawScenes = cleanedText.split(/(?=INT\.|EXT\.)/g);

    const scenes = rawScenes
      .map((content, index) => {
        const cleanContent = content.trim();
        const firstLine = cleanContent.split('\n')[0];
        return {
          id: index + 1,
          title: firstLine.substring(0, 50),
          content: cleanContent
        };
      })
      .filter(scene => scene.content.length > 50); // Remove tiny junk fragments

    return NextResponse.json({ 
      totalScenes: scenes.length,
      scenes: scenes.slice(0, 10) 
    });

  } catch (error) {
    console.error("PDF Parsing Error:", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}