function showMessages(chat, div) {
  let chatsButton = document.createElement("button")
  let br = document.createElement("br")
  chatsButton.innerText = chat.subject
  chatsButton.dataset.id = chat.id
  chatsButton.className = "chat-button"
  div.append(chatsButton)
  div.append(br)
}

function fetchMessages(div) {
  fetch("http://localhost:3000/api/v1/chat_rooms")
    .then(res => res.json())
    .then(data => {
      data.forEach(e => showMessages(e, div))
    })
  }

  function addNewMessage(message, messageDisplay, userId) {
    let thisChatDiv = document.createElement("div")
    let thisChatSpan = document.createElement("span")
    let thisChatP = document.createElement("p")
    let thisChatLi = document.createElement("li")
    thisChatLi.className = "message-li";
    thisChatDiv.className = "message-container";
    if (message.user_id === userId) {
      thisChatDiv.classList = thisChatDiv.classList + " me";
      thisChatLi.classList =  thisChatLi.classList + " self";
    }
    thisChatP.innerText = message.text
    thisChatDiv.append(thisChatP)
    thisChatLi.append(thisChatDiv)
    messageDisplay.append(thisChatLi)
  }


document.addEventListener("DOMContentLoaded", () => {
  const messageUl = document.getElementById("message-ul")
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const loginContainer = document.getElementById("login-container")
  const main = document.getElementById("test")
  const textInput = document.getElementById("text-container")
  const functionalPage = document.getElementById("functional-page")
  const chatsDiv = document.getElementById("chats-div")
  let currentUser;
  let textBox;
  let userId;
  let userName;
  let userLanguage;
  let currentChat;
  let currentChatMessages;
  let messageDisplay;

  function openConnection() {
    return new WebSocket("ws://localhost:3000/cable")
  }

  functionalPage.addEventListener("submit", e => {
    e.preventDefault()
    // currentChat
    // debugger
    if (e.target.id === "text-box") {
      text = e.target.msg.value
      fetch("http://localhost:3000/api/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text, user_id: userId, chat_room_id: currentChat.id
        })
      })
    }
    const chatWebSocket = openConnection()
    chatWebSocket.onopen = (event) => {
      const subscribeMsg = {
        "command": "subscribe",
        "identifier": `{\"channel\":\"MessagesChannel\", \"chat_room_id\": ${currentChat.id}}`
      }
      chatWebSocket.send(JSON.stringify(subscribeMsg))
    }
    chatWebSocket.onmessage = event => {
      const result = JSON.parse(event.data)
      if(result.message && result.message.text) {
        console.log(result.message.text)
        addNewMessage(result.message, messageDisplay, userId)
        // showMessages(result.message.text, chatsDiv)
      }
    }

  })



  fetchMessages(chatsDiv)

  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    //userName = e.target.user.value
    loginContainer.style.display = "none"
    functionalPage.style.display = "block"
    // console.log(userName)
    fetch("http://localhost:3000/api/v1/users")
      .then(res => res.json())
      .then(data => { //userName
        currentUser = data.filter( el => el.name === e.target.user.value)
        currentUser = currentUser[0]
        userName = currentUser.name
        userId = currentUser.id
        userLanguage = currentUser.language
      })
  })

  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    userName = e.target.user.value
    let language = e.target.lang.value
    fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: userName, language
      })
    })
    .then(res => res.json())
    .then(data => {
      loginContainer.style.display = "none";
      console.log(userName)
      currentUser = data
      userName = currentUser.name
      userId = currentUser.id
      userLanguage = currentUser.language
    })
  })

  chatsDiv.addEventListener("click", e => {
    if (e.target.className === "chat-button") {
      let chatButtonId = parseInt(e.target.dataset.id)
      fetch("http://localhost:3000/api/v1/chat_rooms")
        .then(res => res.json())
        .then(data => {
          currentChat = data.filter( el => el.id === chatButtonId);
          currentChat = currentChat[0]
          currentChatMessages = currentChat.messages
          if (document.getElementById("message-display")) {
            document.getElementById("message-display").remove();
          }
          messageDisplay = document.createElement('div')
          let messageHeader = document.createElement('h1')
          textBox = document.createElement('form');
          textBox.id = 'text-box';
          textBox.innerHTML = '<textarea class="message-text" placeholder="Type message.." name="msg"></textarea><button id="msg-submit" type="submit" class="btn">Send</button>'
          messageDisplay.append(textBox)
          messageHeader.innerText = `${e.target.innerText} chat`
          messageHeader.id = "message-header"
          messageDisplay.append(messageHeader);
          messageDisplay.id = 'message-display'
          functionalPage.append(messageDisplay)
          currentChatMessages.forEach( (el) => addNewMessage(el, messageDisplay, userId) )
        })
      }
    })

})
