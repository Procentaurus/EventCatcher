function returnNumberOfParticipants(datalist){
    var sum = 0;
    for(var i in datalist){
        sum += 1;
    }
    return sum;
}