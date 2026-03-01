'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ChatBot from '@/components/ChatBot'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { ServiceRequest, Announcement } from '@/lib/types'
import styles from './resident.module.css'

function ResidentPortalContent() {
    const { profile, signOut } = useAuth()
    const [showChatBot, setShowChatBot] = useState(false)
    const [requests, setRequests] = useState<ServiceRequest[]>([])
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [applyingFor, setApplyingFor] = useState<string | null>(null)

    useEffect(() => {
        fetchRequests()
        fetchAnnouncements()
    }, [])

    const fetchRequests = async () => {
        const { data } = await supabase
            .from('service_requests')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5)

        if (data) setRequests(data)
    }

    const fetchAnnouncements = async () => {
        const { data } = await supabase
            .from('announcements')
            .select('*')
            .order('published_at', { ascending: false })
            .limit(4)

        if (data) setAnnouncements(data)
    }

    const handleApply = async (documentType: string) => {
        setApplyingFor(documentType)
        const { error } = await supabase.from('service_requests').insert({
            resident_id: profile!.id,
            document_type: documentType,
            purpose: 'General purpose',
            status: 'pending',
        })

        if (!error) {
            await fetchRequests()
        }
        setApplyingFor(null)
    }

    const getStatusBadge = (status: string) => {
        const badgeMap: Record<string, string> = {
            pending: 'badge badge-warning',
            processing: 'badge badge-info',
            ready: 'badge badge-success',
            completed: 'badge badge-success',
            rejected: 'badge badge-warning',
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
            emergency: 'badge badge-warning',
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
            {/* Header */}
            <header className={styles.header}>
                <div className="container flex-between">
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoIcon}>🏛️</span>
                        <span>E-Barangay</span>
                    </Link>
                    <div className={styles.userMenu}>
                        <span className={styles.userName}>👤 {profile?.full_name || 'Resident'}</span>
                        <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={signOut}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

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
                            <button className={`glass-card ${styles.actionCard}`} onClick={() => handleApply('Barangay Clearance')}>
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
                                        onClick={() => handleApply(service.type)}
                                        disabled={applyingFor === service.type}
                                    >
                                        {applyingFor === service.type ? 'Applying...' : 'Apply Now'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Applications */}
                    <section className={styles.recentSection}>
                        <h2>Recent Applications</h2>
                        <div className={`glass-card ${styles.applicationsCard}`}>
                            {requests.length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.5)' }}>
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
                        <div className="grid grid-2">
                            {announcements.length === 0 ? (
                                <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>No announcements yet.</p>
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
