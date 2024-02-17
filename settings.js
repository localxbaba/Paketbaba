const { EmbedBuilder, Colors, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const config = require("../config.js");
module.exports = {
    name: "settings",
    description: "Edit and view bot settings!",
    type: 1,
    options: [],
    run: async (client, interaction) => {

        if (interaction.user.id !== config.owner) return interaction?.reply({ content: "This command is only available to the bot owner.", ephemeral: true }).catch((e) => { });

        const database = require("../database.json");

        const select = new StringSelectMenuBuilder()
        .setCustomId('menu')
        .setPlaceholder('Please select an option!')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Status')
                .setDescription('Change the bot status!')
                .setEmoji('📊')
                .setValue('status'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Url')
                .setDescription('Please write the url to snip!')
                .setEmoji('📝')
                .setValue('url'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Account Token')
                .setDescription('Please enter the discord account token that will register the url on the server!')
                .setEmoji('🔑')
                .setValue('account_token'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Guild Id')
                .setDescription('Please enter the guild id that will register the url on the server!')
                .setEmoji('📋')
                .setValue('guild_id'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Runtime')
                .setDescription('Change the bot runtime.')
                .setEmoji('🕐')
                .setValue('runtime'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Log Channel')
                .setDescription('Write the log channel id to be informed about the url!')
                .setEmoji('📌')
                .setValue('log_channel'),
        );

            const embed = new EmbedBuilder()
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
            return interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(select)], fetchReply: true }).then(async (msg) => {
  
                database.channelId = interaction.channelId
                database.messageId = msg.id
                require("fs").writeFileSync("./database.json", JSON.stringify(database, null, 2))
                setTimeout(async() => {
                    msg.delete().catch((e) => { });
                }, 300000)
            }).catch((e) => { });

    },
};