

function navBarController()
{


    // bind event listeners to button clicks //
    var that = this;


/*Tip: When a text is hooked in a <span> element, you can style it with CSS, or manipulate it with JavaScript. De ahi q pongamos spam en elapsed time */


//variables
var video = $('video');
var canvas = document.createElement('canvas');//canvas invisible
var frames = [];
var startTime= null;
var endTime=null;
var rafId = null;
var blobURL;



//funcion para escribir por consola
function trace(text) {
	console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}
//funcion selectora de elementos
function $(selector) {
  return document.querySelector(selector) || null;
}

/*El método setTimeout() requiere dos argumentos. El primero es el código que se va a ejecutar o una referencia a la función que se debe ejecutar. El segundo argumento es el tiempo, en milisegundos, que se espera hasta que comienza la ejecución del código
	El simbolo _ referencia a que es un metodo customizado.*/
function turnOnCamera(boton){

	boton.target.disabled = true;
	$('#record-me').disabled = false;
	video.controls = false;

	var finishVideoSetup_ = function() {
    
	setTimeout(function() {
		video.width = 320;//video.clientWidth;
		video.height = 240;// video.clientHeight;
		canvas.width = video.width;
		canvas.height = video.height;
	}, 1000);
	};

 navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    
  navigator.getUserMedia({audio:true, video:true}, function(stream){
	/* el objeto window representa toda la ventana del navegador.
 Como todos los demás objetos heredan directa o indirectamente del objeto window,
no es necesario ponerlo puesto que va implicito. */
	video.src = window.URL.createObjectURL(stream);
	finishVideoSetup_();
},function(error) {
      trace("navigator.getUserMedia error: ", error);
    });

}

function cambiarRecordButton(){

	/* la almohadilla # se utiliza para hacer referencia al atributo id del html, o sea que #identificador hace referencia al elemento que tenga id="identificador" en el html. */
	var boton =$('#record-me');
	boton.textContent = boton.disabled ? 'Grabar' : 'Grabando..'; //clasico if else
	boton.classList.toggle('recording');//toggle the existence of a class in an element's list of classes in DOM(cambia la clase para poder por ejemplo definirle otro estilo)
	boton.disabled =!boton.disabled;
}

function record(){

var elapsedTime=$('elapsed-time'); //es una etiqueta span que nos permitira modificarlo con js
var ctx =canvas.getContext('2d'); //The getContext() method returns an object that provides methods and properties for drawing on the canvas
var CANVAS_HEIGHT = canvas.height;
var CANVAS_WIDTH = canvas.width;

frames=[]; //array de frames donde almacenaremos todos los frames de la captura
startTime = Date.now();

cambiarRecordButton();
$('#stop-me').disabled = false; 	

	function drawVideoFrame_(time){
		//deberia de usar el adapter.js en vez de este apaño(el adapter.js esta siempre actualizado, esto no.)
		 var requestAnimationFrame = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame; 
		
		//rafId =webkitRequestAnimationFrame(drawVideoFrame_);
		
		
		/*
		requestAnimationFrame informa al navegador que quieres realizar una animación y solicita que el navegador programe el repintado de la ventana para el próximo ciclo de animación.
		El método indicado como callback recibe un único argumento que indica el tiempo en el que está programado que se ejecute el ciclo de animación.
		*/
		rafId =requestAnimationFrame(drawVideoFrame_);
		ctx.drawImage(video,0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
		
		var contador = $('#counter');
		contador.textContent =  'Recording...' + Math.round((Date.now() - startTime) / 1000) + 's'; //cada ciclo de animacion se actualiza
		
		var url =canvas.toDataURL('image/webp',1);
		frames.push(url); //metemos el frame obtenido del canvas en el array de frames
		
	
	
	};
	
rafId = requestAnimationFrame(drawVideoFrame_);



}

function stop(){
	cancelAnimationFrame(rafId); //detiene el ciclo de animacion de requestAnimationFrame
	endTime= Date.now();
	$('#stop-me').disabled = true;
	
	var contador = $('#counter');
	contador.textContent ='0';
	cambiarRecordButton();
	
	trace('frames captured: ' + frames.length + ' => ' +
              ((endTime - startTime) / 1000) + 's video');
	
mostrarPrevisualizacion();
}

function mostrarPrevisualizacion(url_opt){

var url = url_opt || null;
var video = $('#video-preview video') || null;
var downloadLink = $('#video-preview a[download]') || null;

if (!video){
	//creamos el video para la previsualizacion
	video = document.createElement('video');
	video.autoplay = true;
	video.controls = true;
	video.loop = true;
	video.style.width = canvas.width + 'px';
   	video.style.height = canvas.height + 'px';
   	//introducimos dicho video como hijo en el DOM del div=video-preview
	$('#video-preview').appendChild(video);
	
	downloadLink = document.createElement('a');
	downloadLink.download = 'capture.webm';
	downloadLink.textContent = '[ download video ]';
    	downloadLink.title = 'Download your .webm video';
    	
    	//creamos un parrafo donde introducimos el enlace de descarga y lo agregamos al DOM(como hijo del div=video-preview)
    	var p = document.createElement('p');
    	p.appendChild(downloadLink);
    	$('#video-preview').appendChild(p);
    	
}else{

	/*
	The URL.revokeObjectURL() static method releases 
    an existing object URL which was previously created
     by calling window.URL.createObjectURL().  
    Call this method when you've finished using a object URL, 
    in order to let the browser know it doesn't need to keep the reference to the file any longer.
	*/
	window.URL.revokeObjectURL(video.src);
}

if (!url){
	var webmBlob = Whammy.fromImageArray(frames, 1000/ 60);
	trace('Se ha empleado Whammy.js para la codificacion');
	url = window.URL.createObjectURL(webmBlob);
    console.log("(!url)asignada la url: "+ url);
    console.log("(!url)asignada la webmBlob: "+ webmBlob);
}

video.src = url;
downloadLink.href = url;
//metemos el blob en un campo dentro del post del articulo
$('#videoBlob').value = url;
console.log("asignada la url: "+ url);


}


function initEvents() {
  $('#camera-me').addEventListener('click', turnOnCamera);
  $('#record-me').addEventListener('click', record);
  $('#stop-me').addEventListener('click', stop);
  $('#record-me').disabled=true;

trace("inicializacion(initEvents) completada");
}


//Aqui comienza el codigo principal del script
initEvents();


    

    
    
    
    }