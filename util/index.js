/**
 * JST時間を返す
 * @returns JST(Date)
 */
export const getJstDate = function () {
  return new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
}
