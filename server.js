// curl -k https://localhost:8000/
const https = require('https');
const fs = require('fs');
const {
    server: WebSocketServer
} = require('websocket')
const { URL, URLSearchParams } = require('url')
const crypto = require('crypto');
const { EDESTADDRREQ } = require('constants');

const options = {
    key: fs.readFileSync('agent2-key.pem'),
    cert: fs.readFileSync('agent2-cert.pem')
};


// ***** test *****
// let keyString = 'dGhlIHNhbXBsZSBub25jZQ=='
// let magicString = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
// let str = `${keyString}${magicString}`
// console.log(
//     crypto.createHash('sha1').update(str).digest('sha1').toString('base64')
// )
// ***** test *****

const server = https.createServer(options, (req, res) => {
    const url = new URL(req.url, 'https://localhost:6503')
    // console.log(url)
    // console.log(req.headers)
    // console.log(
    //     req.headers.origin,
    //     req.headers.origin === 'https://localhost:6503'
    // )
    const headers = req.headers

    let clientID = null




    console.log(url.pathname, clientID)

    if (url.pathname === '/') {

        fs.readFile(
            'index.html',
            {
                encoding: 'utf8',
                flas: 'r'
            },
            (err, data) => {
                if (err) throw err
                res.writeHead(200)
                res.end(data, 'utf8', () => { })
            }
        )

    } else if (
        url.pathname === '/chat'
        && req.method === 'GET'
    ) {
        console.log('2')

        if (clientID === null) {
            clientID = 1
        } else {
            res.end('123')
        }

        // console.log(req.headers)
        // console.log("headers.accept,", headers.accept,)
        // console.log("headers.origin,", headers.origin,)
        // console.log("headers.connection,", headers.connection,)
        // console.log("headers.upgrade,", headers.upgrade,)
        // console.log("headers['sec-websocket-version'],", headers['sec-websocket-version'],)
        // console.log("headers['sec-websocket-protocol'],", headers['sec-websocket-protocol'],)
        // console.log("headers['sec-websocket-extensions'],", headers['sec-websocket-extensions'],)
        // console.log("headers['sec-websocket-key'],", headers['sec-websocket-key'],)
        if (
            headers['sec-websocket-version'] === '13'
            && req.headers.origin === 'https://localhost:6503'
        ) {
            let str = '',
                buffer = null,
                encodedHash = '',
                keyString = '',
                magicString = '';
            keyString = headers['sec-websocket-key']
            magicString = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
            str = `${keyString}${magicString}`
            buffer = crypto.createHash('sha1').update(str).digest('sha1')
            encodedHash = buffer.toString('base64')

            // crypto.createHash('sha1')
            res.writeHead(101, 'Switching Protocols', {
                'upgrade': 'websocket',
                'connection': 'upgrade',
                'sec-websocket-accept': encodedHash,
                'sec-websocket-protocol': 'json',
                'origin': 'https://localhost:6503'
            })


            res.end()


        } else {
            res.writeHead(400, 'Bad Request', {})
            res.end()
        }



    }
    else if (url.pathname === '/client.js') {
        fs.readFile(
            'client.js',
            {
                encoding: 'utf8',
                flas: 'r'
            },
            (err, data) => {
                if (err) throw err
                res.writeHead(200)
                res.end(data, 'utf8', () => { })
            })
    }
    else if (url.pathname === '/chatclient.js') {
        fs.readFile(
            'chatclient.js',
            {
                encoding: 'utf8',
                flas: 'r'
            },
            (err, data) => {
                if (err) throw err
                res.writeHead(200)
                res.end(data, 'utf8', () => { })
            })
    }
    else {
        res.writeHead(404)
        res.end('404', 'utf8', () => { })
    }


}).listen(6503)


wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
})

wsServer.on('request', function (request) {

    var connection = request.accept('json', request.origin);
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            let data = JSON.stringify({ data: 'xutai' })
            connection.sendUTF(data)
            // connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

})






// setTimeout(() => {
//     // server.getConnections((err, count) => { console.log(count) })
//     // console.log(server.listening)
// }, 2000)

// server.on('connection', (socket) => {
//     // console.log(socket)
//     socket.on('data', chunk => {
//         console.log("chunk", chunk)
//     })
//     socket.on('error', error => {
//         console.error(error)
//     })
//     // console.log(
//     //     // "socket.bytesRead", socket.bytesRead,
//     //     // "socket.bytesWritten", socket.bytesWritten
//     // )
// })