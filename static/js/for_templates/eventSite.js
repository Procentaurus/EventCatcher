takeBegginingData();
addListeners();

var eventData;

function fetchSingleData(url, username){
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        eventData = data;

        var destination = document.getElementById('participants');

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

        for(participant of eventData.participants){
            let x = `
                <div class="text-center bg-light rounded my-1 me-0">
                    <a class="nav-link p-1" href="${mainUrl}userprofile/${participant.id}">
                        <img class="avatar" src="${participant.image}">
                        <span class="text-nowrap fs-4 me-4 ms-2 fw-bold text-dark">@${participant.username}</span>
                    </a>
                </div>
            `
            destination.innerHTML += x;
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
        var element = document.getElementById('event_picture');
        element.addEventListener("click", function() {
            document.getElementById("main").innerHTML = "event_picture";
        });
        element = document.getElementById('event_specifics');
        element.addEventListener("click", function() {
            document.getElementById("main").innerHTML = "event_specifics";
        });
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
        element = document.getElementById('invite_for_event');
        element.addEventListener("click", function() {
            document.getElementById("main").innerHTML = "invite_for_event";
        });
        element = document.getElementById('kick_participant');
        element.addEventListener("click", function() {
            document.getElementById("main").innerHTML = "kick_participant";
        });
        element = document.getElementById('delete_event');
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