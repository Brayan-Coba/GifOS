function clickEnBoton(){
    document.getElementById("dropdown-estilos").classList.toggle("show")
}

function clickEnEstiloNigth(){
    document.getElementById("body").classList.add("nigth")
}

function clickEnEstiloDay(){
    document.getElementById("body").classList.remove("nigth")
}

document.addEventListener("keypress", activacionBusqueda);


function activacionBusqueda(){
    var strInputBuscador = document.getElementById("input_buscador").value
    if (strInputBuscador.value != ""){
       document.getElementById("txt_buscar_id").classList.remove("inactivo")
   }
}

/* lo de arriba funciona a medias pues no evalua la condicion */

var api = "api.giphy.com/v1/gifs/search?"
var apiKey = "api_key=Nj0jjM3UQ44YeJHkvgWaTMW0iFJx4Q5c"

function clickEnBusqueda(){ 
    var keyword = document.getElementById("input_buscador").value;
    var url = api+apiKey+"&q="+keyword;
    console.log(url)
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET",url)
    xhr.responseType = "json"
    xhr.onload = function (){
      (this.response.data[0].images.url)
    }
    xhr.send();
}

