"use strict";
const table = document.getElementById("placesTable");
const table2 = document.getElementById("sortedPlacesTable");
const input = document.getElementById("search");
const inputRight = document.getElementById("searchRight");

main();

//TODO Заголовок в таблице () Регионы -> Районый -> Сельсоветы -> Пункты; ЕСТЬ
//TODO Раздельная прокрутка левой и правой таблицы (overflow Y) ЕСТЬ
//TODO Подсветка элемента в левой таблице, содержимое которого сейчас в правой; ЕСТЬ
//TODO Слить активацию левых/правых ЕСТЬ

async function main(){
    let leftTableData = Array();
    let rightTableData = Array();
    let dataArray = Array();
    let SelectedElement;
    await load();
    const placeArray = initPlaceArray();
    await setContents(leftTableData);
    await drawTable(table, leftTableData);

    input.addEventListener("keyup", findLeft);
    inputRight.addEventListener("keyup", findRight);
    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
            turnBack();
            drawTable(table, leftTableData);
        }
    });
   table.onclick = tableOnClick;
   table2.onclick = tableOnClick;
   function tableOnClick(event){
       {
            let target = event.target.parentElement;
            if (target.tagName === 'TR'){
                if (SelectedElement === target){
                    SelectedElement.classList.remove('selected');
                    SelectedElement = null;

                } else {
                    if(SelectedElement!=null){
                        SelectedElement.classList.remove('selected');
                    }
                    SelectedElement = target;
                    target.classList.add('selected');
                    showTable2();
                }
            }
       }
   }
    async function drawTableByName(name, tableToDraw, data){
        tableToDraw.replaceChildren();
        await drawTableHead(tableToDraw);

        for(let i = 0; i<data.length; i++){
            if(data[i].name.toLowerCase().includes(name.toLowerCase())){
                await drawTableRow(data[i], tableToDraw);
            }
        }
    }
    async function drawTableHead(tableToDraw) {
        let parse;
        let level;
        let code3;
        if(SelectedElement!= null){
            parse = SelectedElement.id.split("-");
            level = Number(parse[5]);
            code3 = Number(parse[2]);
        } else {
            level = 1;
        }
        if(tableToDraw===table2){
            level++;
        }
        let tableHead = document.createElement('thead');
        let tableRow = document.createElement('tr');
        let th1 = document.createElement('th');
        let th2 = document.createElement('th');
        switch (level){
            case 1 :{
                th1.innerText = "Регионы";
                break;
            }
            case 2 :{
                th1.innerText = "Районы";
                break;
            }
            case 3 :{
                if(code3 === 0){
                    th1.innerText = "Населенные пункты";
                    break;
                } else {
                    th1.innerText = "Сельсоветы";
                    break;
                }
            }
            case 4 :{
                th1.innerText = "Населенные пункты";
                break;
            }
            default: {
            }
        }
        th2.innerText = "Коды";
        tableRow.append(th2);
        tableRow.append(th1);
        tableHead.append(tableRow);
        tableToDraw.append(tableHead);
    }
    async function drawTableRow(place, tableToDraw){
        let tableRow = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let textCode = (place.code1+" "+place.code2+" "+place.code3+" "+place.code4+" "+place.code6);

        td1.innerText =textCode;
        td1.style.width = "200px";
        td2.innerText = place.name;

        tableRow.append(td1);
        tableRow.append(td2);
        tableRow.id = (place.code1+"-"+place.code2+"-"+place.code3+"-"+place.code4+"-"+place.code6+"-"+place.level);
        if(SelectedElement != null && SelectedElement.id === tableRow.id){
            tableRow.classList.add('selected');
        }

        tableToDraw.append(tableRow);
    }
    async function load(){
        let response = await fetch('http://localhost:63342/Prac4/data/oktmo.csv');
        let data = await response.text();
        let stringsData = data.split(/\n/);
        for(let i = 0; i<stringsData.length; i++){
            dataArray.push(stringsData[i]);
        }
    }
    function initPlaceArray(){
        let placeArray = Array();
        for (let i = 0; i<dataArray.length; i++) {
            try{
                let regExp = new RegExp(/(\d+)";"(\d+)";"(\d+)";"(\d+)";"\d";"(\d)";"(.*?)"/);
                let temp = dataArray[i].match(regExp);
                let level = 0;
                if(temp[1]!=0){
                    level++;
                }
                if(temp[2]!=0){
                    level++;
                }
                if(temp[3]!=0){
                    level++;
                }
                if(temp[4]!=0){
                    level++;
                }

                placeArray.push(
                    {
                        code1: Number(temp[1]),
                        code2: Number(temp[2]),
                        code3: Number(temp[3]),
                        code4: Number(temp[4]),
                        code6: Number(temp[5]),
                        name: String(temp[6]),
                        level: Number(level)
                    }
                )
            } catch (Error){
                alert("Произошла ошибка"+ i);
                continue;
            }
        }
        return placeArray;
    }
    function findLeft(e){
        if (e.target.value.length >=3){
            drawTableByName(e.target.value , table , leftTableData);
        } else {
            drawTable(table, leftTableData);
        }
    }
    function findRight(e){
        if (e.target.value.length >=3){
            drawTableByName(e.target.value , table2 , rightTableData);
        } else {
            drawTable(table2, rightTableData);
        }
    }
     function showTable2(){
         setContents(leftTableData);
         setContents(rightTableData);
         if(rightTableData.length == 0){
             return;
         }
         drawTable(table, leftTableData);
         drawTable(table2, rightTableData);
         inputRight.classList.remove('hidden');
    }

    async function drawTable(tableToDraw, data) {
        tableToDraw.replaceChildren();
        await drawTableHead(tableToDraw);
        for(let i = 0; i<data.length; i++){
            await drawTableRow(data[i], tableToDraw);
        }
    }
    function setContents(tableData){
        tableData.length = 0; // Замени на "tableData = [];" и развлекайся ☻
        if(SelectedElement == null){
            for(let i = 0; i<placeArray.length; i++){
                if(placeArray[i].level === 1 && placeArray[i].code6 === 2){
                    tableData.push(placeArray[i]);
                }
            }
        } else {
            let parse = SelectedElement.id.split("-");
            let code1 = Number(parse[0]);
            let code2 = Number(parse[1]);
            let code3 = Number(parse[2]);
            let level = Number(parse[5]);
            if(tableData === rightTableData){
                level++;
            }
            switch (level){
                case 1:{
                    for(let i = 0; i<placeArray.length; i++){
                        if(placeArray[i].level === level && placeArray[i].code6 === 2){
                            tableData.push(placeArray[i]);
                        }
                    }
                    break;
                }
                case 2:{
                    for(let i = 0; i<placeArray.length; i++){
                        if(placeArray[i].level === level && placeArray[i].code1 === code1){
                            tableData.push(placeArray[i]);
                        }
                    }
                    break;
                }
                case 3:{
                    for(let i = 0; i<placeArray.length; i++){
                        if(placeArray[i].level === level && placeArray[i].code1 === code1 && placeArray[i].code2 === code2){
                            tableData.push(placeArray[i]);
                        }
                    }
                    break;
                }
                case 4:{
                    for(let i = 0; i<placeArray.length; i++){
                        if(placeArray[i].level === level && placeArray[i].code1 === code1 && placeArray[i].code2 === code2 && placeArray[i].code3 === code3){
                            tableData.push(placeArray[i]);
                        }
                    }
                    break;
                }
            }
        }
    }
    function turnBack(){
        let parse = SelectedElement.id.split("-");
        let code1 = Number(parse[0]);
        let code2 = Number(parse[1]);
        let code3 = Number(parse[2]);
        let level = Number(parse[5]);
        level--;
        leftTableData = [];

        switch (level){
            case 1:{
                for(let i = 0; i<placeArray.length; i++){
                    if(placeArray[i].level === level && placeArray[i].code6 === 2){
                        leftTableData.push(placeArray[i]);
                    }
                }
                break;
            }
            case 2:{
                for(let i = 0; i<placeArray.length; i++){
                    if(placeArray[i].level === level && placeArray[i].code1 === code1){
                        leftTableData.push(placeArray[i]);
                    }
                }
                break;
            }
            case 3:{
                for(let i = 0; i<placeArray.length; i++){
                    if(placeArray[i].level === level && placeArray[i].code1 === code1 && placeArray[i].code2 === code2){
                        leftTableData.push(placeArray[i]);
                    }
                }
                break;
            }
            case 4:{
                for(let i = 0; i<placeArray.length; i++){
                    if(placeArray[i].level === level && placeArray[i].code1 === code1 && placeArray[i].code2 === code2 && placeArray[i].code3 === code3){
                        leftTableData.push(placeArray[i]);
                    }
                }
                break;
            }
        }
    }

}