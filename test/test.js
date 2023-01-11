require("dotenv").config();
const {
  Client,
  Embed,
  EmitTypes,
  SlashCommand,
  ButtonConstructor,
  MenuConstructor,
  Intents,
} = require("../index");
const client = new Client(process.env.TEST_TOKEN, {
  intents: [
    Intents.GUILD_MESSAGES,
    Intents.GUILDS,
    Intents.GUILD_MEMBERS,
    Intents.MESSAGE_CONTENT,
  ],
  oauth2CacheSelf: true,
});

client.on(EmitTypes.READY, async () => {
  await client.applications.create(
    new SlashCommand()
      .setName("blep")
      .setDescription("Just a test commanddddddd")
      .addOptions(
        "something",
        "hello this is something",
        SlashCommand.STRING,
        true,
        new SlashCommand.Options().setName("namamama").setValue("valuething"),
        new SlashCommand.Options().setName("name thing lol").setValue("xd")
      )
  );
  console.log(`${client.user.tag} has logged in.`);
  client.presence.setActivity("Visual Studio Code");
});

client.on(EmitTypes.MESSAGE_CREATE, async (message) => {
  if (message.author.bot) {
    return;
  } else if (message.content == "t!hello") {
    await message.reply(
      new Embed()
        .setTitle("Hello user")
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setDescription("Hello user")
        .setFooter("Hello hello hello")
        .setTimestamp()
        .setColor("green")
        .setThumbnail(client.user.avatarURL)
    );
  } else if (message.content == "t!delete") {
    await message.channel.delete();
  } else if (message.content == "t!button") {
    await message.channel.send(
      "this happens to be a button :)",
      new ButtonConstructor()
        .setLink("https://google.com")
        .setLabel("hello")
        .setStyle(ButtonConstructor.LINK),
      new ButtonConstructor()
        .setLabel("something cool ya")
        .setCustomId("custom id cool")
        .setStyle(ButtonConstructor.SUCCESS)
    );
  } else if (message.content == "t!regular") {
    await message.channel.send("hello regular");
  } else if (message.content == "t!menu") {
    await message.channel.send(
      "cool a menu",
      new MenuConstructor()
        .setCustomId("hello custom id wow")
        .setPlaceholder("wow select a value cool")
        .addOption(
          new MenuConstructor.Options()
            .setDefault(true)
            .setDescription("just something cool")
            .setLabel("choose")
            .setValue("valuething")
        )
        .addOption(
          new MenuConstructor.Options()
            .setDescription("asasdl;kfjasdl;fkj")
            .setLabel("random lertters")
            .setValue("wwwwwww")
        )
    );
  }
});

client.on(EmitTypes.INTERACTION_CREATE, (interaction) => {
  interaction.defer();

  setTimeout(() => {
    interaction.editResponse("You sent: " + interaction.data.options[0].value);
  }, 2000);
});

client.login();

client.on("error", (message) => {
  console.log(message);
});
