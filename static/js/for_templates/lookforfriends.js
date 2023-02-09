
const buttonPressed = e => {
    var destination = document.getElementById('users');
    destination.value = e.target.id;

    var destination2 = document.getElementById('list1');
    destination2.innerHTML = "";
}

function addListener(guzik){
    guzik.addEventListener("click", buttonPressed);
}

function basicListeners(){
    const buttons = document.getElementsByTagName("button");
    for (let button of buttons) {
        if(button.id != "buttonMain"){
            addListener(button);
        }
    }
}

function searchUsers(){
    var user_name = document.getElementById('users').value;
    var destination = document.getElementById('list1');
    
    if(user_name == ""){
        destination.innerHTML = "";
        return;
    }

    const me = JSON.parse(document.getElementById('mydata').textContent);
    var url =  mainUrl + `lookforfriends/${me}/?user_name=${user_name}`;

    fetch(url, {
        method: "GET",
      })
      .then(response => response.json())
      .then(function(data){
          datalist = JSON.parse(data);
          destination.innerHTML =  ``;
          for(let i=0;i < datalist.length; i++){
              var item = ` 
              <button type="button" class="btn btn-light rounded" id="${datalist[i].fields.username}">
                <img class="avatar" src="/images/${datalist[i].fields.image}">
                <span id="${datalist[i].fields.username}" class="text-nowrap fs-4 me-4 ms-2 fw-bold text-dark">@${datalist[i].fields.username}</span>
              </button>
              `
              destination.innerHTML += item;
          }
          for (const child of destination.children) {
            addListener(child);
          }
      });
}

basicListeners();