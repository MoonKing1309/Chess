let x = [0,2]
// let char = 'P'
// let char = "1"
let char = "2"
let limit = 0
let sol = []

if (char=="P"){
    limit = 1
    if (((x[0] + limit) > -1) && ((x[0] + limit) < 5)) {
        sol.push([x[0] + limit, x[1]])
    }
    if (x[0] - limit > -1 && x[0] - limit < 5) {
        sol.push([x[0] - limit, x[1]])
    }
    if (x[1] + limit > -1 && x[1] + limit < 5) {
        sol.push([x[0], limit + x[1]])
    }
    if (x[1] - limit > -1 && x[1] - limit < 5) {
        sol.push([x[0], x[1] - limit])
    }
}
if(char =="1"){
    limit =2
    if (((x[0] + limit) > -1) && ((x[0] + limit) < 5)) {
        sol.push([x[0] + limit, x[1]])
    }
    if (x[0] - limit > -1 && x[0] - limit < 5) {
        sol.push([x[0] - limit, x[1]])
    }
    if (x[1] + limit > -1 && x[1] + limit < 5) {
        sol.push([x[0], limit + x[1]])
    }
    if (x[1] - limit > -1 && x[1] - limit < 5) {
        sol.push([x[0], x[1] - limit])
    }
}
if (char=="2"){
    limit =2
    if (char=="2"){
        if((x[0]+limit)>-1 && (x[0]+limit)<5 && (x[1]+limit)>-1 && (x[1]+limit)<5){
            sol.push([x[0]+limit,x[1]+limit])
        }
        if((x[0]-limit)>-1 && (x[0]-limit)<5 && (x[1]+limit)>-1 && (x[1]+limit)<5){
            sol.push([x[0]-limit,x[1]+limit])
        }
        if((x[0]+limit)>-1 && (x[0]+limit)<5 && (x[1]-limit)>-1 && (x[1]-limit)<5){
            sol.push([x[0]+limit,x[1]-limit])
        }
        if((x[0]-limit)>-1 && (x[0]-limit)<5 && (x[1]-limit)>-1 && (x[1]-limit)<5){
            sol.push([x[0]-limit,x[1]-limit])
        }
    }

} 


var colorIndex = ""
sol.forEach((value)=>{
    colorIndex = String(value[0]) + String(value[1])
    if(side[0]=="R"){
        document.getElementById(colorIndex).style.backgroundColor="red"
    }
    else{
        document.getElementById(colorIndex).style.backgroundColor="blue"

    }
})

