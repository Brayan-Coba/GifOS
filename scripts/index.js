
function cambiarPaginaCrearGifos(){
    window.location.assign("./html/CrearGifos.html")
}

function obtenerInputBuscador(){
    return document.getElementById("input_buscador");
}


/*---------------------------------------------------------------------------------
Nombre:		    elegirTema
Descripcion:    Agrega o quita la clase show que muestra el elemnto en pantalla
Entrada:	    
                click
Salida:		    
                .show
----------------------------------------------------------------------------------*/
function elegirTema(){
    document.getElementById("dropdown-estilos").classList.toggle("show");
    document.getElementById("flecha_dropdown").classList.toggle("rotate");
    document.getElementById("flecha_forward").classList.toggle("rotate");
}


/* cambia el estilo a diurno  */
function clickEnEstiloDay(){
    document.getElementById("body").classList.remove("nigth");
    document.getElementById("flecha_dropdown").classList.toggle("rotate");
    localStorage.setItem("sailor-nigth","false");
}

/* cambia el estilo a nocturno */
function clickEnEstiloNigth(){
    document.getElementById("body").classList.add("nigth");
    document.getElementById("flecha_forward").classList.toggle("rotate")
    localStorage.setItem("sailor-nigth","true");
}

if (localStorage.getItem("sailor-nigth") == "true"){
    document.getElementById("body").classList.add("nigth");
    document.getElementById("flecha_forward").classList.remove("rotate");
}
else{
    document.getElementById("body").classList.remove("nigth");
    document.getElementById("flecha_dropdown").classList.add("rotate");
}

function modoMisGifos(){
    document.getElementById("id_buscar").classList.add("suppress")
    document.getElementById("sect_sugerencias_hoy").classList.add("suppress")
    document.getElementById("sect_tendencias").classList.add("suppress")
    document.getElementById("sect_resutaldos_busqueda").classList.add("suppress")
    document.getElementById("sect_mis_gifos").classList.remove("suppress")
    document.getElementById("id_mis_gifos").style.color = "#C2B5CB"
}

obtenerInputBuscador().addEventListener("input", activacionBusqueda);


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
    var strInputBuscador = obtenerInputBuscador().value;

    if (fBoTextoVacio(strInputBuscador)) {
        document.getElementById("busqueda").classList.add("inactivo")
        document.getElementById("txt_buscar_id").classList.add("inactivo")
        document.getElementById("img_lupa_buscar_day").src="./assets/lupa_inactive.svg"
        document.getElementById("img_lupa_buscar_nigth").src="./assets/Combined_Shape.svg"

}
    else {
        document.getElementById("busqueda").classList.remove("inactivo")
        document.getElementById("txt_buscar_id").classList.remove("inactivo")
        document.getElementById("img_lupa_buscar_day").src="./assets/lupa.svg"
        document.getElementById("img_lupa_buscar_nigth").src="./assets/lupa_light.svg"
        }
}

