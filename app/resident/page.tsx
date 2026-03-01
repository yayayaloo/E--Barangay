'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ChatBot from '@/components/ChatBot'
import ProtectedRoute from '@/components/ProtectedRoute'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import RequestModal from '@/components/RequestModal'
import { useAuth } from '@/components/AuthProvider'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'
import { ServiceRequest, Announcement } from '@/lib/types'
import styles from './resident.module.css'

function ResidentPortalContent() {
    const { profile, signOut } = useAuth()
    const { showToast } = useToast()
    const [showChatBot, setShowChatBot] = useState(false)
    const [showRequestModal, setShowRequestModal] = useState(false)
    const [requests, setRequests] = useState<ServiceRequest[]>([])
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loadingRequests, setLoadingRequests] = useState(true)
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)

    useEffect(() => {
        fetchRequests()
        fetchAnnouncements()
    }, [])

    const fetchRequests = async () => {
        setLoadingRequests(true)
        try {
            const { data, error } = await supabase
                .from('service_requests')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5)

            if (error) throw error
            if (data) setRequests(data)
        } catch {
            showToast('Failed to load your requests', 'error')
        } finally {
            setLoadingRequests(false)
        }
    }

    const fetchAnnouncements = async () => {
        setLoadingAnnouncements(true)
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('published_at', { ascending: false })
                .limit(4)

            if (error) throw error
            if (data) setAnnouncements(data)
        } catch {
            showToast('Failed to load announcements', 'error')
        } finally {
            setLoadingAnnouncements(false)
        }
    }

    const handleRequestSubmit = async (documentType: string, purpose: string) => {
        const { error } = await supabase.from('service_requests').insert({
            resident_id: profile!.id,
            document_type: documentType,
            purpose: purpose,
            status: 'pending',
        })

        if (error) throw new Error(error.message)

        showToast(`${documentType} request submitted successfully!`, 'success')
        await fetchRequests()
    }

    const getStatusBadge = (status: string) => {
        const badgeMap: Record<string, string> = {
            pending: 'badge badge-warning',
            processing: 'badge badge-info',
            ready: 'badge badge-success',
            completed: 'badge badge-success',
            rejected: 'badge badge-error',
        }
        return badgeMap[status] || 'badge badge-info'
    }

    const getStatusLabel = (status: string) => {
        const labelMap: Record<string, string> = {
            pending: 'Pending',
            processing: 'Processing',
            ready: 'Ready for Pickup',
            completed: 'Completed',
            rejected: 'Rejected',
        }
        return labelMap[status] || status
    }

    const getDocIcon = (type: string) => {
        const iconMap: Record<string, string> = {
            'Barangay Clearance': '📄',
            'Business Permit': '🏠',
            'Barangay ID': '🆔',
            'Certificate': '📝',
        }
        return iconMap[type] || '📄'
    }

    const getCategoryBadge = (category: string) => {
        const badgeMap: Record<string, string> = {
            community_event: 'badge badge-info',
            important: 'badge badge-warning',
            emergency: 'badge badge-error',
            general: 'badge badge-info',
        }
        return badgeMap[category] || 'badge badge-info'
    }

    const getCategoryLabel = (category: string) => {
        const labelMap: Record<string, string> = {
            community_event: 'Community Event',
            important: 'Important',
            emergency: 'Emergency',
            general: 'General',
        }
        return labelMap[category] || category
    }

    return (
        <div className={styles.portalContainer}>
            <Header
                title="E-Barangay"
                userName={profile?.full_name || 'Resident'}
                onSignOut={signOut}
                variant="resident"
            />

            <main className={styles.main}>
                <div className="container">
                    {/* Welcome Section */}
                    <section className={styles.welcome}>
                        <h1>Welcome back, {profile?.full_name?.split(' ')[0] || 'Resident'}! 👋</h1>
                        <p>Access barangay services, track your requests, and stay updated</p>
                    </section>

                    {/* Quick Actions */}
                    <section className={styles.quickActions}>
                        <h2>Quick Actions</h2>
                        <div className="grid grid-3">
                            <button className={`glass-card ${styles.actionCard}`} onClick={() => setShowRequestModal(true)}>
                                <div className={styles.actionIcon}>📄</div>
                                <div>
                                    <h3>Request Document</h3>
                                    <p>Apply for clearances, permits, and certificates</p>
                                </div>
                            </button>

                            <button className={`glass-card ${styles.actionCard}`}>
                                <div className={styles.actionIcon}>📊</div>
                                <div>
                                    <h3>Track Status</h3>
                                    <p>Monitor your pending applications</p>
                                </div>
                            </button>

                            <button
                                className={`glass-card ${styles.actionCard}`}
                                onClick={() => setShowChatBot(true)}
                            >
                                <div className={styles.actionIcon}>💬</div>
                                <div>
                                    <h3>Ask AI Assistant</h3>
                                    <p>Get instant answers 24/7</p>
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* Services Grid */}
                    <section className={styles.services}>
                        <h2>Available Services</h2>
                        <div className="grid grid-4">
                            {[
                                { type: 'Barangay Clearance', icon: '📄', desc: 'For employment, business, or government requirements', reqs: ['Valid ID', 'Proof of residency', '1x1 photo'] },
                                { type: 'Business Permit', icon: '🏠', desc: 'Register or renew your business', reqs: ['DTI/SEC registration', 'Occupancy permit', 'Sanitary permit'] },
                                { type: 'Barangay ID', icon: '🆔', desc: 'Official identification for residents', reqs: ['Birth certificate', 'Proof of address', '2x2 photo'] },
                                { type: 'Certificate', icon: '📝', desc: 'Indigency, residency, and other certs', reqs: ['Valid ID', 'Purpose statement', 'Supporting docs'] },
                            ].map((service) => (
                                <div className="glass-card" key={service.type}>
                                    <div className={styles.serviceIcon}>{service.icon}</div>
                                    <h3>{service.type}</h3>
                                    <p className={styles.serviceDesc}>{service.desc}</p>
                                    <ul className={styles.requirements}>
                                        {service.reqs.map((req) => (
                                            <li key={req}>✓ {req}</li>
                                        ))}
                                    </ul>
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%', marginTop: '1rem' }}
                                        onClick={() => setShowRequestModal(true)}
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Applications */}
                    <section className={styles.recentSection}>
                        <h2>Recent Applications</h2>
                        <div className={`glass-card ${styles.applicationsCard}`}>
                            {loadingRequests ? (
                                <LoadingSpinner text="Loading your requests..." size="sm" />
                            ) : requests.length === 0 ? (
                                <p className={styles.emptyMessage}>
                                    No applications yet. Apply for a service above to get started!
                                </p>
                            ) : (
                                requests.map((req) => (
                                    <div className={styles.applicationItem} key={req.id}>
                                        <div className={styles.appInfo}>
                                            <div className={styles.appIcon}>{getDocIcon(req.document_type)}</div>
                                            <div>
                                                <h4>{req.document_type}</h4>
                                                <p className={styles.appDate}>
                                                    Applied: {new Date(req.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                                {req.purpose && (
                                                    <p className={styles.appPurpose}>Purpose: {req.purpose}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className={getStatusBadge(req.status)}>{getStatusLabel(req.status)}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Announcements */}
                    <section className={styles.announcements}>
                        <h2>Latest Announcements 📢</h2>
                        {loadingAnnouncements ? (
                            <LoadingSpinner text="Loading announcements..." size="sm" />
                        ) : (
                            <div className="grid grid-2">
                                {announcements.length === 0 ? (
                                    <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                                        <p className={styles.emptyMessage}>No announcements yet.</p>
                                    </div>
                                ) : (
                                    announcements.map((ann) => (
                                        <div className={`glass-card ${styles.announcementCard}`} key={ann.id}>
                                            <div className={styles.announcementHeader}>
                                                <span className={getCategoryBadge(ann.category)}>
                                                    {getCategoryLabel(ann.category)}
                                                </span>
                                                <span className={styles.announcementDate}>
                                                    {new Date(ann.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <h3>{ann.title}</h3>
                                            <p>{ann.content}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Floating AI Chat Button */}
            <button
                className={styles.chatButton}
                onClick={() => setShowChatBot(true)}
                aria-label="Open AI Assistant"
            >
                🤖
            </button>

            {/* ChatBot Component */}
            {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}

            {/* Request Document Modal */}
            {showRequestModal && (
                <RequestModal
                    onClose={() => setShowRequestModal(false)}
                    onSubmit={handleRequestSubmit}
                />
            )}
        </div>
    )
}

export default function ResidentPortal() {
    return (
        <ProtectedRoute>
            <ResidentPortalContent />
        </ProtectedRoute>
    )
}
