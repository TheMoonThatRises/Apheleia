require('dotenv').config();
const { Client, Intents, Embed } = require('../index');
const client = new Client(process.env.TESTTOKEN, [Intents.GUILDS, Intents.GUILD_MESSAGES, Intents.GUILD_MEMBERS]);


client.on(Client.READY, () => {
    console.log(`${client.user.tag} has logged in.`);
});

client.on(Client.MESSAGE_CREATE, message => {
    if (!message.author.bot) message.channel.send(new Embed().setTitle("Hello user").setAuthor(message.author.tag, message.author.avatarURL).setDescription("Hello user").setFooter("Hello hello hello").setTimestamp().setColor("green").setThumbnail(client.user.avatarURL));
});


client.login();