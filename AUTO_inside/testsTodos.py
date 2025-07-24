import os
import acciones

## LISTA DE AGUJAS QUE QUEREMOS TESTEAR ================================
## =====================================================================
agujasTests = ["AG1", "AG3", "AG5", "AG7"]

## NOMBRE DE ARCHIVOS DE LOS TESTS A REALIZAR ==========================
## =====================================================================
test09 = "test_09.py"
test10 = "test_10.py"
test11 = "test_11.py"

# También se podría hacer una lista de tests y meterlo en un doble bucle
# Pero prefiero tener más control individual en cada test
# Se puede mofificar la lista de agujas que mandar a cada test si fuera necesario
# --------------------------------------------------------------
# agujasTests10 = ["AG1", "AG3", "AG15"]
# resultadoTest10 = acciones.realizaTests(agujasTests10, test10)
# print(resultadoTest10)
# --------------------------------------------------------------
# Con esto, el test10 podría incluir la aguja 15 aunque el resto no lo haga

# Creamos un archivo resumen de los test donde poner los resultados
resumen = 'resumenTestsPuzol.txt'
if os.path.exists(resumen):
    os.remove(resumen)
    
with open(resumen, 'w') as file:
    file.write('RESUMEN DE LOS TEST DE TRASONA\n\n')

def guardar(resultado):
    print(resultado)
    with open(resumen, 'a') as file:
        file.write('----------------\n')

## EJECUTAMOS LOS TESTS ================================================
## =====================================================================
resultadoTest9 = acciones.realizaTests(agujasTests, test09)            
guardar(resultadoTest9)

resultadoTest10 = acciones.realizaTests(agujasTests, test10)
guardar(resultadoTest10)

resultadoTest11 = acciones.realizaTests(agujasTests, test11)
guardar(resultadoTest11)

## =====================================================================
## =====================================================================

# Podemos leer el archivo de resumen para ofrecerlo también en la terminal
print(f'Todos los tests finalizados\n')
print("--------------------------------------")

with open(resumen, 'r') as file:
    contenido = file.read()
    print(contenido)

print("--------------------------------------")
