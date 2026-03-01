'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import styles from './register.module.css'

export default function RegisterPage() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { signUp } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        const { error } = await signUp(email, password, fullName, address, phone)

        if (error) {
            setError(error)
            setLoading(false)
        } else {
            setSuccess(true)
            setTimeout(() => router.push('/login'), 3000)
        }
    }

    if (success) {
        return (
            <div className={styles.registerContainer}>
                <div className={styles.loginBackground}>
                    <div className={styles.gradientOrb1} />
                    <div className={styles.gradientOrb2} />
                </div>
                <div className={styles.registerCard}>
                    <div className={styles.successMessage}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <h2>Registration Successful!</h2>
                        <p>Please check your email to verify your account. You will be redirected to the login page shortly.</p>
                        <Link href="/login" className={styles.link}>Go to Login →</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.registerContainer}>
            <div className={styles.loginBackground}>
                <div className={styles.gradientOrb1} />
                <div className={styles.gradientOrb2} />
            </div>

            <div className={styles.registerCard}>
                <div className={styles.logoSection}>
                    <Link href="/" className={styles.backLink}>← Back to Home</Link>
                    <div className={styles.logoIcon}>🏛️</div>
                    <h1>Create Account</h1>
                    <p>Join the E-Barangay community</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.errorMessage}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label htmlFor="fullName">Full Name *</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Juan Dela Cruz"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address *</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Password *</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword">Confirm Password *</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="address">Address</label>
                        <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Gordon Heights, Olongapo City"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="09XX XXX XXXX"
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Already have an account?{' '}
                        <Link href="/login" className={styles.link}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
