function returnNumberOfParticipants(datalist){
    var sum = 0;
    for(var i in datalist){
        sum += 1;
    }
    return sum;
}
function activateBootstrapToast(buttonID, toastID){
    const toastTrigger = document.getElementById(buttonID);
    const toastLiveExample = document.getElementById(toastID);
    if (toastTrigger) {
    toastTrigger.addEventListener('click', () => {
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
        })
    } 
}

function hideObject(obj) {
    document.getElementById(obj).hidden = true;
}
function displayObject(obj) {
    document.getElementById(obj).hidden = false;
}

function removeEmptyValues(object) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            var value = object[key];
            if (value === null || value === undefined || value === '') {
                delete object[key];
            }
        }
    }
}
