

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
  

  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    let userName = e.target.user.value

  })


  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    let name = e.target.user.value
    let language = e.target.lang.value
    fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name, language
      })
    })
  })

  putMessages(messageUl)





})
