import subprocess
import pyautogui
import cv2
import numpy as np
import time
import json
import socket
# import unittest

# Para leer los elementos del json y sus propiedades
with open('elementos.json', 'r') as f:
    elementos = json.load(f)

# ================================================================
# AÑADIR ESPERAS AQUÍ
# ================================================================


# REALIZAR TESTS
## Evitar esta estructura en el test general
def realizaTests(listaDeAgujas, nombreDelTest):
    print(f'\nEmpezando {nombreDelTest} ===============================================\n')
    for aguja in listaDeAgujas:
        test = f'python3 {nombreDelTest} {aguja} "HacerResumen"'
        resultado = subprocess.run(test, shell=True, capture_output=True, text=True)
        print(f'Ejecución de ', test, '======================\n', resultado.stdout, resultado.stderr)
        # Guardar el resultado de los test en un array para hacer un resumen al final TODO 
    return f'Test {nombreDelTest} realizado en las agujas {listaDeAgujas} \n\n'


# SIMPLIFICAR LA COMPROBACION DE ESCENARIOS
## También para evitar repetir esta estructura en el test general
def comprobarEscenario(condiciones, aguja, escenario):
    if all(condiciones):
        print("-------------------------")
        print(f'{escenario} en {aguja} OK')
        print("-------------------------")
        print(" ")

        resultado = True
    else:
        print("-------------------------")
        print(f'{escenario} en {aguja} KO - ERROR - Necesita revisión')
        print("-------------------------")
        print(" ")
        resultado = False
    return resultado

# DICCIONARIO DE COLORES (EN GRIS)
colores = {
    "negro": 0,
    "azul": 29,
    "amarillo": 226,
    "rosa": 173,
    "rojo": 76,
    "blanco": 255,
    "verde": 113
}


# DICCIONARIO DE BOTONES EN MENU DE AGUJA
## Posición Y respecto a la parte superior del botón AYUDA
botonesMenuAguja = {
    "MAG": 10,
    "AN":10,
    "AI":30,
    "BA": 30,
    "ABA": 55,
    "BIA": 75,
    "DIA": 100,
    "MAE": 120,
    "ANE":120,
    "AIE":150
}


# DICIONARIO DE BOTONES EN MENU DE SEÑAL ENTRADA
botonesMenuSenalE = {
    "I": 10,
    "R": 40,
    "DAI": 60,
    "BS": 80,
    "ABS": 100,
    "CS": 130
}


# DICIONARIO DE BOTONES EN MENU DE SEÑAL SALIDA
botonesMenuSenalS = {
    "I": 32,
    "M": 65,
    "DAI": 95,
    "DEI": 130,
    "BS": 160,
    "ABS": 190,
    "CS": 225,
    "BDE": 255,
    "ABDE": 285,
    "AYUDA": 320
}


# PULSAR BOTONES GENERALES
def pulsar(botonGeneral):
    x = elementos["BotonesGenerales"][botonGeneral]["posicionX"]
    y = elementos["BotonesGenerales"][botonGeneral]["posicionY"]

    pyautogui.moveTo(x, y)
    pyautogui.click()
    print(f' - Pulsado mando {botonGeneral} [{x} {y}]')
    time.sleep(1)


# COMPROBAR POSICIÓN AGUJA
def posicionAguja(aguja):
    
    x = elementos["Agujas"][aguja]["posicionX"]
    y = elementos["Agujas"][aguja]["posicionY"]

    print(f'- La aguja está en la posición  x:{x} y:{y}')
    pixel = pyautogui.screenshot(region=(x, y, 1, 1))
    pixel_np = np.array(pixel)
    pixel_cv = cv2.cvtColor(pixel_np, cv2.COLOR_RGB2BGR)
    color = cv2.cvtColor(pixel_cv, cv2.COLOR_BGR2GRAY)
    
    explicacion = "=============================================================================================\
\n- Puede que la posicón de la aguja no sea correcta \
o que la aguja esté enclavada o parpadeando. "
    solucion = "\n- Si la aguja está normalizada, revisa la posición \
introducida en ./elementos.json \n- Puedes usar ./helpers/posicion.py\
\n============================================================================================="

    comparaColores = color == colores.get("blanco")
    
    assert comparaColores, f'EL COLOR NO ES EL ESPERADO\n{explicacion} {solucion}'
    if comparaColores:
        return True
    else:
        return False


