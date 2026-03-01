'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { ServiceRequest, Announcement } from '@/lib/types'
import styles from './admin.module.css'

function AdminDashboardContent() {
    const { profile, signOut } = useAuth()
    const [activeTab, setActiveTab] = useState('overview')

    // Stats
    const [pendingCount, setPendingCount] = useState(0)
    const [completedCount, setCompletedCount] = useState(0)
    const [totalResidents, setTotalResidents] = useState(0)

    // Data
    const [requests, setRequests] = useState<ServiceRequest[]>([])
    const [announcements, setAnnouncements] = useState<Announcement[]>([])

    // Announcement form
    const [annTitle, setAnnTitle] = useState('')
    const [annContent, setAnnContent] = useState('')
    const [annCategory, setAnnCategory] = useState('community_event')
    const [publishing, setPublishing] = useState(false)

    useEffect(() => {
        fetchStats()
        fetchRequests()
        fetchAnnouncements()
    }, [])

    const fetchStats = async () => {
        const { count: pending } = await supabase
            .from('service_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')
        setPendingCount(pending || 0)

        const { count: completed } = await supabase
            .from('service_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'completed')
        setCompletedCount(completed || 0)

        const { count: residents } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'resident')
        setTotalResidents(residents || 0)
    }

    const fetchRequests = async () => {
        const { data } = await supabase
            .from('service_requests')
            .select(`
                *,
                profiles!service_requests_resident_id_fkey ( full_name )
            `)
            .order('created_at', { ascending: false })
            .limit(20)

        if (data) {
            const mapped = data.map((r: any) => ({
                ...r,
                resident_name: r.profiles?.full_name || 'Unknown',
            }))
            setRequests(mapped)
        }
    }

    const fetchAnnouncements = async () => {
        const { data } = await supabase
            .from('announcements')
            .select('*')
            .order('published_at', { ascending: false })
            .limit(10)

        if (data) setAnnouncements(data)
    }

    const updateRequestStatus = async (id: string, status: string) => {
        await supabase
            .from('service_requests')
            .update({ status })
            .eq('id', id)

        await fetchRequests()
        await fetchStats()
    }

    const publishAnnouncement = async () => {
        if (!annTitle.trim() || !annContent.trim()) return
        setPublishing(true)

        await supabase.from('announcements').insert({
            title: annTitle,
            content: annContent,
            category: annCategory,
            author_id: profile!.id,
        })

        setAnnTitle('')
        setAnnContent('')
        setAnnCategory('community_event')
        setPublishing(false)
        await fetchAnnouncements()
    }

    const deleteAnnouncement = async (id: string) => {
        await supabase.from('announcements').delete().eq('id', id)
        await fetchAnnouncements()
    }

    const getStatusBadge = (status: string) => {
        const map: Record<string, string> = {
            pending: 'badge badge-warning',
            processing: 'badge badge-info',
            ready: 'badge badge-success',
            completed: 'badge badge-success',
            rejected: 'badge badge-warning',
        }
        return map[status] || 'badge badge-info'
    }

    const getCategoryLabel = (category: string) => {
        const map: Record<string, string> = {
            community_event: 'Community Event',
            important: 'Important',
            emergency: 'Emergency',
            general: 'General',
        }
        return map[category] || category
    }

    const getCategoryBadge = (category: string) => {
        const map: Record<string, string> = {
            community_event: 'badge badge-info',
            important: 'badge badge-warning',
            emergency: 'badge badge-warning',
            general: 'badge badge-info',
        }
        return map[category] || 'badge badge-info'
    }

    return (
        <div className={styles.adminContainer}>
            {/* Header */}
            <header className={styles.header}>
                <div className="container flex-between">
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoIcon}>🏛️</span>
                        <span>E-Barangay Admin</span>
                    </Link>
                    <div className={styles.userMenu}>
                        <span className={styles.userName}>👤 {profile?.full_name || 'Admin'}</span>
                        <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={signOut}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <div className={styles.dashboardLayout}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <nav className={styles.sidebarNav}>
                        <button
                            className={activeTab === 'overview' ? styles.active : ''}
                            onClick={() => setActiveTab('overview')}
                        >
                            📊 Overview
                        </button>
                        <button
                            className={activeTab === 'requests' ? styles.active : ''}
                            onClick={() => setActiveTab('requests')}
                        >
                            📝 Document Requests
                        </button>
                        <button
                            className={activeTab === 'residents' ? styles.active : ''}
                            onClick={() => setActiveTab('residents')}
                        >
                            👥 Residents
                        </button>
                        <button
                            className={activeTab === 'verify' ? styles.active : ''}
                            onClick={() => setActiveTab('verify')}
                        >
                            🔐 QR Verification
                        </button>
                        <button
                            className={activeTab === 'announcements' ? styles.active : ''}
                            onClick={() => setActiveTab('announcements')}
                        >
                            📢 Announcements
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className={styles.mainContent}>
                    <div className="container">
                        {activeTab === 'overview' && (
                            <>
                                <h1>Dashboard Overview</h1>

                                {/* Statistics Cards */}
                                <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
                                    <div className={`glass-card ${styles.statCard}`}>
                                        <div className={styles.statIcon}>⏳</div>
                                        <div className={styles.statValue}>{pendingCount}</div>
                                        <div className={styles.statLabel}>Pending Requests</div>
                                    </div>
                                    <div className={`glass-card ${styles.statCard}`}>
                                        <div className={styles.statIcon}>✅</div>
                                        <div className={styles.statValue}>{completedCount}</div>
                                        <div className={styles.statLabel}>Completed</div>
                                    </div>
                                    <div className={`glass-card ${styles.statCard}`}>
                                        <div className={styles.statIcon}>👥</div>
                                        <div className={styles.statValue}>{totalResidents.toLocaleString()}</div>
                                        <div className={styles.statLabel}>Total Residents</div>
                                    </div>
                                    <div className={`glass-card ${styles.statCard}`}>
                                        <div className={styles.statIcon}>📈</div>
                                        <div className={styles.statValue}>{requests.length > 0 ? Math.round((completedCount / (completedCount + pendingCount || 1)) * 100) : 0}%</div>
                                        <div className={styles.statLabel}>Completion Rate</div>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <h2>Recent Requests</h2>
                                <div className="glass-card">
                                    <div className={styles.activityList}>
                                        {requests.slice(0, 5).map((req) => (
                                            <div className={styles.activityItem} key={req.id}>
                                                <div className={styles.activityIcon}>📄</div>
                                                <div className={styles.activityDetails}>
                                                    <strong>{req.document_type}</strong>
                                                    <p>{req.resident_name} — {req.document_type}</p>
                                                    <span className={styles.activityTime}>
                                                        {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <span className={getStatusBadge(req.status)}>
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            </div>
                                        ))}
                                        {requests.length === 0 && (
                                            <p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.5)' }}>
                                                No requests yet.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'requests' && (
                            <>
                                <h1>Document Requests</h1>
                                <div className="glass-card">
                                    <div className={styles.tableContainer}>
                                        <table className={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th>Request ID</th>
                                                    <th>Applicant</th>
                                                    <th>Document Type</th>
                                                    <th>Date Applied</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {requests.map((req) => (
                                                    <tr key={req.id}>
                                                        <td>#{req.id.slice(0, 8).toUpperCase()}</td>
                                                        <td>{req.resident_name}</td>
                                                        <td>{req.document_type}</td>
                                                        <td>{new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                        <td><span className={getStatusBadge(req.status)}>{req.status.charAt(0).toUpperCase() + req.status.slice(1)}</span></td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                                {req.status === 'pending' && (
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                                        onClick={() => updateRequestStatus(req.id, 'processing')}
                                                                    >
                                                                        Process
                                                                    </button>
                                                                )}
                                                                {req.status === 'processing' && (
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                                        onClick={() => updateRequestStatus(req.id, 'ready')}
                                                                    >
                                                                        Mark Ready
                                                                    </button>
                                                                )}
                                                                {req.status === 'ready' && (
                                                                    <button
                                                                        className="btn btn-secondary"
                                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                                        onClick={() => updateRequestStatus(req.id, 'completed')}
                                                                    >
                                                                        Complete
                                                                    </button>
                                                                )}
                                                                {(req.status === 'pending' || req.status === 'processing') && (
                                                                    <button
                                                                        className="btn btn-outline"
                                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                                        onClick={() => updateRequestStatus(req.id, 'rejected')}
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {requests.length === 0 && (
                                                    <tr>
                                                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.5)' }}>
                                                            No document requests yet.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'verify' && (
                            <>
                                <h1>QR Code Verification</h1>
                                <div className="grid grid-2">
                                    <div className={`glass-card ${styles.qrScanner}`}>
                                        <h3>Scan QR Code</h3>
                                        <div className={styles.scannerPlaceholder}>
                                            <div className={styles.scannerFrame}>
                                                <div className={styles.scannerCorner} style={{ top: 0, left: 0 }}></div>
                                                <div className={styles.scannerCorner} style={{ top: 0, right: 0 }}></div>
                                                <div className={styles.scannerCorner} style={{ bottom: 0, left: 0 }}></div>
                                                <div className={styles.scannerCorner} style={{ bottom: 0, right: 0 }}></div>
                                            </div>
                                            <p>Position QR code within frame</p>
                                        </div>
                                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                            📷 Activate Camera
                                        </button>
                                    </div>

                                    <div className="glass-card">
                                        <h3>Recent Verifications</h3>
                                        <div className={styles.verificationList}>
                                            <p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.5)' }}>
                                                QR scanning coming soon with camera integration.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'announcements' && (
                            <>
                                <h1>Manage Announcements</h1>
                                <div className="glass-card" style={{ marginBottom: '2rem' }}>
                                    <h3>Create New Announcement</h3>
                                    <div className={styles.announcementForm}>
                                        <input
                                            type="text"
                                            placeholder="Announcement Title"
                                            value={annTitle}
                                            onChange={(e) => setAnnTitle(e.target.value)}
                                        />
                                        <textarea
                                            rows={4}
                                            placeholder="Announcement content..."
                                            value={annContent}
                                            onChange={(e) => setAnnContent(e.target.value)}
                                        />
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <select value={annCategory} onChange={(e) => setAnnCategory(e.target.value)}>
                                                <option value="community_event">Community Event</option>
                                                <option value="important">Important</option>
                                                <option value="emergency">Emergency</option>
                                                <option value="general">General</option>
                                            </select>
                                            <button
                                                className="btn btn-primary"
                                                onClick={publishAnnouncement}
                                                disabled={publishing || !annTitle.trim() || !annContent.trim()}
                                            >
                                                {publishing ? 'Publishing...' : '📢 Publish'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <h3>Published Announcements</h3>
                                <div className="grid grid-2">
                                    {announcements.map((ann) => (
                                        <div className="glass-card" key={ann.id}>
                                            <div className={styles.announcementHeader}>
                                                <span className={getCategoryBadge(ann.category)}>
                                                    {getCategoryLabel(ann.category)}
                                                </span>
                                                <button
                                                    className={styles.editButton}
                                                    onClick={() => deleteAnnouncement(ann.id)}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                            <h4>{ann.title}</h4>
                                            <p>{ann.content}</p>
                                            <span className={styles.publishDate}>
                                                Published: {new Date(ann.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    ))}
                                    {announcements.length === 0 && (
                                        <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                                            <p style={{ color: 'rgba(255,255,255,0.5)' }}>No announcements published yet.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default function AdminDashboard() {
    return (
        <ProtectedRoute requiredRole="admin">
            <AdminDashboardContent />
        </ProtectedRoute>
    )
}
