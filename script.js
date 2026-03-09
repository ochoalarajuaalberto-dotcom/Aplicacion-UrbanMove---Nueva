var map;
// ===== CAMBIAR PANTALLAS =====

function mostrarRegistro(){
document.getElementById("inicio").style.display="none";
document.getElementById("registro").style.display="block";
}

function mostrarLogin(){

document.getElementById("inicio").style.display="none";
document.getElementById("registro").style.display="none";
document.getElementById("login").style.display="block";

}

function volverInicio(){

document.getElementById("app").style.display="none";
document.getElementById("login").style.display="none";
document.getElementById("registro").style.display="none";

document.getElementById("inicio").style.display="block";

}


// ===== REGISTRO =====

function registrarUsuario(){

var nombre=document.getElementById("nombre").value;
var email=document.getElementById("email").value;
var telefono=document.getElementById("telefono").value;
var password=document.getElementById("password").value;

// guardar usuario por email
var usuario = {
nombre:nombre,
email:email,
telefono:telefono,
password:password
};

localStorage.setItem(email, JSON.stringify(usuario));

alert("Registro exitoso");

mostrarLogin();

}

// ===== LOGIN =====

function login(){

var email=document.getElementById("loginEmail").value;
var pass=document.getElementById("loginPass").value;

var datosUsuario = JSON.parse(localStorage.getItem(email));

if(datosUsuario && datosUsuario.password===pass){

// guardar usuario activo
localStorage.setItem("nombre",datosUsuario.nombre);
localStorage.setItem("email",datosUsuario.email);
localStorage.setItem("telefono",datosUsuario.telefono);

document.getElementById("login").style.display="none";
document.getElementById("app").style.display="block";

iniciarMapa();

setTimeout(function(){
map.invalidateSize();
},500);

}else{

alert("Correo o contraseña incorrectos");

}

}

// ===== MAPA =====

function iniciarMapa(){

map = L.map('map').setView([21.019,-101.257],13);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{ maxZoom:19 }
).addTo(map);


/* ===== ICONO DE AUTOBUS ===== */

var busIcon = L.icon({
iconUrl:"https://cdn-icons-png.flaticon.com/512/61/61231.png",
iconSize:[40,40]
});


/* ===== PARADAS DE CAMION (MAS PARADAS) ===== */

var paradas = [

[21.019,-101.257], // centro
[21.021,-101.255],
[21.023,-101.253],
[21.025,-101.250],
[21.027,-101.247],
[21.029,-101.244],
[21.031,-101.242],
[21.033,-101.240]

];

paradas.forEach(function(p){

L.marker(p)
.addTo(map)
.bindPopup("🚏 Parada de Camión");

});


/* ===== RUTA 1 ===== */

var ruta1 = [

[21.019,-101.257],
[21.021,-101.255],
[21.023,-101.253],
[21.025,-101.250],
[21.027,-101.247]

];

var linea1 = L.polyline(ruta1,{
color:'cyan',
weight:5
}).addTo(map);


/* ===== RUTA 2 ===== */

var ruta2 = [

[21.023,-101.253],
[21.025,-101.250],
[21.027,-101.247],
[21.029,-101.244],
[21.031,-101.242],
[21.033,-101.240]

];

var linea2 = L.polyline(ruta2,{
color:'yellow',
weight:5
}).addTo(map);



/* ===== CREAR AUTOBUSES ===== */

var buses = [

{
ruta:ruta1,
marker:L.marker(ruta1[0],{icon:busIcon}).addTo(map),
index:0
},

{
ruta:ruta2,
marker:L.marker(ruta2[0],{icon:busIcon}).addTo(map),
index:0
}

];


/* ===== MOVER AUTOBUSES ===== */

function moverBuses(){

buses.forEach(function(bus){

bus.index++;

if(bus.index >= bus.ruta.length){

bus.index = 0;

}

bus.marker.setLatLng(bus.ruta[bus.index]);

var tiempo = (bus.ruta.length - bus.index) * 2;

bus.marker.bindPopup(
"🚌 Autobús en servicio<br>⏱ Próxima parada en: "
+ tiempo + " min"
);

});

}


setInterval(moverBuses,3000);

}

// ===== BUSCAR PARADAS =====

function buscarParadas(){

document.getElementById("mapaParadas").src=
"https://www.google.com/maps?q=paradas+de+camion+Guanajuato+Guanajuato&output=embed";

}

// ===== DESCARGAR PDF =====


function descargarCredencial(){

const { jsPDF } = window.jspdf;

var doc = new jsPDF();

// datos usuario
var nombre = localStorage.getItem("nombre") || "Usuario";
var email = localStorage.getItem("email") || "correo";
var telefono = localStorage.getItem("telefono") || "telefono";

// generar ID simple
var idUsuario = "URB-" + Math.floor(Math.random()*90000+10000);

// ===== TARJETA =====

// fondo azul
doc.setFillColor(10,60,120);
doc.rect(20,30,170,90,"F");

// borde
doc.setDrawColor(0,200,255);
doc.setLineWidth(2);
doc.rect(20,30,170,90);

// titulo
doc.setTextColor(255,255,255);
doc.setFontSize(20);
doc.text("URBANMOVE",80,45);

// subtitulo
doc.setFontSize(12);
doc.text("Credencial de Usuario",80,52);

// datos
doc.setFontSize(13);

doc.text("Nombre: "+nombre,30,70);
doc.text("Email: "+email,30,80);
doc.text("Telefono: "+telefono,30,90);

// ID
doc.setFontSize(12);
doc.text("ID Usuario: "+idUsuario,30,105);

// footer
doc.setFontSize(10);
doc.text("Sistema Inteligente de Movilidad Urbana",30,115);

// guardar
doc.save("credencial_urbanmove.pdf");

}


// ===== REPORTAR PROBLEMA =====

function enviarReporte(){

var tipo = document.getElementById("tipoProblema").value;
var ubicacion = document.getElementById("ubicacionProblema").value;
var comentario = document.getElementById("comentarioProblema").value;

var reportes = JSON.parse(localStorage.getItem("reportes")) || [];

var nuevoReporte = {

tipo: tipo,
ubicacion: ubicacion,
comentario: comentario,
fecha: new Date().toLocaleString()

};

reportes.push(nuevoReporte);

localStorage.setItem("reportes", JSON.stringify(reportes));

document.getElementById("mensajeReporte").innerHTML =
"✅ Reporte enviado al sistema UrbanMove";

document.getElementById("ubicacionProblema").value="";
document.getElementById("comentarioProblema").value="";

}
