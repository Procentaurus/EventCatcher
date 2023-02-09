takeBegginingData();
addListenersForDsiplayingMainModal();
addListenersForFunctionalButtons();

var eventData;
var mainModal = new bootstrap.Modal(document.getElementById('mainModal'));
var supportingModal = new bootstrap.Modal(document.getElementById('supportingModal'));
var userID;

function takeBegginingData(){
    var url = mainUrl + `api/events/${event_id}/`;
    try{
        var username = document.getElementById("navusername").innerText.slice(1);
    }
    catch(err){
        username = '';
    }

    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        eventData = data;

        // wyswietlanie tylko 1 z buttonów
        displayProperInvitingOption(eventData);

        // wyswietlanie participantsów po lewej stronie
        displayParticipants(eventData);

        //sprawdzenie czy user jest participantem i ewentualne schowanie buttona do invite'u
        checkIfParticipant(eventData);

        // wyswietlanie danych eventu po srodku
        displayEventInfo(eventData);

        //wyswietlanie participantsów w modalu służącym do robienia kicków          UWAGA - usuwa organisera z data.participants
        prepareDeletingModal(eventData, username);

        //przygotowanie form'u do zmiany danych event'u
        fillFormWithEventData();

        //dodanie listnere'ów w supporting modalu (invite and kick)
        addListenersForSupportingModal(eventData);
    })
}
function addListenersForFunctionalButtons(){
    var url = mainUrl + `api/events/${event_id}/`;
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    try{
        //zmiana danych event'u
        addListenerForChangingEventData(csrftoken, url);

        //dodanie listnereów wpisujących nazwy użytkowników do pola participant
        element = document.getElementById('friends');
        addListenersToAllChildren(element);

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

function addListenersForDsiplayingMainModal(){
    const modalElements = [
        "invite-body",
        "invite-title",
        "delete-body",
        "delete-title",
        "kick-body",
        "kick-title",
        "picture-body",
        "picture-title",
        "specifics-title",
        "specifics-body"
    ];
    const exteriorButtonsNames = [
        "invite_for_event_exterior",
        "delete_event_exterior",
        "kick_participant_exterior",
        "event_picture_exterior",
        "event_specifics_exterior"
    ]; 
    try{
        element = document.getElementById('close');
        element.addEventListener("click", function() {
            for(element of modalElements){
                hideObject(element);
            }
            mainModal.hide();
            userID = 0;
            document.getElementById('participant').value = "";
            document.getElementById('listOfUsers').innerHTML = "";
            document.getElementById("messages").innerText = "";
        });

        for(let i = 0; i < 5; i++){
            element = document.getElementById(exteriorButtonsNames[i]);
            element.addEventListener("click", function() {
                displayObject(modalElements[2*i]);
                displayObject(modalElements[2*i + 1]);
                mainModal.show();
            });
        }
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

        // dodanie listenera otwierającego przygotowany do invite'a supporting modal
        element = document.getElementById('checkTheUser');
        element.addEventListener('click', function(e){
            e.preventDefault();

            var user_name = document.getElementById('participant').value;
            var url =  mainUrl + `eventsite/${event_id}/?user_name=${user_name}`;

            if(user_name == ""){
                destination.innerHTML = "";
                return;
            }

            fetch(url, {
                method: "GET",
            })
            .then(response => response.json())
            .then(function(data){
                if(data.message == null){

                    userID = data.id;
                    user_data.innerHTML = `
                        <img class="avatar" src="${data.image}">
                        <span class="text-nowrap fs-5 me-4 ms-2 fw-bold text-dark">@${data.username}</span>
                    `
                    mainModal.hide();
                    displayObject("final-invite-title");
                    displayObject("final-invite-positive");
                    displayObject("final-invite-negative");
                    supportingModal.show();
                    document.getElementById("messages").innerText = "";
                }
                else{
                    document.getElementById("messages").innerText = data.message;
                }
            });
        })

        //dodanie listnera do buttona zamykającego final-kick
        addListenerForNotMakingFinalAction('kick');

        //dodanie listnera do buttona zamykającego final-invite
        addListenerForNotMakingFinalAction('invite');
        
        //dodanie listnera do buttona dokonującego kick'a
        addListenerForKickingParticipant(csrftoken, userID);

        //dodanie listnera do buttona wysylającego invitation
        element = document.getElementById('final-invite-positive');
        element.addEventListener("click", function() {
            
            const data = {'participant': userID};
            const url = mainUrl + `eventsite/${event_id}/`;

            fetch(url, {
                method: 'POST',
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
                .catch((error) => {
                    console.error('Error:', error);
            });
            supportingModal.hide();
        });
    }
    catch{
    
    }
}

///////////////////////                            Funkcje wykorzystywane w addListenersForSupportingModal()                           /////////////////////////////////
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
function addListenerForNotMakingFinalAction(option){
    element = document.getElementById(`final-${option}-negative`);
    element.addEventListener("click", function() {
        hideObject(`final-${option}-title`);
        hideObject(`final-${option}-positive`);
        hideObject(`final-${option}-negative`);

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
///////////////////////////////////////                     Funkcje wykorzystywane w takeBegginningData()                            ///////////////////////////////////
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

function checkIfParticipant(data){
    flag = false;  
    const myID = JSON.parse(document.getElementById('mydata').textContent);

    if(data.can_participants_invite == false){
        if(data.organiser.id != myID){
            hideObject('invite_for_event_exterior');
            return;
        }
    }

    for(participant of data.participants){
        if(myID == participant.id){
            flag = true;
            break;
        }
    }
    if(!flag) hideObject('invite_for_event_exterior');
}

////////////////////////////////                         Funkcje uzywane w addListenersForFunctionalButtons()                        ///////////////////////////////////
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

//////////////////////////////                                Funkcje do obsługi invite'owania nowych user'ów                         //////////////////////////////////

function lookForUsers(){
    var user_name = document.getElementById('participant').value;
    const me = JSON.parse(document.getElementById('mydata').textContent);
    var url =  mainUrl + `lookforfriends/${me}/?user_name=${user_name}`;
    var destination = document.getElementById('listOfUsers');

    if(user_name == ""){
        destination.innerHTML = "";
        return;
    }

    fetch(url, {
        method: "GET",
    })
    .then(response => response.json())
    .then(function(data){
        datalist = JSON.parse(data)
        destination.innerHTML =  ``;
        for(let i=0;i < datalist.length; i++){
            var item = ` 
            <button type="button" class="btn btn-dark rounded" id="${datalist[i].fields.username}" name="${datalist[i].fields.id}">
                <img class="avatar" src="/images/${datalist[i].fields.image}">
                <span class="text-nowrap fs-4 me-4 ms-2 fw-bold text-light">@${datalist[i].fields.username}</span>
            </button>
            `
            destination.innerHTML += item;
        }
        addListenersToAllChildren(destination);
    });
}

function addListenersToAllChildren(destination){
    for (const child of destination.children) {
        child.addEventListener('click', function(e){
            document.getElementById('participant').value = child.id;
        });
    }
}