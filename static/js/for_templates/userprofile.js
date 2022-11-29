searchUserEvents();

function searchUserEvents(){
    var destination = document.getElementById('destination');
    var username = document.getElementById("username").innerText;
    var username_ready = username.slice(1);
    var url = `http://127.0.0.1:8000/api/events?organiser=${username_ready}`;

    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        var datalist = data
        destination.innerHTML ="";
        for(var i in datalist){
            var item = `
                <li id="data-row-${i}" class="list-group-item bg-dark shadow mb-4 rounded-3">
                    <div class="row mx-1">
                        <div class="col-sm-11 my-4">
                            <h1 class="fw-bold text-white">${datalist[i].name}</h1>
                            <h4 class="fw-bold mt-0"><a href="#" class="text-decoration-none text-light">@${datalist[i].organiser}</a></h4>
                        </div>
                        <div class="col-sm-3 mt-1 me-2">
                            <div class="my_card">
                                <h4 class="fw-bold text-light">Where and when</h4>
                                <div><span class="fw-bold text-light">Beggining:</span>&nbsp;&nbsp;<span class="text-light">${convertDate(datalist[i].start_date_time)}</span></div>
                                <div><span class="fw-bold text-light">End:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-light">${convertDate(datalist[i].end_date_time)}</span></div>
                                <div><span class="fw-bold text-light">Location:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-light">${datalist[i].location}</span></div>
                            </div>
                        </div>
                        <div class="col-sm-3 mt-1">
                            <div class="my_card">
                                <h4 class="fw-bold text-light">Character</h4>
                                <div><span class="fw-bold text-light">Is open:</span>&nbsp;&nbsp;&nbsp;<span class="text-light">${datalist[i].is_open}</span></div>
                                <div><span class="fw-bold text-light">Is free:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-light">${datalist[i].is_free}</span></div>
                                <div><span class="fw-bold text-light">Category:</span>&nbsp;&nbsp;&nbsp;<span class="text-light">${datalist[i].category}</span></div>
                                </div>
                        </div>
                    </div>
                    <div class="row mx-1 mt-3">
                        <div class="col-sm-6 me-2">
                            <div class="my_card">
                                <div>&nbsp;&nbsp;&nbsp;<span class="text-light">${datalist[i].description}</span></div>
                            </div>
                        </div>
                    </div>
                </li>
            `
            destination.innerHTML += item
        }
    })
}