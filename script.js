const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbot = document.querySelector(".chatbot");

let userMessage;
const API_KEY = "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";
const API_URL = "https://api.openai.com/v1/chat/completions";

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    chatLi.innerHTML = className === "outgoing" ?
        `<p>${message}</p>` :
        `<span class="material-symbols-outlined"><i class="ri-robot-2-line"></i></span><p>${message}</p>`;
    return chatLi;
}

const generateResponse = async (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }]
            })
        });

        const data = await response.json();
        const responseText = data.choices[0].message.content;
        const formattedResponse = responseText.replace(/\n/g, '<br>');
        messageElement.innerHTML = formattedResponse;
    } catch (error) {
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }

    // Scroll to the bottom of the chatbox
    chatbot.scrollTo(0, chatbox.scrollHeight);
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));

    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);

    // Use setTimeout to scroll after the DOM has updated
    setTimeout(() => {
        chatbot.scrollTo(0, chatbox.scrollHeight);
    });

    generateResponse(incomingChatLi);
}

sendChatBtn.addEventListener("click", handleChat);


function autoResize() {
  chatInput.style.height = "auto";
  chatInput.style.height = chatInput.scrollHeight + "px";
}

chatInput.addEventListener("input", autoResize);

// Trigger the auto-resize function initially to set the textarea's height based on the initial content.
autoResize();
