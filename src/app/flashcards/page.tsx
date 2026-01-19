"use client";

import { useState } from 'react';
import { Upload, MessageSquare, ArrowLeft, ArrowRight, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Flashcard {
    question: string;
    answer: string;
}

export default function FlashcardsPage() {
    const [mode, setMode] = useState<'upload' | 'chat'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [textInput, setTextInput] = useState('');
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleGenerate = async () => {
        if (mode === 'upload' && !file) {
            setError('Please upload a PDF file');
            return;
        }
        if (mode === 'chat' && !textInput.trim()) {
            setError('Please enter some text');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            if (mode === 'upload' && file) {
                formData.append('file', file);
            } else if (mode === 'chat') {
                formData.append('text', textInput);
            }

            const res = await fetch('/api/generate-flashcards', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to generate flashcards');
            }

            setFlashcards(data.flashcards);
            setCurrentIndex(0);
            setIsFlipped(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleReset = () => {
        setFlashcards([]);
        setCurrentIndex(0);
        setIsFlipped(false);
        setFile(null);
        setTextInput('');
        setError('');
    };

    return (
        <div style={{ minHeight: '100vh', padding: '2rem', position: 'relative' }}>
            {/* Background */}
            <div className="gradient-bg"></div>
            <div className="gradient-orb gradient-orb-1"></div>
            <div className="gradient-orb gradient-orb-2"></div>

            <div className="container" style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ marginBottom: '3rem' }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', marginBottom: '1.5rem', textDecoration: 'none' }}>
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </Link>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Sparkles size={40} color="#34d399" />
                        AI Flashcards
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
                        Upload PDFs or chat to create smart flashcards for better learning
                    </p>
                </div>

                {flashcards.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '3rem' }}>
                        {/* Mode Selection */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <button
                                onClick={() => setMode('upload')}
                                className={mode === 'upload' ? 'btn-primary' : 'btn-secondary'}
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Upload size={20} />
                                Upload PDF
                            </button>
                            <button
                                onClick={() => setMode('chat')}
                                className={mode === 'chat' ? 'btn-primary' : 'btn-secondary'}
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <MessageSquare size={20} />
                                Enter Text
                            </button>
                        </div>

                        {error && (
                            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', marginBottom: '1.5rem' }}>
                                {error}
                            </div>
                        )}

                        {mode === 'upload' ? (
                            <div>
                                <label
                                    htmlFor="pdf-upload"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '3rem',
                                        border: '2px dashed rgba(52, 211, 153, 0.3)',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        background: file ? 'rgba(52, 211, 153, 0.05)' : 'transparent'
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <Upload size={48} color="#34d399" style={{ marginBottom: '1rem' }} />
                                    <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                                        {file ? file.name : 'Click to upload or drag and drop'}
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                        PDF files only (Max 10MB)
                                    </p>
                                    <input
                                        id="pdf-upload"
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        ) : (
                            <div>
                                <textarea
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder="Enter the topic or content you want to create flashcards from..."
                                    className="input-glass"
                                    style={{
                                        width: '100%',
                                        minHeight: '200px',
                                        resize: 'vertical',
                                        fontFamily: 'inherit',
                                        fontSize: '1rem',
                                        lineHeight: '1.6'
                                    }}
                                />
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            className="btn-primary"
                            disabled={loading || (mode === 'upload' && !file) || (mode === 'chat' && !textInput.trim())}
                            style={{
                                width: '100%',
                                marginTop: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                opacity: loading || (mode === 'upload' && !file) || (mode === 'chat' && !textInput.trim()) ? 0.5 : 1
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                                    Generating Flashcards...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Generate Flashcards
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div>
                        {/* Flashcard Display */}
                        <div className="flashcard-container" style={{ marginBottom: '2rem' }}>
                            <div
                                className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                                onClick={() => setIsFlipped(!isFlipped)}
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '400px',
                                    cursor: 'pointer',
                                    transformStyle: 'preserve-3d',
                                    transition: 'transform 0.6s',
                                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                }}
                            >
                                {/* Front */}
                                <div className="glass-panel flashcard-face" style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '3rem',
                                    border: '2px solid rgba(52, 211, 153, 0.3)'
                                }}>
                                    <div style={{ fontSize: '0.875rem', color: '#34d399', marginBottom: '1rem', fontWeight: '600' }}>
                                        QUESTION
                                    </div>
                                    <p style={{ fontSize: '1.5rem', textAlign: 'center', lineHeight: '1.6' }}>
                                        {flashcards[currentIndex]?.question}
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '2rem' }}>
                                        Click to reveal answer
                                    </p>
                                </div>

                                {/* Back */}
                                <div className="glass-panel flashcard-face" style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '3rem',
                                    transform: 'rotateY(180deg)',
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                                    border: '2px solid rgba(52, 211, 153, 0.5)'
                                }}>
                                    <div style={{ fontSize: '0.875rem', color: '#34d399', marginBottom: '1rem', fontWeight: '600' }}>
                                        ANSWER
                                    </div>
                                    <p style={{ fontSize: '1.25rem', textAlign: 'center', lineHeight: '1.6' }}>
                                        {flashcards[currentIndex]?.answer}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Progress */}
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <p style={{ fontSize: '1.125rem', color: '#94a3b8' }}>
                                Card <span style={{ color: '#34d399', fontWeight: '700' }}>{currentIndex + 1}</span> of {flashcards.length}
                            </p>
                        </div>

                        {/* Controls */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={handlePrev}
                                className="btn-secondary"
                                disabled={currentIndex === 0}
                                style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
                            >
                                <ArrowLeft size={20} />
                                Previous
                            </button>
                            <button
                                onClick={handleReset}
                                className="btn-glass"
                            >
                                <RotateCcw size={20} />
                                New Set
                            </button>
                            <button
                                onClick={handleNext}
                                className="btn-secondary"
                                disabled={currentIndex === flashcards.length - 1}
                                style={{ opacity: currentIndex === flashcards.length - 1 ? 0.5 : 1 }}
                            >
                                Next
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
