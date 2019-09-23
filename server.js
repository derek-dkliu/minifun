//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/minifun'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname+'/dist/minifun/index.html'));
});

// Start the app by listening on the default Heroku port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Server started on port ' + port);
});

