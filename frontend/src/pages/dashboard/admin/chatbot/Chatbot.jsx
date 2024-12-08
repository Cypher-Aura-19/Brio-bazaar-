import React, { useState } from 'react';
import { useSelector } from 'react-redux';
//for admin
function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Access authentication state from Redux store
  const { user } = useSelector((state) => state.auth);

  function displayMessage(text, sender) {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, sender },
    ]);
  }

  function disableSendButton(disable) {
    setIsSending(disable);
  }

  async function sendRequest(userInput) {
    const requestBody = {
      contents: [
        {
          role: "model",
          parts: [
            {
              text: "You are CustomerBot, an assistant that helps customers with their inquiries and issues.",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: "Hello! Welcome to CustomerBot. How can I assist you today?",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: "I need help with my order.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "I'm here to help! Please provide your order number, and I'll assist you further.",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: "My order number is 12345. Can you check its status?",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Your order 12345 is being processed and will be shipped soon. Is there anything else I can help you with?",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: "Can you update me on the shipping details?",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Sure! Your order is expected to arrive in 3-5 business days. You'll receive an email once it's shipped.",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `input: ${userInput}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 1.5,
        topK: 1,
        topP: 1,
        maxOutputTokens: 500,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };
    
    

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCKI97Sz1RPsfF5AxTYW4CojWR_jvTOj-8`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch response");
      }

      const data = await response.json();
      if (data && data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Error:", error);
      return "Sorry, there was an error fetching the information.";
    }
  }

  async function handleSendClick() {
    if (userInput) {
      displayMessage(userInput, "user");
      disableSendButton(true);

      try {
        const botResponse = await sendRequest(userInput);
        displayMessage(botResponse, "bot");
      } catch (error) {
        console.error("Error:", error);
        displayMessage("Sorry, there was an error fetching the weather information.", "bot");
      }

      setUserInput('');
      disableSendButton(false);
    }
  }

  if (!user) {
    return <div>Please log in to access the chatbot.</div>;
  }

  return (
    <div className="container fixed top-0 right-0 h-full rounded-l-lg shadow-lg overflow-hidden w-full md:w-[1505px] flex flex-col">
      <div id="chat-container" className="flex flex-col space-y-4 p-4 overflow-y-auto flex-grow max-h-[calc(100vh-60px)]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} items-center space-x-2`}
          >
            <div className={`flex ${message.sender === "user" ? "flex-row-reverse" : ""} items-start space-x-3`}>
              <img
                className="w-10 h-10 rounded-full"
                src={message.sender === "user" ? "user.png" : "bot.avif"}
                alt={message.sender}
              />
              <div
                className={`p-3 rounded-lg max-w-md text-white shadow-lg ${ // Increased max width here
                  message.sender === "user"
                    ? "bg-gradient-to-r border border-gray-700"
                    : "bg-gradient-to-r text-white border border-gray-700"
                }`}
              >
                <div className="font-semibold mb-1">
                  {message.sender === "user" ? "You" : "ChatBot"}
                </div>
                <div className="whitespace-pre-wrap">{message.text}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="input-container flex items-center space-x-3 p-4 border-t bg-black text-white">
        <input
          type="text"
          id="userInput"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask me anything"
          className="w-full sm:w-2/3 p-2 rounded-lg border bg-black border-gray-700 text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          id="sendButton"
          onClick={handleSendClick}
          disabled={isSending}
          className="w-full sm:w-1/3 p-2 rounded-lg bg-white text-black disabled:opacity-50 font-bold hover:bg-gray-200"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
