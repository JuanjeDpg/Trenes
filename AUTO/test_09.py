import sys
import json
import acciones
import time
import os

# Para leer los elementos del json y sus propiedades (movido a las acciones)
with open('elementos.json', 'r') as f:
    elementos = json.load(f)

# Para que sepa el elemento al que le queremos hacer el test
aguja = sys.argv[1]


# ===========================================================
#   TEST 09 - SEGUIMOS LAS ACCIONES DEL PROTOCOLO
# ===========================================================

## Primero se comprueba que la posición de la aguja es correcta
normalizada = acciones.posicionAguja(aguja) # True or False

## Escenario 1. AG a invertido por menú ----------------------
## Acción 1 -> Desplegar el menú del motor y comprobarlo
estadoPre = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPre}')
acciones.desplegarMenu(aguja) 
menu = acciones.comprobarMenu("AGnormal")

## Acción 2 -> Seleccionar MAG
acciones.clicar(aguja, boton="MAG")

## Acción 3 -> Antes de 7 segundos coge comprobación
time.sleep(8)
### El cambio de estado podría ser una acción que lo comprueba
### Para simplificar el archivo del test 
estadoPost = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPost}')
cambioEstado = estadoPre != estadoPost
assert cambioEstado, f'ERROR! La aguja no ha cambiado de posición\n'

condiciones = [normalizada, menu, cambioEstado]
escenario1 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 1")


## Escenario 2. AG a normal por menú -------------------------
## Acción 1 -> Desplegar el menú del motor y comprobarlo
estadoPre = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPre}')
acciones.desplegarMenu(aguja) 
menu = acciones.comprobarMenu("AGnormal")

## Acción 2 -> Seleccionar MAG
acciones.clicar(aguja, boton="MAG")

## Acción 3 -> Antes de 7 segundos coge comprobación
time.sleep(8)
### El cambio de estado podría ser una acción que lo comprueba
### Para simplificar el archivo del test 
estadoPost = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPost}')
cambioEstado = estadoPre != estadoPost
assert cambioEstado, f'ERROR! La aguja no ha cambiado de posición\n'

condiciones = [normalizada, menu, cambioEstado]
escenario2 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 2")


## Escenario 3. AG a invertido con ocupación ----------------
print(f' - Ocupar CV. De momento usamos nircmd en la maquina - Susceptible de cambiar')
CV = elementos["Agujas"][aguja]["CV"]
# CI 
acciones.ocuparCV(CV)
acciones.cerrarMenu()
time.sleep(2)
acciones.pulsar("RAL")
time.sleep(3)
# CI
## Acción 1 -> Desplegar Menú
estadoPre = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPre}')
### No es estrictamente necesario pero así podemos comprobar si cambia
acciones.desplegarMenu(aguja)
menu = acciones.comprobarMenu("AGocupado")

## Acción 2 -> Seleccionar MAG -> No posible
acciones.clicar(aguja, boton="MAG")
acciones.cerrarMenu()

## Acción 3 -> Seleccionar MAG por teclado -> Rechazado
acciones.lineaComandosAG(aguja, "MAG")
time.sleep(8)
rechazado = acciones.comprobarRechazo()
estadoPost = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPost}')
mismoEstado = estadoPre == estadoPost

## Extra para volver a normalizar -> Desocupar
acciones.ocuparCV(CV)
time.sleep(1)

condiciones = [menu, rechazado, mismoEstado]
escenario3 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 3")


## Escenario 4. AG a normal con ocupación -------------------
CV = elementos["Agujas"][aguja]["CV"]
# CI
print(f' - Movemos la aguja para probar lo mismo en otra posicion')
acciones.desplegarMenu(aguja)
acciones.clicar(aguja, boton="MAG")
time.sleep(8)
print(f' - Ocupar CV. De momento usamos nircmd en la maquina - Susceptible de cambiar')
acciones.ocuparCV(CV)
time.sleep(2)
acciones.pulsar("RAL")
time.sleep(3)
# CI
## Acción 1 -> Desplegar Menú
estadoPre = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPre}')
### No es estrictamente necesario pero así podemos comprobar si cambia
acciones.desplegarMenu(aguja)
menu = acciones.comprobarMenu("AGocupado")

## Acción 2 -> Seleccionar MAG -> No posible
acciones.clicar(aguja, boton="MAG")
acciones.cerrarMenu()

## Acción 3 -> Seleccionar MAG por teclado -> Rechazado
acciones.lineaComandosAG(aguja, "MAG")
time.sleep(8)
rechazado = acciones.comprobarRechazo()
estadoPost = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPost}')
mismoEstado = estadoPre == estadoPost

## Extra para volver a normalizar -> Desocupar
acciones.ocuparCV(CV)
time.sleep(1)

condiciones = [menu, rechazado, mismoEstado]
escenario4 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 4")


## Escenario 5. Movimiento de AG afectada por ruta ----------
## Acción 1 -> Lanzar ruta que lo enclava (azul)
acciones.rutaEnclavaAguja(aguja)
time.sleep(10)
enclavada = acciones.comprobarAgujaEnclavada(aguja)

## Acción 2 -> Seleccionar MAG (rechazo)
acciones.lineaComandosAG(aguja, "MAG")
time.sleep(1)
rechazado = acciones.comprobarRechazo()

## Acción 3 -> Repeir proceso para todas las agujas de ruta (sin hacer)

## Extra para volver a normalizar -> DAI en señal inicio
senalInicio = elementos["Agujas"][aguja]["ruta"]["senalInicio"]
acciones.DAI(senalInicio)
time.sleep(5)

condiciones = [enclavada, rechazado]
escenario5 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 5")


## Escenario 6. Aguja ---------------------------------------
## Acción 1 -> Click izquierdo y probar mando por defecto (MAG)
acciones.clicarDefecto(aguja)
CLIesMAG = acciones.leerCLI("MAG")
time.sleep(1)

## Acción 2 -> Anular comando
acciones.pulsar("anularComando")
vacio = acciones.leerCLI("vacio")

## Acción 3 -> Desplegar Menú y comprobar
acciones.desplegarMenu(aguja) 
menu = acciones.comprobarMenu("AGnormal")

## Acción 4 -> Desplegar Ayuda y comprobar
acciones.clicar(aguja, boton="AYUDA")
menuAyuda = acciones.comprobarMenu("AGayuda")

## Acción 5 -> Comprobar que no se puede seleccionar (sin hacer)
acciones.cerrarMenu()

condiciones = [CLIesMAG, vacio, menu, menuAyuda]
escenario6 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 6")


# ===========================================================
#   TEST 09 - ACABADO
# ===========================================================

# GUARDAR RESULTADOS DEL TEST
if len(sys.argv) > 2:
    resumen = 'resumenTestsTrasona.txt'
    if (escenario1 and escenario2 and escenario3 and
       escenario4 and escenario5 and escenario6):
        print(f'TEST 9 - {aguja}: OK')
        print("=========================")
        with open(resumen, 'a') as file:
            file.write(f'TEST 9. {aguja}: OK\n')
    else:
        print(f'TEST 9 - {aguja}: KO - ERROR - Necesita revisión')
        print("=========================")
        with open(resumen, 'a') as file:
            file.write(f'TEST 9. {aguja}: KO\n')

