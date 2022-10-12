/******** This program is only for discord.js v13.x *******/
/******** Must use node.js version 16~ **********/
/******** Use and edit package.json for update packages *******/
/******** Powered by T-H-Un *********/

const http = require('http');
const querystring = require('querystring');
const { Client, Intents } = require('discord.js');
const cron = require('node-cron')
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

/**
 * JST時間を返す
 * @returns JST(Date)
 */
const getJstDate = function() {
  return new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
}

//叩き起こすためのサーバーを設置する make zombie server with google scripts
http.createServer(function(req, res){
  if (req.method == 'POST') {
    var data = "";
    req.on('data', function(chunk){
      data += chunk;
    });

    req.on('end', function(){
      if (!data) {
        res.end("No post data");
        return;
      }

      const dataObject = querystring.parse(data);
      console.log("post:" + dataObject.type);

      if (dataObject.type == "wake") {
        console.log("Woke up in post");
        res.end();
        return;
      }
      res.end();
    });
  } else if (req.method == 'GET') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Discord Bot is active now\n');
  }
}).listen(3000);

//ボットが稼働状態になったら呼び出される。関数とステータスを設定している。 
//if Bot status is "ready", call this function. It7s start log and Set status of Bot.
client.on('ready', message =>{
  console.log('Bot_Ready');
  client.user.setActivity('Game', { type: 'PLAYING' });
});

/*通話用システム部分 for VC messages functions*/
//process.env.XXX みたいなのは全て.envファイルに正しく設定を行えている前提
//process.env.DISCORD_BOT_TOKEN -> Discord botのTOKENの文字列が格納されている
//process.env.TEXT_CHANNEL_ID -> channel IDの文字列が格納されている
//process.env.VOICE_CHANNEL_ID  -> ボイスチャットチャンネルの文字列が格納されている

/** 通知開始時間 */
const NOTIFICATION_START_HOUR = 6
/** 通知終了時間 */
const NOTIFICATION_STOP_HOUR = 0

client.on('voiceStateUpdate', (oldGuildMember, newGuildMember) => {
  if (oldGuildMember.channelId !== null || newGuildMember.channelId === null) {
    return
  }

  // 特定のボイスチャットチャンネルのみ反映
  if (newGuildMember.channelId !== process.env.VOICE_CHANNEL_ID) {
    return
  }

  if ( client.channels.cache.get(newGuildMember.channelId).members.size === 1 ) {
    const jstnow = getJstDate()
    const now_hour = jstnow.getHours()

    if ( NOTIFICATION_START_HOUR <= now_hour || now_hour < NOTIFICATION_STOP_HOUR ) {
      // 通話開始通知
      const text = `<@${newGuildMember.id}>が通話を開始しました。\n`;
      client.channels.cache.get(process.env.TEXT_CHANNEL_ID).send(text);
    };
  }
  
  if ( client.channels.cache.get(newGuildMember.channelId).members.size === null ) {
    const jstnow = getJstDate()
    const now_hour = jstnow.getHours()

    if ( NOTIFICATION_START_HOUR <= now_hour || now_hour < NOTIFICATION_STOP_HOUR ) {
      // 通話終了通知
      const text = `通話が終了しました。\n`;
      client.channels.cache.get(process.env.TEXT_CHANNEL_ID).send(text);
    };
  }
});

client.on('ready', async () => {
  const channel = await client.channels.fetch(process.env.TEXT_CHANNEL_ID)
  cron.schedule('0 15 * * *', () => {
    // 0時通知
    const jstnow = getJstDate()
    channel.send(`${jstnow.getHours()} 時になりました。`)
  })
})

/*通話用システムここまで end VC function*/

//ログインする関数基本的にDiscord系の関数一番下において置く Login in on Discord with TOKEN
client.login( process.env.DISCORD_BOT_TOKEN );
