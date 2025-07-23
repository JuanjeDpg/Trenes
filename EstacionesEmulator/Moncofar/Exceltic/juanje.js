// ##########################################################################
// SIMULAMOS LAS OCUPACIONES DE LA VÍA DE FORMA SIMPLIFICADA
// ##########################################################################


// Creamos el webSocket para comunicarnos con el server que hace la ocupación

class SimpleWebSocket {
    constructor(url) {
        this.ws = new WebSocket(url);
        this.ws.onopen = () => console.log("Connected");
        this.ws.onmessage = (e) => console.log("Message received:", e.data);
        this.ws.onclose = () => console.log("Disconnected");
    }
    
      send(message) {
        this.ws.send(message);
      }

      close() {
            this.ws.close();
        }
}
        
const ws = new SimpleWebSocket("ws://localhost:5256"); // ws://localhost:5256
        
// // PARA MANDAR COMANDOS QUE COJAS DE OTRO BOTÓN
// document.getElementById("sendButton").addEventListener("click", () => {
//   const message = document.getElementById("messageInput").value;
//   ws.send(message);
// });

let anchoVar = "I"

let via = document.getElementById('via')
let eje = document.getElementById('eje')

document.getElementById('TipoAncho').addEventListener('click', function() {
    if (this.style.backgroundColor === 'white') {
        this.style.backgroundColor = 'orange';
        this.innerText = "Ancho UIC";
        this.style.transform = 'translateX(-37px)';
        anchoVar = "U"
    } else {
        this.style.backgroundColor = 'white';
        this.innerText = "Ancho Común";
        this.style.transform =  'translateX(0px)';
        anchoVar = "I"
    }
});

// document.getElementById('CV1').addEventListener('click', function() {
//     this.focused = false;
//     // Alternar el color del botón y su comportamiento en base a este
//     // Si el botón está en amarillo, se ocupa
//     if (this.style.backgroundColor === 'yellow') {
//         this.style.backgroundColor = 'red';
//         let message_CV = "YardObjectEvent|CV1@AE|yard_control^cv_oc_I"
//         ws.send(message_CV);
//     // Si el botón está en rojo, se desocupa
//     } else {
//         this.style.backgroundColor = 'yellow';
//         let message_CV = "YardObjectEvent|CV1@AE|yard_control^cv_libre"
//         ws.send(message_CV);
//     }
// });

// document.getElementById('CV2').addEventListener('click', function() {
//     this.focused = false;
//     // Alternar el color del botón y comportarse según este
//     if (this.style.backgroundColor === 'yellow') {
//         this.style.backgroundColor = 'red';
//         let message_CV = "YardObjectEvent|CV2@AE|yard_control^cv_oc_I"
//         ws.send(message_CV);
//     } else {
//         this.style.backgroundColor = 'yellow';
//         let message_CV = "YardObjectEvent|CV2@AE|yard_control^cv_libre"
//         ws.send(message_CV);
//     }
// });


document.addEventListener('DOMContentLoaded', function() {

function handleButtonClick(buttonId) {
    let button = document.getElementById(buttonId);
    button.addEventListener('click', function() {
        this.focused = false;
        if (this.style.backgroundColor === 'yellow') {
            this.style.backgroundColor = 'red';
            let message_CV = `YardObjectEvent|${buttonId}@MF|yard_control^cv_oc_${anchoVar}`
            ws.send(message_CV);
        } else {
            this.style.backgroundColor = 'yellow';
            let message_CV = `YardObjectEvent|${buttonId}@MF|yard_control^cv_libre`
            ws.send(message_CV);
        }
    });
}
 
// Llamar a la función para cada botón
handleButtonClick('CV3');

handleButtonClick('CV491');
handleButtonClick('CVE_4');
handleButtonClick('CVE4');
handleButtonClick('CV1');
handleButtonClick('CVE1');
handleButtonClick('CVE_1');
handleButtonClick('CV577');

handleButtonClick('CVA1');
handleButtonClick('CVA2');

handleButtonClick('CV474');
handleButtonClick('CVE_2');
handleButtonClick('CVE2');
handleButtonClick('CV2');
handleButtonClick('CVE3');
handleButtonClick('CVE_3');
handleButtonClick('CV554');

handleButtonClick('CVA3');
handleButtonClick('CVA4');

handleButtonClick('CVAM2');
handleButtonClick('CV4');
handleButtonClick('CVAM1');

handleButtonClick('CVA7');
handleButtonClick('CVA10');

handleButtonClick('CV6');

handleButtonClick('CVA13');
handleButtonClick('CVA16');
handleButtonClick('CVA18');
});

// ARROW FUNCTION FUNCIONA        
// document.getElementById("button1").addEventListener("click", () => {
//         let messageB1 = "YardObjectEvent|CV1@AE|yard_control^cv_oc_I"
//       ws.send(messageB1);
//     });

// document.getElementById("closeButton").addEventListener("click", () => {
//   ws.close();
// });
            

// Añade más eventos según sea necesario


