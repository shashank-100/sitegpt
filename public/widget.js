(function() {
  'use strict';

  // Get configuration
  const config = window.sitegptConfig || {};
  const chatbotId = config.chatbotId;
  const apiUrl = config.apiUrl || 'http://localhost:3000';

  if (!chatbotId) {
    console.error('SiteGPT: chatbotId is required');
    return;
  }

  let isOpen = false;
  let conversationId = null;
  let visitorId = localStorage.getItem('sitegpt_visitor_id') ||
    'visitor_' + Math.random().toString(36).substring(2, 15);

  localStorage.setItem('sitegpt_visitor_id', visitorId);

  // Create widget container
  const container = document.createElement('div');
  container.id = 'sitegpt-widget';
  container.innerHTML = `
    <style>
      #sitegpt-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      #sitegpt-button {
        width: 60px;
        height: 60px;
        border-radius: 30px;
        background: #0ea5e9;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
      }

      #sitegpt-button:hover {
        transform: scale(1.1);
      }

      #sitegpt-button svg {
        width: 30px;
        height: 30px;
        fill: white;
      }

      #sitegpt-chat {
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 380px;
        height: 600px;
        max-height: calc(100vh - 140px);
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
      }

      #sitegpt-chat.open {
        display: flex;
      }

      #sitegpt-header {
        background: #0ea5e9;
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      #sitegpt-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      #sitegpt-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #sitegpt-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: #f9fafb;
      }

      .sitegpt-message {
        margin-bottom: 16px;
        display: flex;
        gap: 10px;
      }

      .sitegpt-message.user {
        flex-direction: row-reverse;
      }

      .sitegpt-message-content {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.5;
      }

      .sitegpt-message.assistant .sitegpt-message-content {
        background: white;
        color: #374151;
        border: 1px solid #e5e7eb;
      }

      .sitegpt-message.user .sitegpt-message-content {
        background: #0ea5e9;
        color: white;
      }

      #sitegpt-quick-prompts {
        padding: 0 20px 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .sitegpt-quick-prompt {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 8px 16px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .sitegpt-quick-prompt:hover {
        background: #f3f4f6;
      }

      #sitegpt-input-container {
        padding: 20px;
        border-top: 1px solid #e5e7eb;
        background: white;
      }

      #sitegpt-input-form {
        display: flex;
        gap: 10px;
      }

      #sitegpt-input {
        flex: 1;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 10px 14px;
        font-size: 14px;
        outline: none;
        font-family: inherit;
      }

      #sitegpt-input:focus {
        border-color: #0ea5e9;
      }

      #sitegpt-send {
        background: #0ea5e9;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }

      #sitegpt-send:hover:not(:disabled) {
        background: #0284c7;
      }

      #sitegpt-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .sitegpt-typing {
        display: inline-flex;
        gap: 4px;
      }

      .sitegpt-typing span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #9ca3af;
        animation: sitegpt-bounce 1.4s infinite ease-in-out both;
      }

      .sitegpt-typing span:nth-child(1) {
        animation-delay: -0.32s;
      }

      .sitegpt-typing span:nth-child(2) {
        animation-delay: -0.16s;
      }

      @keyframes sitegpt-bounce {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }

      @media (max-width: 480px) {
        #sitegpt-chat {
          bottom: 0;
          right: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          max-height: 100vh;
          border-radius: 0;
        }
      }
    </style>

    <button id="sitegpt-button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.68-.31-3.86-.85l-.28-.14-2.86.49.49-2.86-.14-.28C4.31 14.68 4 13.38 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
      </svg>
    </button>

    <div id="sitegpt-chat">
      <div id="sitegpt-header">
        <h3 id="sitegpt-title">Chat</h3>
        <button id="sitegpt-close">&times;</button>
      </div>
      <div id="sitegpt-messages"></div>
      <div id="sitegpt-quick-prompts"></div>
      <div id="sitegpt-input-container">
        <form id="sitegpt-input-form">
          <input
            type="text"
            id="sitegpt-input"
            placeholder="Type your message..."
            autocomplete="off"
          />
          <button type="submit" id="sitegpt-send">Send</button>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // Elements
  const button = document.getElementById('sitegpt-button');
  const chat = document.getElementById('sitegpt-chat');
  const closeBtn = document.getElementById('sitegpt-close');
  const messagesContainer = document.getElementById('sitegpt-messages');
  const inputForm = document.getElementById('sitegpt-input-form');
  const input = document.getElementById('sitegpt-input');
  const sendBtn = document.getElementById('sitegpt-send');
  const quickPromptsContainer = document.getElementById('sitegpt-quick-prompts');

  // Load chatbot configuration
  fetch(`${apiUrl}/api/widget/${chatbotId}`)
    .then(res => res.json())
    .then(data => {
      if (data.chatbot) {
        const { welcomeMessage, theme, quickPrompts } = data.chatbot;

        // Set theme
        if (theme && theme.primaryColor) {
          const style = document.createElement('style');
          style.textContent = `
            #sitegpt-button { background: ${theme.primaryColor} !important; }
            #sitegpt-header { background: ${theme.primaryColor} !important; }
            #sitegpt-send { background: ${theme.primaryColor} !important; }
            .sitegpt-message.user .sitegpt-message-content { background: ${theme.primaryColor} !important; }
          `;
          document.head.appendChild(style);
        }

        // Show welcome message
        if (welcomeMessage) {
          addMessage('assistant', welcomeMessage);
        }

        // Show quick prompts
        if (Array.isArray(quickPrompts) && quickPrompts.length > 0) {
          quickPrompts.forEach(prompt => {
            const btn = document.createElement('button');
            btn.className = 'sitegpt-quick-prompt';
            btn.textContent = prompt;
            btn.onclick = () => {
              input.value = prompt;
              quickPromptsContainer.innerHTML = '';
            };
            quickPromptsContainer.appendChild(btn);
          });
        }
      }
    })
    .catch(err => console.error('SiteGPT: Failed to load config', err));

  // Toggle chat
  function toggleChat() {
    isOpen = !isOpen;
    chat.classList.toggle('open');
    if (isOpen) {
      input.focus();
    }
  }

  button.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  // Add message to chat
  function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `sitegpt-message ${role}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'sitegpt-message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Show typing indicator
  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'sitegpt-message assistant';
    typingDiv.id = 'sitegpt-typing';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'sitegpt-message-content';
    contentDiv.innerHTML = '<div class="sitegpt-typing"><span></span><span></span><span></span></div>';

    typingDiv.appendChild(contentDiv);
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function hideTyping() {
    const typingDiv = document.getElementById('sitegpt-typing');
    if (typingDiv) {
      typingDiv.remove();
    }
  }

  // Send message
  inputForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = input.value.trim();
    if (!message) return;

    // Clear input and quick prompts
    input.value = '';
    quickPromptsContainer.innerHTML = '';

    // Add user message
    addMessage('user', message);

    // Disable input
    sendBtn.disabled = true;
    input.disabled = true;

    // Show typing
    showTyping();

    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId,
          message,
          conversationId,
          visitorId,
        }),
      });

      const data = await response.json();

      if (data.response) {
        hideTyping();
        addMessage('assistant', data.response);

        if (data.conversationId && !conversationId) {
          conversationId = data.conversationId;
        }
      }
    } catch (error) {
      hideTyping();
      addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
      console.error('SiteGPT: Error sending message', error);
    } finally {
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });
})();
