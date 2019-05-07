'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const axios = require('axios');
// const wordcut = require('wordcut');
// wordcut.init();
// console.log(wordcut.cut('ขอวาร์ปหน่อยครับ'));
// const qs = require('qs');

const config = require('./config.json')['kirk'];
const keywords = require('./keywords.js');

// create LINE SDK client
const client = new line.Client(config);

const app = express();

// app.get('/verify', async (req, res) => {
//   const accessToken = config.channelAccessToken;
//   const url = 'https://api.line.me/v2/oauth/verify';
//   const data = { 'access_token': accessToken };
//   const options = {
//     method: 'POST',
//     headers: { 'content-type': 'application/x-www-form-urlencoded' },
//     data: qs.stringify(data),
//     url,
//   };
//   try {
//     const result = await axios(options);
//     console.log(result.data);
//     return res.status(200).json({ message: 'Request received!', data: result.data });
//   } catch (error) {
//     console.error(error);
//   }
// });

// handleText();
// console.log(isDetectKeyword('xxx'));

app.get('/', (req, res) => {
  res.status(200).send('hello worldddd');
});

// webhook callback
app.post('/webhook', line.middleware(config), (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(req.body.events.map(event => {
    // console.log('event', event);
    // check verify webhook event
    if (event.replyToken === '00000000000000000000000000000000' ||
      event.replyToken === 'ffffffffffffffffffffffffffffffff') {
      return;
    }
    return handleEvent(event);
  }))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

const replyFlex = (token, data) => {
  // console.log(data);
  console.log('Send flex');
  return client.replyMessage(
    token,
    data.map(item => (
      {
        'type': 'flex',
        'altText': 'This is a Flex message',
        'contents': {
          'type': 'bubble',
          'hero': {
            'type': 'image',
            'url': item.img,
            'size': 'full',
            'aspectRatio': '2:1',
          },
          'footer': {
            'type': 'box',
            'layout': 'vertical',
            'contents': [
              {
                'type': 'button',
                'style': 'primary',
                'action': {
                  'type': 'uri',
                  'label': 'Primary style button',
                  'uri': item.link,
                },
              },
            ],
          },
        },
      }
    ))
  );
};

// callback function to handle a single event
function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          // console.log(message);
          if (isDetectKeyword(message.text)) {
            return handleText(message, event.replyToken);
          };
          break;
        case 'image':
          return handleImage(message, event.replyToken);
        case 'video':
          return handleVideo(message, event.replyToken);
        case 'audio':
          return handleAudio(message, event.replyToken);
        case 'location':
          return handleLocation(message, event.replyToken);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }
      break;
    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'beacon':
      const dm = `${Buffer.from(event.beacon.dm || '', 'hex').toString('utf8')}`;
      return replyText(event.replyToken, `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

async function handleText(message, replyToken) {
  const flexData = await responseMessageGenerator(message.text);
  if (flexData) {
    return replyFlex(replyToken, flexData);
  }

  return replyText(replyToken, message.text);
}

function handleImage(message, replyToken) {
  return replyText(replyToken, 'Got Image');
}

function handleVideo(message, replyToken) {
  return replyText(replyToken, 'Got Video');
}

function handleAudio(message, replyToken) {
  return replyText(replyToken, 'Got Audio');
}

function handleLocation(message, replyToken) {
  return replyText(replyToken, 'Got Location');
}

function handleSticker(message, replyToken) {
  return replyText(replyToken, 'Got Sticker');
}

function isDetectKeyword(message) {
  return keywords.some(keyword => {
    return message.match(keyword);
  });
}

async function responseMessageGenerator (message) {
  if (message.match('วาร์ป')) {
    const result = await axios.get('https://api.avgle.com/v1/videos/0?limit=5');
    const viedos = result.data.response.videos;
    const imgPreviews = viedos.map(video => ({
      img: video.preview_url,
      link: video.video_url,
    }));
    // console.log(imgPreviews);
    return imgPreviews;
  }
}

const port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
