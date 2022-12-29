var form = document.getElementById('request');
form.addEventListener('click', function(e){
    e.preventDefault();

    var url = mainUrl + 'api/events/';

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const data = collectForEvent();
    
    var myFlag = showErrorForEvent("emptyFields");
    var myFlag2 = showErrorForEvent("badDate");

    if(myFlag && myFlag2){
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
            .then((data) => {
                window.location.href = mainUrl;
            })
            .catch((error) => {
                console.error('Error:', error);
        });
        }
});