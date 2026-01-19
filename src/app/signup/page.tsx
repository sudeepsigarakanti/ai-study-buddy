"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, CheckCircle, Shield } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1 = email/password, 2 = OTP verification
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Step 1: Send OTP
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setSuccessMessage(data.message);
            setStep(2); // Move to OTP verification step
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Invalid OTP');
            }

            setSuccessMessage(data.message);
            // Wait a moment then redirect to login
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to resend OTP');
            }

            setSuccessMessage('OTP resent to your email!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}>

                {/* Step Indicator */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: step === 1 ? 1 : 0.5
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: step === 1 ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                        }}>1</div>
                        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Sign Up</span>
                    </div>
                    <div style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.1)', alignSelf: 'center' }}></div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: step === 2 ? 1 : 0.5
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: step === 2 ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                        }}>2</div>
                        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Verify</span>
                    </div>
                </div>

                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 'bold' }}>
                    {step === 1 ? 'Create Account' : 'Verify Your Email'}
                </h2>
                <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '2rem', fontSize: '0.875rem' }}>
                    {step === 1 ? 'Enter your email and password to get started' : 'Enter the 6-digit code sent to your email'}
                </p>

                {error && (
                    <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', color: '#86efac', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={16} />
                        {successMessage}
                    </div>
                )}

                {/* Step 1: Email & Password */}
                {step === 1 && (
                    <form onSubmit={handleSendOTP}>
                        <div style={{ marginBottom: '1rem' }}>
                            <div className="input-glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
                                <Mail size={20} color="#94a3b8" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <div className="input-glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
                                <Lock size={20} color="#94a3b8" />
                                <input
                                    type="password"
                                    placeholder="Password (min. 6 characters)"
                                    required
                                    minLength={6}
                                    style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none' }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Sending OTP...' : <>Send Verification Code <ArrowRight size={18} /></>}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOTP}>
                        <div style={{ marginBottom: '2rem' }}>
                            <div className="input-glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
                                <Shield size={20} color="#94a3b8" />
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    required
                                    maxLength={6}
                                    pattern="[0-9]{6}"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'white',
                                        flex: 1,
                                        outline: 'none',
                                        fontSize: '1.5rem',
                                        letterSpacing: '0.5rem',
                                        textAlign: 'center'
                                    }}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', textAlign: 'center' }}>
                                Code sent to {email}
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
                            disabled={loading || otp.length !== 6}
                        >
                            {loading ? 'Verifying...' : <>Verify & Complete Signup <CheckCircle size={18} /></>}
                        </button>

                        <button
                            type="button"
                            className="btn-secondary"
                            style={{ width: '100%' }}
                            onClick={handleResendOTP}
                            disabled={loading}
                        >
                            Resend OTP
                        </button>
                    </form>
                )}

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                    Already have an account? <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Log In</Link>
                </p>
            </div>
        </div>
    );
}
