function getData(){
    var myArray = [
        document.getElementById('id_name').value,
        document.getElementById('id_start_date_time').value,
        document.getElementById('id_end_date_time').value,
        document.getElementById('id_location').value,
        document.getElementById('id_category').value,
        document.getElementById('id_is_open').checked,
        document.getElementById('id_is_free').checked,
        document.getElementById('id_description').value,
    ]
    if(myArray[5] != "" ) myArray[5] = "True";
    if(myArray[6] != "" ) myArray[6] = "True";
    return myArray
}

function collectForEvent(){
    const p = getData();
    const data = {
        'name': p[0],
        'start_date_time': p[1],
        'end_date_time': p[2],
        'location': p[3],
        'category': p[4],
        'is_open': p[5],
        'is_free': p[6],
        'description': p[7],
    };
    return data;
}
function showErrorForEvent(name){
    const p = getData();
    switch(name) {
        case "emptyFields":
            var error1 = document.getElementById('emptyFields');
            if(p[0] == "" || p[1] == ""|| p[2] == ""|| p[3] == ""|| p[4] == "" || p[7] == ""){
                error1.removeAttribute("hidden");
                return false;
            }
            else{
                error1.setAttribute("hidden", true);
                return true;
            }
        case "badDate":
            var myFlag = checkDates(p[1], p[2]);
            var error2 = document.getElementById('badDate');
            if(!myFlag){
                error2.removeAttribute("hidden");
            }
            else{
                error2.setAttribute("hidden", true);
            }
            return myFlag;
      } 
}