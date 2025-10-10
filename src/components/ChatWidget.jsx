import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function ChatWidget({setIsOpen}) {
	const [messages, setMessages] = useState([
		{ role: 'bot', text: 'Hi! I can help you with questions about the complaint system. You can ask me about contact details, department information, or any other details from the available documents.' }
	]);
	const [inputValue, setInputValue] = useState('');
	const [isSending, setIsSending] = useState(false);
	const scrollAnchorRef = useRef(null);

	useEffect(() => {
		if (scrollAnchorRef.current) {
			scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	const sendMessage = async () => {
		const trimmed = inputValue.trim();
		if (!trimmed || isSending) return;

		const userMessage = { role: 'user', text: trimmed };
		setMessages(prev => [...prev, userMessage]);
		setInputValue('');
		setIsSending(true);

		try {
			const resp = await axios.post('http://127.0.0.1:5000/chat', { question: trimmed });
			const answer = resp?.data?.answer ?? 'Sorry, I did not receive a valid response.';
			setMessages(prev => [...prev, { role: 'bot', text: answer }]);
		} catch (err) {
			console.error('Chat error:', err);
			let errorMessage = 'Hmm, something went wrong. Please try again.';
			
			if (err.response?.data?.error) {
				errorMessage = `Error: ${err.response.data.error}`;
			} else if (err.code === 'ECONNREFUSED') {
				errorMessage = 'Unable to connect to the chatbot service. Please make sure the backend server is running.';
			} else if (err.code === 'TIMEOUT') {
				errorMessage = 'The request timed out. Please try again with a shorter question.';
			}
			
			setMessages(prev => [
				...prev,
				{ role: 'bot', text: errorMessage }
			]);
		} finally {
			setIsSending(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		sendMessage();
	};

	const styles = {
		container: {
			display: 'flex',
			flexDirection: 'column',
			border: '1px solid #e5e7eb',
			borderRadius: 12,
			width: '100%',
			maxWidth: 500,
			height: 400,
			background: '#ffffff',
			overflow: 'hidden',
			boxShadow: '0 12px 28px rgba(2,6,23,0.2)'
		},
		header: {
			padding: '12px 16px',
			borderBottom: '1px solid #f1f5f9',
			background: 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)',
			color: '#ffffff',
			fontWeight: 600,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between'
		},
		headerActions: {
			display: 'flex',
			gap: 8
		},
		headerBtn: {
			border: '1px solid rgba(255,255,255,0.7)',
			background: 'rgba(255,255,255,0.2)',
			color: '#ffffff',
			padding: '6px 10px',
			borderRadius: 8,
			cursor: 'pointer'
		},
		chatArea: {
			flex: 1,
			overflowY: 'auto',
			padding: 16,
			background: '#f8fafc'
		},
		row: {
			display: 'flex',
			marginBottom: 10
		},
		bubbleUser: {
			marginLeft: 'auto',
			background: 'linear-gradient(135deg, #2563eb 0%, #22d3ee 100%)',
			color: '#ffffff',
			padding: '10px 12px',
			borderRadius: 12,
			maxWidth: '75%',
			wordBreak: 'break-word',
			boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
		},
		bubbleBot: {
			marginRight: 'auto',
			background: '#d1fae5',
			color: '#065f46',
			padding: '10px 12px',
			borderRadius: 12,
			maxWidth: '75%',
			wordBreak: 'break-word',
			boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
		},
		footer: {
			borderTop: '1px solid #f1f5f9',
			padding: 12,
			background: '#f9fafb'
		},
		form: {
			display: 'flex',
			gap: 8
		},
		input: {
			flex: 1,
			padding: '10px 12px',
			borderRadius: 8,
			border: '1px solid #d1d5db',
            color: '#000',
			outline: 'none'
		},
		button: {
			padding: '10px 16px',
			borderRadius: 8,
			border: '1px solid #2563eb',
			background: isSending ? '#93c5fd' : 'linear-gradient(90deg,rgb(150, 8, 245) 0%,rgb(37, 6, 212) 100%)',
			color: '#ffffff',
			cursor: isSending ? 'not-allowed' : 'pointer'
		}
	};

	const handleClose = () => setIsOpen(false);

	return (
		<div style={styles.container}>
			<div style={styles.header}>
				<span>Chat</span>
				<div style={styles.headerActions}>
					<button type="button" style={styles.headerBtn} onClick={handleClose} aria-label="Close chat">×</button>
				</div>
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
				<form onSubmit={handleSubmit} style={styles.form}>
					<input
						type="text"
						placeholder="Type a message and press Enter..."
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						style={styles.input}
						disabled={isSending}
					/>
					<button type="submit" style={styles.button} disabled={isSending}>
						{isSending ? 'Sending...' : 'Send'}
					</button>
				</form>
			</div>
		</div>
	);
}

export default ChatWidget;