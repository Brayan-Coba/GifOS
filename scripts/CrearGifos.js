const cStr_VIDEO = document.getElementById("id_video_gifos");
const cVidSTREAM = navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
        height:{max: 480}
    }
})
const cStr_API_KEY = "api_key=Nj0jjM3UQ44YeJHkvgWaTMW0iFJx4Q5c"
const cStr_API_UPLOAD = "https://upload.giphy.com/v1/gifs?"
const cStr_API_SHOW = "https://api.giphy.com/v1/gifs/"

var h = 0;
var m = 0;
var s = 0;
var ml = 0;
var recorder;
var capGif = document.getElementById("id_captar_gif")
var prevGif = document.getElementById("id_prev_gif")
var prevGifSubido = document.getElementById("id_prev_gif_subido")
var txtCargando = document.getElementById("id_cargando")
var divProgreso = document.getElementById("id_carga_barra_progreso")
var divProgesoSubir = document.getElementById("id_carga_barra_subir")
var txtEstadoCamara = document.getElementById("txt_estado_camara")
var contCronometro = document.getElementById("id_cronometro")
var contBarraProgreso = document.getElementById("id_cont_barra_progreso")
var btnCancelar = document.getElementById("id_btn_cancelar");
var form = new FormData()
var btnCopiarUrlif = document.getElementById("id_btn_copiar_url")
var btnDescargarGif = document.getElementById("id_btn_descargar_gif")
var idGif = ""
var cancelarSubida = false
var listoParaCopiar = false
var controller


function cambiarPaginaIndex(){
    window.location.assign("../index.html");
}

function ocultarCrearGifos(){
    document.getElementById("id_cont_crear_gifos").classList.add("suppress");
    document.getElementById("id_grabar_gifos").classList.remove("suppress");
    getStreamAndRecord();
}

function recargarPagina(){
    location.reload();
};


function getStreamAndRecord(callback){
    cVidSTREAM
    .then( function(stream){
        cStr_VIDEO.srcObject = stream;
        cStr_VIDEO.play();
        callback && callback(stream);
    });
};


function captureCamera(callback) {
    navigator.mediaDevices.getUserMedia({ 
        video: true 
    })
    .then(function(camera) {
        callback(camera);
    }).catch(function(error) {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(error);
})};

function startRecordingNow() {
    form = new FormData()
    captureCamera(function(camera) {
        recorder = RecordRTC(camera, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 480,
            hidden: 360,
            onGifRecordingStarted: function() {
            },
            onGifPreview: function(gifURL) {
                capGif.src = gifURL;
            }
        });
        recorder.startRecording();
        recorder.camera = camera;
    });
};

function stopRecordingCallback(){
    prevGif.src = URL.createObjectURL(recorder.getBlob());
    prevGifSubido.src = URL.createObjectURL(recorder.getBlob());
    descargaGif = URL.createObjectURL(recorder.getBlob());

    form.append("file",recorder.getBlob(),"gifGenerico.gif");
    recorder.camera.stop();
}

function stopRecordingNow() {
    this.disabled = true;
    recorder.camera.stop();
    recorder.stopRecording(stopRecordingCallback);
};

function modoGrabarVideo(){
    var elem = divProgreso;
    document.getElementById("id_btn_camara").classList.add("suppress")
    document.getElementById("id_btn_capturar").classList.add("suppress")
    document.getElementById("id_btn_recording").classList.remove("suppress")
    document.getElementById("id_btn_listo").classList.remove("suppress")
    contCronometro.classList.remove("suppress")
    contBarraProgreso.classList.remove("suppress")
    txtEstadoCamara.innerHTML = "Capturando tu Gifo"
    mostrarBarraProgreso()
    animarProgreso(elem);
    setTimeout(ocultarBarraProgreso,1000)
}


function iniciarCronometro(){
    contCronometro.innerHTML="00:00:00";
    id = setInterval(cronometrar,250);
}

function cronometrar(){
    var hAux, mAux, sAux;
    ml++;
    if (ml>3){s++;ml=0}
    if (s>59){m++;s=0;}
    if (m>59){h++;m=0;}
    if (h>23){h=0;}

    if (s<10){sAux="0"+s;}else{sAux=s;}
    if (m<10){mAux="0"+m;}else{mAux=m;}
    if (h<10){hAux="0"+h;}else{hAux=h;}

    contCronometro.innerHTML = hAux + ":" + mAux + ":" + sAux;
}

function esperaCronometro(){
    contCronometro.style.background = "#FFFFFF"
    iniciarCronometro()
    cStr_VIDEO.style.opacity = "100%"
    txtCargando.classList.add("suppress")
}

function duracionGif(){
    var duracion = h*36000+m*600+s*10+ml*2.5
    return duracion
}

function animarProgreso(elem){
    var barra = elem
    var width = 1;
    if( s == 0) {var tiempo = 10}
    else {var tiempo = duracionGif()}
    var id = setInterval(frame, tiempo);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
            barra.style.width = "1%"
        } 
        else {
            width++; 
        barra.style.width = width + "%"; 
        }
    }
}

function ocultarBarraProgreso(){
    document.getElementById("cuerpo_barra_progreso").classList.add("suppress")
    document.getElementById("id_btn_barra_progreso").classList.add("suppress")
}

function mostrarBarraProgreso(){
    document.getElementById("cuerpo_barra_progreso").classList.remove("suppress")
    document.getElementById("id_btn_barra_progreso").classList.remove("suppress")
}

