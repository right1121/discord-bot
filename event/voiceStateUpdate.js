import { getJstDate } from '../util'

/** 通知開始時間 */
const NOTIFICATION_START_HOUR = 6
/** 通知終了時間 */
const NOTIFICATION_STOP_HOUR = 0

/**
 * メッセージの送信可能時間か
 */
const isAllowSendTime = () => {
  const jstnow = getJstDate()
  const nowHour = jstnow.getHours()
  return NOTIFICATION_START_HOUR <= nowHour || nowHour < NOTIFICATION_STOP_HOUR
}

/**
 * メッセージの送信
 * @param {import('discord.js').Client} client
 * @param {string} client
 */
const sendMessage = (client, text) => {
  if (!isAllowSendTime()) return
  client.channels.cache.get(process.env.TEXT_CHANNEL_ID).send(text)
}

/**
 * 対象のVoiceチャンネルか
 * @returns
 */
const isTargetChannel = (guildMember) => {
  return guildMember.channelId === process.env.VOICE_CHANNEL_ID
}

/**
 * ユーザーがVoiceチャンネルに接続したか
 * VC: VoiceChanel
 * @param {import('discord.js').VoiceState} oldState
 * @param {import('discord.js').VoiceState} newState
 */
export const isConnectionVC = (oldState, newState) => {
  return oldState.channelId === null && newState.channelId !== null
}

/**
 * ユーザーが初めての通話かどうか
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').VoiceState} newState
 */
export const isStartCall = (client, newState) => {
  return client.channels.cache.get(newState.channelId).members.size === 1
}

/**
 * 通話接続時
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').VoiceState} newState
 */
export const connectionVC = (client, newState) => {
  if (isTargetChannel(newState)) {
    if (isStartCall(client, newState)) {
      sendMessage(client, `<@${newState.id}>が通話を開始しました。\n`)
    }
  }
}

/**
 * ユーザーがVoiceチャンネルから切断したか
 * @param {import('discord.js').VoiceState} oldState
 * @param {import('discord.js').VoiceState} newState
 */
export const isDisconnectionVC = (oldState, newState) => {
  return oldState.channelId !== null && newState.channelId === null
}

/**
 * 通話切断時
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').VoiceState} oldState
 */
export const disconnectionVC = (client, oldState) => {
  if (isTargetChannel(oldState)) {
    if (isEndCall(client, oldState)) {
      sendMessage(client, '通話が終了しました。\n')
    }
  }
}

/**
 * Voiceチャンネルの通話が終了したか
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').VoiceState} oldState
 */
export const isEndCall = (client, oldState) => {
  return client.channels.cache.get(oldState.channelId).members.size === 0
}

/**
 * Voiceチャンネル内で移動があったか
 * @param {import('discord.js').VoiceState} oldState
 * @param {import('discord.js').VoiceState} newState
 */
export const isMoveVC = (oldState, newState) => {
  return oldState.channelId !== null && newState.channelId !== null
}

/**
 * Voiceチャンネルに変化があった際の処理
 * @param {import('discord.js').Client} client
 * @returns {(oldState: import('discord.js').VoiceState, newState: import('discord.js').VoiceState) => void}
 */
export const voiceStateUpdate = (client) => (oldState, newState) => {
  if (isConnectionVC(oldState, newState)) {
    connectionVC(client, newState)
  } else if (isDisconnectionVC(oldState, newState)) {
    disconnectionVC(client, oldState)
  } else if (isMoveVC(oldState, newState)) {
    // チャンネル移動
  } else {
    console.error('想定外のパラメータ => ', 'oldState: ', oldState, 'newState: ', newState)
  }
}
