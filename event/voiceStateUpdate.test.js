import {
  isAllowSendTime
} from './voiceStateUpdate'

test.concurrent.each([
  ['2022-11-03T06:00:00'],
  ['2022-11-03T23:59:59'],
])('メッセージの送信可能時間 (%s)', async (dateString) => {
  expect(isAllowSendTime(new Date(dateString))).toBeTruthy()
})

test.concurrent.each([
  ['2022-11-03T05:59:59'],
  ['2022-11-03T00:00:00'],
])('メッセージの送信不可時間 (%s)', async (dateString) => {
  expect(isAllowSendTime(new Date(dateString))).toBeFalsy()
})
