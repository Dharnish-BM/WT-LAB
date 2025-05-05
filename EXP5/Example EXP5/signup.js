const http = require('http');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function checkLogin(username, password) {
  try {
    await client.connect();
    const db = client.db("Student");
    const users = db.collection("login");

    const user = await users.findOne({ username });
    return user && user.password === password;
  } finally {
    await client.close();
  }
}

http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/submit_login') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      const { username, password } = querystring.parse(body);
      const success = await checkLogin(username, password);

      res.writeHead(success ? 200 : 401, { 'Content-Type': 'text/html' });
      res.end(success ?
        `<html><body><script>
          alert('Login successful');
          document.body.innerHTML = '<h1>Welcome, ${username}</h1>';
        </script></body></html>`
        : '<html><body><h1>Login failed</h1></body></html>'
      );
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html><body>
        <h2>Login</h2>
        <form action="/submit_login" method="post">
          <label>Username: <input type="text" name="username" required></label><br>
          <label>Password: <input type="password" name="password" required></label><br>
          <button type="submit">Login</button>
        </form>
      </body></html>
    `);
  }
}).listen(8080, () => console.log('Server running on port 8080'));