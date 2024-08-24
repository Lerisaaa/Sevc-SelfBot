const { joinVoiceChannel } = require("@discordjs/voice")
const { Client } = require("discord.js-selfbot-v13")
const bot = new Client({ checkUpdate: false })
const config = require("./config.json")

bot.on('ready', async() => {
    console.log(`Logged in as ${bot.user.tag}(${bot.user.id})`)
})

bot.on('voiceStateUpdate', async (o, n) => {
    const ov = o.channelId
    const nv = n.channelId

    if (config.comeback == true) {
        if (ov !== nv) {
            if (!nv && o.member.id === bot.user.id) {
                console.log('someone kicked bot from voice chat, bot joining back');
    
                setTimeout(async () => {
                    const guild = o.guild;
                    const vc = guild.channels.cache.get(ov);
    
                    if (vc) {
                        try {
                            joinVoiceChannel({
                                channelId: vc.id,
                                guildId: guild.id,
                                selfDeaf: config.deaf,
                                selfMute: config.muted,
                                adapterCreator: guild.voiceAdapterCreator
                            });
                            console.log('bot is reconnected to voice chat');
                        } catch (error) {
                            console.error('a error', error);
                        }
                    } else {
                        console.log('channel not found');
                    }
                }, 5000);
            }
        }
    }
})

bot.on('messageCreate', async (message) => {
    if (message.content.startsWith('.join')) {
        const args = message.content.slice(1).trim().split(/ +/);
        let guildid = args[1]
        let voiceid = args[2]
        
        jv(bot, guildid, voiceid)
    }
})

bot.login(config.token)

async function jv(bot, gid, vid) {
    const guild = bot.guilds.cache.get(gid);

    if (!guild) {
        console.log('guildid not found');
        return;
    }

    const voice = guild.channels.cache.get(vid);

    if (!voice) {
        console.log('voiceid not found');
        return;
    }

    joinVoiceChannel({
        channelId: voice.id,
        guildId: guild.id,
        selfDeaf: config.deaf,
        selfMute: config.muted,
        adapterCreator: guild.voiceAdapterCreator
    });
}
