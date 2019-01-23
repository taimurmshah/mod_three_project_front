

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

  putMessages(messageUl)



})
