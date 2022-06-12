const Discord = require('discord.js');
const fs = require('fs');
const { db } = require('./firebase');
const { createMemberProfile, getConfig } = require('./managers/data-manager');
const { forwardMessage } = require('./util/discord-utils');
const logger = require('./util/logger');
const UserError = require('./classes/errors/user-error');
const embedShop = require('./util/embed-shop');
const configTemplate = require('./config-template.json');
const { canExecute } = require('./util/utils');

process.on('uncaughtException', err => {
    console.log(err.stack);
    process.exit();
});

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.DIRECT_MESSAGES
    ],
    partials: ['CHANNEL']
});

const commands = new Map();

// Load all commands
fs.readdirSync('src/commands')
    .filter(fileName => fileName.endsWith('.js'))
    .forEach(fileName => {
        const commandClass = require(`./commands/${fileName}`);
        commands.set(
            commandClass.metadata.commandName.toLowerCase(),
            commandClass
        );
        logger.log(`✅ ${commandClass.metadata.commandName} command loaded`);
    });

client.once('ready', async () => {
    await client.application.fetch();
    await client.guilds.fetch();
    const guildNames = client.guilds.cache.map(g => g.name);
    logger.log(
        `${client.user.username} is running on (${
            guildNames.length
        }) guilds: ${guildNames.join(', ')}`
    );
});

client.on('guildCreate', async guild => {
    await db.collection('guilds').doc(guild.id).create({
        id: guild.id,
        config: configTemplate
    });
});

client.on('guildMemberAdd', async member => {
    createMemberProfile(member.guild.id, member.id).catch(() => {});

    // Send Welcome Message in the Configured Welcome Channel
    const config = await getConfig(member.guild.id);
    const welcomeMsg = config.welcomeMessage.replace('{member}', member);
    member.guild.channels.cache.get(config.welcomeChannel).send(welcomeMsg); // TODO make sure it works
});

client.on('messageCreate', async msg => {
    // Ignore bot messages
    if (msg.author.bot) {
        return;
    }

    const guild = msg.guild;

    // Handle DMs
    if (!guild) {
        logger.log(`DM received from [${msg.author.id}]: ${msg.content}`);
        forwardMessage(
            `**DM from <@${msg.author.id}>:**\n${msg.content}`,
            msg,
            client.application.owner
        ).catch(err => {
            logger.log(err.stack);
        });
        return;
    }

    // TODO Handle Report Channels

    // Give points to member
    // let memberProfile = await getMemberProfile(msg.guildId, msg.member.id);
    // if (memberProfile) {
    //     memberProfile.points++;
    // } else {
    //     memberProfile = {
    //         id: msg.member.id,
    //         points: 0
    //     };
    // }
    // writeMemberProfile(msg.guildId, memberProfile);

    // Load guild config
    const config = await getConfig(msg.guildId);

    // Handle commands
    if (msg.content.startsWith(config.prefix)) {
        const commandName = msg.content
            .substring(config.prefix.length)
            .split(' ')[0]
            .toLowerCase();

        const commandClass = commands.get(commandName);

        if (!commandClass) {
            return;
        }

        const args = msg.content
            .substring(config.prefix.length)
            .trim()
            .substring(commandName.length)
            .trimStart();

        const command = new commandClass(msg, args);

        if (canExecute(msg.member, commandClass.metadata.permissions)) {
            command.execute().catch(err => {
                if (err instanceof UserError) {
                    msg.reply({
                        embeds: [
                            embedShop.oneLineEmbed(
                                `${
                                    err.message
                                        ? err.message
                                        : 'Something went wrong'
                                }`,
                                'danger',
                                null
                            )
                        ]
                    });
                } else {
                    logger.log(err.stack);
                }
            });
        }
    }
});

client.login(require('../secret.json').botToken);
