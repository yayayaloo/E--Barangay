'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './ChatBot.module.css'

interface Message {
    id: number
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
}

interface ChatBotProps {
    onClose: () => void
}

// Mock responses for demonstration
const mockResponses: Record<string, string> = {
    'hello': 'Hello! I\'m your E-Barangay AI assistant. How can I help you today?',
    'hi': 'Hi there! Welcome to E-Barangay Gordon Heights. What can I assist you with?',
    'clearance': 'To apply for a Barangay Clearance, you\'ll need: (1) Valid ID, (2) Proof of residency, and (3) 1x1 photo. You can start your application by clicking "Request Document" on your dashboard.',
    'requirements': 'It depends on the service you need. Which document would you like to apply for? We offer Barangay Clearance, Business Permits, Barangay ID, and various Certificates.',
    'hours': 'Our online portal is available 24/7! However, the Barangay Hall is open Monday to Friday, 8:00 AM to 5:00 PM. Document pickup is available during office hours.',
    'contact': 'You can reach us at:\n📞 Phone: (123) 456-7890\n✉️ Email: info@ebarangay-gh.gov.ph\n📍 Address: Barangay Hall, Gordon Heights',
    'status': 'You can track your application status by clicking "Track Status" on your dashboard. You\'ll see all your pending and completed requests there.',
    'qr': 'QR codes on our documents allow instant verification of authenticity. Anyone can scan the QR code to verify that the document was officially issued by our office.',
    'help': 'I can help you with:\n• Document requirements\n• Application process\n• Office hours and contact info\n• Tracking your requests\n• General barangay information\n\nWhat would you like to know?',
}

const quickReplies = [
    'Barangay Clearance requirements',
    'Office hours',
    'Track my application',
    'Contact information',
]

export default function ChatBot({ onClose }: ChatBotProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: 'Hello! I\'m your AI assistant for E-Barangay Gordon Heights. How can I help you today?',
            sender: 'bot',
            timestamp: new Date(),
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const getBotResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase()

        // Check for keyword matches
        for (const [keyword, response] of Object.entries(mockResponses)) {
            if (lowerMessage.includes(keyword)) {
                return response
            }
        }

        // Default response
        return 'I\'m not sure about that. You can ask me about:\n• Document requirements\n• Office hours\n• Application tracking\n• Contact information\n\nOr type "help" for more options.'
    }

    const handleSend = (message?: string) => {
        const textToSend = message || inputValue.trim()
        if (!textToSend) return

        // Add user message
        const userMessage: Message = {
            id: messages.length + 1,
            text: textToSend,
            sender: 'user',
            timestamp: new Date(),
        }
        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        // Simulate bot thinking and response
        setTimeout(() => {
            const botResponse: Message = {
                id: messages.length + 2,
                text: getBotResponse(textToSend),
                sender: 'bot',
                timestamp: new Date(),
            }
            setMessages(prev => [...prev, botResponse])
            setIsTyping(false)
        }, 1000 + Math.random() * 1000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.chatContainer} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.chatHeader}>
                    <div className={styles.headerInfo}>
                        <div className={styles.botAvatar}>🤖</div>
                        <div>
                            <h3>AI Assistant</h3>
                            <span className={styles.status}>
                                <span className={styles.statusDot}></span>
                                Online
                            </span>
                        </div>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div className={styles.messagesContainer}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.botMessage
                                }`}
                        >
                            {message.sender === 'bot' && (
                                <div className={styles.messageAvatar}>🤖</div>
                            )}
                            <div className={styles.messageContent}>
                                <div className={styles.messageText}>{message.text}</div>
                                <div className={styles.messageTime}>
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                            {message.sender === 'user' && (
                                <div className={styles.messageAvatar}>👤</div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className={`${styles.message} ${styles.botMessage}`}>
                            <div className={styles.messageAvatar}>🤖</div>
                            <div className={styles.typingIndicator}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length === 1 && (
                    <div className={styles.quickReplies}>
                        {quickReplies.map((reply, index) => (
                            <button
                                key={index}
                                className={styles.quickReplyButton}
                                onClick={() => handleSend(reply)}
                            >
                                {reply}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        className={styles.sendButton}
                        onClick={() => handleSend()}
                        disabled={!inputValue.trim()}
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    )
}
