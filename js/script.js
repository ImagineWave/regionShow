"use strict";
main();

async function main(){
    const table = document.getElementById("placesTable");
    console.log(table);
    let dataArray = Array();
    await load();
    const placeArray = await initPlaceArray();
    await drawPlaces();

    async function drawPlaces(){
        for(let i = 0; i<placeArray.length; i++){
            await drawTable(placeArray[i]);
        }
    }

    async function drawTable(place){
        let tableRow = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let textCode = (place.code1+" "+place.code2+" "+place.code3+" "+place.code4+" "+place.code6);

        td1.innerText =textCode;
        td1.style.width = "200px";
        td2.innerText = place.name;

        tableRow.append(td1);
        tableRow.append(td2);

        table.append(tableRow);
    }

    async function load(){
        let response = await fetch('http://localhost:63342/Prac4/data/small.csv');
        let data = await response.text();
        let stringsData = data.split(/\n/);
        for(let i = 0; i<stringsData.length; i++){
            dataArray.push(stringsData[i]);
        }
    }
    async function initPlaceArray(){
        let placeArray = Array();
        for (let i = 0; i<dataArray.length; i++) {
            try{
                let regExp = new RegExp(/(\d+)";"(\d+)";"(\d+)";"(\d+)";"\d";"(\d)";"(.*?)"/);
                let temp = dataArray[i].match(regExp);
                console.log("OK");
                placeArray.push(
                    {
                        code1: Number(temp[1]),
                        code2: Number(temp[2]),
                        code3: Number(temp[3]),
                        code4: Number(temp[4]),
                        code6: Number(temp[5]),
                        name: String(temp[6])
                    }
                )
            } catch (Error){
                console.log("Мать сдохла");
            }
        }
        return placeArray;
    }

}



