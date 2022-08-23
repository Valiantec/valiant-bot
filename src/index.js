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
    .map(fileName => require(`./commands/${fileName}`))
    .sort((c1, c2) => c1.metadata.permissions?.toString().localeCompare(c2.metadata.permissions?.toString()))
    .forEach(Command => {
        try {
            client.commands.set(Command.metadata.commandName.toLowerCase(), Command);
            Command.metadata.aliases?.forEach(alias => client.commands.set(alias, Command));
            console.log(
                `✅ command: [${
                    Command.metadata.permissions == PermissionFlagsBits.Administrator
                        ? 'ADM'
                        : Command.metadata.permissions == PermissionFlagsBits.ManageMessages
                        ? 'MOD'
                        : 'ALL'
                }] ${Command.metadata.commandName}`
            );
        } catch (err) {
            console.log(`❌ command: ${Command.metadata.commandName} [Failed to load]\n${err}`);
        }
    });

console.log('Loading events');
fs.readdirSync(path.join(__dirname, 'events'))
    .filter(fileName => fileName.endsWith('.js'))
    .map(fileName => require(`./events/${fileName}`))
    .forEach(handler => {
        try {
            if (handler.execOnce) {
                client.once(handler.eventName, handler.execute);
            } else {
                client.on(handler.eventName, handler.execute);
            }
            console.log(`🟢 event: ${handler.eventName}`);
        } catch (err) {
            console.log(`🔴 event: ${handler.eventName} [Failed to load]\n${err}`);
        }
    });

client.login(process.env.BOT_TOKEN).then(() => console.log(`Client logged in`));
