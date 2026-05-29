import React, { useState, useEffect, useRef } from 'react';

export default function App() {
    const [messages, setMessages] = useState([{ text: "Hello! I am your AI Desktop Agent.", sender: "agent" }]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const isListenerAttached = useRef(false);

    useEffect(() => {
        if (!isListenerAttached.current) {
            window.api.onResponse((response) => {
                setMessages(prev => [...prev, { text: response, sender: "agent" }]);
                setIsLoading(false);
            });
            isListenerAttached.current = true;
        }
    }, []);

    const sendMessage = () => {
        if (!input.trim() || isLoading) return;
        setMessages(prev => [...prev, { text: input, sender: "user" }]);
        window.api.sendMessage(input);
        setInput("");
        setIsLoading(true);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Desktop Agent</h2>
            <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                {messages.map((m, i) => <p key={i}><strong>{m.sender}:</strong> {m.text}</p>)}
                {isLoading && <p style={{ color: '#888', fontStyle: 'italic' }}>Agent is thinking...</p>}
            </div>
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
                style={{ width: '80%', padding: '5px' }}
            />
            <button onClick={sendMessage} disabled={isLoading} style={{ padding: '5px 10px' }}>Send</button>
        </div>
    );
}
