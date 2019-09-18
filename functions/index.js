'use strict';

const {
  dialogflow,
  Image,
  BasicCard,
  Button
} = require('actions-on-google');

const functions = require('firebase-functions');
const app = dialogflow({debug: true});

const API_KEY = 'AIzaSyDofJ3IG-f3y3UkwYM3Xl0yH5Af8pA3YyE';

app.intent('GetPopular', (conv, {artist}) => {
    console.log(artist);

    var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=" + encodeURIComponent(artist)+ "&type=video&order=viewCount&videoCategoryId=10&key=" + API_KEY;
    const axios = require('axios');
    return axios.get(url)
        .then(response => {
          var output = JSON.stringify(response.data);
          var song_fields = response.data.items[1];
          return song_fields;
      }).then(output => {
          var song_title = output.snippet.title;

          let jsdom = require('jsdom').JSDOM
          let dom = new jsdom(song_title);
          song_title = dom.window.document.body.innerHTML;

          var song_link = JSON.stringify(output.id.videoId);
          var song_thumbnail = output.snippet.thumbnails.high.url;

          conv.ask(`Here is your result...`)
          conv.ask(new BasicCard({
            text: `The most popular song is: __${song_title}__`,
            buttons: new Button({
              title: 'Watch',
              url: `https://www.youtube.com/watch?v=` + song_link.slice(1, -1),
            }),
            image: new Image({
              url: song_thumbnail,
              alt: 'Song thumbnail',
            }),
            display: 'CROPPED',
          }));
          conv.close(`See you next time.`);
          return;
      })
});

exports.GetPopular = functions.https.onRequest(app);
