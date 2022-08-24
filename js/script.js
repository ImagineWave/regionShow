document.write('4s4');
load();
function load(){
    document.write();
    fetch('http://localhost:63342/Prac4/data/small.csv').then((response) => {
        return response.text();
    }).then((data) => {
        data.split(/ig/);
        document.writeln(data);
    })
}

