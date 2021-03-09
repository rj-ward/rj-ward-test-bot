// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const fetch = require('node-fetch');

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const PREFIX = '&';

//processes function on bot boot/login
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

function roll(size) {
  return (Math.floor(Math.random() * size) + 1);
 
};

//checks and receives commands
client.on('message', async(msg) => {
//ingore messages from bots
    if (msg.author.bot) {
        return
    };
//ignore messages not starting with defined prefix
    if(!msg.content.startsWith(PREFIX)) {
        console.log('no prefix')
        return
    }
    
    //removes prefix, trims extra whitespace, returns array of words from message
    const args = msg.content.slice(PREFIX.length).trim().split(' ')

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
    
    if(command === "clear") {
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

    if(command === 'roll') {
        let size = 6
         if (Number.isInteger(Number(args)) && !'' && ![]) {
            size = parseInt(msg.content.toLowerCase().substring(6));
        };
        result = roll(size);

        msg.reply('Rolled a d' + size + ': ' + result);
    }

    if(command === 'add') {
        let addRoll = args.join(' ').toLowerCase().split(', ');
        console.log('addRoll: ' + addRoll);
        let roleSet = new Set(addRoll);
        let { cache } = msg.guild.roles; //pulls list of roles

        roleSet.forEach(roleName => {
            let role = cache.find(role => role.name.toLowerCase() === roleName); //checks for role in cache
            if(role) {
                if(msg.member.roles.cache.has(role.id)) {
                    msg.reply("You already have this role.");
                    return;
                } else if(
                    role.permissions.has("ADMINISTRATOR") ||
                    role.permissions.has("KICK_MEMBERS") ||
                    role.permissions.has('BAN_MEMBERS') ||
                    role.permissions.has('MANAGE_GUILD') ||
                    role.permissions.has('MANAGE_CHANNELS')) {

                        msg.reply("You cannot add yourself to this role.");
                        return;
                } else {
                    msg.member.roles.add(role)
                        .then(member => msg.reply("You have been added to this role."))
                        .catch(err => {
                            console.log(err);
                            msg.channel.send("Something went wrong...")
                        });
                }

            } else {
                msg.channel.send('Role not found.');
            }
        });
        
    }

    if(command === 'del') {
        let addRoll = args.join(' ').toLowerCase().split(', ');
        console.log('addRoll: ' + addRoll);
        let roleSet = new Set(addRoll);
        let { cache } = msg.guild.roles; //pulls list of roles

        roleSet.forEach(roleName => {
            let role = cache.find(role => role.name.toLowerCase() === roleName); //checks for role in cache
            if(role) {
                if(msg.member.roles.cache.has(role.id)) {
                    msg.member.roles.remove(role)
                        .then(member => msg.reply("You have been removed from this role."))
                        .catch(err => {
                            console.log(err);
                            msg.channel.send("Something went wrong...")
                        });
                    return;
                } else {
                    msg.channel.send("Role not found.");
                        return;
                }

            } else {
                msg.channel.send('Role not found.');
            }
        });
    }
 
    if(command === 'embed') {
        let embedContent = args.join(' ');
        let embed = new Discord.MessageEmbed();

        embed.addField('Message', embedContent);
        embed.setDescription('description');
        embed.setColor('GOLD');
        embed.setTitle("New embed mesasge created.");
        embed.setTimestamp();
        embed.setImage(msg.author.displayAvatarURL());
        embed.setAuthor(msg.author.tag, msg.author.displayAvatarURL());
        msg.channel.send(embed);
    }
    
    if(command === 'say') {
        let chan = args.shift();
        let channelId = chan.substring(2, chan.length - 1);
        let announcement = args.join(' ');
        console.log(channelId);
        console.log(announcement);
        let destinationChannel = client.channels.cache.get(chan);
        console.log(destinationChannel);
       
        if (destinationChannel) {
            destinationChannel.message.send(announcement);
        }
    }
    }

    
);

//set is outside our event listener to prevent wasted processing re-creating it on every message
let set = new Set(['badword', 'badword2'])
client.on('message', (msg) => {
  //if author of message is a bot, return. This prevents potential infinite loops
  if(msg.author.bot) {
    return
  }
  //split message into array of individual words
  let wordArray = msg.content.split(' ')
  console.log(wordArray)
  
  //loop through every word and check if it is in our set of banned words
  for(var i = 0; i < wordArray.length; i++) {
    //if the message contains a word in our set, we delete it and send a message telling them why
    if(set.has(wordArray[i])) {
      msg.delete()
      msg.channel.send(`sorry ${msg.author.username}, this is a christian server, no bad words allowed`)
      break
    }
    
  }


}
)

client.on('messageReactionAdd', async (reaction, user) => {
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});
