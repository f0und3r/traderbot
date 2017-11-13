import { Listener } from "../types"

const onlyNumbersRegExp = /^\d+$/
const subscribeSellAmountText = "Введите максимальную сумму продажи (0 - любая)"
const subscribeBuyAmountText = "Введите минимальную сумму скупки (0 - любая)"

const listener: Listener = (bot, msg, state, updateState, next) => {
  const text = msg.text || ""

  if (
    (state.type === "subscribe-sell" || state.type === "subscribe-buy") &&
    state.amount === null
  ) {
    if (state.step === "input" && onlyNumbersRegExp.test(text)) {
      updateState({ ...state, amount: parseInt(text) })
      next()
    } else {
      updateState({ ...state, step: "input" })
      bot.sendMessage(
        msg.chat.id,
        state.type === "subscribe-sell"
          ? subscribeSellAmountText
          : subscribeBuyAmountText
      )
    }
  } else {
    next()
  }
}

export default listener
