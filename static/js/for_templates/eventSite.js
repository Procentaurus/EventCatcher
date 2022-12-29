takeBegginingData();
function fetchSingleData(url, username){
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        var event = data
        console.log(event);

        var destination = document.getElementById('participants');

        for(participant of event.participants){
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
    var destination = document.getElementById('destination');
    var url = mainUrl + `api/events/${event_id}/`;
    try{
        var username = document.getElementById("navusername").innerText.slice(1);
    }
    catch(err){
        username = '';
    }

    fetchSingleData(url, username);
}