# DESPLEGAR MENU CON BOTON CENTRAL
def desplegarMenu(aguja):

    x = elementos["Agujas"][aguja]["posicionX"]
    y = elementos["Agujas"][aguja]["posicionY"]
    
    pyautogui.moveTo(x, y)
    pyautogui.click(button='middle')
    print(" - Desplegando menú (con botón central) [", x, y, "]")
    time.sleep(2)


# COMPROBAR MENU CONTRA IMAGEN
def comprobarMenu(estado):
    # Dependiendo del estado debe de haber diferentes imágenes con los que compararlo
    if estado == 'AGnormal':
        menu = pyautogui.locateOnScreen('imagenes/menu_normal.png')
        print(" - El menú se encuentra desplegado (Normal)")
        
    elif estado == 'AGocupado':
        menu = pyautogui.locateOnScreen('imagenes/menu_ocupado.png')
        print(" - El menú se encuentra desplegado (Ocupado)")
        
    elif estado == 'AGayuda':
        menu = pyautogui.locateOnScreen('imagenes/menu_AYUDA_senal.png')
        print(" - El menú de ayuda se encuentra desplegado")

    else:
        print("Tienes que definir un estado para poder seleccionar el menú correcto")

    if menu is not None:
        return True
    else:
        return False


# SACAR COLOR DEL PIXEL
def colorPixel(x, y):
    pixel = pyautogui.screenshot(region=(x, y, 1, 1))
    pixel_np = np.array(pixel)
    pixel_cv = cv2.cvtColor(pixel_np, cv2.COLOR_RGB2BGR)
    color = cv2.cvtColor(pixel_cv, cv2.COLOR_BGR2GRAY)
    return color


# COMPROBAR ESTADO DE AGUJA
def estadoAguja(aguja):
    
    aspa = elementos["Agujas"][aguja]["aspa"]
    x = elementos["Agujas"][aguja]["posicionX"]
    y = elementos["Agujas"][aguja]["posicionY"]

    if aspa == 'SuperiorDerecha':
        aspaLateral = colorPixel(x + 16, y)
        aspaFrontal = colorPixel(x + 11, y - 10)
        if aspaLateral[0][0] != colores.get("negro") and aspaFrontal == colores.get("negro"):
            return f'normal [aspaLateral {x + 16} {y} - aspaFrontal {x + 11} {y - 10}]'
        elif aspaLateral[0][0] == colores.get("negro") and aspaFrontal != colores.get("negro"):
            return f'invertida [aspaLateral {x + 16} {y} - aspaFrontal {x + 11} {y - 10}]'
        elif aspaLateral[0][0] == colores.get("blanco") and aspaFrontal == colores.get("blanco"):
            return f'Borde Blanco'
        else:
            print("Error: La posición del aspa no está bien configurada")
            return f'indefinida [aspaLateral [{x + 16} {y} - aspaFrontal {x + 11} {y - 10}]'

    elif aspa == 'SuperiorIzquierda':
        aspaLateral = colorPixel(x - 16, y)
        aspaFrontal = colorPixel(x - 11, y - 10)
        if aspaLateral[0][0] != colores.get("negro") and aspaFrontal == colores.get("negro"):
            return f'normal [aspaLateral {x - 16} {y} - aspaFrontal {x - 11} {y - 10}]'
        elif aspaLateral[0][0] == colores.get("negro") and aspaFrontal != colores.get("negro"):
            return f'invertida [aspaLateral {x - 16} {y} - aspaFrontal {x - 11} {y - 10}]'
        elif aspaLateral[0][0] == colores.get("blanco") and aspaFrontal == colores.get("blanco"):
            return f'Borde Blanco'
        else:
            print("Error: La posición del aspa no está bien configurada")
            return f'indefinida [aspaLateral {x + 16} {y} - aspaFrontal {x + 11} {y - 10}]'
        
    elif aspa == 'InferiorDerecha':
        aspaLateral = colorPixel(x + 16, y)
        aspaFrontal = colorPixel(x + 11, y + 10)
        if aspaLateral[0][0] != colores.get("negro") and aspaFrontal == colores.get("negro"):
            return f'normal [aspaLateral {x + 16} {y} - aspaFrontal {x + 11} {y + 10}]'
        elif aspaLateral[0][0] == colores.get("negro") and aspaFrontal != colores.get("negro"):
            return f'invertida [aspaLateral {x + 16} {y} - aspaFrontal {x + 11} {y + 10}]'
        elif aspaLateral[0][0] == colores.get("blanco") and aspaFrontal == colores.get("blanco"):
            return f'Borde Blanco'
        else:
            print("Error: La posición del aspa no está bien configurada")
            return f'indefinida [aspaLateral {x + 16} {y} - aspaFrontal {x + 11} {y + 10}]'
        
    elif aspa == 'InferiorIzquierda':
        aspaLateral = colorPixel(x - 16, y)
        aspaFrontal = colorPixel(x - 11, y + 10)
        if aspaLateral[0][0] != colores.get("negro") and aspaFrontal == colores.get("negro"):
            return f'normal [aspaLateral {x - 16} {y} - aspaFrontal {x - 11} {y + 10}]'
        elif aspaLateral[0][0] == colores.get("negro") and aspaFrontal != colores.get("negro"):
            return f'invertida [aspaLateral {x - 16} {y} - aspaFrontal {x - 11} {y + 10}]'
        elif aspaLateral[0][0] == colores.get("blanco") and aspaFrontal == colores.get("blanco"):
            return f'Borde Blanco'
        else:
            print("Error: La posición del aspa no está bien configurada")
            return f'indefinida [aspaLateral {x - 16} {y} - aspaFrontal {x - 11} {y + 10}]'

    else:
        print("Error: El nombre del aspa no es correcto")
        return "Indefinida" 


