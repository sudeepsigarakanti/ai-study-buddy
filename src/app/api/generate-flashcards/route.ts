import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
const pdf = require('pdf-parse');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const text = formData.get('text') as string | null;

        let content = '';

        // Extract text from PDF if file is provided
        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const data = await pdf(buffer);
            content = data.text;
        } else if (text) {
            content = text;
        } else {
            return NextResponse.json(
                { message: 'Please provide either a PDF file or text input' },
                { status: 400 }
            );
        }

        // Generate flashcards using Groq
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are a flashcard generator. Create concise, educational flashcards from the given content. 
Format your response as a JSON array of objects, each with "question" and "answer" fields.
Make 8-12 flashcards covering the most important concepts.
Keep questions clear and answers concise but complete.
Example format:
[
  {"question": "What is...", "answer": "It is..."},
  {"question": "How does...", "answer": "It works by..."}
]`
                },
                {
                    role: 'user',
                    content: `Create flashcards from this content:\n\n${content.slice(0, 8000)}`
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 2000,
        });

        const response = completion.choices[0]?.message?.content || '[]';

        // Try to parse as JSON, if it fails, create a simple flashcard
        let flashcards;
        try {
            flashcards = JSON.parse(response);
        } catch (e) {
            // If response isn't valid JSON, try to extract it
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                flashcards = JSON.parse(jsonMatch[0]);
            } else {
                flashcards = [{
                    question: "Summary",
                    answer: response
                }];
            }
        }

        return NextResponse.json({ flashcards }, { status: 200 });
    } catch (error: any) {
        console.error('Flashcard Generation Error:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to generate flashcards' },
            { status: 500 }
        );
    }
}
