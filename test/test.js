require('dotenv').config();
const { Client, Embed, EmitTypes } = require('../index');
const client = new Client(process.env.TESTTOKEN, {"oauth2CacheSelf": true});


client.on(EmitTypes.READY, async () => {
    console.log(`${client.user.tag} has logged in.`);
    // console.log(await client.api('oauth2/applications/@me'));
});

client.on(EmitTypes.MESSAGE_CREATE, message => {
    if (!message.author.bot && message.content == "t!hello") message.channel.send(new Embed().setTitle("Hello user").setAuthor(message.author.tag, message.author.avatarURL).setDescription("Hello user").setFooter("Hello hello hello").setTimestamp().setColor("green").setThumbnail(client.user.avatarURL));
});

client.on(EmitTypes.MESSAGE_DELETE, message => {
    console.log(message)
});

client.on(EmitTypes.CHANNEL_PINS_UPDATE, pins => console.log(pins));


client.login();