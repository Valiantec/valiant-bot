require('dotenv').config();
require('./util/logger').integrate();

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const eventsLoader = require('./loader/events-loader');
const commandsLoader = require('./loader/commands-loader');

process.on('uncaughtException', err => {
    console.log(err);
    process.exit();
});

console.log('Initializing...');

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

commandsLoader.load(client);
eventsLoader.load(client);

client.login(process.env.BOT_TOKEN).then(() => console.log(`Client logged in`));
