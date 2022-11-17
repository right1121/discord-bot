/** ****** This program is only for discord.js v13.x *******/
/** ****** Must use node.js version 16~ **********/
/** ****** Use and edit package.json for update packages *******/
/** ****** Powered by T-H-Un *********/

import http from 'http'
import querystring from 'querystring'
import { Client, GatewayIntentBits, Events } from 'discord.js'
import dotenv from 'dotenv'

import { voiceStateUpdate, ready } from './event'

dotenv.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] })

// 叩き起こすためのサーバーを設置する make zombie server with google scripts
http.createServer(function (req, res) {
  if (req.method === 'POST') {
    let data = ''
    req.on('data', function (chunk) {
      data += chunk
    })

    req.on('end', function () {
      if (!data) {
        res.end('No post data')
        return
      }

      const dataObject = querystring.parse(data)
      console.log('post:' + dataObject.type)

      if (dataObject.type === 'wake') {
        console.log('Woke up in post')
        res.end()
        return
      }
      res.end()
    })
  } else if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Discord Bot is active now\n')
  }
}).listen(3000)

client.on(Events.ClientReady, ready)

/* 通話用システム部分 for VC messages functions */
// process.env.XXX みたいなのは全て.envファイルに正しく設定を行えている前提
// process.env.DISCORD_BOT_TOKEN -> Discord botのTOKENの文字列が格納されている
// process.env.TEXT_CHANNEL_ID -> channel IDの文字列が格納されている
// process.env.VOICE_CHANNEL_ID  -> ボイスチャットチャンネルの文字列が格納されている

client.on('voiceStateUpdate', voiceStateUpdate(client))

/* 通話用システムここまで end VC function */

// ログインする関数基本的にDiscord系の関数一番下において置く Login in on Discord with TOKEN
client.login(process.env.DISCORD_BOT_TOKEN)
