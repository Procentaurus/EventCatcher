function convertDate(text){
    var newText = '';
    var date = text.substr(0,10);

    var time = text.substr(11,5);

    newText += date;
    newText +=" - ";
    newText += time;

    return newText
}
function convertDateBack(text){
    var newText = '';
    var date = text.substr(0,10);

    var time = text.substr(11,5);

    newText += date;
    newText +="T";
    newText += time;
    newText += "Z";

    return newText
}


function checkDates(date1, date2){
    const years = [parseInt(date1.substr(0,4)),parseInt(date2.substr(0,4))];
    const months = [parseInt(date1.substr(5,2)),parseInt(date2.substr(5,2))];
    const days = [parseInt(date1.substr(8,2)),parseInt(date2.substr(8,2))];
    const hours = [parseInt(date1.substr(11,2)),parseInt(date2.substr(11,2))];
    const minutes = [parseInt(date1.substr(14,2)),parseInt(date2.substr(14,2))];

    if(years[0] < years[1]) return true;
    else if(years[0] == years[1]){
        if(months[0] < months[1]) return true;
        else if(months[0] == months[1]){
            if(days[0] < days[1]) return true;
            else if(days[0] == days[1]){
                if(hours[0] <= hours [1] ) return true;
                else if(hours[0] == hours [1] ){
                    if(minutes[0] < minutes[1]) return true;
                    return false;
                }
                return false;
            }
            return false;
        }
        return false;
    }
    return false;
}