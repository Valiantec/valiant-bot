# Inviting the bot
You can invite the currently running instance of the bot to your own server using this link:\
https://discord.com/api/oauth2/authorize?client_id=896634815456108544&permissions=8&scope=bot

# Prerequisites
* node (version 16.9+)

# Importing the project
1. clone the repository using `git clone https://github.com/Valiantec/valiant-bot.git`
2. open a terminal inside the cloned directory
3. run `npm install`

# Running the bot
1. Create your bot on the Discord Developer Portal and copy its token
2. Create the environment variables file called `.env` and place it in the root directory of the project (next to README.md). It should look like this:
```
BOT_TOKEN="REPLACE_WITH_YOUR_BOT_TOKEN"
```
3. Open any terminal in the root directory of the bot and run the command: `npm start`

## For auto re-run on crash
run this from powershell
```ps1
while ($true) {
    npm start;
    sleep 5;
}
```
