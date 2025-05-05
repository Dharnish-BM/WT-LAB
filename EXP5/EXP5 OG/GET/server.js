const http = require('http');
const mongoose = require('mongoose');
const fs = require('fs');
const url = require('url');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/simpleAuth');

const User = mongoose.model('User', new mongoose.Schema({ username: String, password: String }));

// Create Server
http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { username, password } = parsedUrl.query;

    if (req.url === '/' || req.url === '/index.html') {
        // Serve the HTML form
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    else if (parsedUrl.pathname === '/signup' && username && password) {
        // Save user to database
        await new User({ username, password }).save();
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Signup Successful! User created: ${username}`);
    }
    else if (parsedUrl.pathname === '/login' && username && password) {
        // Check if user exists
        const user = await User.findOne({ username, password });
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(user ? `Login Successful! Welcome, ${username}` : 'Login Failed: Invalid Credentials.');
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Invalid Request. Use the signup or login form.');
    }
}).listen(3000, () => console.log('Server running at http://localhost:3000'));
