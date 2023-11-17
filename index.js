const {WebSocketServer} = require('ws')

const wss = new WebSocketServer({ port: 8080 })

// aqui guardaremos el objeto ws de los clientes connectados
const clients = new Set()

// asi vamos a estar regresando la info, como un objeto convertido a string
function resTemplate(type, content) {
  return JSON.stringify({
    type: type,
    content: content
  })
}

wss.on('connection', function connection(ws) {
  ws.on('error', console.error)

  ws.on('message', function message(data) {
    console.log('Mensaje recibido: %s', data)
    ws.send(resTemplate(0, `Procesamos tu mensaje correctamente: ${data}`))

    // aqui se manda mensaje a los demas usuarios menos al que genero el mensaje
    // esto es gracias a que persistimos las conexiones y las identificamos con una id
    for (let client of clients) {
      if (client.id !== ws.id) {
        client.send(resTemplate(1, `Procesamos el mensaje de otro usuario: ${data}`))
      }
    }
  })

  // aun no encuentro si ws ya te genera una id asi que de momento la genero manualmente
  ws.id = `${Math.random().toString().slice(2)}-${new Date().getTime()}`
  clients.add(ws)
  ws.send(resTemplate(2, 'Conexión establecida correctamente'))
})