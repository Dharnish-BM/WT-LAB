const http = require('http');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/simpleAuth');

const User = mongoose.model('User', new mongoose.Schema({ username: String, password: String }));

// Create Server
http.createServer((req, res) => {
    if (req.method === 'GET') {
        let file = req.url === '/login' ? 'login.html' : 'signup.html';
        fs.readFile(path.join(__dirname, file), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            const { username, password } = parse(body);

            if (req.url === '/signup') {
                await new User({ username, password }).save();
                res.end('<script>alert("Signup Successful!"); window.location="/login";</script>');
            } else if (req.url === '/login') {
                const user = await User.findOne({ username, password });
                res.end(user ? '<script>alert("Login Successful!");</script>' : '<script>alert("Invalid Credentials"); window.location="/login";</script>');
            }
        });
    }
}).listen(3000, () => console.log('Server running at http://localhost:3000/signup'));
