const { InteractionType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, Colors } = require("discord.js");
const fs = require("fs");
const config = require("../config.js");
let database = require("../database.json");
const axios = require("axios");
module.exports = async(client, interaction) => {
if(interaction.user.bot) return;

if (interaction.type === InteractionType.ApplicationCommand) {
fs.readdir("./commands", (err, files) => {
if (err) throw err;
files.forEach(async (f) => {
let props = require(`../commands/${f}`);
if (interaction.commandName.toLowerCase() === props.name.toLowerCase()) {
try {
return props.run(client, interaction);
} catch (e) {
return interaction.reply({ content: `ERROR\n\n\`\`\`${e.message}\`\`\``, ephemeral: true }).catch(e => { })
}
}
});
});
}

if (interaction?.type === InteractionType?.MessageComponent) {
    if (interaction.user.id !== config.owner) return interaction?.reply({ content: "This command is only available to the bot owner.", ephemeral: true }).catch((e) => { });

    switch (interaction?.values[0]) {
    case 'status': {
        const Modal = new ModalBuilder()
        .setCustomId("status")
        .setTitle("Change Status")
        
        const list = new TextInputBuilder()
        .setCustomId("status")
        .setLabel("Status")
        .setRequired(true)
        .setStyle(TextInputStyle?.Short)
        .setPlaceholder("Open or Close")
        .setMaxLength(5)
        .setMinLength(4)
        
        const row = new ActionRowBuilder().addComponents(list);
        Modal?.addComponents(row)
        await interaction?.showModal(Modal).catch(e => { })
    }
    break 
    case 'url': {
        const Modal = new ModalBuilder()
        .setCustomId("url")
        .setTitle("Change Url")
        
        const list = new TextInputBuilder()
        .setCustomId("url")
        .setLabel("Url")
        .setRequired(true)
        .setStyle(TextInputStyle?.Short)
        .setPlaceholder("Url")
        .setMaxLength(25)
        .setMinLength(1)
        
        const row = new ActionRowBuilder().addComponents(list);
        Modal?.addComponents(row)
        await interaction?.showModal(Modal).catch(e => { })
    }
    break
    case 'account_token': {
        const Modal = new ModalBuilder()
        .setCustomId("account_token")
        .setTitle("Change Account Token")
        
        const list = new TextInputBuilder()
        .setCustomId("account_token")
        .setLabel("Account Token")
        .setRequired(true)
        .setStyle(TextInputStyle?.Short)
        .setPlaceholder("Account Token")
        .setMaxLength(150)
        
        const row = new ActionRowBuilder().addComponents(list);
        Modal?.addComponents(row)
        await interaction?.showModal(Modal).catch(e => { })
    }
    break
    case 'guild_id': {
        const Modal = new ModalBuilder()
        .setCustomId("guild_id")
        .setTitle("Change Guild Id")

        const list = new TextInputBuilder()
        .setCustomId("guild_id")
        .setLabel("Guild Id")
        .setRequired(true)
        .setStyle(TextInputStyle?.Short)
        .setPlaceholder("Guild Id")
        .setMaxLength(30)
        .setMinLength(7)

        const row = new ActionRowBuilder().addComponents(list);
        Modal?.addComponents(row)
        await interaction?.showModal(Modal).catch(e => { })
    }
    break
    case 'runtime': {
        const Modal = new ModalBuilder()
        .setCustomId("runtime")
        .setTitle("Change Runtime")

        const list = new TextInputBuilder()
        .setCustomId("runtime")
        .setLabel("Runtime")
        .setRequired(true)
        .setStyle(TextInputStyle?.Short)
        .setPlaceholder("1000 | 1000=1s")
        .setMaxLength(6)
        .setMinLength(2)

        const row = new ActionRowBuilder().addComponents(list);
        Modal?.addComponents(row)
        await interaction?.showModal(Modal).catch(e => { })
    }
    break
    case 'log_channel': {
        const Modal = new ModalBuilder()
        .setCustomId("log_channel")
        .setTitle("Change Log Channel")

        const list = new TextInputBuilder()
        .setCustomId("log_channel")
        .setLabel("Log Channel")
        .setRequired(true)
        .setStyle(TextInputStyle?.Short)
        .setPlaceholder("Log Channel Id")
        .setMaxLength(30)
        .setMinLength(7)

        const row = new ActionRowBuilder().addComponents(list);
        Modal?.addComponents(row)
        await interaction?.showModal(Modal).catch(e => { })
    }
    break
    }
}


if (interaction?.type === InteractionType?.ModalSubmit) {
    switch (interaction?.customId) {
    case 'status': {
        const content = interaction?.fields?.getTextInputValue("status")
            if (content == "Open") {
                if (!database?.url) return interaction?.reply({ content: "Please enter the url first!", ephemeral: true }).catch((e) => { });
                if (!database?.account_token) return interaction?.reply({ content: "Please enter the account token first!", ephemeral: true }).catch((e) => { });
                if (!database?.guild_id) return interaction?.reply({ content: "Please enter the guild id first!", ephemeral: true }).catch((e) => { });
                let guild = client?.guilds?.cache?.get(database?.guild_id)
                if (!guild) return interaction?.reply({ content: "The guild id you entered is invalid! Please add me to the server and try to save me that way.", ephemeral: true }).catch((e) => { });
                if (!database?.runtime) return interaction?.reply({ content: "Please enter the runtime first!", ephemeral: true }).catch((e) => { });
                if (!database?.log_channel) return interaction?.reply({ content: "Please enter the log channel first!", ephemeral: true }).catch((e) => { });
                let channel = client?.channels?.cache?.get(database?.log_channel)
                if (!channel) return interaction?.reply({ content: "The channel id you entered is invalid! Please add me to the server and try to save me that way.", ephemeral: true }).catch((e) => { });
                database.status = content
                require("fs").writeFileSync("./database.json", JSON.stringify(database, null, 2))
                embedUpdate()
               return interaction?.reply({ content: "The status has been successfully changed! -> " + content, ephemeral: true }).catch((e) => { });
            } else if (content == "Close") {
                database.status = content
                require("fs").writeFileSync("./database.json", JSON.stringify(database, null, 2))
                embedUpdate()
                return interaction?.reply({ content: "The status has been successfully changed! -> " + content, ephemeral: true }).catch((e) => { });
            } else {
                return interaction?.reply({ content: "The status you entered is invalid! Open or Close", ephemeral: true }).catch((e) => { });
            }
    }
    break
    case 'url': {
        const content = interaction?.fields?.getTextInputValue("url")
                database.url = content
            fs.writeFileSync("./database.json", JSON.stringify(database, null, 2))
            embedUpdate()
                return interaction?.reply({ content: "The url has been successfully changed! -> " + content, ephemeral: true }).catch((e) => { });
        }
    break
    case 'account_token': {
        const content = interaction?.fields?.getTextInputValue("account_token")
                let data = await fetch(`https://discord.com/api/oauth2/authorize?client_id=${client?.user?.id}&redirect_uri=http%3A%2F%2Flocalhost%3A3001&response_type=code&scope=identify%20email%20guilds.join`, { "headers": { "authorization": content, "content-type": "application/json" }, "body": "{\"permissions\":\"0\",\"authorize\":true}", "method": "POST" }).then(x => x.json())

                if (data.location) {
                    let query = data?.location.split("?")[1].split("=")[1]

                    const tokenResponseData = await axios({
                        method: 'POST',
                        url: 'https://discord.com/api/oauth2/token',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: new URLSearchParams({
                            client_id: client?.user?.id,
                            client_secret: config?.BOT_SECRET,
                            code: query,
                            grant_type: 'authorization_code',
                            redirect_uri: `http://localhost:3001`,
                            scope: 'identify',
                        }).toString()
                    }).then(x => x?.data);


                    const userResponseData = await axios({
                        method: 'GET',
                        url: 'https://discord.com/api/users/@me',
                        headers: {
                            authorization: `${tokenResponseData?.token_type} ${tokenResponseData?.access_token}`
                        }
                    }).then(x => x.data);

                    database.account_token = content
                    database.account_id = userResponseData?.id
                    require("fs").writeFileSync("./database.json", JSON.stringify(database, null, 2))
                    embedUpdate()
                return interaction?.reply({ content: "The account token has been successfully changed! -> " + userResponseData?.username + "#" + userResponseData?.discriminator, ephemeral: true }).catch((e) => { });
            } else {
                return interaction?.reply({ content: "The account token you entered is invalid!", ephemeral: true }).catch((e) => { });
            }
    }
    break
    case 'guild_id': {
        const content = interaction?.fields?.getTextInputValue("guild_id")
                let guild = client?.guilds?.cache?.get(content)
                if(!guild) return interaction?.reply({ content: "The guild id you entered is invalid! Please add me to the server and try to save me that way.", ephemeral: true }).catch((e) => { });
                database.guild_id = content
                require("fs").writeFileSync("./database.json", JSON.stringify(database, null, 2))
                embedUpdate()
                return interaction?.reply({ content: "The guild id has been successfully changed! -> " + guild?.name, ephemeral: true }).catch((e) => { });
        }
    break
    case 'runtime': {
        const content = interaction?.fields?.getTextInputValue("runtime")
                if (isNaN(content)) return interaction?.reply({ content: "The runtime you entered is invalid!", ephemeral: true }).catch((e) => { });
                database.runtime = Number(content)
                require("fs").writeFileSync("./database.json", JSON.stringify(database, null, 2))
                embedUpdate()
                return interaction?.reply({ content: "The runtime has been successfully changed! -> " + content, ephemeral: true }).catch((e) => { });
        }
    break
    case 'log_channel': {
        const content = interaction?.fields?.getTextInputValue("log_channel")
                let channel = client?.channels?.cache?.get(content)
                if(!channel) return interaction?.reply({ content: "The channel id you entered is invalid! Please add me to the server and try to save me that way.", ephemeral: true }).catch((e) => { });
                database.log_channel = content
                require("fs").writeFileSync("./database.json", JSON.stringify(database, null, 2))
                embedUpdate()
                return interaction?.reply({ content: "The log channel has been successfully changed! -> <#"+ content +">", ephemeral: true }).catch((e) => { });
    }
    break

        }
    }

    async function embedUpdate(){
        let channel = client?.channels?.cache?.get(database?.channelId)
        if(!channel) return;
       let message = await channel?.messages?.fetch(database?.messageId)

        let embed = new EmbedBuilder()
        .setTitle("Bot Settings!")
        .setThumbnail("https://static.vecteezy.com/system/resources/previews/008/966/637/original/vus-logo-vus-letter-vus-letter-logo-design-initials-vus-logo-linked-with-circle-and-uppercase-monogram-logo-vus-typography-for-technology-business-and-real-estate-brand-vector.jpg")
        .setColor(Colors.Green)
        .setDescription(`> **Status:** \`${database.status || "False"}\`
> **Url:** \`${database.url || "None"}\`
> **Account Token:** ||\`${database.account_token || "None"}\`||
> **Guild:** \`${client.guilds.cache.get(database.guild_id)?.name + " (" + database.guild_id + ")" || "None"}\`
> **Runtime:** \`${database.runtime || "None"}\`
> **Log Channel:** \`${client.channels.cache.get(database.log_channel)?.name + "\` (<#" + database.log_channel + ">)" || "\`None\`"}`)
        .setTimestamp()
        message?.edit({ embeds: [embed] }).catch(e => { })
        
    }

    }