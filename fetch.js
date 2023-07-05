const api_key = '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';
const url = "https://api.openai.com/v1/chat/completions"

generate_request = (url, prompt) => {

        let request = new Request(url);

        const request_headers = new Headers({"Content-Type" : "application/json", "Authorization" : `Bearer ${api_key}`});
        console.log(prompt)
        let request_body =  {
            "model" : "gpt-3.5-turbo",
            "messages" : prompt,
            "temperature" : 0.5,
            "max_tokens" : 100

        }

        let request_params = {
            method : "POST",
            headers : request_headers,
            body : JSON.stringify(request_body)
        }
        return [request, request_params]
}

const get_data = async (request) => {
    try
    {
        let response = await fetch(request[0], request[1]);
        let data = await response.json();
        let chat_response = data.choices[0].message.content
        let user_message = request[1].body
        user_message = JSON.parse(user_message)
        user_message = user_message.messages
        user_message = user_message[user_message.length - 1].content
        try {
            messages = JSON.parse(sessionStorage.getItem("messages"))
            messages.push({role: "user", content : user_message}, {role: "assistant", content : chat_response})
            sessionStorage.setItem("messages", JSON.stringify(messages))
            return chat_response;
        }
        catch (error) {
            let messages = [{role: "user", content : user_message}, {role: "assistant", content : chat_response}]
            sessionStorage.setItem("messages", JSON.stringify(messages))
            return chat_response;
        }
    }
    catch (error)
    {
        throw new Error(error);
    }
}

// get_data(request)

const user_input = document.querySelector("#form")

user_input.addEventListener("submit",async (e) =>  {
    e.preventDefault();
    let input = document.querySelector("#input");
    let prompt = input.value
    input.value = "";
    const user_text = document.querySelector('#dummy')

    let text_user = user_text.cloneNode(true)
    // text_user.innerHTML = prompt
    text_user.id = ""
    text_user.className = "user-text"
    children = text_user.childNodes
    children = children[1].childNodes
    children = children[2]

    text_user.childNodes[1].childNodes[2].data = prompt
    user_text.parentNode.appendChild(text_user);
    let data;
    try
    {
        messages = JSON.parse(sessionStorage.getItem("messages"))
        messages.push({role: "user", content : prompt})
        let request = await generate_request(url, messages);
        data = await get_data(request);
    }
    catch (error)
    {
        messages = [{role: "user", content : prompt}]
        let request = await generate_request(url, messages);
        data = await get_data(request);
    }
    const chat_text = document.querySelector('#dummy2')

    let text_chat = chat_text.cloneNode(true)
    text_chat.id = ""
    text_chat.className = "chat-text"
    text_chat.childNodes[1].childNodes[2].data = data
    chat_text.parentNode.appendChild(text_chat);

  });




  const menuToggle = document.querySelector('#menu-toggle');
  const menuToggle2 = document.querySelector('#menu-toggle2');
  const nav = document.querySelector('#nav-container');
  const page = document.querySelector('#page-container');

  menuToggle.addEventListener("click", () => {
      nav.classList.toggle('no-display');
      menuToggle2.classList.toggle('no-display');
      page.style.gridTemplateColumns = 'auto';
  })

  menuToggle2.addEventListener("click", () => {
      nav.classList.toggle('no-display');
      menuToggle2.classList.toggle('no-display');
      page.style.gridTemplateColumns = '1.02fr 5fr';
  })