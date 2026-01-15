import { NextResponse } from 'next/server';
import Groq from "groq-sdk";
// @ts-ignore
import pdf from 'pdf-parse';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const type = formData.get('type') as string;
        let content = formData.get('content') as string;
        const file = formData.get('file') as File | null;
        const count = formData.get('count') ? parseInt(formData.get('count') as string) : 3;

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
        }

        // Handle PDF Extraction
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            try {
                // pdf-parse v1.1.1 exports a function directly (default export)
                const data = await pdf(buffer);
                content = data.text;
                // Limit content length to avoid token limits (Groq has limits)
                if (content.length > 30000) {
                    content = content.substring(0, 30000) + "...[Teaching material truncated]";
                }
            } catch (error) {
                console.error("PDF Parse Error", error);
                return NextResponse.json({ error: 'Failed to read PDF file' }, { status: 400 });
            }
        }

        let prompt = "";
        if (type === 'explain') {
            prompt = `Explain the following topic simply and clearly, as if you are a helpful tutor. Use Markdown formatting (headers, bolding, bullet points) to structure the explanation effectively. Topic: "${content}"`;
        } else if (type === 'summarize') {
            prompt = `Summarize the following text into a structured Markdown format. Use a "## Key Takeaways" header, followed by a bulleted list using dashes (-). Use bolding **text** for important terms. Text: "${content}"`;
        } else if (type === 'quiz') {
            prompt = `Generate ${count} distinct multiple-choice questions based on the following content. 
        
        Content: "${content.substring(0, 15000)}"

        Return the response strictly as a JSON array of objects, where each object has:
        - "question": string
        - "options": array of 4 strings
        - "answer": string (must match one of the options exactly)
        
        Do not include any markdown formatting like \`\`\`json or \`\`\`. Just return the raw JSON array.`;
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
        });

        const text = completion.choices[0]?.message?.content || "";

        return NextResponse.json({ result: text });
    } catch (error) {
        console.error('AI Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }
}
