'use client'

import AuthProvider from '@/components/AuthProvider'
import { ToastProvider } from '@/components/Toast'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </AuthProvider>
    )
}
