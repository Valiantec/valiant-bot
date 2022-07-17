const BaseCommand = require('../classes/base-command');
const fs = require('fs');
const { hPath } = require('../../secret.json');
const embedShop = require('../util/embed-shop');
const { shuffleInPlace } = require('../util/utils');

const allowedServers = ['977024746019516446'];

const allowedFileTypes = [
    '.jpg',
    '.jpeg',
    'png',
    'apng',
    'gif',
    'jfif',
    'webp'
];

const CATEGORY_ALL = 'all';

/**
 *
 * @param {string} path
 * @param {Map<string, Array<string>>} outMap
 */
function rec(path, category, outMap) {
    fs.readdirSync(path, { withFileTypes: true }).forEach(dirent => {
        const direntFullPath = `${path}/${dirent.name}`;
        if (
            dirent.isFile() &&
            allowedFileTypes.some(fileType =>
                dirent.name.toLowerCase().endsWith(fileType)
            )
        ) {
            outMap.get(CATEGORY_ALL).push(direntFullPath);
            const filesArr = outMap.get(category);
            if (filesArr) {
                filesArr.push(direntFullPath);
            } else {
                outMap.set(category, [direntFullPath]);
            }
        } else if (dirent.isDirectory()) {
            rec(direntFullPath, dirent.name, outMap);
        }
    });
}

/**
 * @type {Map<string, Array<string>>}
 */
const categories = new Map();

categories.set(CATEGORY_ALL, []);
rec(hPath, CATEGORY_ALL, categories);

for (const arr of categories.values()) {
    shuffleInPlace(arr);
}

class Command extends BaseCommand {
    static metadata = {
        commandName: 'h',
        description: 'Gets a random image from the configured path'
    };

    async execute() {
        if (
            !allowedServers.includes(this.dMsg.guildId) ||
            !this.dMsg.channel.nsfw
        ) {
            return;
        }

        const args = this.parseArgs(1);

        const dirName = args[0]?.toLowerCase();

        if (dirName == 'categories') {
            let categoriesString = '';

            for (const category of categories.keys()) {
                categoriesString += category + ', ';
            }

            categoriesString = `\`${categoriesString.slice(0, -2)}\``;

            this.dMsg.channel.send({
                embeds: [embedShop.oneLineEmbed(categoriesString)]
            });
        } else {
            const dir = dirName || CATEGORY_ALL;
            const files = categories.get(dir) || categories.get(CATEGORY_ALL);
            let file = files.shift();
            files.push(file);
            let tries = 5;
            while (tries) {
                await this.dMsg.channel
                    .send({ files: [file] })
                    .then(() => (tries = 0))
                    .catch(err => {
                        if (
                            err.message == 'Request entity too large' &&
                            --tries
                        ) {
                            file = files.shift();
                            files.push(file);
                        } else {
                            throw err;
                        }
                    });
            }
        }
    }
}

module.exports = Command;
