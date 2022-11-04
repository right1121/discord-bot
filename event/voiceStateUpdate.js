import { getJstDate } from '../util'

/** 通知開始時間 */
export const NOTIFICATION_START_HOUR = 6
/** 通知終了時間 */
export const NOTIFICATION_STOP_HOUR = 0

/**
 * メッセージの送信可能時間か
 * @param {Date} 現在時刻
 */
export const isAllowSendTime = (currentDate = getJstDate()) => {
  const nowHour = currentDate.getHours()
  return NOTIFICATION_START_HOUR <= nowHour || nowHour < NOTIFICATION_STOP_HOUR
}

/**
 * メッセージの送信
 */
export const sendMessage = (client, text) => {
  if (!isAllowSendTime()) return
  client.channels.cache.get(process.env.TEXT_CHANNEL_ID).send(text)
}

/**
 * 対象のVoiceチャンネルか
 * @returns
 */
export const isTargetChannel = (guildMember) => {
  return guildMember.channelId === process.env.VOICE_CHANNEL_ID
}

/**
 * ユーザーがVoiceチャンネルに接続したか
 * VC: VoiceChanel
 */
export const isConnectionVC = (oldGuildMember, newGuildMember) => {
  return oldGuildMember.channelId === null && newGuildMember.channelId !== null
}

/**
 * ユーザーが初めての通話かどうか
 */
export const isStartCall = (client, newGuildMember) => {
  return client.channels.cache.get(newGuildMember.channelId).members.size === 1
}

/**
 * 通話接続時
 */
export const connectionVC = (client, newGuildMember) => {
  if (isTargetChannel(newGuildMember)) {
    if (isStartCall(client, newGuildMember)) {
      sendMessage(client, `<@${newGuildMember.id}>が通話を開始しました。\n`)
    }
  }
}

/**
 * ユーザーがVoiceチャンネルから切断したか
 */
export const isDisconnectionVC = (oldGuildMember, newGuildMember) => {
  return oldGuildMember.channelId !== null && newGuildMember.channelId === null
}

/**
 * 通話切断時
 */
export const disconnectionVC = (client, oldGuildMember) => {
  if (isTargetChannel(oldGuildMember)) {
    if (isEndCall(client, oldGuildMember)) {
      sendMessage(client, '通話が終了しました。\n')
    }
  }
}

/**
 * Voiceチャンネルの通話が終了したか
 */
export const isEndCall = (client, oldGuildMember) => {
  return client.channels.cache.get(oldGuildMember.channelId).members.size === 0
}

/**
 * Voiceチャンネル内で移動があったか
 */
export const isMoveVC = (oldGuildMember, newGuildMember) => {
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
