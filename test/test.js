require("dotenv").config();
const {Client, Embed, EmitTypes} = require("../index");
const client = new Client(process.env.TESTTOKEN, {"oauth2CacheSelf": true, "cacheBotMessage": false});


client.on(EmitTypes.READY, () => console.log(`${client.user.tag} has logged in.`));

client.on(EmitTypes.MESSAGE_CREATE, message => {
    if (!message.author.bot && message.content == "t!hello") {
        message.reply(new Embed().setTitle("Hello user")
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setDescription("Hello user")
            .setFooter("Hello hello hello")
            .setTimestamp()
            .setColor("green")
            .setThumbnail(client.user.avatarURL));
        message.delete();
    }

});

client.on(EmitTypes.MESSAGE_DELETE, message => {
    console.log(message);
});

client.on(EmitTypes.CHANNEL_PINS_UPDATE, pins => console.log(pins));


client.login();