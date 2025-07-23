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
let ContrarioAnchoVar = "U"
let dobleOC = "simple"

let via = document.getElementById('via')
let eje = document.getElementById('eje')

document.getElementById('TipoAncho').addEventListener('click', function() {
    if (this.style.backgroundColor === 'white') {
        this.style.backgroundColor = 'orange';
        this.innerText = "Ancho UIC";
        this.style.transform = 'translateX(-37px)';
        anchoVar = "U"
        ContrarioAnchoVar = "I"
    } else {
        this.style.backgroundColor = 'white';
        this.innerText = "Ancho Común";
        this.style.transform =  'translateX(0px)';
        anchoVar = "I"
        ContrarioAnchoVar = "U"
    }
});

document.getElementById('dobleOcupacion').addEventListener('click', function() {
    if (this.style.backgroundColor === 'white') {
        this.style.backgroundColor = 'orange';
        this.innerText = "Ocupación doble";
        dobleOC = "doble"
    } else {
        this.style.backgroundColor = 'white';
        this.innerText = "Ocupación simple";
        dobleOC = "simple"
    }
});

document.getElementById('mostrarSenales').addEventListener('click', function(){

    const botones = document.querySelectorAll('.senales-button');
    const bloques = document.querySelectorAll('.submenu');

    if (this.style.backgroundColor === 'white') {
        this.style.backgroundColor = 'orange';
        
        botones.forEach(boton => {
        boton.style.display = 'inline';
        });

    } else {
        this.style.backgroundColor = 'white';
        botones.forEach(boton => {
        boton.style.display = 'none';
        });

        bloques.forEach(menu => {
        menu.style.display = 'none';
        });
    }
})


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
            let message_CV = `YardObjectEvent|${buttonId}@AE|yard_control^cv_oc_${anchoVar}`
            ws.send(message_CV);
        } else {
            if (dobleOC === 'simple') {
                this.style.backgroundColor = 'yellow';
                let message_CV = `YardObjectEvent|${buttonId}@AE|yard_control^cv_libre`
                ws.send(message_CV);
            } else {
                if(this.style.backgroundColor === 'red') {
                    this.style.backgroundColor = 'darkred';
                    let message_CV = `YardObjectEvent|${buttonId}@AE|yard_control^cv_oc_${ContrarioAnchoVar}`
                    ws.send(message_CV);
                } else {
                    let message_CV = `YardObjectEvent|${buttonId}@AE|yard_control^cv_libre`
                    ws.send(message_CV);
                    this.style.backgroundColor = 'yellow';
                }
            }
            // this.style.backgroundColor = 'yellow';
            // let message_CV = `YardObjectEvent|${buttonId}@AE|yard_control^cv_libre`
            // ws.send(message_CV);
        }
    });
}
 
// Llamar a la función para cada botón
handleButtonClick('CV6');

handleButtonClick('CVAM1');
handleButtonClick('CV4');
handleButtonClick('CVAM2');

handleButtonClick('CVA9');
handleButtonClick('CVA10');

handleButtonClick('CVA3');
handleButtonClick('CVA4');

handleButtonClick('CV454');
handleButtonClick('CVE_3');
handleButtonClick('CVE3');
handleButtonClick('CV2');
handleButtonClick('CVE2');
handleButtonClick('CVE_2');
handleButtonClick('CV368');

handleButtonClick('CVA1');
handleButtonClick('CVA2');

handleButtonClick('CV473');
handleButtonClick('CVE_1');
handleButtonClick('CVE1');
handleButtonClick('CV1');
handleButtonClick('CVE4');
handleButtonClick('CVE_4');
handleButtonClick('CV389');

handleButtonClick('CVA14');

handleButtonClick('CV3');
handleButtonClick('CVAM4');