# CLICAR EN BOTON DE MENU AGUJAS
def clicar(aguja, boton, boton2=""):

    menu = pyautogui.locateOnScreen('imagenes/menu_normal.png')
    x = menu.left
    y = menu.top
    
    posicionBoton = botonesMenuAguja.get(boton)
    time.sleep(1)
    pyautogui.moveTo(x + 21, y + posicionBoton)
    if boton == "MAG" or boton == "MAE":
        print(f' - Ratón sobre el botón {boton} [{x + 21} {y + posicionBoton}]')
    else:
        pyautogui.click()
        print(f' - Seleccionando el botón {boton} [{x + 21} {y + posicionBoton}]') 
    time.sleep(1)
    if boton == "MAG" or boton == "MAE":
        posicionBoton2 = botonesMenuAguja.get(boton2)
        pyautogui.moveTo(x + 100, y + posicionBoton2)
        pyautogui.click()
        print(f' - Seleccionando el botón {boton2} [{x + 21} {y + posicionBoton2}]')
        time.sleep(1) 
    pyautogui.click(button='right')
    print(" - Mandando el comando")


# MANDAR RUTA QUE ENCLAVA AGUJA
def rutaEnclavaAguja(aguja):

    senalIni = elementos["Agujas"][aguja]["ruta"]["senalInicio"]
    senalFin = elementos["Agujas"][aguja]["ruta"]["senalFin"]
    senalIniX = elementos["Senales"][senalIni]["posicionX"]
    senalIniY = elementos["Senales"][senalIni]["posicionY"]
    senalFinX = elementos["Senales"][senalFin]["posicionX"]
    senalFinY = elementos["Senales"][senalFin]["posicionY"]

    time.sleep(1)
    pyautogui.moveTo(senalIniX, senalIniY)
    pyautogui.click()
    print(f' - Seleccionando senal inicial {senalIni} [{senalIniX} {senalIniY}]')
    time.sleep(1)
    pyautogui.moveTo(senalFinX, senalFinY)
    pyautogui.click()
    print(f' - Seleccionando senal final {senalFin} [{senalFinX} {senalFinY}]') 
    time.sleep(1)
    pyautogui.click(button='right')
    print(" - Mandando el comando")    


# COMPROBAR QUE UNA AGUA ESTÁ ENCLAVADA
def comprobarAgujaEnclavada(aguja):

    x = elementos["Agujas"][aguja]["posicionX"]
    y = elementos["Agujas"][aguja]["posicionY"]

    colorAguja = colorPixel(x, y)
    
    if colorAguja[0][0] == colores.get("azul"):
        print(" - La aguja se ha enclavado")
        return True
    else:
        print("Error: La aguja no ha enclavado")
        return False