function grabarVideo(){
    modoGrabarVideo();
    setTimeout(esperaCronometro,1000);
    cStr_VIDEO.style.opacity = "30%"
    txtCargando.classList.remove("suppress");
    startRecordingNow();
}

function modoGifGrabado(){
    document.getElementById("id_btn_recording").classList.add("suppress")
    document.getElementById("id_btn_listo").classList.add("suppress")
    document.getElementById("id_btn_repetir").classList.remove("suppress")
    document.getElementById("id_btn_subir").classList.remove("suppress")
    contBarraProgreso.style.marginRight = "12.2%"
    cStr_VIDEO.classList.add("suppress")
    prevGif.classList.remove("suppress")
    txtEstadoCamara.innerHTML = " Vista Previa"
    mostrarBarraProgreso()
    animarProgreso(divProgreso)
}

function pausarVideo(){
    clearInterval(id);
    modoGifGrabado();
    stopRecordingNow();
}

function reiniciarCronometro(){
    h = 0
    m = 0
    s = 0
    ml = 0
    contCronometro.innerHTML = "";
    contCronometro.style.background = "#FF0000"
}

function ocultarCronometro(){
    contCronometro.classList.add("suppress");
}

function modoRepitiendoVideo(){
    txtEstadoCamara.innerHTML = " Un Chequeo Antes de Empezar"
    document.getElementById("id_btn_repetir").classList.add("suppress");
    document.getElementById("id_btn_subir").classList.add("suppress");
    document.getElementById("id_btn_camara").classList.remove("suppress");
    document.getElementById("id_btn_capturar").classList.remove("suppress");
    cStr_VIDEO.classList.remove("suppress");
    prevGif.classList.add("suppress");
    contBarraProgreso.style.marginRight = "27%"
    contBarraProgreso.classList.add("suppress")
}


function modoSubiendoVideo(){
    var elem = divProgesoSubir
    txtEstadoCamara.innerHTML = "Subiendo Guifo"
    ocultarBarraProgreso();
    ocultarCronometro();
    btnCancelar.classList.remove("suppress")
    document.getElementById("id_btn_repetir").classList.add("suppress");
    document.getElementById("id_btn_subir").classList.add("suppress");
    document.getElementById("id_prev_gif").classList.add("suppress");
    document.getElementById("id_cont_subir_gifos").classList.remove("suppress");
    animarProgreso(elem);
}

function booPostearGif(){
    if (duracionGif()>15){var tiempo = duracionGif()}
    else {var tiempo = 15}

    if (cancelarSubida == true){
        repetirVideo()
        btnCancelar.classList.add("suppress")
        document.getElementById("id_cont_subir_gifos").classList.add("suppress");
    }
  
    if (cancelarSubida == false){
        postearGif()
        modoVideoSubido()
        btnDescargarGif.href  = descargaGif
    }
}

function subirVideo(){
    if (duracionGif()>15){var tiempo = duracionGif()}
    else {var tiempo = 15}
    modoSubiendoVideo()
    setTimeout(booPostearGif,tiempo*100)
    cancelarSubida = false
}

function modoVideoSubido(){
    document.getElementById("id_grabar_gifos").classList.add("suppress");
    document.getElementById("id_cont_crear_gifos").classList.remove("suppress");
    document.getElementById("id_txt_encabezado_crear_y_grabar_gif").innerHTML = "Guifo Subido Con Éxito"
    document.getElementById("id_cuerpo_crear_y_grabar_gifos").classList.add("suppress")
    document.getElementById("id_cuerpo_gifo_exitoso").classList.remove("suppress")
    document.getElementById("btn_cerrar").classList.remove("suppress")
}

function copiarEnPortapapeles(){
    if (listoParaCopiar == true){
        var elem2 = document.createElement("textarea");
        elem2.value = urlGif;
        document.body.appendChild(elem2);
        elem2.select();
        document.execCommand("copy");
        document.body.removeChild(elem2);
        document.getElementById("id_btn_copiar_url").innerHTML = "Enlace copiado!!!"
    }
    else{
        return
    }
}

function postearGif(callback){
    try{
     fetch(cStr_API_UPLOAD+cStr_API_KEY,{
        method: "POST",
        body: form,
    })
    .then(response =>{
        return response.json();
    })
    .then(response =>{
        idGif = response.data.id
        fetch(cStr_API_SHOW+idGif+"?&"+cStr_API_KEY)
            .then(response => {
                return response.json();
            })
            .then(gif =>{
                urlGif = ""
                contador = 0
                urlGif = gif.data.images.original.url
                localStorage.setItem(idGif,JSON.stringify(gif))
                document.getElementById("id_contenedor_mis_gifos").innerHTML = ""
                document.getElementById("id_btn_copiar_url").classList.remove("inactivo")
                listoParaCopiar = true
                cargarLocalStorge()
            })
    })
    }
    catch{
        //console.log("Algo salio mal al intentar subir el GIF")
    }
}

function cargarLocalStorge(){
    for ( i=0; i < localStorage.length; i++){
        key = localStorage.key(i)
        valor = localStorage.getItem(key)
        try{
            objGif = JSON.parse(valor)
            url = objGif.data.images.original.url
            //console.log("esta es la URL "+url)

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
            //console.log("no es un objeto")
        }

    }
}
cargarLocalStorge()

function repetirVideo(){
    reiniciarCronometro();
    ocultarCronometro();
    ocultarCrearGifos();
    modoRepitiendoVideo();
    form = ""
}

function cancelarVideo(){
    cancelarSubida = true
}
