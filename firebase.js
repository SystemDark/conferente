import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
query,
orderBy,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";


const firebaseConfig = {

apiKey: "AIzaSyA67xXR7UMxE6nSOyzHcpt0u53VxBvJjeg",

authDomain: "sistema-patio.firebaseapp.com",

projectId: "sistema-patio",

storageBucket: "sistema-patio.firebasestorage.app",

messagingSenderId: "895256409752",

appId: "1:895256409752:web:321956190f04c7c843c2ed"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


window.login = async function(){

let email = document.getElementById("email").value;

let senha = document.getElementById("senha").value;

try{

await signInWithEmailAndPassword(auth,email,senha);

}catch(e){

alert("Erro no login");

}

}


onAuthStateChanged(auth,(user)=>{

if(user){

document.getElementById("loginCard").style.display="none";

document.getElementById("sistema").style.display="block";

iniciarPainel();

}

});


window.registrarContainer = async function(){

let numero = document.getElementById("numero").value.toUpperCase();

let tipo = document.getElementById("tipo").value;

let movimento = document.getElementById("movimento").value;

let empresa = document.getElementById("empresa").value;

let prazo = document.getElementById("prazo").value;

let localizacao = document.getElementById("localizacao").value;

await addDoc(collection(db,"containers"),{

numero,

tipo,

movimento,

empresa,

prazo,

localizacao,

data:serverTimestamp()

});

alert("Container registrado");

}


function iniciarPainel(){

const q = query(collection(db,"containers"),orderBy("numero"));

onSnapshot(q,(snapshot)=>{

let tabela = document.getElementById("tabela");

tabela.innerHTML="";

let total=0;

let deadline=0;

let demurrage=0;

snapshot.forEach((doc)=>{

let c = doc.data();

total++;

if(c.prazo==="Deadline") deadline++;

if(c.prazo==="Demurrage") demurrage++;

let classe="";

if(c.prazo==="Deadline") classe="deadline";

if(c.prazo==="Demurrage") classe="demurrage";

tabela.innerHTML+=`

<tr class="${classe}">

<td>${c.numero}</td>

<td>${c.tipo}</td>

<td>${c.movimento}</td>

<td>${c.empresa || "-"}</td>

<td>${c.localizacao}</td>

<td>${c.prazo || "-"}</td>

</tr>

`;

});

document.getElementById("total").innerText=total;

document.getElementById("deadline").innerText=deadline;

document.getElementById("demurrage").innerText=demurrage;

});

}
