// frontend/src/context/ChatContext.jsx — AI conversation state that survives route changes
import React, { createContext, useContext, useState, useCallback } from 'react';
import { sendAIQuery, analyzeImageAI } from '../services/api';

const ChatContext = createContext();

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const WELCOME = {
  sender: 'ai',
  text: "Namaste! 👋 I'm your **NIVRA AI Assistant**. Tell me your situation in simple words — for example: *'I am a college student needing help with fees'* or *'There is flooding in my street'*. I'll classify your problem and show exact schemes, loan rules, or emergency shelter steps.",
  intentCategory: 'GENERAL_GUIDANCE',
  timestamp: now(),
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([WELCOME]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (text, imageFile = null, imagePreview = null) => {
    const query = (text || '').trim();
    if (!query && !imageFile) return;

    setMessages(prev => [...prev, { sender: 'user', text: query, imagePreview, timestamp: now() }]);
    setLoading(true);

    try {
      const imageAnalysis = imageFile ? await analyzeImageAI(imageFile) : null;
      // An image with no caption still gets routed through the AI using the detected category
      const res = await sendAIQuery(query || imageAnalysis?.detectedCategory || 'image report');

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: res.responseText || 'Here is the guidance I prepared for your query.',
        intentCategory: res.intentCategory || 'GENERAL_GUIDANCE',
        matchedItems: res.matchedItems || [],
        documentChecklist: res.documentChecklist || [],
        nextSteps: res.nextSteps || [],
        officialSources: res.officialSources || [],
        urgentAction: res.urgentAction || false,
        disclaimer: res.disclaimer,
        imageAnalysis,
        timestamp: now(),
      }]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetChat = useCallback(() => setMessages([{ ...WELCOME, timestamp: now() }]), []);

  return (
    <ChatContext.Provider value={{ messages, loading, sendMessage, resetChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
