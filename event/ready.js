import { getJstDate } from '../util'
import cron from 'node-cron'

/**
 * Readyイベント
 * @param {import('discord.js').Client} client
 */
export const ready = async (client) => {
  console.log('Bot_Ready')
  client.channels.cache.get(process.env.DEV_NOTIFICATIONS_CHANNEL_ID).send('Bot Ready')

  const channel = await client.channels.fetch(process.env.TEXT_CHANNEL_ID)
  cron.schedule('0 15 * * *', () => {
    // 0時通知
    const jstnow = getJstDate()
    channel.send(`${jstnow.getHours()} 時になりました。`)
  })
}
