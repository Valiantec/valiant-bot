require('dotenv').config();
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
let commands = [];

// load commands
// fs.readdirSync('src/slash-commands')
//     .filter(fileName => fileName.endsWith('.js'))
//     .forEach(fileName => {
//         try {
//             const Command = require(`./slash-commands/${fileName}`);
// 			if (Command.getSlashCommandConfig) {
// 				commands.push(Command.getSlashCommandConfig());
// 				console.log(`✅ command: ${fileName}`);
// 			} else {
// 				console.log(`❌ command: ${fileName} [No Slash Command Config]`);
// 			}
//         } catch (err) {
//             console.log(`❌ command: ${fileName} [Failed to load]`);
//         }
//     });

commands = []; //commands.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

rest
  .put(Routes.applicationCommands(process.env.APP_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
