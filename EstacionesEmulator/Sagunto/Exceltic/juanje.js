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

document.getElementById('mostrarAgujas').addEventListener('click', function(){

    const botonesAG = document.querySelectorAll('.agujas-button');
    const bloquesAG = document.querySelectorAll('.submenuAG');

    if (this.style.backgroundColor === 'white') {
        this.style.backgroundColor = 'orange';
        
        botonesAG.forEach(botonAG => {
        botonAG.style.display = 'block';
        });

    } else {
        this.style.backgroundColor = 'white';
        botonesAG.forEach(botonAG => {
        botonAG.style.display = 'none';
        });

        bloquesAG.forEach(menuAG => {
        menuAG.style.display = 'none';
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
            let message_CV = `YardObjectEvent|${buttonId}@SG|yard_control^cv_oc_${anchoVar}`
            ws.send(message_CV);
        } else {
            if (dobleOC === 'simple') {
                this.style.backgroundColor = 'yellow';
                let message_CV = `YardObjectEvent|${buttonId}@SG|yard_control^cv_libre`
                ws.send(message_CV);
            } else {
                if(this.style.backgroundColor === 'red') {
                    this.style.backgroundColor = 'darkred';
                    let message_CV = `YardObjectEvent|${buttonId}@SG|yard_control^cv_oc_${ContrarioAnchoVar}`
                    ws.send(message_CV);
                } else {
                    let message_CV = `YardObjectEvent|${buttonId}@SG|yard_control^cv_libre`
                    ws.send(message_CV);
                    this.style.backgroundColor = 'yellow';
                }
            }
            // this.style.backgroundColor = 'yellow';
            // let message_CV = `YardObjectEvent|${buttonId}@SG|yard_control^cv_libre`
            // ws.send(message_CV);
        }
    });
}

function trackStatus(buttonId) {
    let button = document.getElementById(buttonId);
    button.addEventListener('click', function() {
        this.focused = false;
        if (this.style.backgroundColor === 'yellow') {
            this.style.backgroundColor = 'red';
            let message_TR = `YardObjectEvent|${buttonId}@SG|status^TRACK_STATUS|Cvia_Ocupado (1)`
            ws.send(message_TR);
        } else {
            this.style.backgroundColor = 'yellow';
            let message_TR = `YardObjectEvent|${buttonId}@SG|status^TRACK_STATUS|Cvia_Libre (0)`
            ws.send(message_TR);
        }
    });
}
 
// Llamar a la función para cada botón
handleButtonClick('CV1');
handleButtonClick('CV2');
handleButtonClick('CV3');
handleButtonClick('CV3A');
handleButtonClick('CV3B');
handleButtonClick('CV4');
trackStatus('CV7');
trackStatus('CV5');
handleButtonClick('CV6');
handleButtonClick('CV6A');
handleButtonClick('CV6B');
handleButtonClick('CV8');
handleButtonClick('CV10');
// El 12 no lo incluimos porque no se puede interactuar con él

handleButtonClick('CVAP4');
handleButtonClick('CVS3P');
handleButtonClick('CVAE6P');
handleButtonClick('CVAS1P');

handleButtonClick('CVE14');
trackStatus('CVE4M');
trackStatus('CVA12');
trackStatus('CVE2M');
handleButtonClick('CVS1_14');

handleButtonClick('CVAE2');
handleButtonClick('CVAE4');
handleButtonClick('CVE_2');
handleButtonClick('CV368');
handleButtonClick('CV389');

handleButtonClick('CVA26');
handleButtonClick('CVA50');
handleButtonClick('CVS1_6A');

handleButtonClick('CVA3');
handleButtonClick('CVA5');
handleButtonClick('CVA2');
handleButtonClick('CVE4');
handleButtonClick('CVS1_1A');
handleButtonClick('CV1A');
handleButtonClick('CVE8');
handleButtonClick('CVAR1');
handleButtonClick('CVE1');
handleButtonClick('CVE_1');
handleButtonClick('CVAM3');

handleButtonClick('CVA24');
handleButtonClick('CVP6');
handleButtonClick('CVAR4P');
handleButtonClick('CVA8');
handleButtonClick('CVAR2P');
handleButtonClick('CVA20B');
handleButtonClick('CVA17');
handleButtonClick('CVE_3');
handleButtonClick('CVE3');
handleButtonClick('CVAR3');
handleButtonClick('CVE6');
handleButtonClick('CV2A');
handleButtonClick('CVS1_2A');
handleButtonClick('CVE2');
handleButtonClick('CVA14');
handleButtonClick('CVA20A');
handleButtonClick('CVA4');
handleButtonClick('CVA7');
handleButtonClick('CVA1');
handleButtonClick('CVA16');
trackStatus('CVS1_11');
trackStatus('CVS2_11');
trackStatus('CVA34');
trackStatus('CVA46');
trackStatus('CVS2_9');
trackStatus('CVE5');
handleButtonClick('CVE_5');
trackStatus('CVE7');
handleButtonClick('CVA58');
handleButtonClick('CVA36');

function fundirAspecto(aspectoID) {
    let aspecto = document.getElementById(aspectoID);
    let nombreSenal = aspectoID.replace(/^[^_]*_/, "");
    let message_aspecto = "";
    aspecto.addEventListener('click', function() {
        switch (this.style.backgroundColor) {
            case "limegreen":
                this.style.backgroundColor = 'darkgreen';
                message_aspecto = `YardObjectEvent|${nombreSenal}@SG|yard_control^fundir_verde`
                ws.send(message_aspecto);
                break;
            case "yellow":
                this.style.backgroundColor = 'darkgoldenrod';
                message_aspecto = `YardObjectEvent|${nombreSenal}@SG|yard_control^fundir_amarillo`
                ws.send(message_aspecto);
                break;
            case "red":
                this.style.backgroundColor = 'darkred';
                message_aspecto = `YardObjectEvent|${nombreSenal}@SG|yard_control^fundir_rojo`
                ws.send(message_aspecto);
                break;
            case "white":
                switch(true) {
                    case aspectoID.startsWith("BH"):
                    this.style.backgroundColor = 'grey';
                    message_aspecto = `YardObjectEvent|${nombreSenal}@SG|yard_control^fundir_blanco`
                    ws.send(message_aspecto);
                    break;
                    case aspectoID.startsWith("BC"):
                    this.style.backgroundColor = 'grey';
                    message_aspecto = `YardObjectEvent|${nombreSenal}@SG|yard_control^fundir_blanco2`
                    ws.send(message_aspecto);
                    break;
                    case aspectoID.startsWith("BV"):
                    this.style.backgroundColor = 'grey';
                    message_aspecto = `YardObjectEvent|${nombreSenal}@SG|yard_control^fundir_blanco3`
                    ws.send(message_aspecto);
                    break;
                }
            break;
            case "darkgreen":
                this.style.backgroundColor = 'limegreen';
                message_aspecto = `YardObjectEvent|${nombreSenal}@SG|yard_control^reponer_verde`
                ws.send(message_aspecto);
                break;
            case "darkgoldenrod":
                this.style.backgroundColor = 'yellow';
                message_aspecto = `YardObjectEvent|${nombreSenal}@SG|yard_control^reponer_amarillo`
                ws.send(message_aspecto);
                break;
            case "darkred":
                this.style.backgroundColor = 'red';
                message_aspecto = `YardObjectEvent|${nombreSenal}@SG|yard_control^reponer_rojo`
                ws.send(message_aspecto);
                break;
            case "grey":
                switch(true) {
                    case aspectoID.startsWith("BH"):
                    this.style.backgroundColor = 'white';
                    message_aspecto = `YardObjectEvent|${nombreSenal}@SG|yard_control^reponer_blanco`
                    ws.send(message_aspecto);
                    break;
                    case aspectoID.startsWith("BC"):
                    this.style.backgroundColor = 'white';
                    message_aspecto = `YardObjectEvent|${nombreSenal}@SG|yard_control^reponer_blanco2`
                    ws.send(message_aspecto);
                    break;
                    case aspectoID.startsWith("BV"):
                    this.style.backgroundColor = 'white';
                    message_aspecto = `YardObjectEvent|${nombreSenal}@SG|yard_control^reponer_blanco3`
                    ws.send(message_aspecto);
                    break;
                }
                break;
        }
    });
}

function comprobarAguja(accionAG) {
    let accionAguja = document.getElementById(accionAG);
    let nombreAguja = accionAG.replace(/^[^_]*_/, "");
    let message_accion = "";
    let mensajeStatus = "";

    accionAguja.addEventListener('click', function() {
        switch(true) {
            case accionAG.startsWith("Normal"):
                message_accion = `YardObjectEvent|${nombreAguja}@SG|status^POINT|comprobacion_a_mas (14)`
                ws.send(message_accion);
                setTimeout(function() {
                    mensajeStatus = `YardObjectEvent|${nombreAguja}@SG|status_locked|unset`
                    ws.send(mensajeStatus);
                    }, 1000);
                break;
            case accionAG.startsWith("Invertido"):
                message_accion = `YardObjectEvent|${nombreAguja}@SG|status^POINT|comprobacion_a_menos (13)`
                ws.send(message_accion);
                setTimeout(function() {
                    mensajeStatus = `YardObjectEvent|${nombreAguja}@SG|status_locked|unset`
                    ws.send(mensajeStatus);
                    }, 1000);
                break;  
            case accionAG.startsWith("Descomprobar"):
                message_accion = `YardObjectEvent|${nombreAguja}@SG|status^POINT|fuera_de_control (15)`
                ws.send(message_accion);
                setTimeout(function() {
                    mensajeStatus = `YardObjectEvent|${nombreAguja}@SG|status_locked|set`
                    ws.send(mensajeStatus);
                    }, 1000);
                break;
            }
        });
    }



    const arrayAspectos = [
        "V_S2_1", "A_S2_1", "R_S2_1", "BC_S2_1", "BH_S2_1", "BV_S2_1",
        "V_S2_2", "A_S2_2", "R_S2_2", "BC_S2_2", "BH_S2_2", "BV_S2_2",
        "V_S2_4", "A_S2_4", "R_S2_4", "BC_S2_4", "BH_S2_4", "BV_S2_4",
        "V_S2_6", "A_S2_6", "R_S2_6", "BC_S2_6", "BH_S2_6", "BV_S2_6",
        "V_S2_8", "A_S2_8", "R_S2_8", "BC_S2_8", "BH_S2_8", "BV_S2_8",
        "V_S2_10", "A_S2_10", "R_S2_10", "BC_S2_10", "BH_S2_10", "BV_S2_10",
        "V_S2_12", "A_S2_12", "R_S2_12", "BC_S2_12", "BH_S2_12", "BV_S2_12",
        "V_S2_3", "A_S2_3", "R_S2_3", "BC_S2_3", "BH_S2_3", "BV_S2_3",

        "V_S1_1", "A_S1_1", "R_S1_1", "BC_S1_1", "BH_S1_1", "BV_S1_1",
        "V_S1_2", "A_S1_2", "R_S1_2", "BC_S1_2", "BH_S1_2", "BV_S1_2",
        "V_S1_4", "A_S1_4", "R_S1_4", "BC_S1_4", "BH_S1_4", "BV_S1_4",
        "V_S1_6", "A_S1_6", "R_S1_6", "BC_S1_6", "BH_S1_6", "BV_S1_6",
        "V_S1_8", "A_S1_8", "R_S1_8", "BC_S1_8", "BH_S1_8", "BV_S1_8",
        "V_S1_10", "A_S1_10", "R_S1_10", "BC_S1_10", "BH_S1_10", "BV_S1_10",
        "V_S1_12", "A_S1_12", "R_S1_12", "BC_S1_12", "BH_S1_12", "BV_S1_12",
        "V_S1_3", "A_S1_3", "R_S1_3", "BC_S1_3", "BH_S1_3", "BV_S1_3",
        "V_S1_5", "A_S1_5", "R_S1_5", "BC_S1_5", "BH_S1_5", "BV_S1_5",
        "V_S1_7", "A_S1_7", "R_S1_7", "BC_S1_7", "BH_S1_7", "BV_S1_7",

        "V_S2_3A", "A_S2_3A", "R_S2_3A", "BC_S2_3A", "BH_S2_3A", "BV_S2_3A",
        "V_S2_3B", "A_S2_3B", "R_S2_3B", "BC_S2_3B", "BH_S2_3B", "BV_S2_3B",
        "V_S1_3A", "A_S1_3A", "R_S1_3A", "BC_S1_3A", "BH_S1_3A", "BV_S1_3A",
        "V_S1_3B", "A_S1_3B", "R_S1_3B", "BC_S1_3B", "BH_S1_3B", "BV_S1_3B",

        "R_M5", "BC_M5", "BH_M5", "BV_M5",
        "R_M3", "BC_M3", "BH_M3", "BV_M3",
        "R_R3", "BC_R3", "BH_R3", "BV_R3",
        "R_R1", "BC_R1", "BH_R1", "BV_R1",

        "V_E3", "A_E3", "R_E3", "BC_E3", "BH_E3", "BV_E3",
        "V_E1", "A_E1", "R_E1", "BC_E1", "BH_E1", "BV_E1",
        "V_E_3", "A_E_3", "R_E_3",
        "V_E_1", "A_E_1", "R_E_1",
        "V_368", "A_368", "R_368", "BC_368", "BH_368", "BV_368",
        "V_370", "A_370", "R_370", "BC_370", "BH_370", "BV_370",

        "V_S2_6A", "A_S2_6A", "R_S2_6A", "BC_S2_6A", "BH_S2_6A", "BV_S2_6A",
        "V_S2_6B", "A_S2_6B", "R_S2_6B", "BC_S2_6B", "BH_S2_6B", "BV_S2_6B",
        "V_S1_6A", "A_S1_6A", "R_S1_6A", "BC_S1_6A", "BH_S1_6A", "BV_S1_6A",
        "V_S1_6B", "A_S1_6B", "R_S1_6B", "BC_S1_6B", "BH_S1_6B", "BV_S1_6B",

        "V_S2_11", "A_S2_11", "R_S2_11", "BC_S2_11", "BH_S2_11", "BV_S2_11",
        "V_S1_11", "A_S1_11", "R_S1_11", "BC_S1_11", "BH_S1_11", "BV_S1_11",
        "V_S2_9", "A_S2_9", "R_S2_9", "BC_S2_9", "BH_S2_9", "BV_S2_9",
        "V_E7", "A_E7", "R_E7", "BC_E7", "BH_E7", "BV_E7",
        "V_E5", "A_E5", "R_E5", "BC_E5", "BH_E5", "BV_E5",
        "V_E_5", "A_E_5", "R_E_5",
        "V_2686", "A_2686", "R_2686", "BC_2686", "BH_2686", "BV_2686",
        "V_2654", "A_2654", "R_2654", "BC_2654", "BH_2654", "BV_2654",

        "R_R6", "BC_R6", "BH_R6", "BV_R6",
        "R_R8", "BC_R8", "BH_R8", "BV_R8",
        "V_E6", "A_E6", "R_E6", "BC_E6", "BH_E6", "BV_E6",
        "V_E8", "A_E8", "R_E8", "BC_E8", "BH_E8", "BV_E8",
        "V_S1_1A", "A_S1_1A", "R_S1_1A", "BC_S1_1A", "BH_S1_1A", "BV_S1_1A",
        "V_S1_2A", "A_S1_2A", "R_S1_2A", "BC_S1_2A", "BH_S1_2A", "BV_S1_2A",

        "R_R4", "BC_R4", "BH_R4", "BV_R4",
        "R_R2", "BC_R2", "BH_R2", "BV_R2",
        "R_E4", "BC_E4", "BH_E4", "BV_E4",
        "R_E2", "BC_E2", "BH_E2", "BV_E2",
        "R_E_4", "A_E_4", "R_E_4",
        "R_E_2", "A_E_2", "R_E_2",
        "R_303", "A_303", "R_303", "BC_303", "BH_303", "BV_303",
        "R_305", "A_305", "R_305", "BC_305", "BH_305", "BV_305",

        "V_E14", "A_E14", "R_E14", "BC_E14", "BH_E14", "BV_E14",
        "V_E4M", "A_E4M", "R_E4M", "BC_E4M", "BH_E4M", "BV_E4M",
        "V_E2M", "A_E2M", "R_E2M", "BC_E2M", "BH_E2M", "BV_E2M",
        "V_S1_14", "A_S1_14", "R_S1_14", "BC_S1_14", "BH_S1_14", "BV_S1_14",
        "R_R4M", "BC_R4M", "BH_R4M", "BV_R4M",
        "V_SP", "A_SP", "R_SP", "BC_SP", "BH_SP", "BV_SP",
        "R_R10", "BC_R10", "BH_R10", "BV_R10",
        "R_R2M", "BC_R2M", "BH_R2M", "BV_R2M",

        "V_S2P", "A_S2P", "R_S2P", "BC_S2P", "BH_S2P", "BV_S2P",
        "V_S3P", "A_S3P", "R_S3P", "BC_S3P", "BH_S3P", "BV_S3P",
        "V_S1P", "A_S1P", "R_S1P", "BC_S1P", "BH_S1P", "BV_S1P",
        "V_S5P", "A_S5P", "R_S5P", "BC_S5P", "BH_S5P", "BV_S5P",
        "R_R2P", "BC_R2P", "BH_R2P", "BV_R2P",
        "R_R4P", "BC_R4P", "BH_R4P", "BV_R4P"
    ]

    arrayAspectos.forEach(idAspecto => {
        fundirAspecto(idAspecto);
    });

    const opcionesAgujas = [
        "Normal_A1", "Invertido_A1", "Descomprobar_A1",
        "Normal_A3", "Invertido_A3", "Descomprobar_A3",
        "Normal_A7", "Invertido_A7", "Descomprobar_A7",
        "Normal_A5", "Invertido_A5", "Descomprobar_A5",
        "Normal_A11", "Invertido_A11", "Descomprobar_A11",
        "Normal_A9", "Invertido_A9", "Descomprobar_A9",
        "Normal_A13", "Invertido_A13", "Descomprobar_A13",
        "Normal_A17", "Invertido_A17", "Descomprobar_A17",
        "Normal_A19", "Invertido_A19", "Descomprobar_A19",
        "Normal_C3", "Invertido_C3", "Descomprobar_C3",
        "Normal_A40", "Invertido_A40", "Descomprobar_A40",
        "Normal_A50", "Invertido_A50", "Descomprobar_A50",
        "Normal_A54", "Invertido_A54", "Descomprobar_A54",
        "Normal_A48", "Invertido_A48", "Descomprobar_A48",
        "Normal_A52", "Invertido_A52", "Descomprobar_A52",
        "Normal_A58", "Invertido_A58", "Descomprobar_A58",
        "Normal_A36", "Invertido_A36", "Descomprobar_A36",
        "Normal_A46", "Invertido_A46", "Descomprobar_A46",
        "Normal_A34", "Invertido_A34", "Descomprobar_A34",
        "Normal_A14", "Invertido_A14", "Descomprobar_A14",
        "Normal_A18", "Invertido_A18", "Descomprobar_A18",
        "Normal_A22", "Invertido_A22", "Descomprobar_A22",
        "Normal_A16", "Invertido_A16", "Descomprobar_A16",
        "Normal_P10", "Invertido_P10", "Descomprobar_P10",
        "Normal_A20A", "Invertido_A20A", "Descomprobar_A20A",
        "Normal_A20B", "Invertido_A20B", "Descomprobar_A20B",
        "Normal_A10", "Invertido_A10", "Descomprobar_A10",
        "Normal_P8", "Invertido_P8", "Descomprobar_P8",
        "Normal_P6", "Invertido_P6", "Descomprobar_P6",
        "Normal_A24", "Invertido_A24", "Descomprobar_A24",
        "Normal_A12", "Invertido_A12", "Descomprobar_A12",
        "Normal_A26", "Invertido_A26", "Descomprobar_A26",
        "Normal_A30", "Invertido_A30", "Descomprobar_A30",
        "Normal_A28", "Invertido_A28", "Descomprobar_A28",
        "Normal_C28", "Invertido_C28", "Descomprobar_C28",
        "Normal_A2", "Invertido_A2", "Descomprobar_A2",
        "Normal_A4", "Invertido_A4", "Descomprobar_A4",
        "Normal_A6", "Invertido_A6", "Descomprobar_A6",
        "Normal_A8", "Invertido_A8", "Descomprobar_A8",
        "Normal_P2", "Invertido_P2", "Descomprobar_P2",
        "Normal_P4", "Invertido_P4", "Descomprobar_P4"
    ];

    opcionesAgujas.forEach(opcAguja => {
        comprobarAguja(opcAguja);
    });

    // Función para manejar el clic en las agujas

// document.getElementById("senalS2_1").addEventListener("click", function() {
//     desplegarMenu("submenuS2_1");
// })
// document.getElementById("senalS1_1").addEventListener("click", function() {
//     desplegarMenu("submenuS1_1");
// })

    const arraySenales = [
        "S2_1", "S2_2", "S2_4", "S2_6", "S2_8", "S2_10", "S2_12", "S2_3", 
        "S1_1", "S1_2", "S1_4", "S1_6", "S1_8", "S1_10", "S1_12", "S1_3", "S1_5", "S1_7", 
        "S2_3A", "S2_3B", "S1_3A", "S1_3B", 
        "M5", "M3", "R3", "R1", 
        "E3", "E1", "E_3", "E_1", "368", "370",
        "S2_6A", "S2_6B", "S1_6A", "S1_6B",
        "S2_11", "S1_11", "S2_9", "E7", "E5", "E_5", "2686", "2654",
        "R6", "R8", "E6", "E8", "S1_1A", "S1_2A", 
        "R4", "R2", "E4", "E2", "E_4", "E_2", "303", "305",
        "E14", "E4M", "E2M", "S1_14", "R4M", "SP", "R10", "R2M",
        "S2P", "S3P", "S1P", "S5P", "R2P", "R4P"
    ];

    arraySenales.forEach(id => {
        document.getElementById(`senal${id}`).addEventListener("click", function() {
        desplegarMenu(`submenu${id}`);
        });
    });

    const arrayAgujas  = ["A1", "A3",
         "A7", "A5", "A11", "A9", "A13", 
         "A17", "A19", "C3", "A40", "A50", "A54",
         "A48", "A52", "A58", "A36", "A46",
         "A34", "A14", "A18", "A22", "A16", "P10",
         "A20A", "A20B", "A10", "P8", "P6", 
         "A24", "A12", "A26", "A30", "A28", "C28",
         "A2", "A4", "A6", "A8", "P2", "P4"
         ]

    arrayAgujas.forEach(id => {
        document.getElementById(`aguja${id}`).addEventListener("click", function() {
        desplegarMenu(`submenuAG_${id}`);
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


