const http = require('http');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/simpleAuth');

const User = mongoose.model('User', new mongoose.Schema({ username: String, password: String }));

// Create Server
http.createServer(async (req, res) => {
    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
        // Serve the HTML form
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    else if (req.method === 'POST' && (req.url === '/signup' || req.url === '/login')) {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // Convert buffer to string
        });

        req.on('end', async () => {
            const formData = new URLSearchParams(body);
            const username = formData.get('username');
            const password = formData.get('password');

            if (!username || !password) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Error: Username and Password required.');
                return;
            }

            if (req.url === '/signup') {
                await new User({ username, password }).save();
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Signup Successful! User created: ${username}`);
            }
            else if (req.url === '/login') {
                const user = await User.findOne({ username, password });
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(user ? `Login Successful! Welcome, ${username}` : 'Login Failed: Invalid Credentials.');
            }
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Invalid Request.');
    }
}).listen(3000, () => console.log('Server running at http://localhost:3000'));
