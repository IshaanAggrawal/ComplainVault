import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function ChatWidget({ setIsOpen }) {
	const [messages, setMessages] = useState([
		{ role: 'bot', text: 'Hi! I can help you with questions about the complaint system.' }
	]);
	const [inputValue, setInputValue] = useState('');
	const [isSending, setIsSending] = useState(false);
	const scrollAnchorRef = useRef(null);

	useEffect(() => {
		if (scrollAnchorRef.current) {
			scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	const sanitizeInput = (text) => text.replace(/[*?\\%]/g, '').trim();

	const sendMessage = async () => {
		const trimmed = sanitizeInput(inputValue);
		if (!trimmed || isSending) return;

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

	const handleClose = () => setIsOpen(false);

	const styles = {
		container: {
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			maxWidth: 500,
			height: 400,
			borderRadius: 16,
			boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
			overflow: 'hidden',
			fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
			backgroundColor: '#f9fafb'
		},
		header: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			padding: '14px 20px',
			background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
			color: '#fff',
			fontWeight: 600,
			fontSize: 18
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
			backgroundColor: '#f3f4f6'
		},
		row: { display: 'flex', marginBottom: 10 },
		bubbleUser: {
			marginLeft: 'auto',
			background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
			color: '#fff',
			padding: '12px 16px',
			borderRadius: 20,
			maxWidth: '75%',
			wordBreak: 'break-word',
			boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
			transition: 'transform 0.1s',
		},
		bubbleBot: {
			marginRight: 'auto',
			background: '#e0f2fe',
			color: '#0369a1',
			padding: '12px 16px',
			borderRadius: 20,
			maxWidth: '75%',
			wordBreak: 'break-word',
			boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
		},
		footer: {
			padding: 12,
			borderTop: '1px solid #e5e7eb',
			background: '#fff',
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
			color: '#000'
		},
		button: {
			padding: '12px 20px',
			borderRadius: 12,
			border: 'none',
			background: isSending ? '#93c5fd' : 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)',
			color: '#fff',
			fontWeight: 600,
			cursor: isSending ? 'not-allowed' : 'pointer',
			transition: 'background 0.3s'
		}
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

			<div style={styles.footer}>
				<input
					type="text"
					placeholder="Type a message..."
					value={inputValue}
					onChange={e => setInputValue(e.target.value)}
					style={styles.input}
					disabled={isSending}
				/>
				<button onClick={handleSubmit} style={styles.button} disabled={isSending}>
					{isSending ? 'Sending...' : 'Send'}
				</button>
			</div>
		</div>
	);
}

export default ChatWidget;
