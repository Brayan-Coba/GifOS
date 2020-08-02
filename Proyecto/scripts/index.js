/*---------------------------------------------------------------------------------
Nombre:		    elegirTema
Descripcion:    Agrega o quita la clase show que muestra el elemnto en pantalla
Entrada:	    
                click
Salida:		    
                .show
----------------------------------------------------------------------------------*/
function elegirTema(){
    document.getElementById("dropdown-estilos").classList.toggle("show")
}

/* cambia el estilo a nocturno */
function clickEnEstiloNigth(){
    document.getElementById("body").classList.add("nigth")
}

/* cambia el estilo a diurno  */
function clickEnEstiloDay(){
    document.getElementById("body").classList.remove("nigth")
}

document.getElementById("input_buscador").addEventListener("input", activacionBusqueda);


/*---------------------------------------------------------------------------------
Nombre:		    fBoTextoVacio
Descripcion:    Compara la entrada de texto para ver si esta vacio o solo con espacios
Entrada:	    
                texto
Salida:		    
                true    -> Está vacío 
                false   -> No está vacío
----------------------------------------------------------------------------------*/
function fBoTextoVacio(texto){
    if (texto == "" || texto.trim() == "" ){
        return true
    }
    else{
        return false
    }
}

/* cambia el estilo del boton y la imagen de la lupa entre activo e inactivo */
function activacionBusqueda(){
        var strInputBuscador = document.getElementById("input_buscador").value
        
        if (fBoTextoVacio(strInputBuscador)) {
            document.getElementById("txt_buscar_id").classList.add("inactivo")
            document.getElementById("lupa_buscar").src="./assets/lupa_inactive.svg"
    
       }
       else {
            document.getElementById("txt_buscar_id").classList.remove("inactivo")
            document.getElementById("lupa_buscar").src="./assets/lupa.svg"
       }
}

/* La funcion de abajo es para que busque con el enter */
document.getElementById("input_buscador").addEventListener("keydown", function(event) {
    if (event.which == 13){
        clickEnBusqueda();
    }
});

/* oculta el menu de cambio de estilos al hacer click */
window.onclick = function(event) {
    if (!event.target.matches('.boton')) {
      var dropdowns = document.getElementsByClassName("sailor-estilos");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var div_Dropdown = dropdowns[i];
        if (div_Dropdown.classList.contains('show')) {
            div_Dropdown.classList.remove('show');
        }
      }
    }
  }


var api_busqueda = "https://api.giphy.com/v1/gifs/search?"
var api_sugerencia = "https://api.giphy.com/v1/tags/related/"
var api_trending = "https://api.giphy.com/v1/gifs/trending?"
var api_random = "https://api.giphy.com/v1/gifs/random?"
var apiKey = "api_key=Nj0jjM3UQ44YeJHkvgWaTMW0iFJx4Q5c"


/*esta funcion hace peticion a la URL y ejecuta una funcion callback con la estructura
function ejemplo (err,response); */

function respuestaServer(url,callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET",url)
    xhr.responseType = "json"
    xhr.onload = function (){
        var status = this.status
        if (status == 200){
            callback(null,this.response)
        }
        else {callback(status)};
    }
    xhr.send();
}

function callbackBusqueda(err,response){
    
    var count = (response.pagination.count)
    var indice = getRandomInt(0,count);

    if (count == 0){
        img_url = "https://media2.giphy.com/media/9J7tdYltWyXIY/giphy.gif"
    }
    else {
        img_url = (response.data[indice].images.original.url)
    }   
    document.getElementById("img_prueba").src= img_url     
}


