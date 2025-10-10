    "use client"
    import Image from 'next/image'
    import React, { useState } from 'react'
    import ChatWidget from './ChatWidget'

    function Chatboticon() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
        <p className='fixed bottom-24 right-6 z-10 text-sm font-medium text-white/90 bg-gradient-to-r from-indigo-500 to-cyan-400 px-2 py-1 rounded-md shadow'>Ask Chatbot</p>
        <button 
        onClick={() => setIsOpen(v => !v)}
        className={`fixed bottom-5 right-5 rounded-full p-2 shadow-lg transition-transform z-10 ring-2 ring-white/60 ${isOpen ? 'bg-gradient-to-r from-rose-500 to-orange-400 hover:scale-105' : 'bg-gradient-to-r from-indigo-500 to-cyan-400 hover:scale-110'}`}
        aria-label={isOpen ? 'Hide chatbot' : 'Show chatbot'}
        >
        <Image
            src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
            alt="Chatbot Icon"
            width={50}
            height={50}
        />
        </button>
        {isOpen && (
            <div className="fixed bottom-24 right-5 z-10 w-[360px] max-w-[92vw]">
        <ChatWidget setIsOpen={setIsOpen} />
            </div>
        )}
        </>
    )
    }

    export default Chatboticon
