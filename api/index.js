const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8000;

module.exports = function(discord) {
  app.use(bodyParser());

  app.get('/guild/:id/channels', (req, res) => {
    return res.send(discord.guilds.get(req.params.id).channels.array());
  })

  app.get('/guild/:id/emojis', (req, res) => {
    return res.send(discord.guilds.get(req.params.id).emojis.map((e) => ({
      name: e.name,
      url: e.url,
      code: e.toString()
    })));
  })

  app.post('/guild/:id/channels/:chid/chat', (req, res) => {
    let { message } = req.body;
    let channel = discord.guilds.get(req.params.id).channels.get(req.params.chid);
    channel.send(message)

    return res.send();
  });

  app.listen(port, () => console.log('listening to ' + port));
}