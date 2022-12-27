searchUserEvents();
enableChangingAvatar();

function searchUserEvents(){
    var destination = document.getElementById('destination');
    var usernamePage = document.getElementById("username").innerText;
    var usernameUsing = document.getElementById("navusername").innerText;
    var usernamePage_ready = usernamePage.slice(1);
    var usernameUsing_ready = usernameUsing.slice(1);
    var url = `http://127.0.0.1:8000/api/events?organiser=${usernamePage_ready}`;

    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        var datalist = data
        destination.innerHTML ="";
        for(var i in datalist){
            var myBadge;

            if(datalist[i].organiser.username == usernameUsing_ready){
                myBadge = `<span class="badge rounded-pill bg-info position-absolute top-0 end-0 mt-1 me-1 fs-5 text-dark">Your event</span>`
            }
            for(let user of datalist[i].organiser.friends){
                if(user.username == usernameUsing_ready){
                    myBadge = `<span class="badge rounded-pill bg-success position-absolute top-0 end-0 mt-1 me-1 fs-5 text-dark">Your friend's event</span>`;
                    break;
                }
            }
            var item = `
                <li id="data-row-${i}" class="list-group-item bg-dark shadow mb-4 rounded-3">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="row mx-1">
                            <div class="col-sm-12 my-4">
                                <h1 class="fw-bold text-white">${datalist[i].name}</h1>
                                <h4 class="fw-bold mt-0"><a href="#" class="text-decoration-none text-light">@${datalist[i].organiser.username}</a></h4>
                                ${myBadge}
                            </div>
                        </div>
                        <div class="row mx-1">
                            <div class="col-sm-5 mt-1 me-2">
                                <div class="my_card">
                                    <h4 class="fw-bold text-light">Where and when</h4>
                                    <div><span class="fw-bold text-light">Beggining:</span>&nbsp;&nbsp;<span class="text-light">${convertDate(datalist[i].start_date_time)}</span></div>
                                    <div><span class="fw-bold text-light">End:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-light">${convertDate(datalist[i].end_date_time)}</span></div>
                                    <div><span class="fw-bold text-light">Location:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-light">${datalist[i].location}</span></div>
                                </div>
                            </div>
                            <div class="col-sm-5 mt-1">
                                <div class="my_card">
                                    <h4 class="fw-bold text-light">Character</h4>
                                    <div><span class="fw-bold text-light">Is open:</span>&nbsp;&nbsp;&nbsp;<span class="text-light">${datalist[i].is_open}</span></div>
                                    <div><span class="fw-bold text-light">Is free:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-light">${datalist[i].is_free}</span></div>
                                    <div><span class="fw-bold text-light">Category:</span>&nbsp;&nbsp;&nbsp;<span class="text-light">${datalist[i].category}</span></div>
                                    </div>
                            </div>
                        </div>
                        <div class="row mx-1 mt-3">
                            <div class="col-sm-12 me-2">
                                <div class="my_card">
                                    <div>&nbsp;&nbsp;&nbsp;<span class="text-light">${datalist[i].description}</span></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-5 me-2">
                            <span class="text-white position-absolute bottom-0 end-0 fw-bold mb-2 me-4">Number of participants :&nbsp;&nbsp;${returnNumberOfParticipants(datalist[i].participants)} </span>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <img src="${datalist[i].image}" class="eventimage">
                    </div>
                </div>
                </li>
            `
            destination.innerHTML += item
        }
    })
}

function enableChangingAvatar(){
    const toastTrigger = document.getElementById('myBadge')
    const toastLiveExample = document.getElementById('liveToast')
    if (toastTrigger) {
    toastTrigger.addEventListener('click', () => {
        const toast = new bootstrap.Toast(toastLiveExample)
        toast.show()
        })
    }
}