import { NextResponse } from 'next/server';
import { getRequests } from '../../../lib/store';
import { VertexAI } from '@google-cloud/vertexai';

const project = process.env.GOOGLE_CLOUD_PROJECT || 'prompt-wars-2-494622';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

const vertexAI = new VertexAI({ project, location });
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

export async function GET() {
  try {
    const currentRequests = getRequests();
    
    // Fallback for mocked response if credentials missing
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return NextResponse.json({
        insight: "High demand predicted in Sector 7",
        hotspots: ["Sector 7", "Downtown"],
        recommendation: "Deploy additional medical units to Sector 7"
      });
    }

    const prompt = `
You are the ReliefLink AI Strategic Intelligence Analyst.
Analyze the following active disaster relief requests and provide:
1. One concise "Insight" line for a dashboard header (max 10 words).
2. A list of "Hotspots" (Sectors or Locations) that are showing increasing demand.
3. A priority "Recommendation" for the Command Center.

Active Requests:
${JSON.stringify(currentRequests)}

Output a JSON object:
{
  "insight": "string",
  "hotspots": ["string"],
  "recommendation": "string"
}
`;

    const request = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        response_mime_type: 'application/json',
      }
    };

    const streamingResp = await generativeModel.generateContent(request);
    const response = await streamingResp.response;
    const fullText = response.candidates[0].content.parts[0].text;
    
    const aiResult = JSON.parse(fullText);
    
    return NextResponse.json(aiResult);
  } catch (error) {
    console.error('Vertex AI Intelligence error:', error);
    return NextResponse.json({ error: 'Failed to generate intelligence' }, { status: 500 });
  }
}
