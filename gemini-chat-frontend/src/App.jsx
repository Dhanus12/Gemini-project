import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastResponseSummary, setLastResponseSummary] = useState(null);
    const chatEndRef = useRef(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        const userMsg = { sender: "user", text: question };
        setMessages((prev) => [...prev, userMsg]);
        setQuestion("");
        setLoading(true);

        try {
            const response = await axios.post(`${BACKEND_URL}/api/qna/ask`, { question });
            const data = response.data;

            const mainText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            const role = data.candidates?.[0]?.content?.role || "";
            const promptTokenCount = data.usageMetadata?.promptTokenCount || 0;
            const candidatesTokenCount = data.usageMetadata?.candidatesTokenCount || 0;
            const modality = data.usageMetadata?.promptTokensDetails?.[0]?.modality || "";
            const modelVersion = data.modelVersion || "";

            setMessages((prev) => [...prev, { sender: "bot", text: mainText }]);
            setLastResponseSummary({ role, promptTokenCount, candidatesTokenCount, modality, modelVersion });
        } catch (error) {
            console.log(error);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "⚠️ Something went wrong. Please try again!" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="chat-wrapper">
                <div className="chat-header">🤖 Gemini AI Chat</div>
                <div className="chat-box">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message-wrapper ${msg.sender === "user" ? "user-msg-wrapper" : "bot-msg-wrapper"}`}
                        >
                            <div className={`message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="text-center text-muted mt-2">
                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                            Thinking...
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {lastResponseSummary && (
                    <div className="summary-box">
                        <h5>Response Details:</h5>
                        <p><strong>Role:</strong> {lastResponseSummary.role}</p>
                        <p><strong>Prompt Token Count:</strong> {lastResponseSummary.promptTokenCount}</p>
                        <p><strong>Candidates Token Count:</strong> {lastResponseSummary.candidatesTokenCount}</p>
                        <p><strong>Modality:</strong> {lastResponseSummary.modality}</p>
                        <p><strong>Model Version:</strong> {lastResponseSummary.modelVersion}</p>
                    </div>
                )}

                <form onSubmit={handleSend} className="input-area">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Type your question..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        Send
                    </button>
                </form>
            </div>

            <footer className="footer">
                <p>Founded by Dhanus | Email: <a href="mailto:dhanusmani43@gmail.com">dhanusmani43@gmail.com</a></p>
            </footer>
        </div>
    );
}

export default App;
