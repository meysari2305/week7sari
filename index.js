let express = require('express');

let fs = require('fs');

let jsonServer = require('json-server');
let bodyparser = require('body-parser');
const { name } = require('ejs');

let app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const jsonServerMiddleware = jsonServer.router('api.json');

app.use('/api', jsonServerMiddleware);
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.redirect('/users');
});

app.get('/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync('api.json')).users;
  res.render('listUsers.ejs', { data: users });
});

app.post('/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync('api.json')).users;

  let user = {
    id: Date.now(),
    name: req.body.name,
    age: req.body.age,
    country: req.body.country,
  };

  users.push(user);

  fs.writeFileSync('api.json', JSON.stringify({ users }));
  res.redirect('/users');
});

app.get('/delUser/:id', (req, res) => {
  const users = JSON.parse(fs.readFileSync('api.json')).users;
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));

  users.slice(userIndex, 1);
  fs.writeFileSync('api.json', JSON.stringify({ users }));
  res.redirect('/users');
});

app.listen(5300, () => {
  console.log('app is run on port 5300');
});
