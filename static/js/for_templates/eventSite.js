takeBegginingData();
addListenersForExteriorButtons();
addListeners();

var eventData;
var mainModal = new bootstrap.Modal(document.getElementById('mainModal'));
var supportingModal = new bootstrap.Modal(document.getElementById('supportingModal'));
var userID;

function fetchSingleData(url, username){
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        eventData = data;

        // wyswietlanie tylko 1 z buttonów
        displayProperInvitingOption(eventData);

        // wyswietlanie participantsów po lewej stronie
        displayParticipants(eventData);

        // wyswietlanie danych eventu po srodku
        displayEventInfo(eventData);

        //wyswietlanie participantsów w modalu służącym do robienia kicków
        prepareDeletingModal(eventData, username);

        //przygotowanie form'u do zmiany danych event'u
        fillFormWithEventData()

        //dodanie listnere'ów w supporting modalu (invite and kick)
        addListenersForSupportingModal(eventData);
    })
}

function addListeners(){
    var url = mainUrl + `api/events/${event_id}/`;
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    try{
        //zmiana danych event'u
        addListenerForChangingEventData(csrftoken, url);

        //zmiana ustawienia opcji zapraszania innych user'ów przez participantów
        addListenersToInviteOptionsButtons(true, csrftoken, url);
        addListenersToInviteOptionsButtons(false, csrftoken, url);

        //dodawanie listnera do buttonu delete_event_interior
        element = document.getElementById('delete_event_interior');
        element.addEventListener("click", function(e) {

            e.preventDefault();

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

        //dodawanie listnera do buttonu banner-picture-submit
        element = document.getElementById('banner-picture-submit');
        element.addEventListener("click", function(e) {

            e.preventDefault();

            const imageInput = document.getElementById('banner-picture-input');

            let image = imageInput.files[0];
            let formData = new FormData();

            formData.append('image', image);
            formData.append('id', eventData.id);
            formData.append('name', eventData.name);

            fetch(url, {
                method: 'PUT',
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                body: formData,
                redirect: 'follow',
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
        })  
    }
    catch{}
}

function addListenersForExteriorButtons(){
    const modalElements = [
          "delete-body",
          "delete-title",
          "kick-body",
          "kick-title",
          "invite-body",
          "invite-title",
          "picture-body",
          "picture-title",
          "specifics-title",
          "specifics-body"
    ];
    const exteriorButtonsNames = [
          "delete_event_exterior",
          "kick_participant_exterior",
          "invite_for_event_exterior",
          "event_picture_exterior",
          "event_specifics_exterior"
    ]; 
    try{
        for(let i = 0; i < 5; i++){
            element = document.getElementById(exteriorButtonsNames[i]);
            element.addEventListener("click", function() {
                displayObject(modalElements[2*i]);
                displayObject(modalElements[2*i + 1]);
                mainModal.show();
            });
        }
        element = document.getElementById('close');
        element.addEventListener("click", function() {
            for(element of modalElements){
                hideObject(element);
            }
            mainModal.hide();
        });
    }
    catch{

    }
}

function addListenersForSupportingModal(data){
    try{
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        user_data = document.getElementById("user-data");

        // dodanie listenerów do wszystkich buttonow otwierających final-kick
        addListenersForKickingButtons(data.participants);

        //dodanie listnera do buttona zamykającego final-kick
        addListenerForNotKickingParticipant();
        
        //dodanie listnera do buttona dokonującego kick'a
        addListenerForKickingParticipant(csrftoken, userID)

        element = document.getElementById('final-invite-negative');
        element.addEventListener("click", function() {
            supportingModal.hide();
            mainModal.hide();
        });

        element = document.getElementById('final-invite-positive');
        element.addEventListener("click", function() {
            supportingModal.hide();
            mainModal.hide();
        });
    }
    catch{
    
    }
}
function sendRequestPUT(request_data, csrftoken, url){
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        redirect: 'follow',
        body: request_data,
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
}
function addListenerForKickingParticipant(csrftoken){
    element = document.getElementById('final-kick-positive');
    element.addEventListener("click", function() {
        var url = mainUrl + `api/events/${event_id}/`;
        var request_data = {
            "id": eventData.id,
            "name": eventData.name,
            "to_kick": userID
        };
        request_data = JSON.stringify(request_data);
        sendRequestPUT(request_data, csrftoken, url);
    });
}
function addListenerForNotKickingParticipant(){
    element = document.getElementById('final-kick-negative');
    element.addEventListener("click", function() {
        hideObject("final-kick-title");
        hideObject("final-kick-positive");
        hideObject("final-kick-negative");

        userID = 0;

        supportingModal.hide();
        mainModal.show();
    });
} 
function addListenersForKickingButtons(participants){
    for(let i=0; i<participants.length; i++){
        object = document.getElementById(`kick_${participants[i].id}`);
        object.addEventListener("click", function(){
            mainModal.hide();
            userID = participants[i].id;
            user_data.innerHTML = `
                <img class="avatar" src="${participants[i].image}">
                <span class="text-nowrap fs-5 me-4 ms-2 fw-bold text-dark">@${participants[i].username}</span>
            `
            displayObject("final-kick-title");
            displayObject("final-kick-positive");
            displayObject("final-kick-negative");
            supportingModal.show();
        })
    }
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
function displayProperInvitingOption(data){
    if(data.can_participants_invite){
        try {
            document.getElementById('enable_inviting').style.display = "none";
        }catch{}
    }
    else{
        try {
            document.getElementById('disable_inviting').style.display = "none";
        }catch{}
    }
}
function displayParticipants(data){
    var destination = document.getElementById('participants');

    data.participants.sort((a, b) => {
        let fa = a.username.toLowerCase(), fb = b.username.toLowerCase();
    
        if (fa < fb) return -1;
        if (fa > fb) return 1;
        return 0;
    });
    
    for(participant of data.participants){
        let x = `
            <div class="text-center bg-light rounded my-1 me-0">
                <a class="nav-link p-1" href="${mainUrl}userprofile/${participant.id}">
                    <img class="avatar" src="${participant.image}">
                    <span class="text-nowrap fs-5 me-4 ms-2 fw-bold text-dark">@${participant.username}</span>
                </a>
            </div>
        `
        destination.innerHTML += x;
    }
}
function displayEventInfo(data){
    destination = document.getElementById('main');
    destination.innerHTML += `
        <h1 class="display-1 fw-bold text-center">${data.name}</h1>
        <div class="d-flex mt-3">
            <img src="${data.image}" class="banner_max" />
        </div>
    `
}
function prepareDeletingModal(data, username){
    destination = document.getElementById('users_to_kick');

    for( var i = 0; i < data.participants.length; i++){ 
        if ( data.participants[i].username == username) data.participants.splice(i, 1); 
    }

    for(let x = 0; x < data.participants.length; x+=3){
        let div = `<div class="d-flex justify-content-center mb-2">`;
        for(let k=0;k<3;k++){
            let participant = data.participants[x+k];
            if(participant != null){
                div += `
                    <button id="kick_${participant.id}" class="btn btn-light mx-1 p-1" href="${mainUrl}userprofile/${participant.id}">
                        <img class="avatar" src="${participant.image}">
                        <span class="text-nowrap fs-4 me-4 ms-2 fw-bold text-dark">@${participant.username}</span>
                    </button>
                `
            }
        }
        div += `</div>`;
        destination.innerHTML += div;
    }
}
function fillFormWithEventData(){
    document.getElementById('id_name').value = eventData.name;
    document.getElementById('id_start_date_time').valueAsDate = new Date(eventData.start_date_time);
    document.getElementById('id_end_date_time').valueAsDate = new Date(eventData.end_date_time);
    document.getElementById('id_location').value = eventData.location;
    document.getElementById('id_category').value = eventData.category;
    document.getElementById('id_is_open').checked = eventData.is_open;
    document.getElementById('id_is_free').checked = eventData.is_free;
    document.getElementById('id_description').value = eventData.description;
}

function addListenerForChangingEventData(csrftoken, url){
    element = document.getElementById('event-specifics-interior');
    element.addEventListener('click', function(e){
        e.preventDefault();

        var data = collectForEvent();
        data.id = eventData.id;
        data = JSON.stringify(data);
        
        var myFlag = showErrorForEvent("badDate");
        if(myFlag){
            sendRequestPUT(data, csrftoken, url);
        }

    });
}
function addListenersToInviteOptionsButtons(flag, csrftoken, url){
    if(flag) element = document.getElementById('enable_inviting');
    else element = document.getElementById('disable_inviting');

    element.addEventListener("click", function(e) {

        e.preventDefault();

        var data = eventData;
        data.can_participants_invite = flag;
        delete data.image;
        data = JSON.stringify(data);
    
        sendRequestPUT(data, csrftoken, url);
    });
}