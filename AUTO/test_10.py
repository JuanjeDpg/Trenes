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
#   TEST 10 - SEGUIMOS LAS ACCIONES DEL PROTOCOLO
# ===========================================================

## Primero se comprueba que la posición de la aguja es correcta
normalizada = acciones.posicionAguja(aguja) # True or False

## Escenario 1. AG a invertido por MAE - Se rechaza
# ===========================================================
## Acción 1 -> Desplegar el menú del motor y MAE
estadoPre = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPre}')
acciones.desplegarMenu(aguja) 
menu = acciones.comprobarMenu("AGnormal")
acciones.clicar(aguja, boton="MAE")
time.sleep(1)

## Acción 2 -> Seleccionar MAE (teclado)
acciones.cerrarMenu()
acciones.lineaComandosAG(aguja, "MAE")
time.sleep(8)
rechazado = acciones.comprobarRechazo()
estadoPost = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPost}')
mismoEstado = estadoPre == estadoPost

condiciones = [normalizada, menu, rechazado, mismoEstado]
escenario1 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 1")

assert mismoEstado, f'ERROR! La aguja ha cambiado de posición\n'

## Escenario 2. AG a normal por MAE - Se rechaza 
# ===========================================================
# CI
print(f' - Movemos la aguja para probar lo mismo en otra posicion')
acciones.desplegarMenu(aguja)
acciones.clicar(aguja, boton="MAG")
time.sleep(9) # Se supone que son 7 segundos pero a veces va lento
# CI
## Acción 1 -> Desplegar el menú del motor y MAE
estadoPre = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPre}')
acciones.desplegarMenu(aguja) 
menu = acciones.comprobarMenu("AGnormal")
acciones.clicar(aguja, boton="MAE")
time.sleep(1)

## Acción 2 -> Seleccionar MAE (teclado)
acciones.cerrarMenu()
acciones.lineaComandosAG(aguja, "MAE")
time.sleep(8)
rechazado = acciones.comprobarRechazo()
estadoPost = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPost}')
mismoEstado = estadoPre == estadoPost

condiciones = [normalizada, menu, rechazado, mismoEstado]
escenario2 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 2")

assert mismoEstado, f'ERROR! La aguja ha cambiado de posición\n'

## Escenario 3. AG a invertido por MAE - CV Ocupado 
# ===========================================================
print(f' - Ocupar CV. De momento usamos nircmd en la maquina - Susceptible de cambiar')
CV = elementos["Agujas"][aguja]["CV"]

# CI ------------------
acciones.ocuparCV(CV)
acciones.cerrarMenu()
time.sleep(2)
acciones.pulsar("RAL")
time.sleep(3)
# CI ------------------

## Acción 1 -> Seleccionar MAE - Anulacion de efecto pedal
estadoPre = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPre}')
acciones.desplegarMenu(aguja)
menu = acciones.comprobarMenu("AGocupado")
acciones.clicar(aguja, boton="MAE")
time.sleep(5)
cartelon = acciones.comprobarCartelon("efectoPedal")
estado = acciones.estadoAguja(aguja)
bordeBlanco = estado == "Borde Blanco" #Para comprobar que el estado es bordeBlanco
print(f' - La aguja tiene {estado}')

## Acción 2 -> Pulsar ME - Se mueve la aguja
### La falta de gálibo se comprueba en el test11 de conjugadas
time.sleep(4)
acciones.pulsar("ME")
time.sleep(8)
estadoPost = acciones.estadoAguja(aguja)
cambioEstado = estadoPre != estadoPost
print(f' - La aguja está en posición {estadoPost}')

condiciones = [menu, cartelon, bordeBlanco, cambioEstado]
escenario3 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 3")

assert cambioEstado, f'ERROR! La aguja no ha cambiado de posición\n'

## Escenario 4. AG a normal por MAE - CV Ocupado
# ===========================================================

## Acción 1 -> Seleccionar MAE - Anulacion de efecto pedal
estadoPre = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPre}')
acciones.desplegarMenu(aguja)
menu = acciones.comprobarMenu("AGocupado")
acciones.clicar(aguja, boton="MAE")
time.sleep(4)
cartelon = acciones.comprobarCartelon("efectoPedal")
estado = acciones.estadoAguja(aguja)
bordeBlanco = estado == "Borde Blanco"
print(f' - La aguja tiene {estado}')

## Acción 2 -> Pulsar ME - Se mueve la aguja
time.sleep(4)
acciones.cerrarMenu()
acciones.pulsar("ME")
time.sleep(8)
estadoPost = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPost}')
cambioEstado = estadoPre != estadoPost

condiciones = [menu, cartelon, bordeBlanco, cambioEstado]
escenario4 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 4")

assert cambioEstado, f'ERROR! La aguja no ha cambiado de posición\n'

## Extra para volver a normalizar -> Desocupar
print(" - Para volver a normalizar")
acciones.ocuparCV(CV)
time.sleep(1)
print("-------------------------")

# ===========================================================
#   TEST 10 - ACABADO
# ===========================================================

# GUARDAR RESULTADOS DEL TEST
if len(sys.argv) > 2:
    resumen = 'resumenTestsTrasona.txt'
    if (escenario1 and escenario2 and escenario3 and escenario4):
        print(f'TEST 10 - {aguja}: OK')
        print("=========================")
        with open(resumen, 'a') as file:
            file.write(f'TEST 10. {aguja}: OK\n')
    else:
        print(f'TEST 10 - {aguja}: KO - ERROR - Necesita revisión')
        print("=========================")
        with open(resumen, 'a') as file:
            file.write(f'TEST 10. {aguja}: KO\n')

