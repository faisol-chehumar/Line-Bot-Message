const express = require('express');

const Line = require('./services/lineService');
const config = require('./config/app.json');

const app = express();

app.get('/', (_, res) => {
  const event = {
    type: 'message',
    replyToken: '1111',
    message: {
      type: 'text',
      text: 'วาร์ป',
    },
  };
  Line.handleEvent(event);
  res.status(200).send('hello worldddd');
});

app.post('/webhook', (req, res) => {
  console.log(res);
  console.log('>>>>>>>>>>>');
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
