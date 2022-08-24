let dataArray = Array();
let placeArray = Array();
load();
initPlaceArray();

async function load(){
    (fetch('http://localhost:63342/Prac4/data/small.csv').then((response) => {
        return response.text();
    }).then((data) => {

        let stringsData = data.split(/\n/);
        for(let i = 0; i<stringsData.length; i++){
            dataArray.push(stringsData[i]);
            console.log(stringsData[i]);
        }
    }))

}
function initPlaceArray(){
    console.log(dataArray); //TODO
    console.log("dataArray.length = "+ dataArray.length); //TODO

    for (let i = 0; i<dataArray.length; i++) {

        let data = dataArray[i].match(/(\d+)";"(\d+)";"(\d+)";"(\d+)";"\d";"\d";"([А-Яа-я\s]+) ([А-Я а-я\s-]+)/gm);
        placeArray.push(
            {
                code1: Number(data[1]),
                code2: Number(data[2]),
                code3: Number(data[3]),
                code4: Number(data[4]),
                status: String(data[5]),
                name: String(data[6])

            }
        )
    }
}


