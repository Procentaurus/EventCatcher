takeBegginingData();

function takeBegginingData(){
    var destination = document.getElementById('destination');
    var url = 'http://127.0.0.1:8000/api/events/';
    try{
        var username = document.getElementById("navusername").innerText.slice(1);
    }
    catch(err){
        username = '';
    }


    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        var datalist = data
        for(var i in datalist){

            var myBadge;

            if(datalist[i].organiser.username == username){
                myBadge = `<span class="badge rounded-pill bg-info position-absolute top-0 end-0 mt-1 me-1 fs-5 text-dark">Your event</span>`
            }
            for(let user of datalist[i].organiser.friends){
                if(user.username == username){
                    myBadge = `<span class="badge rounded-pill bg-success position-absolute top-0 end-0 mt-1 me-1 fs-5 text-dark">Your friend's event</span>`;
                    break;
                }
            }

            var item = `
                <li id="data-row-${i}" class="list-group-item bg-dark shadow mb-4 rounded-3">
                    <div class="row mx-1">
                        <div class="col-sm-11 my-4">
                            <h1 class="fw-bold text-white">${datalist[i].name}</h1>
                            <h4 class="fw-bold mt-0"><a href="#" class="text-decoration-none text-light">@${datalist[i].organiser.username}</a></h4>
                            ${myBadge}
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
                        <div class="col-sm-5 me-2">
                            <span class="text-white position-absolute bottom-0 end-0 fw-bold mb-2 me-4">Number of participants :&nbsp;&nbsp;${returnNumberOfParticipants(datalist[i].participants)} </span>
                        </div>
                    </div>
                </li>
            `
            destination.innerHTML += item
        }
    })
}

function returnNumberOfParticipants(datalist){
    var sum = 0;
    for(var i in datalist){
        sum += 1;
    }
    return sum;
}

function filterData(){
    var destination = document.getElementById('destination');
    const datax = collectForEvent();

    var url = `http://127.0.0.1:8000/api/events?`;

    if(datax.name != ""){
        url += `name=${datax.name}&`;
    }
    if(datax.start_date_time != ""){
        url += `start_date_time=${convertDateBack(datax.start_date_time)}&`;
    }
    if(datax.end_date_time != ""){
        url += `end_date_time=${convertDateBack(datax.end_date_time)}&`;
    }
    if(datax.category != ""){
        url += `category=${datax.category}&`;
    }
    if(datax.location != ""){
        url += `location=${datax.location}&`;
    }
    if(datax.is_open != ""){
        url += `is_open=${datax.is_open}&`;
    }
    if(datax.is_free != ""){
        url += `is_free=${datax.is_free}`;
    }

    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        var datalist = data
        destination.innerHTML ="";
        for(var i in datalist){
            var item = `
                <li id="data-row-${i}" class="list-group-item list-group-item-action list-group-item-secondary shadow mb-4 rounded-3">
                    <div class="row mx-1">
                        <div class="col-sm-11 my-4">
                            <h1 class="fw-bold">${datalist[i].name}</h1>
                            <h4 class="fw-bold mt-0"><a href="#" class="text-decoration-none text-secondary">@${datalist[i].organiser}</a></h4>
                        </div>
                        <div class="col-sm-3 mt-1 me-2">
                            <div class="my_card">
                                <h4 class="fw-bold ">Where and when</h4>
                                <div><span class="fw-bold">Beggining:</span>&nbsp;&nbsp;${convertDate(datalist[i].start_date_time)}</div>
                                <div><span class="fw-bold">End:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${convertDate(datalist[i].end_date_time)}</div>
                                <div><span class="fw-bold">Location:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${datalist[i].location}</div>
                            </div>
                        </div>
                        <div class="col-sm-3 mt-1">
                            <div class="my_card">
                                <h4 class="fw-bold">Character</h4>
                                <div><span class="fw-bold">Is open:</span>&nbsp;&nbsp;&nbsp;${datalist[i].is_open}</div>
                                <div><span class="fw-bold">Is free:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${datalist[i].is_free}</div>
                                <div><span class="fw-bold">Category:</span>&nbsp;&nbsp;&nbsp;${datalist[i].category}</div>
                                </div>
                        </div>
                    </div>
                    <div class="row mx-1 mt-3">
                        <div class="col-sm-6 me-2">
                            <div class="my_card">
                                <div>&nbsp;&nbsp;&nbsp;${datalist[i].description}</div>
                            </div>
                        </div>
                    </div>
                </li>
            `
            destination.innerHTML += item
        }
    })
}