function fundirAspecto(aspectoID) {
    let aspecto = document.getElementById(aspectoID);
    let nombreSenal = aspectoID.replace(/^[^_]*_/, "");
    let message_aspecto = "";
    console.log("aspecto", aspecto, "aspectoID", aspectoID);
    aspecto.addEventListener('click', function() {
        switch (this.style.backgroundColor) {
            case "limegreen":
                this.style.backgroundColor = 'darkgreen';
                message_aspecto = `YardObjectEvent|${nombreSenal}@AE|yard_control^fundir_verde`
                ws.send(message_aspecto);
                break;
            case "yellow":
                this.style.backgroundColor = 'darkgoldenrod';
                message_aspecto = `YardObjectEvent|${nombreSenal}@AE|yard_control^fundir_amarillo`
                ws.send(message_aspecto);
                break;
            case "red":
                this.style.backgroundColor = 'darkred';
                message_aspecto = `YardObjectEvent|${nombreSenal}@AE|yard_control^fundir_rojo`
                ws.send(message_aspecto);
                break;
            case "white":
                switch(true) {
                    case aspectoID.startsWith("BH"):
                    this.style.backgroundColor = 'grey';
                    message_aspecto = `YardObjectEvent|${nombreSenal}@AE|yard_control^fundir_blanco`
                    ws.send(message_aspecto);
                    break;
                    case aspectoID.startsWith("BC"):
                    this.style.backgroundColor = 'grey';
                    message_aspecto = `YardObjectEvent|${nombreSenal}@AE|yard_control^fundir_blanco2`
                    ws.send(message_aspecto);
                    break;
                    case aspectoID.startsWith("BV"):
                    this.style.backgroundColor = 'grey';
                    message_aspecto = `YardObjectEvent|${nombreSenal}@AE|yard_control^fundir_blanco3`
                    ws.send(message_aspecto);
                    break;
                }
            break;
            case "darkgreen":
                this.style.backgroundColor = 'limegreen';
                message_aspecto = `YardObjectEvent|${nombreSenal}@AE|yard_control^reponer_verde`
                ws.send(message_aspecto);
                break;
            case "darkgoldenrod":
                this.style.backgroundColor = 'yellow';
                message_aspecto = `YardObjectEvent|${nombreSenal}@AE|yard_control^reponer_amarillo`
                ws.send(message_aspecto);
                break;
            case "darkred":
                this.style.backgroundColor = 'red';
                message_aspecto = `YardObjectEvent|${nombreSenal}@AE|yard_control^reponer_rojo`
                ws.send(message_aspecto);
                break;
            case "grey":
                switch(true) {
                    case aspectoID.startsWith("BH"):
                    this.style.backgroundColor = 'white';
                    message_aspecto = `YardObjectEvent|${nombreSenal}@AE|yard_control^reponer_blanco`
                    ws.send(message_aspecto);
                    break;
                    case aspectoID.startsWith("BC"):
                    this.style.backgroundColor = 'white';
                    message_aspecto = `YardObjectEvent|${nombreSenal}@AE|yard_control^reponer_blanco2`
                    ws.send(message_aspecto);
                    break;
                    case aspectoID.startsWith("BV"):
                    this.style.backgroundColor = 'white';
                    message_aspecto = `YardObjectEvent|${nombreSenal}@AE|yard_control^reponer_blanco3`
                    ws.send(message_aspecto);
                    break;
                }
                break;
        }
    });
}

    const arrayAspectos = [
        "V_S2_2", "A_S2_2", "R_S2_2", "BC_S2_2", "BH_S2_2", "BV_S2_2",
        "V_S2_1", "A_S2_1", "R_S2_1", "BC_S2_1", "BH_S2_1", "BV_S2_1",
        "V_S1_1", "A_S1_1", "R_S1_1", "BC_S1_1", "BH_S1_1", "BV_S1_1",
        "V_S1_2", "A_S1_2", "R_S1_2", "BC_S1_2", "BH_S1_2", "BV_S1_2",
        "V_S1_3", "A_S1_3", "R_S1_3", "BC_S1_3", "BH_S1_3", "BV_S1_3",
        "V_S1_4", "A_S1_4", "R_S1_4", "BC_S1_4", "BH_S1_4", "BV_S1_4",
        "V_S1_6", "A_S1_6", "R_S1_6", "BC_S1_6", "BH_S1_6", "BV_S1_6",
        "V_S2_3", "A_S2_3", "R_S2_3", "BC_S2_3", "BH_S2_3", "BV_S2_3",
        "V_S2_4", "A_S2_4", "R_S2_4", "BC_S2_4", "BH_S2_4", "BV_S2_4",
        "R_M2", "BC_M2", "BH_M2", "BV_M2",
        "R_R2", "BC_R2", "BH_R2", "BV_R2",
        "R_R4", "BC_R4", "BH_R4", "BV_R4",
        "R_M4", "BC_M4", "BH_M4", "BV_M4",
        "R_M1", "BC_M1", "BH_M1", "BV_M1",
        "R_R1", "BC_R1", "BH_R1", "BV_R1",
        "R_R3", "BC_R3", "BH_R3", "BV_R3",
        "V_E2", "A_E2", "R_E2", "BC_E2", "BH_E2", "BV_E2",
        "V_E4", "A_E4", "R_E4", "BC_E4", "BH_E4", "BV_E4",
        "V_E_2", "A_E_2", "R_E_2", "BC_E_2", "BH_E_2", "BV_E_2",
        "V_E_4", "A_E_4", "R_E_4", "BC_E_4", "BH_E_4", "BV_E_4",
        "V_E1", "A_E1", "R_E1", "BC_E1", "BH_E1", "BV_E1",
        "V_E3", "A_E3", "R_E3", "BC_E3", "BH_E3", "BV_E3",
        "V_E_1", "A_E_1", "R_E_1", "BC_E_1", "BH_E_1", "BV_E_1",
        "V_E_3", "A_E_3", "R_E_3", "BC_E_3", "BH_E_3", "BV_E_3"
    ]

    arrayAspectos.forEach(idAspecto => {
        fundirAspecto(idAspecto);
    });


// document.getElementById("senalS2_1").addEventListener("click", function() {
//     desplegarMenu("submenuS2_1");
// })
// document.getElementById("senalS1_1").addEventListener("click", function() {
//     desplegarMenu("submenuS1_1");
// })

    const arraySenales = [
        "S1_1", "S1_2", "S1_3", "S1_4", "S1_6",
        "S2_1", "S2_2", "S2_3", "S2_4",
        "M2", "R2", "R4", "M4", "M1", "R1", "R3",
        "E2", "E4", "E_2", "E_4", "E_3", "E_1", "E3", "E1"
    ];

    arraySenales.forEach(id => {
        document.getElementById(`senal${id}`).addEventListener("click", function() {
        desplegarMenu(`submenu${id}`);
        });
    });

})

function desplegarMenu(submenuId) {
    const submenu = document.getElementById(submenuId);
    if (submenu.style.display === "none" || submenu.style.display === "") {
        submenu.style.display = "grid"; 
    } else {
        submenu.style.display = "none";
    }
}


// ARROW FUNCTION FUNCIONA        
// document.getElementById("button1").addEventListener("click", () => {
//         let messageB1 = "YardObjectEvent|CV1@AE|yard_control^cv_oc_I"
//       ws.send(messageB1);
//     });

// document.getElementById("closeButton").addEventListener("click", () => {
//   ws.close();
// });
            

// Añade más eventos según sea necesario