# MANDAR POR LINEA DE COMANDOS
def lineaComandosAG(aguja, comando):
    
    comandoAguja = elementos["Agujas"][aguja]["lineaComandos"]
    comandoCLI = f'{comando} {comandoAguja}'

    pulsar("lineaComandos")
    pyautogui.write(comandoCLI, interval=0.25)
    print(f' - {comandoCLI} escrito en la linea de comandos')
    time.sleep(1)
    pulsar("aceptar")
    # print(f'Boton "aceptar" pulsado') #Ya se hace en pulsar()

    
# COMPROBAR QUE EL MANDO SE HA RECHAZADO
def comprobarRechazo():
    rechazo = pyautogui.locateOnScreen('imagenes/rechazo.png', confidence=0.25)
        
    if rechazo is not None:
        print(" - El mando se ha rechazado")
        return True
    else:
        print("Error: El mando no se ha rechazado")
        return False


# COMPROBAR QUE SALE EL CARTELÓN Y EL TEXTO QUE CONTIENE
def comprobarCartelon(texto):
    if texto == "efectoPedal":
        cartel = pyautogui.locateOnScreen('imagenes/cartelon_efectoPedal.png', confidence=0.95)
    else:
        print("Tienes que especificar el cartel esperado")
        texto = None

    if texto is not None:
        print(f' - Cartel {texto} presente')
        return True
    else:
        print(f'Error: El cartel {texto} no está presente')
        return False


# DESPLEGAR MENU DE SENAL CON BOTON CENTRAL
def desplegarMenuSenal(senal):

    x = elementos["Senales"][senal]["posicionX"]
    y = elementos["Senales"][senal]["posicionY"]
    
    pyautogui.moveTo(x, y)
    time.sleep(1)
    pyautogui.click(button='middle')
    print(" - Desplegando menú (con botón central) [", x, y, "]")
    time.sleep(1)


# CLICAR EN BOTON DE MENU SENAL E
def clicarSenal(senal, boton):

    if "E" in senal:
        tipo = "Entrada"
        imagen = 'imagenes/menu_senalE.png'
        botonesMenu = botonesMenuSenalE
    elif "S" in senal:
        tipo = "Salida"
        imagen = 'imagenes/menu_senalS.png'
        botonesMenu = botonesMenuSenalS
    elif "R" in senal:
        tipo = "Repetidora"
        imagen = 'imagenes/menu_senalR.png'
        botonesMenu = botonesMenuSenalR
    else:
        print("Error: Revisar el nombre de la senal")
        imagen = "Indefinida"
    
    menu = pyautogui.locateOnScreen(imagen, confidence=0.9)
    x = menu.left
    y = menu.top
    
    posicionBoton = botonesMenu.get(boton)
    time.sleep(1)
    pyautogui.moveTo(x + 10, y + posicionBoton)
    pyautogui.click()
    print(f' - Seleccionando el botón {boton} [{x + 10} {y + posicionBoton}]') 
    time.sleep(1)
    pyautogui.click(button='right')
    print(" - Mandando el comando")
    time.sleep(1)

    
# LANZAR UN DAI EN UNA DETERMINADA SEÑAL
def DAI(senal):
    desplegarMenuSenal(senal)
    clicarSenal(senal, "DAI")


# CLICAR EN UN AGUJA -> MANDO POR DEFECTO
def clicarDefecto(aguja):

    x = elementos["Agujas"][aguja]["posicionX"]
    y = elementos["Agujas"][aguja]["posicionY"]
    
    pyautogui.moveTo(x, y)
    pyautogui.click()
    print(f' - Seleccionando el comando por defecto {aguja} [{x} {y}]') 
    time.sleep(1)
    
    
# COMPROBAR EL MANDO DEL CLI
def leerCLI(esperado):

    if esperado == "MAG":
        CLI = pyautogui.locateOnScreen('imagenes/CLI_defecto_MAG.png')
        if CLI is not None:
            print(" - El mando por defecto es MAG")
            return True
        else:
            print("Error: El mando por defecto no es correcto")
            return False

    elif esperado == "vacio":
        CLI = pyautogui.locateOnScreen('imagenes/CLI_vacio.png')
        if CLI is not None:
            print(" - La linea de comandos está vacía")
            return True
        else:
            print("Error: La linea de comandos no está vacía")
            return False
        
    else:
        print("Error: El comando por defecto esperado no es correcto")


