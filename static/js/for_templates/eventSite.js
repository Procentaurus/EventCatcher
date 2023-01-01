takeBegginingData();
addListenersForShowingModal();
addListeners();

var eventData;

function fetchSingleData(url, username){
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        eventData = data;

        if(eventData.can_participants_invite){
            try {
                document.getElementById('enable_inviting').style.display = "none";
            }catch{}
        }
        else{
            try {
                document.getElementById('disable_inviting').style.display = "none";
            }catch{}
        }

        var destination = document.getElementById('participants');
        var counter = 0;
        for(participant of eventData.participants){
            let x = `
                <div class="text-center bg-light rounded my-1 me-0">
                    <a class="nav-link p-1" href="${mainUrl}userprofile/${participant.id}">
                        <img class="avatar" src="${participant.image}">
                        <span class="text-nowrap fs-5 me-4 ms-2 fw-bold text-dark">@${participant.username}</span>
                    </a>
                </div>
            `
            destination.innerHTML += x;
            counter++;
        }
        destination = document.getElementById('main');
        destination.innerHTML += `
            <h1 class="display-1 fw-bold text-center">${eventData.name}</h1>
            <div class="d-flex mt-3">
                <img src="${eventData.image}" class="banner_max" />
            </div>
        `
        destination = document.getElementById('users_to_kick');
        for(let x = 0; x < eventData.participants.length; x+=3){
            let div = `<div class="d-flex justify-content-center mb-2">`;
            for(let k=0;k<3;k++){
                let participant = eventData.participants[x+k];
                div += `
                    <button id="${participant.id}" class="btn btn-light mx-1 p-1" href="${mainUrl}userprofile/${participant.id}">
                        <img class="avatar" src="${participant.image}">
                        <span class="text-nowrap fs-4 me-4 ms-2 fw-bold text-dark">@${participant.username}</span>
                    </button>
                `
            }
            div += `</div>`;
            destination.innerHTML += div;
        }
    })
}

function takeBegginingData(){
    var url = mainUrl + `api/events/${event_id}/`;
    try{
        var username = document.getElementById("navusername").innerText.slice(1);
    }
    catch(err){
        username = '';
    }

    fetchSingleData(url, username);
}

function addListeners(){
    var url = mainUrl + `api/events/${event_id}/`;
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    try{
        element = document.getElementById('enable_inviting');
        element.addEventListener("click", function() {

            var data = eventData;
            data.can_participants_invite = true;
            delete data.image
        
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                redirect: 'follow',
                body: JSON.stringify(data),
                })
                .then((response) => {
                    response.json()
                })
                .then((data) => {
                    window.location.href = mainUrl + `eventsite/${event_id}/`;
                })
                .catch((error) => {
                    console.error('Error:', error);
            });
        });
        element = document.getElementById('disable_inviting');
        element.addEventListener("click", function() {

            var data = eventData;
            data.can_participants_invite = false;
            delete data.image
        
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                redirect: 'follow',
                body: JSON.stringify(data),
                })
                .then((response) => {
                    response.json()
                })
                .then((data) => {
                    window.location.href = mainUrl + `eventsite/${event_id}/`;
                })
                .catch((error) => {
                    console.error('Error:', error);
            });
        });
        element = document.getElementById('invite_for_event_exterior');
        element.addEventListener("click", function() {
            document.getElementById("main").innerHTML = "invite_for_event_exterior";
        });
        element = document.getElementById('kick_participant_exterior');
        element.addEventListener("click", function() {
            document.getElementById("main").innerHTML = "kick_participant_exterior";
        });

        element = document.getElementById('delete_event_interior');
        element.addEventListener("click", function() {

            var data = eventData;
            data.can_participants_invite = true;
            delete data.image
        
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                redirect: 'follow',
                body: JSON.stringify(data),
                })
                .then((response) => {
                    response.json()
                })
                .then((data) => {
                    window.location.href = mainUrl + `eventshowdown/`;
                })
                .catch((error) => {
                    console.error('Error:', error);
            });
        });
    }catch{}
}

function addListenersForShowingModal(){
    try{
        var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
        const objects = [
              "delete-body",
              "delete-title",
              "kick-body",
              "kick-title",
              "invite-body",
              "invite-title",
              "picture-body",
              "picture-title",
            ]; 

        element = document.getElementById('delete_event_exterior');
        element.addEventListener("click", function() {
            displayObject(objects[0]);
            displayObject(objects[1]);
            myModal.show();
        });

        element = document.getElementById('kick_participant_exterior');
        element.addEventListener("click", function() {
            displayObject(objects[2]);
            displayObject(objects[3]);
            myModal.show();
        });

        element = document.getElementById('invite_for_event_exterior');
        element.addEventListener("click", function() {
            displayObject(objects[4]);
            displayObject(objects[5]);
            myModal.show();
        });

        element = document.getElementById('event_picture_exterior');
        element.addEventListener("click", function() {
            displayObject(objects[6]);
            displayObject(objects[7]);
            myModal.show();
        });

        element = document.getElementById('close');
        element.addEventListener("click", function() {
            for(obj of objects){
                hideObject(obj);
            }
            myModal.hide();
        });
    }
    catch{

    }
}