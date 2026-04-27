import { NextResponse } from 'next/server';
import { updateRequest, volunteers } from '../../../lib/store';
import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex AI with environment variables
const project = process.env.GOOGLE_CLOUD_PROJECT || 'prompt-wars-2-494622';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

const vertexAI = new VertexAI({ project, location });
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

export async function POST(req) {
  try {
    const { requestId, title, description, location: incidentLocation, category } = await req.json();
    
    // Fallback if credentials might be missing in some environments
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.warn('GOOGLE_APPLICATION_CREDENTIALS not set. Using mocked strategy.');
      const priority = category === 'Medical' || category === 'Fire' ? 'High' : 'Medium';
      const bestMatch = volunteers.find(v => v.skills.includes(category)) || volunteers[0];
      return NextResponse.json(updateRequest(requestId, {
        status: 'Assigned',
        priority,
        assignedVolunteerId: bestMatch.id,
        explanation: `[MOCKED] ${bestMatch.name} assigned based on ${category} expertise.`
      }));
    }

    const prompt = `
You are the ReliefLink AI Advanced Dispatch Engine. 
Analyze this disaster relief request and find the optimal volunteer from the provided list.
Prioritize specialized skills (e.g., Medical skill for Medical category) and proximity.

Request:
- Title: ${title}
- Type: ${category}
- Description: ${description}
- Location: ${incidentLocation}

Available Volunteers:
${JSON.stringify(volunteers)}

Output a JSON object:
{
  "priority": "High" | "Medium" | "Low",
  "volunteerId": "ID_OF_VOLUNTEER",
  "explanation": "Brief tactical reason for this match."
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
    
    const updated = updateRequest(requestId, {
      status: 'Assigned',
      priority: aiResult.priority,
      assignedVolunteerId: aiResult.volunteerId,
      explanation: aiResult.explanation
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Vertex AI Match error:', error);
    return NextResponse.json({ error: 'Failed to process match with Vertex AI' }, { status: 500 });
  }
}
