const config = require("../config.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

module.exports = async (client) => {

  const rest = new REST({ version: "10" }).setToken(config.TOKEN);
  (async () => {
    try {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: await client.commands,
      });
      console.log("➤ | Successfully Loadded Application [/] Commands!");
    } catch (e) {
      console.log("X | Failed To Load Application [/] Commands!\n➤ | " + e);
    }
  })();

  console.log(`➤ | Logged In ${client.user.tag}!`);
  client.user.setActivity(`locali çok seviyorm ♥ `);

}