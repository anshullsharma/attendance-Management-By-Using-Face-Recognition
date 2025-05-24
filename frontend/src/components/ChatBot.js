import React, { useState, useEffect, useRef } from 'react';

function ChatBot({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const chatEndRef = useRef(null);

  // Add welcome message when the chat opens
  useEffect(() => {
    setMessages([{ sender: 'Bot', text: 'How can I help you today?' }]);
  }, []);

  // Scroll to the bottom of the chat when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const userInput = input.trim().toLowerCase();
    if (userInput) {
      setMessages((prev) => [...prev, { sender: 'You', text: userInput }]);
      if (userInput === 'hello') {
        setMessages((prev) => [...prev, { sender: 'Bot', text: 'Hi' }]);
      } else if (userInput === 'how are you') {
        setMessages((prev) => [...prev, { sender: 'Bot', text: 'fine and u' }]);
      } else if (userInput === 'who created you') {
        setMessages((prev) => [...prev, { sender: 'Bot', text: 'my developer known as A^3' }]);
      } else if (userInput === 'what is your name') {
        setMessages((prev) => [...prev, { sender: 'Bot', text: 'My name is mini Bot' }]);
      } else if (userInput === 'bye') {
        setMessages((prev) => [...prev, { sender: 'Bot', text: 'Thanks you for chatting' }]);
      } else if (userInput === 'hwo does face recognition work') {
        setMessages((prev) => [...prev, { sender: 'Bot', text: 'Face recognition works by detecting a face in an image, extracting unique features from it, and then comparing these features with stored data to identify the person.' }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'Bot', text: "sorry i don't get it" }]);
      }
      setInput('');
    } else {
      alert('Please enter some input');
    }
  };

  const handleClear = () => {
    setMessages([{ sender: 'Bot', text: 'How can I help you today?' }]);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={`flex flex-col h-[500px] w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-3 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
        <div className="flex items-center">
          <img src="/images/chatbot.jpg" alt="ChatBot" className="w-10 h-10 rounded-full mr-2" />
          <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-green-600'}`}>CHAT ME</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-grow p-4 overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'} mb-3`}
          >
            {msg.sender === 'Bot' && (
              <img
                src="/images/chatbot.jpg"
                alt="Bot Avatar"
                className="w-8 h-8 rounded-full mr-2 self-end"
              />
            )}
            <div
              className={`relative max-w-xs p-3 rounded-2xl ${
                msg.sender === 'You'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : isDarkMode
                  ? 'bg-gray-700 text-white rounded-bl-none'
                  : 'bg-gray-200 text-black rounded-bl-none'
              }`}
            >
              <span>{msg.text}</span>
              {/* Bubble tail */}
              <span
                className={`absolute bottom-0 w-0 h-0 border-t-8 border-b-0 ${
                  msg.sender === 'You'
                    ? 'right-0 transform translate-x-1/2 border-t-blue-500 border-l-8 border-l-transparent border-r-8 border-r-transparent'
                    : isDarkMode
                    ? 'left-0 transform -translate-x-1/2 border-t-gray-700 border-l-8 border-l-transparent border-r-8 border-r-transparent'
                    : 'left-0 transform -translate-x-1/2 border-t-gray-200 border-l-8 border-l-transparent border-r-8 border-r-transparent'
                }`}
              ></span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 flex items-center gap-2 ${isDarkMode ? 'bg-gray-900 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-grow p-2 rounded-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-black placeholder-gray-500'}`}
          placeholder="Type something..."
          style={{ fontFamily: 'Times New Roman', fontSize: '16px', fontWeight: 'bold' }}
        />
        <button
          onClick={handleSend}
          className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
        <button
          onClick={handleClear}
          className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'} hover:bg-red-700`}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default ChatBot;