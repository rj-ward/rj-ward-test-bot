// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '&'

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

client.on('message', async (msg) => {
//ignore messages not starting with defined prefix
    if(!msg.content.startsWith(prefix)) {
        console.log('no prefix')
        return
    }

    //removes prefix, trims extra whitespace, returns array of words from message
    const args = msg.content.slice(prefix.length).trim().split(' ')

    //saves first word from array as command
    const command = args.shift().toLowerCase()
    //log command
    console.log('command: ', command)
    //log arguments passed with a command
    console.log(args)

    if(command === 'ego') {
        msg.react("😀")
        msg.reply('wow, what a great post')
      }
    
      if (command === "clear") {
        //default deletes message itself plus previous
        let num = 2;
        
        //if argument is provided, convert it from string to number
        if (args[0]) {
          //add 1 to delete clear command itself
          num = parseInt(args[0]) + 1;
        }
        //bulk delete the messages
        msg.channel.bulkDelete(num);
        //notify channel of deleted messages
        msg.channel.send(`deleted  ${args[0]} posts for you`);
      }
})