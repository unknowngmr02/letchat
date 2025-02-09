// 🔗 Connect to the Socket.IO server
const socket = io('https://private-chat-b3f5.onrender.com'); // Change URL if hosted elsewhere

// 📌 Get query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const room = urlParams.get('room');        // Get room name
const username = urlParams.get('username'); // Get username

// 🚨 Redirect user if room or username is missing
if (!room || !username) {
    alert('Invalid Access');
    window.location.href = 'index.html'; // Redirect to home page
}

// 🏠 Join the chat room
socket.emit('join room', { room, username });

// 📌 Display the room name in the UI
document.getElementById('roomName').textContent = room;

/**
 * 📩 Function to create and append a message to the chat
 * @param {Object} msg - The message object (contains username and message)
 */
function appendMessage(msg) {
    const messagesContainer = document.getElementById('messages');

    // 📦 Create a wrapper div to control alignment
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-container');

    // 📝 Create a new list item (message bubble)
    const messageItem = document.createElement('li');
    messageItem.textContent = `${msg.message}`;
    messageItem.classList.add('message-bubble'); // Apply bubble styling

    // 🎯 If the message is from the current user, align it to the right
    if (msg.username === username) {
        messageWrapper.classList.add('self-message'); // Aligns message to flex-end
    }

    // 🏗 Append message item inside the wrapper
    messageWrapper.appendChild(messageItem);

    // 📌 Append the wrapper to the messages container
    messagesContainer.appendChild(messageWrapper);

    // 🏃 Auto-scroll to the latest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * 📤 Function to send a chat message
 */
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim(); // Remove unnecessary spaces

    if (!message) return; // Prevent sending empty messages

    // 🚀 Emit message to the server
    socket.emit('chat message', { room, username, message });

    // 🧹 Clear the input field after sending
    messageInput.value = '';
}

/**
 * 📩 Listen for incoming chat messages
 */
socket.on('chat message', (msg) => {
    appendMessage(msg); // Call function to display message
});

/**
 * 🔄 Load chat history when a user joins
 */
socket.on('chat history', (messages) => {
    const messageList = document.getElementById('messages');
    messageList.innerHTML = ''; // Clear existing messages

    // 📜 Loop through and display each past message
    messages.forEach(msg => {
        appendMessage(msg); // Call function to display message
    });
});
