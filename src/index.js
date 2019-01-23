
function putMessages(ul) {
  fetch("http://localhost:3000/api/v1/messages")
    .then(res => res.json())
    .then(data => {
      data.forEach(e => {
        let messageLi = document.createElement("li")
        messageLi.innerText = `${e.text}   -${e.user.name}`
        ul.append(messageLi)
      })
    })
  }


function showChats(div) {
  fetch("http://localhost:3000/api/v1/chat_rooms")
    .then(res => res.json())
    .then(data => {
      data.forEach(e => {
        let chatsButton = document.createElement("button")
        let br = document.createElement("br")
        chatsButton.innerText = e.subject
        chatsButton.dataset.id = e.id
        chatsButton.className = "chat-button"
        div.append(chatsButton)
        div.append(br)
      })
    })
}

document.addEventListener("DOMContentLoaded", () => {

  const messageUl = document.getElementById("message-ul")
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const loginContainer = document.getElementById("login-container")
  const main = document.getElementById("test")
  const textInput = document.getElementById("text-container")
  const textBox = document.getElementById("text-box")
  const functionalPage = document.getElementById("functional-page")
  const chatsDiv = document.getElementById("chats-div")
  let currentUser;
  let userId;
  let userName;
  let userLanguage;
  let currentChat;
  let currentChatMessages;


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
      functionalPage.style.display = "block";
      console.log(userName)
      currentUser = data
      userName = currentUser.name
      userId = currentUser.id
      userLanguage = currentUser.language
    })
  })

  // putMessages(messageUl)

  textBox.addEventListener("submit", e => {
    e.preventDefault()
    let text = e.target.content.value
    fetch("http://localhost:3000/api/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
       },
      body: JSON.stringify({
        text, user_id: userId, chat_room_id: 6
      })
    }).then(res => res.json())
      .then(data => {
        console.log(data)
      })
  })

  showChats(chatsDiv)


//this is a fucked up method... click on the button to see what it does
//i will explain tomorrow
  chatsDiv.addEventListener("click", e => {
    if (e.target.className === "chat-button") {
      let messageDisplay = document.getElementById("message-display")
      while (messageDisplay.firstChild) {
        messageDisplay.removeChild(messageDisplay.firstChild)
      }
      let chatButtonId = parseInt(e.target.dataset.id)
      fetch("http://localhost:3000/api/v1/chat_rooms")
        .then(res => res.json())
        .then(data => {
          currentChat = data.filter( el => el.id === chatButtonId);
          currentChat = currentChat[0]
          currentChatMessages = currentChat.messages
          currentChatMessages.forEach(e => {
            let thisChatDiv = document.createElement("div")
            let thisChatUl = document.createElement("ul")
            let thisChatLi = document.createElement("li")
            thisChatLi.innerText = e.text
            thisChatUl.append(thisChatLi)
            thisChatDiv.append(thisChatUl)
            messageDisplay.append(thisChatDiv)
          })
        })
      }
    })
})
