import socket

server_ip = '192.168.80.152'
server_port = 5011

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((server_ip, server_port))

message = 'CMD SET LTR_RV_TTR1A_LOXMT TRUE'
client_socket.sendall(message.encode())

respuesta = client_socket.recv(1024)
print(f'Respuesta recibida: {respuesta.decode()}')

client_socket.close()