/* La funcion de abajo es para que busque con el enter */
obtenerInputBuscador().addEventListener("keydown", function(event) {
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


const cStr_API_BUSQUEDA = "https://api.giphy.com/v1/gifs/search?"
const cStr_API_SUGERENCIA = "https://api.giphy.com/v1/tags/related/"
const cStr_API_TRENDING = "https://api.giphy.com/v1/gifs/trending?"
const cStr_API_RANDOM = "https://api.giphy.com/v1/gifs/random?"
const cStr_API_KEY = "api_key=Nj0jjM3UQ44YeJHkvgWaTMW0iFJx4Q5c"
const cNum_CANT_GIF_TENDENCIA = 12
const cStr_LIMITE_BUSQUEDA = "&limit=12"

var arrHistorial = []
var limiteArrHistorial = 10


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

function contarDivBusqueda(err,response,count){
    //obtiene el contenedor que va a tener los divs de resultados de busqueda
    var contenedorDivs = document.getElementById("id_contenedor_resutaldos_busqueda");
    contenedorDivs.innerHTML = ""
    var contador  = 0
    for (contador; contador<count;contador++){
        img_url = (response.data[contador].images.original.url)
        pintarDivBusqueda(contenedorDivs,img_url,contador,)
    }
}

function pintarDivBusqueda(contenedorDivs,img_url,contador,){
    //genera el div que va a contener el historial
    var contenedorDivBusqueda = document.createElement("div");
    var Gif = document.createElement("img");
    var idDivBusqueda = "id_div_busqueda_"+contador;
    var idGifBusqueda = "id_gif_busqueda_"+contador;

    contenedorDivBusqueda.setAttribute("class","div_busqueda");
    contenedorDivBusqueda.setAttribute("id",idDivBusqueda);
    Gif.setAttribute("class","gif_busqueda")
    Gif.setAttribute("id",idGifBusqueda)

    contenedorDivs.appendChild(contenedorDivBusqueda);
    contenedorDivBusqueda.appendChild(Gif);

    document.getElementById(idGifBusqueda).src = img_url;
    };

function generarDivBusqueda(err,response){
    
    var count = (response.pagination.count)
    if (count == 0){
        img_url = "https://media2.giphy.com/media/9J7tdYltWyXIY/giphy.gif";
        var contenedorDivs = document.getElementById("id_contenedor_resutaldos_busqueda");
        contenedorDivs.innerHTML = ""
        var contador = 0;
        pintarDivBusqueda(contenedorDivs,img_url,contador);
    }

    else {
        contarDivBusqueda(err,response,count);
    }
    
}

function ocultarELemento(id){
    document.getElementById(id).classList.add("suppress");
}

function mostrarELemento(id){
    document.getElementById(id).classList.remove("suppress");
}

function generarHistorial(keyword){   
    guardarHistorial(keyword);
    pintarDivHistorial();
}

function guardarHistorial(tagBusqueda){
    arrHistorial.unshift(tagBusqueda);
    
    if (arrHistorial.length>limiteArrHistorial){
        arrHistorial.pop();
    }
}


function pintarDivHistorial(){
    //obtiene el contenedor que va a tener los divs del historial
    var contenedorDivs = document.getElementById("id_cont_historial_busquedas");
    contenedorDivs.innerHTML = ""

    arrHistorial.forEach( function (element,index) {
        //genera el div que va a contener el historial
        var contenedorHistorial = document.createElement("div");
        var idDivHistorial = "id_div_historial_"+index

        contenedorHistorial.setAttribute("class","div_historial");
        contenedorHistorial.setAttribute("id",idDivHistorial);
        contenedorHistorial.innerHTML = "#"+element;
        contenedorHistorial.addEventListener("click",function () {
            obtenerInputBuscador().value = element;
            clickEnBusqueda();
            activacionBusqueda();
            // arrHistorial.splice(arrHistorial.indexOf(element), 1)
        });
        contenedorHistorial.addEventListener
    
        contenedorDivs.appendChild(contenedorHistorial);
    });
}

function modoResultadosBusqueda(){
    var keyword = obtenerInputBuscador().value;
    ocultarELemento("sect_sugerencias_hoy");
    ocultarELemento("sect_tendencias");
    mostrarELemento("sect_resutaldos_busqueda");
    document.getElementById("txt_resultados_bsuqueda").classList.add("subtitulo")
    document.getElementById("txt_resultados_bsuqueda").innerHTML = keyword+" (Resultados)";
    generarHistorial(keyword);
}

var offsetAPedir = 0

function validarBusquedaIgualAnterior(){
    if (arrHistorial.length>0){
    return arrHistorial[0] == obtenerInputBuscador().value;
    }
}


function clickEnBusqueda(){
    var keyword = obtenerInputBuscador().value;

    if (fBoTextoVacio(keyword)){
        return
    }

    else if (validarBusquedaIgualAnterior() == true){
        offsetAPedir = offsetAPedir + 12
        var url = cStr_API_BUSQUEDA+cStr_API_KEY+cStr_LIMITE_BUSQUEDA+"&offset="+offsetAPedir+"&q="+keyword;
        var img_url ="" 
    }

    else{
        var url = cStr_API_BUSQUEDA+cStr_API_KEY+cStr_LIMITE_BUSQUEDA+"&q="+keyword;
        var img_url =""
        offsetAPedir = 0
    }

    respuestaServer(url,generarDivBusqueda);
    modoResultadosBusqueda();

}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

obtenerInputBuscador().addEventListener("input", sugerenciaBusqueda);

function sugerenciaBusqueda(){ 
    var keyword = obtenerInputBuscador().value;
    if (fBoTextoVacio(keyword)){
        document.getElementById("sugerencia_span_1").innerHTML = ""
        document.getElementById("sugerencia_span_2").innerHTML = ""
        document.getElementById("sugerencia_span_3").innerHTML = ""
        document.getElementById("div_cuerpo_opciones").classList.remove("show")
        return
    }
    document.getElementById("div_cuerpo_opciones").classList.add("show")
    var url = cStr_API_SUGERENCIA+keyword+"?"+cStr_API_KEY;

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
    obtenerInputBuscador().value = keyword
    clickEnBusqueda();
    sugerenciaBusqueda();
}

function cerrarGif(e){
    var strId = e.target.id.replace("cerrar","contenedor")
    document.getElementById(strId).classList.add("suppress")
}

function btnVerMas(e){
    var strId = e.target.id
    var url = cStr_API_BUSQUEDA+cStr_API_KEY+"&q="+strId;
    var img_url =""
    respuestaServer(url,function(err,response){
        var count = (response.pagination.count)
        var indice = getRandomInt(0,count);
            img_url = (response.data[indice].images.original.url)
            document.getElementById(strId+"_gif").src= img_url
        })
}


function generarTituloGif(titulo,consecutivoId){
    var tituloGif = document.createElement("div")
    tituloGif.innerText = titulo
    // el return se lo devulve a generarDivTendencia
    tituloGif.setAttribute("class","titulo_gif")
    tituloGif.setAttribute("id","id_titulo_tendencia_"+consecutivoId)
    return tituloGif
}


function existeClaseEnElemento(clase,elemento){
    var boolExiste;
    boolExiste = Array.from(elemento.classList).some(cl=> cl == clase);
    return boolExiste;
}

function verTituloGif(e){
    var hijosDivGif = e.target.parentElement.childNodes
    var titulo= Array.from(hijosDivGif).find( function(elem, index){ 
        return existeClaseEnElemento("titulo_gif",elem)
    })

    if (titulo && !existeClaseEnElemento("show",titulo)){
        titulo.classList.add("show")
    }
}

function quitarTituloGif(e){
    var hijosDivGif = e.target.parentElement.childNodes
    var titulo= Array.from(hijosDivGif).find( function(elem) {
        return existeClaseEnElemento("titulo_gif",elem)
    })
    
    if (titulo && existeClaseEnElemento("show",titulo)){
        titulo.classList.remove("show")
    }
}

function generarDivTendencia(url,consecutivoId,titulo){
    //obtiene el contenedor que va a tener los divs de los gifs
    var contenedorDivs = document.getElementById("id_contenedor_tendencias");
    //genera el div que va a contener el gif
    var contenedorGif = document.createElement("div");
    //genera el img que contiene el gif
    var gif = document.createElement("img");
    
    var tituloGif = generarTituloGif(titulo,consecutivoId);
    var idDivGif = "id_div_tendencia_"+consecutivoId
    var idGif = "id_gif_tendencia_"+consecutivoId

    contenedorGif.setAttribute("class","div_gif_tendencia");
    contenedorGif.setAttribute("id",idDivGif);
    contenedorGif.addEventListener("mouseover",verTituloGif);
    contenedorGif.addEventListener("mouseout",quitarTituloGif);
    gif.setAttribute("class","gif_tendencia");
    gif.setAttribute("id",idGif);
    

    contenedorDivs.appendChild(contenedorGif);
    contenedorGif.appendChild(gif);
    contenedorGif.appendChild(tituloGif);

    document.getElementById(idGif).src = url;
}

/*---------------------------------------------------------------------------------
Nombre:		    procesarTendencias
Descripcion:    toma la respuesta del servidor y anaiza si hay error, si es correcta
                recorre la respuesta y manda a crear la vista para los gif obtenidos
----------------------------------------------------------------------------------*/

function procesarTendencias(err,response){

    if (err){
        alert("error, estado de la respuesta "+err)
        return
    }
    var titulo_url =""
    var img_url =""
    var contador  = 0
    for (contador; contador<cNum_CANT_GIF_TENDENCIA;contador++){
        img_url = (response.data[contador].images.original.url)
        titulo_url = (response.data[contador].title)
        generarDivTendencia(img_url,contador,titulo_url)
    }
}

/*---------------------------------------------------------------------------------
Nombre:		    crearGifTendencia
Descripcion:    Arma la URL solicita respuesta a servidor y la manda a procesar
----------------------------------------------------------------------------------*/

function crearGifTendencia(){
    var url = cStr_API_TRENDING+cStr_API_KEY;
    //obtiene la data de las tendencias del servidor
    respuestaServer(url,procesarTendencias)
}


crearGifTendencia();

function cargarLocalStorge(){
    for ( i=0; i < localStorage.length; i++){
        key = localStorage.key(i)
        valor = localStorage.getItem(key)
        try{
            objGif = JSON.parse(valor)
            url = objGif.data.images.original.url
            // console.log("esta es la URL "+url+typeof(objGif))

            var contGifLocal = document.getElementById("id_contenedor_mis_gifos")
            var divGifLocal = document.createElement("div")
            var gifLocal = document.createElement("img")
            var idDivGifLocal = "id_div_gif_local_"+i
            var idGifLocal = "id_gif_local_"+i

            divGifLocal.setAttribute("class","div_gif_local")
            divGifLocal.setAttribute("id",idDivGifLocal)
            gifLocal.setAttribute("class","gif_local")
            gifLocal.setAttribute("id",idGifLocal)

            contGifLocal.appendChild(divGifLocal)
            divGifLocal.appendChild(gifLocal)

            document.getElementById(idGifLocal).src = url}
        catch{
            // console.log("no es un objeto")
        }

    }
}
cargarLocalStorge();