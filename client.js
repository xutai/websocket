const webSocket = new WebSocket(
    'wss://localhost:6503/chat',
    "json"
)

webSocket.onopen = (evt) => {
    console.log("onopen", "evt", evt)
    let obj = { data: '123' }
    webSocket.send(JSON.stringify(obj))
}
webSocket.onmessage = (evt) => {
    console.log("onmessage", "evt", evt)
    console.log("evt.data", evt.data)
}




console.group('properties')
console.info(webSocket)
console.groupEnd('properties')