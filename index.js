const { Client, GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");
const config = require("./config.js");
const ubreq = require("request")
let database = require("./database.json");
const client = new Client({
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

module.exports = client;

client.commands = [];
fs.readdir("./commands", (err, files) => {
  if (err) throw err;
  files.forEach(async (f) => {
    try {
      let props = require(`./commands/${f}`);
      client.commands.push({
        name: props.name,
        description: props.description,
        options: props.options
      });
      console.log(`➤ | Loaded Command: ${props.name}`);
    } catch (err) {
      console.log(err);
    }
  });
});

fs.readdir("./events", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    console.log(`➤ | Loadded Event: ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});



client.on("ready", async () => {
  function sender() {
    let ms = Math.floor(Math.random() * (75 - 57 + 1) + 57)
    const csLOG = client.channels.cache.get(database.log_channel)
    database.status = "Close"
    fs.writeFileSync("./database.json", JSON.stringify(database, null, 2))
    process.title = "Vanity URL Sniper | " + database.url + " | Stopped | " + ms + "ms"
    if (csLOG) {
      csLOG.send({ content: "<@" + config.owner + ">, **" + database.url + "** Named Custom URL Successfully Received and Bot Stopped Working! **(" + ms + "ms)**" }).catch(e => {
        console.log(database.url + " Named Custom URL Successfully Received and Bot Stopped Working! (" + ms + "ms)")
      })
    } else {
      console.log(database.url + " Named Custom URL Successfully Received and Bot Stopped Working! (" + ms + "ms)")
    }
  }

  async function sniper(serverID, url) {
    console.log("Sniping " + url)
    ubreq.patch({
      url: `https://discord.com/api/v8/guilds/${serverID}/vanity-url`,
      headers: {
        "authorization": database.account_token
      },
      json: { "code": url }
    }, (error, response, body) => {
      if (error) {
        let csLOG = client.channels.cache.get(database.log_channel)
        if (csLOG) {
          csLOG.send({ content: "<@" + config.owner + ">, An error occurred while sending the request to the discord api!" }).catch(e => {
            console.log("An error occurred while sending the request to the discord api!" + error)
          })
        } else {
          console.log("An error occurred while sending the request to the discord api!" + error)
        }
      } else {
        if (response.statusCode == 200) {
          sender()
        }
      }
    })
  }


  function runner() {
    database = require("./database.json");
    if (database.status === "Open") {
      if (client.guilds.cache.get(database.guild_id)) {
        if (client.guilds.cache.get(database.guild_id).features.includes('VANITY_URL')) {
          if (database.url) {
            if (client.guilds.cache.get(database.guild_id).vanityURLCode === database.url) {
              sender()
            } else {
              client.fetchInvite(database.url).then(ub => {
              }).catch(e => {
                if (e?.message.includes("Unknown Invite")) {
                  sniper(database.guild_id, database.url)
                }
              })
            }
          } else {
            database.status = "Close"
            fs.writeFileSync("./database.json", JSON.stringify(database, null, 2))
            const csLOG = client.channels.cache.get(database.log_channel)
            if (csLOG) {
              csLOG.send({ content: "<@" + config.owner + ">, The bot could not be started because the url was not entered!" }).catch(e => {
                console.log("The bot could not be started because the url was not entered!")
              })
            } else {
              console.log("The bot could not be started because the url was not entered!")
            }
          }
        } else {
          database.status = "Close"
          fs.writeFileSync("./database.json", JSON.stringify(database, null, 2))
          const csLOG = client.channels.cache.get(database.log_channel)
          if (csLOG) {
            csLOG.send({ content: "<@" + config.owner + ">, The bot could not be started because the server whose ID was entered does not have the VANITY_URL feature!" }).catch(e => {
              console.log("The bot could not be started because the server whose ID was entered does not have the VANITY_URL feature!")
            })
          } else {
            console.log("The bot could not be started because the server whose ID was entered does not have the VANITY_URL feature!")
          }
        }
      } else {
        database.status = "Close"
        fs.writeFileSync("./database.json", JSON.stringify(database, null, 2))
        const csLOG = client.channels.cache.get(database.log_channel)
        if (csLOG) {
          csLOG.send({ content: "<@" + config.owner + ">, The bot could not be started because the server whose ID was entered could not be found!" }).catch(e => {
            console.log("The bot could not be started because the server whose ID was entered could not be found!")
          })
        } else {
          console.log("The bot could not be started because the server whose ID was entered could not be found!")
        }
      }
    }


  }

setInterval(runner, database.runtime)

})



client.login(config.TOKEN || process.env.TOKEN).catch(e => {
  console.log("Your Bot Token is Invalid Or Your Bot's INTENTS Are OFF!")
})

const express = require("express");
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