function clickEnBusqueda(){ 
    var keyword = document.getElementById("input_buscador").value;
    if (fBoTextoVacio(keyword)){
        return
    }
    
    var url = api_busqueda+apiKey+"&q="+keyword;
    var img_url =""
    respuestaServer(url,callbackBusqueda)
    
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

document.getElementById("input_buscador").addEventListener("input", sugerenciaBusqueda);

function sugerenciaBusqueda(){ 
    var keyword = document.getElementById("input_buscador").value;
    if (fBoTextoVacio(keyword)){
        document.getElementById("sugerencia_span_1").innerHTML = ""
        document.getElementById("sugerencia_span_2").innerHTML = ""
        document.getElementById("sugerencia_span_3").innerHTML = ""
        document.getElementById("div_cuerpo_opciones").classList.remove("show")
        return
    }
    document.getElementById("div_cuerpo_opciones").classList.add("show")
    var url = api_sugerencia+keyword+"?"+apiKey;

    var xhr = new XMLHttpRequest();
    xhr.open("GET",url)
    xhr.responseType = "json"
    xhr.onload = function (){

            var sugerencia1 = (this.response.data[0].name)
            var sugerencia2 = (this.response.data[1].name)
            var sugerencia3 = (this.response.data[2].name)
    
            document.getElementById("sugerencia_span_1").innerHTML = sugerencia1
            document.getElementById("sugerencia_span_2").innerHTML = sugerencia2
            document.getElementById("sugerencia_span_3").innerHTML = sugerencia3 
    }
    xhr.send();
}

/*---------------------------------------------------------------------------------
Nombre:		    buscarSugerencia
Descripcion:    El evento trae informacion como el ID propio, se modifica una 
                palabra ejemplo: replace("opcion","span") para que coincida con el 
                ID deseado y asi se modifica
Entrada:	    
                Evento
Salida:		    
                Modifica el HTML en el ID deseado
----------------------------------------------------------------------------------*/
/*escalabilidad se trae la id del html*/

function buscarSugerencia(e){
    var strId = e.target.id.replace("opcion","span")
    var keyword = document.getElementById(strId).innerText
    document.getElementById("input_buscador").value = keyword
    clickEnBusqueda();
    sugerenciaBusqueda();
}

function cerrarGif(e){
    var strId = e.target.id.replace("cerrar","contenedor")
    document.getElementById(strId).classList.add("suppress")
}

function btnVerMas(e){
    var strId = e.target.id
    var url = api_busqueda+apiKey+"&q="+strId;
    var img_url =""
    respuestaServer(url,function(err,response){
        var count = (response.pagination.count)
        var indice = getRandomInt(0,count);  
            img_url = (response.data[indice].images.original.url)
            document.getElementById(strId+"_gif").src= img_url
        })
}

var contador = 0
var contador2 = 0

function generarDivTendencias(consecutivoId) {
   var contenedorDivs = document.getElementById("id_contenedor_tendencias");
   var contenedorGif = document.createElement("div");
   var gif = document.createElement("img")
   

   contenedorGif.setAttribute("class","div_gif_tendencia");
   contenedorGif.setAttribute("id","id_div_tendencia_"+consecutivoId);
   gif.setAttribute("class","gif_tendencia")
   gif.setAttribute("id","id_gif_tendencia_"+consecutivoId)

   contenedorDivs.appendChild(contenedorGif);
   contenedorGif.appendChild(gif)
}

/* por alguna razon contador2 dentro y fuera de respuesta es diferente, pero srtContador no,
por eso el machetazo de pasarlo a string y luego a numero otra vez */

function insertarGifTendencia(){
    var url = api_trending+apiKey;
    var img_url =""
    var strContador = contador.toString()
    console.log(strContador)
    console.log(contador)
    respuestaServer(url,function(err,response){ 
        console.log(contador)
        console.log(strContador)
        var numContador = parseInt(strContador)
        img_url = (response.data[numContador].images.original.url)
        document.getElementById("id_gif_tendencia_"+strContador).src= img_url})
}

function divsBase(){
for (contador; contador<12;contador++){
    generarDivTendencias(contador);
    insertarGifTendencia();
}
}

divsBase();


