'use client'

import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
    text?: string
    size?: 'sm' | 'md' | 'lg'
    fullPage?: boolean
}

export default function LoadingSpinner({ text = 'Loading...', size = 'md', fullPage = false }: LoadingSpinnerProps) {
    const sizeMap = { sm: 24, md: 40, lg: 56 }
    const px = sizeMap[size]

    const content = (
        <div className={styles.spinnerContainer}>
            <div
                className={styles.spinner}
                style={{ width: px, height: px }}
            />
            {text && <p className={styles.spinnerText}>{text}</p>}
        </div>
    )

    if (fullPage) {
        return <div className={styles.fullPage}>{content}</div>
    }

    return content
}
