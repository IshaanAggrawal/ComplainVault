import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function ChatWidget({ setIsOpen }) {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi! I can help you with questions about the complaint system.' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);
    const scrollAnchorRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        const timer = setTimeout(() => {
            scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    // Sanitize input to prevent script injections
    const sanitizeInput = (text) => text.replace(/[<>]/g, '').trim();

    const sendMessage = async () => {
        const trimmed = sanitizeInput(inputValue);
        if (!trimmed || isSending) return;

        // Add user's message
        setMessages(prev => [...prev, { role: 'user', text: inputValue }]);
        setInputValue('');
        setIsSending(true);

        try {
            const resp = await axios.post(
                'http://127.0.0.1:8000/chat',
                { question: trimmed },
                { timeout: 10000 }
            );

            const answer = resp?.data?.answer ?? 'Sorry, I did not receive a valid response.';
            setMessages(prev => [...prev, { role: 'bot', text: answer }]);
        } catch (err) {
            console.error('Chat error:', err);
            let errorMessage = 'Something went wrong. Please try again.';
            if (err.response?.data?.error) errorMessage = `Error: ${err.response.data.error}`;
            else if (err.code === 'ECONNREFUSED') errorMessage = 'Cannot connect to backend.';
            else if (err.code === 'ECONNABORTED') errorMessage = 'Request timed out.';
            setMessages(prev => [...prev, { role: 'bot', text: errorMessage }]);
        } finally {
            setIsSending(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    // Send message on Enter, allow Shift+Enter for newline
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleClose = () => setIsOpen(false);

    const darkHeaderGradient = 'linear-gradient(90deg, #1e0045 0%, #3e077c 100%)';
    const sendButtonGradient = 'linear-gradient(90deg, #3e077c 0%, #1e0045 100%)';
    const userBubbleGradient = 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)';

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 500,
            height: 400,
            borderRadius: 16,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(8px)',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            background: darkHeaderGradient,
            color: '#fff',
            fontWeight: 600,
            fontSize: 18,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        headerBtn: {
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: 22,
            cursor: 'pointer',
            fontWeight: 700,
            lineHeight: 1
        },
        chatArea: {
            flex: 1,
            padding: 16,
            overflowY: 'auto',
            backgroundColor: 'transparent',
        },
        row: { display: 'flex', marginBottom: 10 },
        bubbleUser: {
            marginLeft: 'auto',
            background: userBubbleGradient,
            color: '#fff',
            padding: '12px 16px',
            borderRadius: 20,
            maxWidth: '75%',
            wordBreak: 'break-word',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.25), 0 0 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.1s',
        },
        bubbleBot: {
            marginRight: 'auto',
            background: 'rgba(239, 246, 255, 0.85)',
            color: '#0369a1',
            padding: '12px 16px',
            borderRadius: 20,
            maxWidth: '75%',
            wordBreak: 'break-word',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 2px rgba(0,0,0,0.05)',
        },
        footer: {
            padding: 12,
            borderTop: '1px solid #e5e7eb',
            background: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            gap: 8
        },
        input: {
            flex: 1,
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid #d1d5db',
            outline: 'none',
            fontSize: 14,
            color: '#000',
            backgroundColor: '#fff',
        },
        button: {
            padding: '12px 20px',
            borderRadius: 12,
            border: 'none',
            background: isSending ? '#93c5fd' : sendButtonGradient,
            color: '#fff',
            fontWeight: 600,
            cursor: isSending ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s, transform 0.1s',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                Chat
                <button style={styles.headerBtn} onClick={handleClose}>×</button>
            </div>

            <div style={styles.chatArea}>
                {messages.map((m, idx) => (
                    <div key={idx} style={styles.row}>
                        <div style={m.role === 'user' ? styles.bubbleUser : styles.bubbleBot}>
                            {m.text}
                        </div>
                    </div>
                ))}
                <div ref={scrollAnchorRef} />
            </div>

            <form onSubmit={handleSubmit} style={styles.footer}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    style={styles.input}
                    disabled={isSending}
                />
                <button
                    type="submit"
                    style={{
                        ...styles.button,
                        ...(isSending
                            ? {}
                            : { background: sendButtonGradient, transform: 'scale(1.02)' }),
                    }}
                    disabled={isSending}
                >
                    {isSending ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
}

export default ChatWidget;
