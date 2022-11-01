import { getJstDate } from '../util'

/** 通知開始時間 */
const NOTIFICATION_START_HOUR = 6
/** 通知終了時間 */
const NOTIFICATION_STOP_HOUR = 0
/** 対象VoiceチャンネルID */
const TARGET_VOICE_CHANNEL = process.env.VOICE_CHANNEL_ID

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
 */
const sendMessage = (client, text) => {
  if (!isAllowSendTime) return
  client.channels.cache.get(process.env.TEXT_CHANNEL_ID).send(text)
}

/**
 * 対象のVoiceチャンネルか
 * @returns
 */
const isTargetChannel = (guildMember) => {
  return guildMember.channelId !== TARGET_VOICE_CHANNEL
}

/**
 * ユーザーがVoiceチャンネルに接続したか
 * VC: VoiceChanel
 */
const isConnectionVC = (oldGuildMember, newGuildMember) => {
  return oldGuildMember.channelId === null && newGuildMember.channelId !== null
}

/**
 * ユーザーが初めての通話かどうか
 */
const isStartCall = (client, newGuildMember) => {
  return client.channels.cache.get(newGuildMember.channelId).members.size === 1
}

/**
 * 通話接続時
 */
const connectionVC = (client, newGuildMember) => {
  if (isTargetChannel(newGuildMember)) {
    if (isStartCall(client, newGuildMember)) {
      sendMessage(client, `<@${newGuildMember.id}>が通話を開始しました。\n`)
    }
  }
}

/**
 * ユーザーがVoiceチャンネルから切断したか
 */
const isDisconnectionVC = (oldGuildMember, newGuildMember) => {
  return oldGuildMember.channelId !== null && newGuildMember.channelId === null
}

/**
 * 通話切断時
 */
const disconnectionVC = (client, oldGuildMember) => {
  if (isTargetChannel(oldGuildMember)) {
    if (isEndCall(client, oldGuildMember)) {
      sendMessage(client, '通話が終了しました。\n')
    }
  }
}

/**
 * Voiceチャンネルの通話が終了したか
 */
const isEndCall = (client, oldGuildMember) => {
  return client.channels.cache.get(oldGuildMember.channelId).members.size === 0
}

/**
 * Voiceチャンネル内で移動があったか
 */
const isMoveVC = (oldGuildMember, newGuildMember) => {
  return oldGuildMember.channelId !== null && newGuildMember.channelId !== null
}

/**
 * Voiceチャンネルに変化があった際の処理
 * @param {*} client
 * @returns
 */
export const voiceStateUpdate = (client) => (oldGuildMember, newGuildMember) => {
  if (isConnectionVC(oldGuildMember, newGuildMember)) {
    connectionVC(client, newGuildMember)
  } else if (isDisconnectionVC(oldGuildMember, newGuildMember)) {
    disconnectionVC(client, oldGuildMember)
  } else if (isMoveVC(oldGuildMember, newGuildMember)) {
    // チャンネル移動
  } else {
    console.error('想定外のパラメータ => ', 'oldGuildMember: ', oldGuildMember, 'newGuildMember: ', newGuildMember)
  }
}
