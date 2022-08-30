"use strict";
const table = document.getElementById("placesTable");
const table2 = document.getElementById("sortedPlacesTable");
const input = document.getElementById("search");
const inputRight = document.getElementById("searchRight");

main();

//TODO Заголовок в таблице () Регионы -> Районый -> Сельсоветы -> Пункты;
//TODO Раздельная прокрутка левой и правой таблицы (overflow Y)
//TODO Подсветка элемента в левой таблице, содержимое которого сейчас в правой;
//TODO Слить активацию левых/правых
//TODO Слить в 1 функцию turnBack() setLeftContents() setRightContents();

async function main(){
    let leftTableData = Array();
    let rightTableData = Array();

    let dataArray = Array(); //TODO убрать из глобала
    let SelectedElement;
    await load();
    const placeArray = initPlaceArray();
    await setContents(leftTableData);
    await drawLeft(table, leftTableData);


    input.addEventListener("keyup", findLeft);
    inputRight.addEventListener("keyup", findRight);
    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
            turnBack();
            drawLeft(table, leftTableData);
        }
    });


    table.onclick = async function selectElement( event){
        let target = event.target.parentElement;
        if (target.tagName === 'TR'){
            if (SelectedElement === target){
                SelectedElement.classList.remove('selected');
                SelectedElement = null;
                hideTable2();
                return;

            } else {
                if(SelectedElement!=null){
                    SelectedElement.classList.remove('selected');
                    hideTable2();
                }
                SelectedElement = target;
                target.classList.add('selected');
                await showTable2();
            }
        }
    }
    table2.onclick = async function selectElementInTable2( event){
        let target = event.target.parentElement;
        if (target.tagName === 'TR'){
            if (SelectedElement === target){
                SelectedElement.classList.remove('selected');
                SelectedElement = null;
                hideTable2();
                return;

            } else {
                if(SelectedElement!=null){
                    SelectedElement.classList.remove('selected');
                    hideTable2();
                }
                SelectedElement = target;
                target.classList.add('selected');
                await showTable2();
            }
        }
    }





    async function drawLeftByName(name){
        table.replaceChildren();
        await drawTableHead(table);



        for(let i = 0; i<leftTableData.length; i++){
            if(leftTableData[i].name.toLowerCase().includes(name.toLowerCase())){
                await drawTableRow(leftTableData[i], table);
            }
        }
    }
    async function drawRightByName(name){
        table.replaceChildren();
        await drawTableHead(table);


        for(let i = 0; i<rightTableData.length; i++){
            if(rightTableData[i].name.toLowerCase().includes(name.toLowerCase())){
                await drawTableRow(rightTableData[i], table2);
            }
        }
    }
    /*
    <thead>
        <tr>
            <th scope="col">Items</th>
            <th scope="col">Expenditure</th>
        </tr>
    </thead>
    */
    async function drawTableHead(tableToDraw) {
        console.log("Зашел в заголовок") //TODO remove logger
        let parse;
        let level;
        if(SelectedElement!= null){
            parse = SelectedElement.id.split("-");
            level = Number(parse[5]);
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
                th1.innerText = "Сельсоветы";
                break;
            }
            case 4 :{
                th1.innerText = "Населенные пункты";
                break;
            }
            default: {
                console.log("Мать сдохла")
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
                alert("Мать сдохла"+ i);
                continue;
            }
        }
        return placeArray;
    }





//TODO drawByName(Left/right);

    function findLeft(e){
        if (e.target.value.length >=3){
            drawLeftByName(e.target.value);
        } else {
            drawLeft(table, leftTableData);
        }
    }
    function findRight(e){
        if (e.target.value.length >=3){
            drawRightByName(e.target.value);
        } else {
            drawRight();
        }
    }


    async function showTable2(){
        await setContents(leftTableData);
        await drawLeft(table, leftTableData);
        await setContents(rightTableData);
        await drawRight();
        inputRight.classList.remove('hidden');
    }
    async function hideTable2(){
        table2.replaceChildren();
        inputRight.classList.add('hidden');
    }

    async function drawLeft(tableToDraw, data) {
        tableToDraw.replaceChildren();
        await drawTableHead(tableToDraw);
        for(let i = 0; i<data.length; i++){
            await drawTableRow(data[i], tableToDraw);
        }
    }
    async function drawRight() {
        table2.replaceChildren();
        await drawTableHead(table2);
        for(let i = 0; i<rightTableData.length; i++){
            await drawTableRow(rightTableData[i], table2);
        }
    }
    
    async function setContents(tableData){
        tableData.length = 0; // Замени на "tableData = [];" и охуевай ☻
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
            let code4 = Number(parse[3]);
            let code6 = Number(parse[4]);
            let level = Number(parse[5]);
            if(tableData === rightTableData){
                level++;
            }
            console.log("setLeftContents() level:"+level+" code1:"+code1); //TODO remove logger
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
            console.log(tableData); //TODO remove logger
        }
    }
    async function setRightContents(isInit){
        if(isInit){
            rightTableData = [];
            console.log("setRightContents(true): добавляем контент в правую таблицу"); //TODO remove logger
            for(let i = 0; i<placeArray.length; i++){
                if(placeArray[i].level === 1 && placeArray[i].code6 === 2){
                    rightTableData.push(placeArray[i]);
                }
            }
        } else {
            console.log("setRightContents(false): добавляем контент в правую таблицу"); //TODO remove logger
            let parse = SelectedElement.id.split("-");
            let code1 = Number(parse[0]);
            let code2 = Number(parse[1]);
            let code3 = Number(parse[2]);
            let code4 = Number(parse[3]);
            let code6 = Number(parse[4]);
            let level = Number(parse[5]);
            let nextLevel = level+1;
            console.log("setRightContents(false): "+nextLevel); //TODO remove logger
            rightTableData = [];
            switch (nextLevel){
                case 1:{
                    console.log("setRightContents(false): случай 1"); //TODO remove logger
                    for(let i = 0; i<placeArray.length; i++){
                        if(placeArray[i].level === 1 && placeArray[i].code6 === 2){
                            rightTableData.push(placeArray[i]);
                        }
                    }
                    break;
                }
                case 2:{
                    console.log("setRightContents(false): случай 2"); //TODO remove logger
                    for(let i = 0; i<placeArray.length; i++){
                        if(placeArray[i].level === nextLevel && placeArray[i].code1 === code1){
                            rightTableData.push(placeArray[i]);
                        }
                    }
                    console.log(rightTableData); //TODO remove logger
                    break;
                }
                case 3:{
                    console.log("setRightContents(false): случай 3"); //TODO remove logger
                    for(let i = 0; i<placeArray.length; i++){
                        if(placeArray[i].level === nextLevel && placeArray[i].code1 === code1 && placeArray[i].code2 === code2){
                            rightTableData.push(placeArray[i]);
                        }
                    }
                    break;
                }
                case 4:{
                    console.log("setRightContents(false): случай 4"); //TODO remove logger
                    for(let i = 0; i<placeArray.length; i++){
                        if(placeArray[i].level === nextLevel && placeArray[i].code1 === code1 && placeArray[i].code2 === code2 && placeArray[i].code3 === code3){
                            rightTableData.push(placeArray[i]);
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
        let code4 = Number(parse[3]);
        let code6 = Number(parse[4]);
        let level = Number(parse[5]);
        level--;
        console.log("setLeftContents() level:"+level+" code1:"+code1); //TODO remove logger
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
        console.log(leftTableData); //TODO remove logger

    }

}



