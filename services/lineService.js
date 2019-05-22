const { LineClient, Line } = require('messaging-api-line');

const lineConfig = require('../config/lineService.json')['kirk'];
const bot = require('./botService');
const movie = require('./movieService');

const client = LineClient.connect(lineConfig);

const replyText = (token, texts) => client.replyText(token, texts);

const replyFlex = (token, contents) => {
  console.log('Reply flex');
  // const flexContent = contents.map(item => (
  //   Line.createFlex(
  //     'This is Flex.',
  //     {
  //       'type': 'bubble',
  //       'hero': {
  //         'type': 'image',
  //         'url': item.img,
  //         'size': 'full',
  //         'aspectRatio': '2:1',
  //       },
  //       'footer': {
  //         'type': 'box',
  //         'layout': 'vertical',
  //         'contents': [
  //           {
  //             'type': 'button',
  //             'style': 'secondary',
  //             'action': {
  //               'type': 'uri',
  //               'label': 'Watch Movie',
  //               'uri': item.link,
  //             },
  //           },
  //         ],
  //       },
  //     }
  //   )
  // ));

  // console.log(flexContent);
  return client.replyFlex(
    token,
    'This is Flex.',
    {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Header text',
          },
        ],
      },
      hero: {
        type: 'image',
        url: 'https://example.com/flex/images/image.jpg',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Body text',
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Footer text',
          },
        ],
      },
      styles: {
        comment: 'See the example of a bubble style object',
      },
    }
  );
};

async function handleText (message, replyToken) {
  const actionType = bot.getActionType(message.text);
  console.log('actionType>>>', actionType);
  if (actionType === 'sendText') {
    console.log('Send Text', message.text);
    return replyText(replyToken, message.text);
  };

  if (actionType === 'sendMovie') {
    console.log('Send Movie');
    const content = await movie.getMovies();

    return replyFlex(replyToken, content);
  }
};

function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          console.log('Handle Event');
          return handleText(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

module.exports = {
  handleEvent,
};
