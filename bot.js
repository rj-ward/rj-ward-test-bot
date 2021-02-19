// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const fetch = require('node-fetch');

const client = new Discord.Client();
const prefix = '&';

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

    if(command === 'joke') {
        //async API call using async/await syntax
        let getJoke = async () => {
            //make API call
            let result = await fetch('https://official-joke-api.appspot.com/random_joke')
            //convert to object we can work with
            let json = await result.json()
            return json
        }
        //call function defined above
        let joke = await getJoke()
        
        //have our bot reply using the data returned from our API call
        msg.reply(`
        Here's your joke
        ${joke.setup}
        ${joke.punchline}
        `)
      }
      
      if(command === 'kick') {
        //verify that user has moderation role
        if(!msg.member.roles.cache.has('812421021830348810')) {
          msg.reply('you dont have permission to kick users')
          // if user doesnt have the role, we return without kicking the user
          return
        }
        //check to make sure a user was actually mentioned, if not we return because bot doesnt know who to kick
        const user = msg.mentions.users.first()
        if(!user) {
          msg.reply('no user mentioned')
          return
        }
        //if user was mentioned, grab their guild member information
        const member = msg.guild.member(user)
        //if they are a member of the server, kick them
        if(member) {
          member.kick('this is a message for the server logs').then(() => {
            msg.reply(`${user.tag} was kicked from the server`)
          })
        }
      }
      
})