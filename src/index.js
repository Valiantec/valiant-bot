require('dotenv').config();
require('./util/logger').integrate();

const path = require('path');
const fs = require('fs');

const { Client, GatewayIntentBits, Partials, Collection, PermissionFlagsBits } = require('discord.js');

process.on('uncaughtException', err => {
    console.log('######### Uncaught Exception ##########');
    console.log(err);
    process.exit();
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

client.commands = new Collection();

console.log('Loading commands');
fs.readdirSync(path.join(__dirname, 'commands'))
    .filter(fileName => fileName.endsWith('.js'))
    .forEach(fileName => {
        try {
            const Command = require(`./commands/${fileName}`);
            client.commands.set(Command.metadata.commandName.toLowerCase(), Command);
            Command.metadata.aliases?.forEach(alias => client.commands.set(alias, Command));
            console.log(
                `✅ command: [${
                    Command.metadata.permissions == PermissionFlagsBits.Administrator
                        ? 'ADM'
                        : Command.metadata.permissions == PermissionFlagsBits.ManageMessages
                        ? 'MOD'
                        : 'ALL'
                }] ${fileName}`
            );
        } catch (err) {
            console.log(`❌ command: ${fileName} [Failed to load]\n${err}`);
        }
    });

console.log('Loading events');
fs.readdirSync(path.join(__dirname, 'events'))
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
            console.log(`🔴 event: ${fileName} [Failed to load]\n${err}`);
        }
    });

client.login(process.env.BOT_TOKEN).then(() => console.log(`Logged in`));
