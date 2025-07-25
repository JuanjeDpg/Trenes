#$ipAddress = [System.Net.IPAddress]::Parse("192.168.80.167")
$ipAddress = [System.Net.IPAddress]::Any
echo ('$ipAddress = [System.Net.IPAddress]::Any')
$port = 5012
echo ('$port = 5012')
$listener = New-Object System.Net.Sockets.TcpListener ($ipAddress, $port)
echo ('$listener = New-Object System.Net.Sockets.TcpListener ($ipAddress, $port)')
$listener.Start()
echo ('$listener.Start()')

# Esperamos para ir ejecutando la parte de Python
echo ("Esperando la conexion del cliente")
while ($true) {
	Start-Sleep -Seconds 1
	$receivedMessage = ""

	$client = $listener.AcceptTcpClient()
	echo ("Cliente conectado")
	$stream = $client.GetStream()
	$buffer = New-Object byte[] 1024

	while($client.Connected){
		Start-Sleep -Seconds 1
		
		if ($stream.DataAvailable) {
			$bytesRead = $Stream.Read($buffer, 0, $buffer.Length)
			$receivedMessage = [System.Text.Encoding]::ASCII.GetString($Buffer, 0, $bytesRead)
			#echo "Bytes leídos: $bytesRead"
			#echo "Mensaje recibido: $receivedMessage"

			#if ($receivedMessage -ne $oldMessage){
			if ($receivedMessage -eq "CERRAR_CONEXION") {
                echo "Cerrando conexion"
                $client.Close()
                break
            } else {
                echo ("Ejecutando: ", $receivedMessage)
                Invoke-Expression $receivedMessage
            }
			# & $receivedMessage
			#}
			# Sin if para que también reejecute mensajes mandados que sean iguales	
		}
	}
	
	echo "Cliente desconectado"
}
