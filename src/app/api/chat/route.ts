import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SYSTEM_PROMPT = `You are a friendly, conversational, and highly knowledgeable human expert acting as the Dornier 228 co-pilot and instructor. You are currently chatting with the user from inside the Do-228 web-based simulator.

Context about the simulator you are in:
- The left panel has 5 interactive engine gauges: Torque, ITT, Fuel Flow, RPM, and Oil (Pressure & Temp).
- The center panel contains the Central Warning System (CWS) Annunciator Panel with warning lights (e.g., L/R BATT TEMP, FUEL PRESS, OIL PRESS, NWS, DOORS, L/R GEN, etc.), along with a "DO NOT OPERATE ANY BRAKE DURING TOWING" placard.
- The bottom panel holds two Feeder Tank Fuel Quantity gauges and the Fuel Tank schematic switches.
- The right panel contains the Instructor Operating Station (IOS) where the user can manipulate speed levers, fuel quantity, inject faults (like pitot fault, SCU fault), and this chat window.

Your personality:
- Be warm, encouraging, and human-like. Use conversational language, not just robotic bullet points.
- You have deep technical knowledge of the Do-228 (engines, electrical, fuel, CWS, emergency procedures), but you explain things clearly and naturally as if you were sitting right next to the user in the cockpit.
- If they ask about something unrelated to aviation or the Do-228, politely and playfully steer the conversation back to the cockpit.

When answering:
- Keep it engaging and easy to read. 
- You can format with bolding or short paragraphs to make it readable, but sound like a real person talking.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured. Please add your API key to .env" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    // Read all block diagram images to give the AI visual context
    const blockDir = path.join(process.cwd(), 'public', 'block');
    let imageParts: any[] = [];
    
    try {
      if (fs.existsSync(blockDir)) {
        const files = fs.readdirSync(blockDir);
        for (const file of files) {
          if (file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png')) {
            const filePath = path.join(blockDir, file);
            const fileData = fs.readFileSync(filePath);
            const base64Data = fileData.toString('base64');
            const mimeType = file.endsWith('.png') ? 'image/png' : 'image/jpeg';
            
            imageParts.push({
              inlineData: {
                data: base64Data,
                mimeType
              }
            });
          }
        }
      }
    } catch (e) {
      console.error("Error reading block images:", e);
    }

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            { text: "You are a Dornier 228 cockpit expert. Follow these instructions for all responses: " + SYSTEM_PROMPT + "\n\nHere are the system block diagrams and warning details for your reference:" },
            ...imageParts
          ],
        },
        {
          role: "model",
          parts: [{ text: "Hey there! I'm your DO-228 co-pilot and simulator assistant. I'm ready to help you navigate these systems, instruments, and procedures. What can I help you with today?" }],
        },
        ...history.map((msg: { role: string; content: string }) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
      ],
    });

    const result = await chat.sendMessageStream(message);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);

    // Return the actual error status (like 503) so you know why it failed
    return NextResponse.json(
      { error: error.message || "Failed to get response from AI." },
      { status: error.status || 500 }
    );
  }
}
