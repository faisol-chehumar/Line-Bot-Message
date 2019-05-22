const express = require('express');
const bodyParser = require('body-parser');

const Line = require('./services/lineService');
const config = require('./config/app.json');

const app = express();

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  // const event = {
  //   type: 'message',
  //   message: {
  //     type: 'text',
  //     text: 'ลายแทง',
  //   },
  // };
  // Line.handleEvent(event);
  console.log(res);
  res.status(200).send(req.body.events);
});

app.post('/webhook', (req, res) => {
  console.log(req);
  console.log(res);
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }

  Promise.all(req.body.events.map(event => {
    if (event.replyToken === '00000000000000000000000000000000' ||
      event.replyToken === 'ffffffffffffffffffffffffffffffff') {
      return;
    }

    return Line.handleEvent(event);
  }))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
