# Trenes
Scripts útiles para mi trabajo que automatizan tareas

## AUTO
Automatización externa para bombardier, se usan desde el PC actuando sobre la maquina virtual. 
Se puede replicar instalando Python y sus dependencias dentro de la maquina virtual. 
### Dependencias
- Python
- Numpy
- Pillow
## Mapa y explicación 
<img width="619" height="367" alt="sleekshot" src="https://github.com/user-attachments/assets/76b881c7-6dac-4e4d-bafa-6416661d27d5" />
El archivo de TestEstación.py es el maestro, va ejecutando todos los test definidos en él, en todos los elementos seleccionados. Estos elementos 
también tienen que tener definidas sus posiciones y todas las características o atributos necesarios en el json. 
Los archivos de TEST_XX.py son traducciones del protocolo de pruebas a código. Para poder funcionar correctamente se ha creado una librería de 
acciones, que es de la que beben esos test. Es decir, en los archivos de test podemos usar la función "mandarRuta(senalInicio, senalFinal)" porque 
esta ya está definida en la librería de acciones. 
Al acabar la ejecución de los tests (y mientras en consola) se genera un reporte con los casos OK y los que han fallado. 

## EstacionesEmulator
Sirve para crear el "ojito" de las estaciones. Un simulador que permite controlar la respuesta de los 
sensores de la estación para poder realizar las pruebas de una forma más eficaz. 
### Dependencias
- Navegador (funciona solo con .js y .html)
