const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let visitorCount = 0;

wss.on('connection', (ws) => {
    console.log('Yeni bir bağlantı yapıldı');

    // Yeni bağlantı olduğunda ziyaretçi sayısını gönder
    ws.send(JSON.stringify({ count: visitorCount }));

    // Yeni ziyaretçi bağlandığında ziyaretçi sayısını arttır ve tüm bağlantılara gönder
    visitorCount++;
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ count: visitorCount }));
        }
    });

    // Bağlantı kapandığında ziyaretçi sayısını azalt ve tüm bağlantılara gönder
    ws.on('close', () => {
        visitorCount--;
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ count: visitorCount }));
            }
        });
        console.log('Bir bağlantı kapandı');
    });
});

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/deneme.html');
});

// Sunucuyu başlat
server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
