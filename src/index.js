
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

document.addEventListener("DOMContentLoaded", () => {

  const messageUl = document.getElementById("message-ul")
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const loginContainer = document.getElementById("login-container")
  const main = document.getElementById("test")
  const textInput = document.getElementById("text-container")
  const textBox = document.getElementById("text-box")
  let userId;
  let userName;
  let userLanguage;
  let currentUser;

  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    //userName = e.target.user.value
    loginContainer.style.display = "none"
    main.hidden = false
    textInput.style.display = "block"
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
      main.hidden = false;
      textInput.style.display = "block"
      console.log(userName)
      currentUser = data
      userName = currentUser.name
      userId = currentUser.id
      userLanguage = currentUser.language
      debugger
    })
  })

  putMessages(messageUl)

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


})
