/**
 * JST時間を返す
 * @returns JST(Date)
 */
export const getJstDate = function () {
  return new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
}

/**
 *
 * @param {import('discord.js').Client} client
 */
export const setActivity = async (client) => {
  /** @type VoiceChannel */
  const vc = await client.channels.fetch(process.env.VOICE_CHANNEL_ID)
  client.user.setActivity(`${vc.members.size}人が通話`)
}
