(function(){
    //console.log("DOM is fully loaded");

    const app = document.querySelector(".app");
    const socket = io();

    
    let uname;

    app.querySelector(".screen.join-screen #join-user").addEventListener("click",function(){
        let username = app.querySelector(".screen.join-screen #username").value;
        if(username.length == 0)
        {
            return;
        }
        socket.emit("newuser",username);
        uname = username;
        app.querySelector(".screen.join-screen").classList.remove("active");
        app.querySelector(".screen.chat-screen").classList.add("active");
});

app.querySelector(".screen.chat-screen #send-message").addEventListener("click", function()
{
    let messageInput = document.getElementById("message-input");
    let message = messageInput.value;
   if(message.length == 0)
    {
        return;
    } 

    renderMessage("my",{
        username: uname,
        text: message

    });

    socket.emit("chat", {
        username: uname,
        text: message
    });

    app.querySelector(".screen.chat-screen #message-input").value="";
});

app.querySelector(".screen.chat-screen #exit-chat").addEventListener("click", function()
{
    socket.emit("exituser", uname );
    window.location.href = window.location.href;
});

socket.on("update", function(update){
    renderMessage("update",update);
});

socket.on("chat", function(message){
    renderMessage("other", message);
});


function renderMessage(type, message){
    let messageContainer = app.querySelector(".screen.chat-screen .messages");
    if(type === "my"){
        let el =document.createElement("div");
        el.setAttribute("class", "message my-message");
        el.innerHTML = `
            <div>
                <div class="name">You</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
    }else if(type === "other"){
        let el =document.createElement("div");
        el.setAttribute("class", "message other-message");
        el.innerHTML = `
            <div>
                <div class="name">${message.username}</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);

    }else if(type === "update"){
        let el =document.createElement("div");
        el.setAttribute("class", "update");
        el.innerText = message;
            messageContainer.appendChild(el);

    }
    //Scroll chat to end
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
}

})();