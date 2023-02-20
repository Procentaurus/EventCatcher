var mainModal = new bootstrap.Modal(document.getElementById('mainModal'));
var supportingModal = new bootstrap.Modal(document.getElementById('supportingModal'));
var messageModal = new bootstrap.Modal(document.getElementById('editMessageModal'));
var userID;
var username, eventData;

takeBegginingData();
addListenersForDsiplayingMainModal();
addListenersForFunctionalButtons();

function takeBegginingData(){
    var url = mainUrl + `api/events/${event_id}/`;
    try{
        username = document.getElementById("navusername").innerText.slice(1);
    }
    catch(err){
        username = '';
    }

    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        eventData = data;
        buildTheViewOfSite(eventData);
    })
}
function buildTheViewOfSite(){

    // wyswietlanie tylko 1 z buttonów obslugujących opcje invitowania
    displayProperInvitingOption();

    // wyswietlanie participantsów po lewej stronie
    displayParticipants();

    //pobieranie danych podobnych eventow
    getSimilarEvents();

    //sprawdzenie czy user jest participantem i ewentualne schowanie buttona do invite'u
    displayInviteButton();

    // wyswietlanie danych eventu po srodku
    displayEventInfo();

    //wyswietla scrollable box z wiadomościami participantow
    prepareAnnouncementsBoard(true);

    //wyswietlanie participantsów w modalu służącym do robienia kicków          UWAGA - usuwa organisera z data.participants
    prepareDeletingModal();

    //przygotowanie form'u do zmiany danych event'u
    fillFormWithEventData();

    //dodanie listnere'ów w supporting modalu (invite and kick)
    addListenersForSupportingModal();
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
            document.getElementById("results").innerText = "";
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

function addListenersForSupportingModal(){
    try{
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        user_data = document.getElementById("user-data");

        // dodanie listenerów do wszystkich buttonow otwierających final-kick
        addListenersForKickingButtons(eventData.participants);

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
                    document.getElementById("results").innerText = "";
                }
                else{
                    document.getElementById("results").innerText = data.message;
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

function sendRequestPUT(request_data, csrftoken, url, makeRedirect = true){
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
            if(makeRedirect) window.location.href = mainUrl + `eventsite/${event_id}/`;
            else prepareAnnouncementsBoard(false);
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
///////////////////////////////////////                     Funkcje wykorzystywane w buildTheViewOfSite()                            ///////////////////////////////////

function displayProperInvitingOption(){
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
}
function displayParticipants(){
    var destination = document.getElementById('participants');

    eventData.participants.sort((a, b) => {
        let fa = a.username.toLowerCase(), fb = b.username.toLowerCase();
    
        if (fa < fb) return -1;
        if (fa > fb) return 1;
        return 0;
    });
    
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
    }
}
function displayEventInfo(){
    destination = document.getElementById('main');
    destination.innerHTML += `
        <h1 class="display-1 fw-bold text-center">${eventData.name}</h1>
        <div class="d-flex mt-3">
            <img src="${eventData.image}" class="banner_max" />
        </div>
        <h3 class="text-center my-4">On the ${convertDate(eventData.start_date_time)}  to  ${convertDate(eventData.end_date_time)}</h3>
        <p class="text-center mt-2">${eventData.description}</p>
    `
}
function prepareDeletingModal(){
    destination = document.getElementById('users_to_kick');

    for( var i = 0; i < eventData.participants.length; i++){ 
        if ( eventData.participants[i].username == username) eventData.participants.splice(i, 1); 
    }

    for(let x = 0; x < eventData.participants.length; x+=3){
        let div = `<div class="d-flex justify-content-center mb-2">`;
        for(let k=0;k<3;k++){
            let participant = eventData.participants[x+k];
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

function displayInviteButton(){
    const myID = JSON.parse(document.getElementById('mydata').textContent);

    if(eventData.can_participants_invite == false){
        if(eventData.organiser.id != myID){
            hideObject('invite_for_event_exterior');
            return;
        }
    }

    if(!checkIfParticipant(eventData.participants)) hideObject('invite_for_event_exterior');
}
function getSimilarEvents(){
    const myID = JSON.parse(document.getElementById('mydata').textContent);
    var url = `http://127.0.0.1:8000/api/events?`;
    url += `counter=10&category=${eventData.category}&organiserneg=${myID}&idneg=${eventData.id}`;
    fetch(url)
    .then((resp) => resp.json())
    .then(function(datalist){

        destination = document.getElementById('suggested');
        if(datalist.length == 0) return;
        else{
            destination.innerHTML += `
                <div class="d-grid gap-2 card card-body bg-dark" id="suggested2">
                <h4 class="text-light fw-bold">You can also like :</h4>
            `

            destination = document.getElementById('suggested2');
            for(let x of datalist){
                if(x.id != data.id && x.organiser.id != myID){
                    var item = `
                    <div class="rounded bg-light p-2">
                        Organised by <a href="${mainUrl}userprofile/${x.organiser.id}" class="text-decoration-none text-dark fw-bold">@${x.organiser.username}</a>
                        <a href="${mainUrl}eventsite/${x.id}" class="text-decoration-none">
                            <div class="text-center my-1">
                                <span class="fw-bold text-nowrap text-dark">${x.name}</span><br>
                                <img src="${x.image}" class="rounded" style="max-width: 8em; max-height:6em;">
                            </div>
                        </a>
                        on ${convertDate(x.start_date_time)}
                    </div>
                    `
                    destination.innerHTML += item;
                }
            }
            destination.innerHTML += `</div>`;
        }
    })
}

function prepareAnnouncementsBoard(flag){
    var baseUrl = mainUrl + `api/messages`;
    var url = baseUrl + `?event=${eventData.id}`;
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const myID = JSON.parse(document.getElementById('mydata').textContent);

    fetch(url)
    .then((resp) => resp.json())
    .then(function(datalist){
        if(flag){
            buildTheBaseOfAnnouncementsBoard(myID, datalist);
            addListenerForSendingMessages(csrftoken, baseUrl+'/');
        }
        buildTheViewOfMessages(datalist, myID);
        addEventListenersForMessagesButtons(datalist, csrftoken, baseUrl);
    })
}
function buildTheBaseOfAnnouncementsBoard(myID, datalist){
    destination = document.getElementById('main');
    destination.innerHTML += `
        <h2 class="fw-bold ms-2 mb-3 mt-5"> Announcements and Questions :</h2>
        <div id="messages" class="overflow-auto p-4 rounded shadow bg-dark" style="max-height: 35em;">
            <div class="input-group mb-2 p-2">
                <input type="text" class="form-control text-light bg-dark" id="message-send-input" placeholder="Write your message">
                ${setPriorityButton(myID)}
                <button class="btn btn-outline-light" type="button" id="sendMessage">Send message</button>
            </div>
            <div id="messages-body"></div>
        </div>
    `
}
function buildTheViewOfMessages(datalist, myID){
    if(datalist.length > 0){
        destination = document.getElementById('messages-body');
        destination.innerHTML = "";
        for(var message of datalist){
            createViewOfMessage(message, destination, myID)
        }
    }
}
function addEventListenersForMessagesButtons(datalist, csrftoken, baseUrl){
    for(var message of datalist){
        url = baseUrl + `/${message.id}/`;

        prepareEditOfMessage(message, csrftoken, url);
        prepareDeleteOfMessage(message, csrftoken, url);
        addListenerForMarkingMessages(message, csrftoken, url);
    }
}
function addListenerForMarkingMessages(message, csrftoken, url){
    var button1 = null, button2 = null, target, flag;
    try{
        button1 = document.getElementById(`message-mark-${message.id}`);
    }catch{}
    try{
        button2 = document.getElementById(`message-unmark-${message.id}`);
    }catch{}
    if(button1 != null){
        target = button1;
        flag = true;
    }
    else{
        target = button2;
        flag = false;
    }
    try{
        target.addEventListener('click', function(e){

            e.preventDefault();

            var data = message;
            if(flag) data.isSpecial = 'True';
            else data.isSpecial = 'False';
            data = JSON.stringify(data);

            sendRequestPUT(data, csrftoken, url, false);
        })
    }catch{}

}
function setPriorityButton(myID){
    if(eventData.organiser.id == myID)
        return `<span class="input-group-text bg-dark text-light">Mark :</span>
                <div class="input-group-text bg-dark">
                    <input class="form-check-input" type="checkbox" id="is-priority" value="True">
                </div>`
    else return ""
}
function createViewOfMessage(message, destination, myID){
    var starCode = "";
    if(message.isSpecial) starCode = `<span class="fs-4">&#11088;</span>`;

    var buttons = "";

    if(eventData.organiser.id == myID){
        if(message.user.id == myID) buttons += `<button type="button" id="message-edit-${message.id}" class="btn btn-outline-info btn-sm me-1">Edit message</button>`;
        if(message.isSpecial) buttons += `<button id="message-unmark-${message.id}" class="btn btn-outline-danger btn-sm">Unset priority</button>`;
        else buttons += `<button id="message-mark-${message.id}" class="btn btn-outline-info btn-sm">Set priority</button>`;
        buttons += `<button id="message-delete-${message.id}" class="btn btn-outline-danger btn-sm ms-1">Delete message</button>`;
    }
    else if(message.user.id == myID) buttons += `
        <button type="button" id="message-edit-${message.id}" class="btn btn-outline-info btn-sm">Edit message</button>
        <button type="button" id="message-delete-${message.id}" class="btn btn-outline-danger btn-sm">Delete message</button>
    `

    var item = `
        <div class="p-2 text-light mb-2" id="message-body-${message.id}">
            <span class="fs-4 fw-bold">@${message.user.username}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${convertDate(message.updated)}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${starCode}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${buttons}<br>
            ${message.content}<br>
        </div>
    `
    destination.innerHTML += item;
}

function checkIfParticipant(participants){
    const myID = JSON.parse(document.getElementById('mydata').textContent);
    for(participant of participants){
        if(myID == participant.id){
            return true;
        }
    }
    return false;
}

function prepareDeleteOfMessage(message, csrftoken, url){
    try{
        element = document.getElementById(`message-delete-${message.id}`);
        element.addEventListener('click', function(e){

            e.preventDefault()

            textarea = document.getElementById('message-body');
            textarea.value = message.content;
            textarea.setAttribute('readonly', true);
            document.getElementById('message-author').innerText = '@' + message.user.username;

            document.getElementById('final-delete-positive').addEventListener('click', function(e){

                e.preventDefault();

                fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': csrftoken,
                    },
                    body: JSON.stringify(message),
                    })
                    .then((response) => response.json())
                    .then((datalist) => {
                        prepareAnnouncementsBoard(false);
                        messageModal.hide();
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                });
            })
            hideObject('final-edit-positive');
            hideObject('edit-message-title');
            displayObject('final-delete-positive');
            displayObject('delete-message-title');
            messageModal.show();
        })
    }
    catch{}
}

function prepareEditOfMessage(message, csrftoken, url){
    try{
        element = document.getElementById(`message-edit-${message.id}`);
        element.addEventListener('click', function(e){
            e.preventDefault();

            textarea = document.getElementById('message-body');
            textarea.value = message.content;
            document.getElementById('message-author').innerText = '@' + message.user.username;

            document.getElementById('final-edit-positive').addEventListener('click', function(e){

                e.preventDefault();

                requestData = message;
                requestData.content = textarea.value;
                requestData = JSON.stringify(requestData);
                sendRequestPUT(requestData, csrftoken, url, false);
                messageModal.hide();
            })
            displayObject('final-edit-positive');
            displayObject('edit-message-title');
            hideObject('final-delete-positive');
            hideObject('delete-message-title');
            textarea.removeAttribute('readonly');
            messageModal.show();
        })
    }
    catch{
        
    }
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

///////////////////////////////////////////                               Wysyłanie wiadomości                               //////////////////////////////////////////

function addListenerForSendingMessages(csrftoken, url){

    button = document.getElementById('sendMessage');
    button.addEventListener('click', function(e){

        e.preventDefault();

        var field = document.getElementById('message-send-input');
        var isSpecial = 'False';
        try{
            flag = document.getElementById('is-priority').checked;
            if(flag) isSpecial = 'True';
        }catch{}

        var data = {
            'event': event_id,
            'content': field.value,
            'isSpecial': isSpecial,
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(data),
            })
            .then((response) => {
                response.json()
            })
            .then((datalist) => {
                prepareAnnouncementsBoard(false);
                field.value = "";
            })
            .catch((error) => {
                console.error('Error:', error);
        });
    })
}