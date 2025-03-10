import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
    
    if(req.url === '/') {
        const htmlFile = fs.readFileSync('./public/index.html', 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlFile);
    } else{
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(3000, () => { console.log("Server running on port 3000"); });