'use client'

import { useState } from 'react'
import styles from './RequestModal.module.css'

interface RequestModalProps {
    onClose: () => void
    onSubmit: (documentType: string, purpose: string) => Promise<void>
}

const documentTypes = [
    { value: 'Barangay Clearance', label: '📄 Barangay Clearance', desc: 'For employment, business, or government transactions' },
    { value: 'Business Permit', label: '🏠 Business Permit', desc: 'Register or renew a business permit' },
    { value: 'Barangay ID', label: '🆔 Barangay ID', desc: 'Official barangay identification card' },
    { value: 'Certificate', label: '📝 Certificate', desc: 'Indigency, residency, or other certificates' },
]

export default function RequestModal({ onClose, onSubmit }: RequestModalProps) {
    const [selectedType, setSelectedType] = useState('')
    const [purpose, setPurpose] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!selectedType) {
            setError('Please select a document type')
            return
        }

        if (!purpose.trim()) {
            setError('Please enter the purpose of your request')
            return
        }

        setSubmitting(true)
        try {
            await onSubmit(selectedType, purpose.trim())
            onClose()
        } catch (err: any) {
            setError(err?.message || 'Failed to submit request. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Request a Document</h2>
                    <button className={styles.closeButton} onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.errorMessage}>⚠️ {error}</div>
                    )}

                    <div className={styles.inputGroup}>
                        <label>Document Type *</label>
                        <div className={styles.typeGrid}>
                            {documentTypes.map((doc) => (
                                <button
                                    key={doc.value}
                                    type="button"
                                    className={`${styles.typeCard} ${selectedType === doc.value ? styles.typeSelected : ''}`}
                                    onClick={() => setSelectedType(doc.value)}
                                >
                                    <span className={styles.typeLabel}>{doc.label}</span>
                                    <span className={styles.typeDesc}>{doc.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="purpose">Purpose / Reason *</label>
                        <textarea
                            id="purpose"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            placeholder="e.g., Employment requirement, Business registration, School enrollment..."
                            rows={3}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : '📄 Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
