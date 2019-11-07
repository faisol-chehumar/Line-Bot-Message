const express = require('express');
const bodyParser = require('body-parser');

const Line = require('./controllers/line');
const config = require('./config/app.json');

const app = express();

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }));

app.get('/', (_, res) => {
  res.status(200).send('Hello');
});

app.get('/broadcast', (req, res) => {
  console.log(req.body.events);
  // Line.getUserProfile('U738a5fc36ba9798137f943eb4805811d');
  const result = Line.broadcast([
    'U738a5fc36ba9798137f943eb4805811d',
    // 'U89be081be7e2f54ed8800a0f8051839c',
  ], 'Roger That!');

  res.status(200).send(result);
});

// app.post('/webhook', (req, res) => {
//   // console.log(req.body.events);
//   if (!Array.isArray(req.body.events)) {
//     return res.status(500).end();
//   }

//   Promise.all(req.body.events.map(event => {
//     if (event.replyToken === '00000000000000000000000000000000' ||
//       event.replyToken === 'ffffffffffffffffffffffffffffffff') {
//       return;
//     }

//     return Line.handleEvent(event);
//   }))
//     .then(() => res.end())
//     .catch((err) => {
//       console.error(err);
//       res.status(500).end();
//     });
// });

const port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
