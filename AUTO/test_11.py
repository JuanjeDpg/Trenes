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
#   TEST 11 - SEGUIMOS LAS ACCIONES DEL PROTOCOLO
# ===========================================================

## Primero se comprueba que la posición de la aguja es correcta
normalizada = acciones.posicionAguja(aguja) # True or False

## Escenario 1. Rechazo de MAG con CV contrario ocupado
# ===========================================================
print(f' - Ocupar CV contrario. De momento usamos nircmd en la maquina - Susceptible de cambiar')
agujaConjugada = elementos["Agujas"][aguja]["AGconjugada"]
CVcontrario = elementos["Agujas"][agujaConjugada]["CV"]
# CI ------------------
acciones.ocuparCV(CVcontrario)
acciones.cerrarMenu()
time.sleep(2)
acciones.pulsar("RAL")
time.sleep(3)
# CI ------------------

## Acción 1 -> Desplegar el menú del motor y MAG
estadoPre = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPre}')
acciones.desplegarMenu(aguja) 
menu = acciones.comprobarMenu("AGocupado")
acciones.clicar(aguja, boton="MAG")
time.sleep(1)

## Acción 2 -> Seleccionar MAG (teclado)
acciones.cerrarMenu()
acciones.lineaComandosAG(aguja, "MAG")
time.sleep(8)
rechazado = acciones.comprobarRechazo()
estadoPost = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPost}')
mismoEstado = estadoPre == estadoPost

condiciones = [normalizada, menu, rechazado, mismoEstado]
escenario1 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 1")

assert mismoEstado, f'ERROR! La aguja ha cambiado de posición\n'

## Escenario 3. MAE con CV contrario ocupado  
# ===========================================================
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
faltaDeGalibo = acciones.comprobarFaltaDeGalibo(aguja, CVocupado="conjugado")
estadoPost = acciones.estadoAguja(aguja)
cambioEstado = estadoPre != estadoPost
print(f' - La aguja está en posición {estadoPost}')

condiciones = [menu, cartelon, faltaDeGalibo, bordeBlanco, cambioEstado]
escenario3 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 3")

assert cambioEstado, f'ERROR! La aguja no ha cambiado de posición\n'

## Escenario 2. Rechazo de MAG con CV contrario ocupado (-) 
# ===========================================================
## Acción 1 -> Desplegar el menú del motor y MAG
estadoPre = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPre}')
acciones.desplegarMenu(aguja) 
menu = acciones.comprobarMenu("AGocupado")
acciones.clicar(aguja, boton="MAG")
time.sleep(1)

## Acción 2 -> Seleccionar MAG (teclado)
acciones.cerrarMenu()
acciones.lineaComandosAG(aguja, "MAG")
time.sleep(8)
rechazado = acciones.comprobarRechazo()
estadoPost = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPost}')
mismoEstado = estadoPre == estadoPost

condiciones = [menu, rechazado, mismoEstado]
escenario2 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 2")

assert mismoEstado, f'ERROR! La aguja ha cambiado de posición\n'

## Escenario 4. MAE con CV contrario ocupado (-)
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
faltaDeGalibo = acciones.comprobarFaltaDeGalibo(aguja, CVocupado="conjugado")
estadoPost = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPost}')
cambioEstado = estadoPre != estadoPost

condiciones = [menu, cartelon, faltaDeGalibo, bordeBlanco, cambioEstado]
escenario4 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 4")

assert cambioEstado, f'ERROR! La aguja no ha cambiado de posición\n'

## Extra para volver a normalizar -> Desocupar
print(" - Para volver a normalizar")
acciones.ocuparCV(CVcontrario)
time.sleep(1)
print("-------------------------")

## Escenario 5. MAE con CV ocupado
# ===========================================================
print(f' - Ocupar CV. De momento usamos nircmd en la maquina - Susceptible de cambiar')
CV = elementos["Agujas"][aguja]["CV"]
# CI 
acciones.ocuparCV(CV)
acciones.cerrarMenu()
time.sleep(2)
acciones.pulsar("RAL")
time.sleep(3)
# CI
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
faltaDeGalibo = acciones.comprobarFaltaDeGalibo(aguja, CVocupado="propio")
estadoPost = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPost}')
cambioEstado = estadoPre != estadoPost

condiciones = [menu, cartelon, faltaDeGalibo, bordeBlanco, cambioEstado]
escenario5 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 5")

assert cambioEstado, f'ERROR! La aguja no ha cambiado de posición\n'

## Escenario 6. MAE con CV ocupado (-)
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
faltaDeGalibo = acciones.comprobarFaltaDeGalibo(aguja, CVocupado="propio")
estadoPost = acciones.estadoAguja(aguja)
print(f' - La aguja está en posición {estadoPost}')
cambioEstado = estadoPre != estadoPost

condiciones = [menu, cartelon, faltaDeGalibo, bordeBlanco, cambioEstado]
escenario6 = acciones.comprobarEscenario(condiciones, aguja, "Escenario 6")

assert cambioEstado, f'ERROR! La aguja no ha cambiado de posición\n'

## Extra para volver a normalizar -> Desocupar
print(" - Para volver a normalizar")
acciones.ocuparCV(CV)
time.sleep(1)
print("-------------------------")

# ===========================================================
#   TEST 11 - ACABADO
# ===========================================================

# GUARDAR RESULTADOS DEL TEST
if len(sys.argv) > 2:
    resumen = 'resumenTestsTrasona.txt'
    if (escenario1 and escenario2 and escenario3 and
        escenario4 and escenario5 and escenario6):
        print(f'TEST 11 - {aguja}: OK')
        print("=========================")
        with open(resumen, 'a') as file:
            file.write(f'TEST 11. {aguja}: OK\n')
    else:
        print(f'TEST 11 - {aguja}: KO - ERROR - Necesita revisión')
        print("=========================")
        with open(resumen, 'a') as file:
            file.write(f'TEST 11. {aguja}: KO\n')

