const Discord = require('discord.js');
const fs = require('fs');
const logger = require('./util/logger');

logger.integrate();

process.on('uncaughtException', err => {
    console.log('######### Uncaught Exception ##########');
    console.log(err);
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

console.log('Loading commands');
fs.readdirSync('src/commands')
    .filter(fileName => fileName.endsWith('.js'))
    .forEach(fileName => {
        try {
            const Command = require(`./commands/${fileName}`);
            client.commands.set(
                Command.metadata.commandName.toLowerCase(),
                Command
            );
            console.log(`✅ command: ${fileName}`);
        } catch (err) {
            console.log(`❌ command: ${fileName} [Failed to load]`);
        }
    });

console.log('Loading events');
fs.readdirSync('src/events')
    .filter(fileName => fileName.endsWith('.js'))
    .forEach(fileName => {
        try {
            const handler = require(`./events/${fileName}`);
            if (handler.execOnce) {
                client.once(handler.eventName, handler.execute);
            } else {
                client.on(handler.eventName, handler.execute);
            }
            console.log(`🟢 event: ${fileName}`);
        } catch (err) {
            console.log(`🔴 event: ${fileName} [Failed to load]`);
        }
    });

client.login(require('../secret.json').botToken).then(()=>console.log(`Logged in`));
