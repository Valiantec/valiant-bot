const Discord = require('discord.js');
const fs = require('fs');
const logger = require('./util/logger');

process.on('uncaughtException', err => {
    console.log('######### Uncaught Exception ##########');
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

client.commands = new Discord.Collection();

// Load Commands
fs.readdirSync('src/commands')
    .filter(fileName => fileName.endsWith('.js'))
    .forEach(fileName => {
        const commandClass = require(`./commands/${fileName}`);
        client.commands.set(
            commandClass.metadata.commandName.toLowerCase(),
            commandClass
        );
        logger.log(`✅ ${commandClass.metadata.commandName} command loaded`);
    });

// Load Event Handlers
fs.readdirSync('src/event-handlers')
    .filter(fileName => fileName.endsWith('.js'))
    .forEach(fileName => {
        const handler = require(`./event-handlers/${fileName}`);
        if (handler.execOnce) {
            client.once(handler.eventName, handler.execute);
        } else {
            client.on(handler.eventName, handler.execute);
        }
    });

client.login(require('../secret.json').botToken);
