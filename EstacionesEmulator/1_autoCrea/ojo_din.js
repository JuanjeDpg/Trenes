/* Version dinamica del SIMBOOL simplificado para EBI LOCK
*  La descripcion de la estacion se hace a traves de un JSON
*  Queda por incluir -> Track_status (CV's de un solo ancho) y agujas
 */

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

// Variables de ancho de via
let anchoVar = "I";
let ContrarioAnchoVar = "U";
let dobleOC = "simple";

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('CV_din');
  const tipoAnchoBtn = document.getElementById('TipoAncho');
  const dobleBtn = document.getElementById('dobleOcupacion');

  // Boton de ancho simple
  tipoAnchoBtn.addEventListener('click', () => {
    if (anchoVar === "I") {
      anchoVar = "U"; ContrarioAnchoVar = "I";
      tipoAnchoBtn.innerText = "Ancho UIC";
      tipoAnchoBtn.style.backgroundColor = "orange";
    } else {
      anchoVar = "I"; ContrarioAnchoVar = "U";
      tipoAnchoBtn.innerText = "Ancho Común";
      tipoAnchoBtn.style.backgroundColor = "white";
    }
  });

  // Boton de doble ancho
  dobleBtn.addEventListener('click', () => {
    if (dobleOC === "simple") {
      dobleOC = "doble";
      dobleBtn.innerText = "Ocupación doble";
      dobleBtn.style.backgroundColor = "orange";
    } else {
      dobleOC = "simple";
      dobleBtn.innerText = "Ocupación simple";
      dobleBtn.style.backgroundColor = "white";
    }
  });

  // Cargamos el JSON de configuracion de estacion
  const resp = await fetch('./config.json');
  const config = await resp.json();

  // Configura parametros basicos de la estacion
  // No hay manejo de error, lo que hace que si no hay elemento
  // "estacion", explota
  const estacionItem = config.find(i => i.type === "estacion");
  const estacion = estacionItem.id;
  document.getElementById('StationName').innerText = estacionItem.label || estacion;

  // Busca ahora objetos "cv" y hace la logica de ocupacion simple o doble
  config.filter(i => i.type === "cv").forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'details-button';
    btn.id = item.id;
    btn.innerText = item.label;
    btn.style = item.style || '';
    btn.onclick = () => {
      const bg = btn.style.backgroundColor;
      if (bg === 'yellow') {
        btn.style.backgroundColor = 'red';
        ws.send(`YardObjectEvent|${item.id}@${estacion}|yard_control^cv_oc_${anchoVar}`);
      } else {
        if (dobleOC === 'simple') {
          btn.style.backgroundColor = 'yellow';
          ws.send(`YardObjectEvent|${item.id}@${estacion}|yard_control^cv_libre`);
        } else {
          if (bg === 'red') {
            btn.style.backgroundColor = 'darkred';
            ws.send(`YardObjectEvent|${item.id}@${estacion}|yard_control^cv_oc_${ContrarioAnchoVar}`);
          } else {
            btn.style.backgroundColor = 'yellow';
            ws.send(`YardObjectEvent|${item.id}@${estacion}|yard_control^cv_libre`);
          }
        }
      }
    };
    container.appendChild(btn);
  });


  container.style.position = 'relative';    // Obtiene las coordenadas de la señal desde el JSON
  // Busca ahora objetos "signal" y gestiona la logica de fusion de señal
  // Tambien implementa apartado display
  config.filter(i => i.type === "signal").forEach(item => {
  const cont = document.createElement('div');
  cont.className = 'signal-container';
  const topMatch = item.style.match(/top:\s*([^;]+)/);
  const leftMatch = item.style.match(/left:\s*([^;]+)/);

  cont.style.position = 'absolute';
  cont.style.top = topMatch ? topMatch[1].trim() : '0px';
  cont.style.left = leftMatch ? leftMatch[1].trim() : '0px';

  // Definimos un tamaño fijo, ignoramos el del JSON (solo cogemos coordenadas absolutas)
  cont.style.width = '50px';
  cont.style.height = '30px';
  cont.style.textAlign = 'center';

  // Creamos cada señal encontrada en la pagina
  const btn = document.createElement('div');
  btn.className = 'signal-button';
  btn.innerText = item.label || item.id;
  btn.style = `
    background-color: white;
    color: black;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  btn.onclick = () => {
    const submenuId = `submenu${item.id}`;
    const target = document.getElementById(submenuId);
    if (!target) return;

    // Toggle de display del submenu de señal
    // Esto es para que cierre el submenu en caso de click sobre submenu abierto
    if (target.style.display === 'grid') {
      target.style.display = 'none';
    } else {
      // Cierra el resto de submenus de señal abiertos
      config.filter(i => i.type === "signal").forEach(i => {
        const sm = document.getElementById(`submenu${i.id}`);
        if (sm) sm.style.display = 'none';
      });
      // Abre el submenu seleccionado
      target.style.display = 'grid';
    }
  };

  cont.appendChild(btn);

  // Interfaz del submenu de señal
  const submenu = document.createElement('div');
  submenu.id = `submenu${item.id}`;
  submenu.style = `
    display: none;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 10px;
    background: #333;
    padding: 10px;
    border-radius: 5px;
  `;

  // Definicion de todos los aspectos
  // No distinguimos por señal, de forma que se incluyen todos los aspectos posibles
  // Algunos no tienen funcionalidad para señales donde ese aspecto no existe, pero aumenta simplicidad
  const aspectos = ['R','A','V','BH','BC','BV'];
  const colores = {
    R: 'red',
    A: 'yellow',
    V: 'limegreen',
    BH: 'white',
    BC: 'white',
    BV: 'white'
  };

  // Nombres de los aspectos de las señales
  const nombres = {
    R: 'Rojo',
    A: 'Amarillo',
    V: 'Verde',
    BH: 'Blanco H',
    BC: 'Blanco C',
    BV: 'Blanco V'
  };

  aspectos.forEach(pref => {
    const wrapper = document.createElement('div');
    wrapper.style = 'text-align: center;';

    const label = document.createElement('div');
    label.innerText = nombres[pref];
    label.style = 'font-size: 12px; color: white; margin-bottom: 2px;';
    wrapper.appendChild(label);

    const asp = document.createElement('div');
    asp.id = `${pref}_${item.id}`;
    asp.className = 'aspecto-senal';
    asp.style = `
      width: 20px;
      height: 20px;
      margin: 0 auto;
      border-radius: 50%;
      background-color: ${colores[pref]};
      cursor: pointer;
    `;
    fundirAspecto(asp);   // Callback de logica de fusion de señal
    wrapper.appendChild(asp);
    submenu.appendChild(wrapper);
  });

  cont.appendChild(submenu);
  container.appendChild(cont);
});


  function fundirAspecto(signal) {
    signal.addEventListener('click', () => {
    const id = signal.id; // Aspecto señal + ID de señal (R_S1_2)
    const [pref, ...rest] = id.split('_');  // Separa el array en strings individuales (EJ: "R" "S1" "2")
    const nombre = rest.join('_'); // Une SOLO el ID de la señal (con "_") para recuperarlo (S1_2)
                                  // Tambien obtenemos el aspecto, util para el caso blanco
      let msg = ``;   // Se hace la definicion explicita en cada accion
      switch (signal.style.backgroundColor) {
        case 'limegreen': signal.style.backgroundColor = 'darkgreen'; msg = `YardObjectEvent|${nombre}@${estacion}|yard_control^fundir_verde`; break;
        case 'yellow': signal.style.backgroundColor = 'darkgoldenrod'; msg = `YardObjectEvent|${nombre}@${estacion}|yard_control^fundir_amarillo`; break;
        case 'red': signal.style.backgroundColor = 'darkred'; msg = `YardObjectEvent|${nombre}@${estacion}|yard_control^fundir_rojo`; break;
        case 'white':
          if (pref === 'BV') msg = `YardObjectEvent|${nombre}@${estacion}|yard_control^fundir_blanco3`;
          else if (pref === 'BH') msg = `YardObjectEvent|${nombre}@${estacion}|yard_control^fundir_blanco`;
          else if (pref === 'BC') msg = `YardObjectEvent|${nombre}@${estacion}|yard_control^fundir_blanco2`;
          signal.style.backgroundColor = 'grey';
          break;
        case 'darkgreen': signal.style.backgroundColor = 'limegreen'; msg = `YardObjectEvent|${nombre}@${estacion}|yard_control^reponer_verde`; break;
        case 'darkgoldenrod': signal.style.backgroundColor = 'yellow'; msg = `YardObjectEvent|${nombre}@${estacion}|yard_control^reponer_amarillo`; break;
        case 'darkred': signal.style.backgroundColor = 'red'; msg = `YardObjectEvent|${nombre}@${estacion}|yard_control^reponer_rojo`; break;
        case 'grey':
          signal.style.backgroundColor = 'white';
          if (pref === 'BV') msg = `YardObjectEvent|${nombre}@${estacion}|yard_control^reponer_blanco3`;
          else if (pref === 'BH') msg = `YardObjectEvent|${nombre}@${estacion}|yard_control^reponer_blanco`;
          else if (pref === 'BC') msg = `YardObjectEvent|${nombre}@${estacion}|yard_control^reponer_blanco2`;
          break;
      }
      ws.send(msg);
    });
  }

  // Submenu de fusion
  window.desplegarMenu = submenuId => {
    config.filter(i => i.type === "signal").forEach(i => {
      const sm = document.getElementById(`submenu${i.id}`);
      if (sm) sm.style.display = 'none';
    });
    const target = document.getElementById(submenuId);
    if (target) target.style.display = 'grid';
  };
});


