# Ai Study Companion

A modern, AI-powered study assistant designed to help students learn faster and more effectively. This application leverages advanced language models to provide instant explanations, summaries of notes, and generated quizzes for self-assessment.

## Features

- **Explain It**: Get simple, clear explanations for complex topics.
- **Note Summarizer**: Convert long lecture notes or articles into concise bullet points.
- **Quiz Master**: Generate custom quizzes from topics or uploaded PDF files to test your knowledge.
- **Dark Mode UI**: A sleek, glassmorphism-inspired interface designed for focused study sessions.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Custom CSS Modules (Glassmorphism)
- **AI Integration**: Groq SDK (Llama 3 Models)
- **PDF Processing**: pdf-parse
- **Icons**: Lucide React

## Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/ai-study-companion.git
    cd ai-study-companion
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add your Groq API key:
    ```bash
    GROQ_API_KEY=your_groq_api_key_here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is open source and available under the [MIT License](LICENSE).
