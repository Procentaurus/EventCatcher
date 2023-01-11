takeBegginingData();
addListenersForMainModal();
addListeners();

var eventData;
var mainModal = new bootstrap.Modal(document.getElementById('mainModal'));
var supportingModal = new bootstrap.Modal(document.getElementById('supportingModal'));

function fetchSingleData(url, username){
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        eventData = data;

        // wyswietlanie tylko 1 z buttonów
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

        // wyswietlanie participantsów po lewej stronie
        var destination = document.getElementById('participants');
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

        // wyswietlanie danych eventu po srodku
        destination = document.getElementById('main');
        destination.innerHTML += `
            <h1 class="display-1 fw-bold text-center">${eventData.name}</h1>
            <div class="d-flex mt-3">
                <img src="${eventData.image}" class="banner_max" />
            </div>
        `

        //wyswietlanie participantsów w modalu służącym do robienia kicków
        destination = document.getElementById('users_to_kick');
        var participants = eventData.participants;
        for( var i = 0; i < participants.length; i++){ 
            if ( participants[i].username == username) participants.splice(i, 1); 
        }
        participants.sort((a, b) => {
            let fa = a.username.toLowerCase(), fb = b.username.toLowerCase();
        
            if (fa < fb) return -1;
            if (fa > fb) return 1;
            return 0;
        });

        for(let x = 0; x < participants.length; x+=3){
            let div = `<div class="d-flex justify-content-center mb-2">`;
            for(let k=0;k<3;k++){
                let participant = participants[x+k];
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
        addListenersForSupportingModal(participants);
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

        element = document.getElementById('event-specifics-interior');
        element.addEventListener('click', function(e){
            e.preventDefault();

            var data = collectForEvent();
            data.id = eventData.id;
            
            removeEmptyValues(data);

            if(!data.hasOwnProperty('name')) data.name = eventData.name

            console.log(data);
            var myFlag = showErrorForEvent("badDate");
            console.log(myFlag);
            // if(myFlag){
            //     fetch(url, {
            //         method: 'PUT',
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'X-CSRFToken': csrftoken,
            //         },
            //         redirect: 'follow',
            //         body: JSON.stringify(data),
            //         })
            //         .then((response) => {
            //             response.json()
            //         })
            //         .then((data) => {
            //             window.location.href = mainUrl;
            //         })
            //         .catch((error) => {
            //             console.error('Error:', error);
            //         });
            // }
        });

        element = document.getElementById('enable_inviting');
        element.addEventListener("click", function(e) {

            e.preventDefault();

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
        element.addEventListener("click", function(e) {

            e.preventDefault();

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

function addListenersForMainModal(){
    try{
        const objects = [
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

        element = document.getElementById('delete_event_exterior');
        element.addEventListener("click", function() {
            displayObject(objects[0]);
            displayObject(objects[1]);
            mainModal.show();
        });

        element = document.getElementById('kick_participant_exterior');
        element.addEventListener("click", function() {
            displayObject(objects[2]);
            displayObject(objects[3]);
            mainModal.show();
        });

        element = document.getElementById('invite_for_event_exterior');
        element.addEventListener("click", function() {
            displayObject(objects[4]);
            displayObject(objects[5]);
            mainModal.show();
        });

        element = document.getElementById('event_picture_exterior');
        element.addEventListener("click", function() {
            displayObject(objects[6]);
            displayObject(objects[7]);
            mainModal.show();
        });
        element = document.getElementById('event_specifics_exterior');
        element.addEventListener("click", function() {
            displayObject(objects[8]);
            displayObject(objects[9]);
            mainModal.show();
        });

        element = document.getElementById('close');
        element.addEventListener("click", function() {
            for(obj of objects){
                hideObject(obj);
            }
            mainModal.hide();
        });
    }
    catch{

    }
}

function addListenersForSupportingModal(participants){
    try{
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        user_data = document.getElementById("user-data");
        var userID = 0;

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

        element = document.getElementById('final-kick-negative');
        element.addEventListener("click", function() {
            hideObject("final-kick-title");
            hideObject("final-kick-positive");
            hideObject("final-kick-negative");

            userID = 0;

            supportingModal.hide();
            mainModal.show();
        });

        element = document.getElementById('final-kick-positive');
        element.addEventListener("click", function() {
            var url = mainUrl + `api/events/${event_id}/`;
            const request_data = {
                "id": eventData.id,
                "name": eventData.name,
                "to_kick": userID
            };
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                redirect: 'follow',
                body: JSON.stringify(request_data),
                })
                .then((response) => {
                    response.json()
                })
                .then((request_data) => {
                    window.location.href = mainUrl + `eventsite/${event_id}/`;
                })
                .catch((error) => {
                    console.error('Error:', error);
            });
        });

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
