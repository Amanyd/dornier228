import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import { config } from "dotenv";
config();

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

function fileToGenerativePart(path: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
  
  const blockDir = "./public/block";
  const files = fs.readdirSync(blockDir).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png'));
  const imageParts = files.map(file => fileToGenerativePart(`${blockDir}/${file}`, file.endsWith('.png') ? "image/png" : "image/jpeg"));

  const prompt = `Extract all block diagrams from these handwritten notes. 
For each diagram, please provide:
1. The exact name of the Warning or Caution light it triggers (e.g., "OIL", "BATT- TEMP", "FUEL PRESS").
2. The sequence of blocks (A -> B -> C).
3. Any specific text written inside or next to the blocks (like "Opens at ΔP > 13psi").
Be as accurate as possible to the handwriting.`;

  const result = await model.generateContent([prompt, ...imageParts]);
  console.log(result.response.text());
}

run().catch(console.error);