# PARA PINCHAR FUERA DE LOS ELEMENTOS Y QUE SE CIERREN LOS MENUS
def cerrarMenu():
    time.sleep(1)
    pyautogui.moveTo(200, 300)
    pyautogui.click()


# COMPROBAR EL PINTADO DEL EFECTO PEDAL
def comprobarFaltaDeGalibo(aguja, CVocupado):
    
    if CVocupado == "conjugado":
        AG = elementos["Agujas"][aguja]["AGconjugada"]
        galibo = aguja
    elif CVocupado == "propio":
        AG = aguja
        galibo = elementos["Agujas"][aguja]["AGconjugada"]
    else:
        print("Error: Hay que definir el CV ocupado para probar la falta de galibo") 
    # Se podría hacer una configuracion para poner el trayecto del CV
    # Se va a intentar evitarlo para mantener la configuración al mínimo
    # Para ello se mirarán puntos en lugar del trayecto total del CV
    # --- PUEDE FALLAR EN ERRORES DE PINTADO ---
    aspa = elementos["Agujas"][galibo]["aspa"]
    x = elementos["Agujas"][galibo]["posicionX"]
    y = elementos["Agujas"][galibo]["posicionY"]

    # Revisar los píxeles - IMPORTANTE
    if aspa == 'SuperiorDerecha':
        Rx = x + 30
        Ry = y
        Lx = x + 16
        Ly = y - 23

    elif aspa == 'SuperiorIzquierda':
        Rx = x - 30
        Ry = y 
        Lx = x - 16
        Ly = y - 23
        
    elif aspa == 'InferiorDerecha':
        Rx = x + 30
        Ry = y
        Lx = x + 16
        Ly = y + 23
        
    elif aspa == 'InferiorIzquierda':
        Rx = x - 30
        Ry = y 
        Lx = x - 16
        Ly = y + 23
        
    else:
        print("Error: El nombre del aspa no es correcto")
    
    estado = estadoAguja(aguja)
    if "invertida" in estado:
        #Comprobar a rojo el L del CV enfrentado
        colorL = colorPixel(Lx, Ly)
        if colorL[0][0] == colores.get("rojo"):
            print(f' - Se ha pintado la falta de galibo L {Lx, Ly}')
            return True
        else:
            print(f'Error: No se ha pintado la falta de galibo L {Lx, Ly}')
            return False
    else:
        #Comprobar a rojo el R del CV enfrentado
        colorR = colorPixel(Rx, Ry)
        if colorR[0][0] == colores.get("rojo"):
            print(f' - Se ha pintado la falta de galibo R {Rx, Ry}')
            return True
        else:
            print(f'Error: No se ha pintado la falta de galibo R {Rx, Ry}')
            return False
    

## ES PROBABLE QUE HAYA QUE CAMBIAR ESTA PARTE============================
# PARA LANZAR COMANDOS A LA MAQUINA DEL SIMBOOL
def mensajeSimbool(mensaje):
    server_ip = elementos["IP"]
    server_port = 5012 #Se ha abierto el puerto en la maquina previamente
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((server_ip, server_port))
    client_socket.sendall(mensaje.encode())

    time.sleep(2)  # Dar tiempo al servidor para procesar el mensaje
    cierre = 'CERRAR_CONEXION'
    client_socket.sendall(cierre.encode())
    client_socket.close()
    time.sleep(1)


# PARA OCUPAR CV - ES MAS SENCILLO PORQUE SE PUEDE USAR EL OJITO (SIN PASOS EXTRA)
def ocuparCV(CV):
    
    x = elementos["CV"][CV]["botonOcuparX"]
    y = elementos["CV"][CV]["botonOcuparY"]

    comando = f'./nircmd/nircmd.exe setcursor {x} {y}; ./nircmd/nircmd.exe sendmouse left click'
    mensajeSimbool(comando)
    print(f' - Se ha (des)ocupado el CV {CV}')

## ======================================================================



    
