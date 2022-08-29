const path = require('path');
const fs = require('fs');
const { Client } = require('discord.js');
const { treeCharacters } = require('../util/utils');

module.exports = {
    /**
     *
     * @param {Client} client
     */
    load: client => {
        console.log('Loading events');
        fs.readdirSync(path.join(__dirname, '..', 'events'))
            .filter(fileName => fileName.endsWith('.js'))
            .map(fileName => require(`../events/${fileName}`))
            .forEach((handler, i, arr) => {
                if (handler.execOnce) {
                    client.once(handler.eventName, handler.execute);
                } else {
                    client.on(handler.eventName, handler.execute);
                }
                console.log(`${treeCharacters(i, arr.length)}🟢 ${handler.eventName}`);
            });
    }
};
