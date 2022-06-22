const BaseCommand = require('../classes/base-command');
const fs = require('fs');
const { ayyPath } = require('../../secret.json');

const allowedServers = ['977024746019516446'];

const allowedFileTypes = ['.jpg', '.jpeg', 'png', 'apng', 'gif', 'jfif'];

let dirs = [];

try {
    dirs = fs
        .readdirSync(ayyPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_'))
        .map(dirent => dirent.name.toLowerCase());
} catch (err) {
    fs.mkdirSync(ayyPath);
}

function getFilesRecursive(rootPath) {
    function rec(path, outList) {
        fs.readdirSync(path, { withFileTypes: true }).forEach(dirent => {
            const fileNameParts = dirent.name.toLowerCase().split('.');
            if (
                dirent.isFile() &&
                allowedFileTypes.includes(
                    fileNameParts[fileNameParts.length - 1]
                )
            ) {
                outList.push(`${path}/${dirent.name}`);
            } else if (dirent.isDirectory()) {
                rec(`${path}/${dirent.name}`, outList);
            }
        });
    }

    const files = [];

    rec(rootPath, files);

    return files;
}

class AyyCommand extends BaseCommand {
    static metadata = {
        commandName: 'ayy',
        description: 'Gets a random pic from the configured path'
    };

    async execute() {
        if (!allowedServers.includes(this.dMsg.guildId) || !this.dMsg.channel.nsfw) {
            return;
        }

        const args = this.parseArgs(1);

        const dirName = args[0];

        const dir = !dirName
            ? ''
            : '/' + dirs.find(dir => dir.startsWith(dirName.toLowerCase()));
        const files = getFilesRecursive(`${ayyPath}${dir}`);
        let file = files[Math.floor(Math.random() * files.length)];
        let tries = 5;
        while (tries) {
            await this.dMsg.channel
                .send({ files: [file] })
                .then(() => (tries = 0))
                .catch(err => {
                    if (err.message == 'Request entity too large') {
                        if (tries < 1) throw err;
                        file = files[Math.floor(Math.random() * files.length)];
                    } else {
                        throw err;
                    }
                    tries--;
                });
        }
    }
}

module.exports = AyyCommand;
