const http = require('http');
const querystring = require('querystring');

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/submit_login') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const { username, password } = querystring.parse(body);
      const success = password === 'dharnish';

      res.writeHead(success ? 200 : 401, { 'Content-Type': 'text/html' });
      res.end(success ?
        `<html><body><script>
          alert('Password matched successfully');
          document.body.innerHTML = '<h1>Welcome, ${username}</h1><p>Password: ${password}</p>';
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
