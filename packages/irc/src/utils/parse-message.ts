import { Message } from "../types"

const cardRegExp = /^#main : \[Server\].*'(.+)'.*'(.+)'\. Грац!/
const refineRegExp = /^#main : \[Server\].*'(.+)'.*заточил.*\+(\d+) (.+)./
const buyRegExp = /^#main : \[Server\].*'(.+)'.*скупку.*'(.+)'.*: (.+) <(\d+),(\d+)>/
const sellRegExp = /^#main : \[Server\].*'(.+)'.*'(.+)'.*: (.+) <(\d+),(\d+)>/

export default (mes: string): Message => {
  const cardMatches = mes.match(cardRegExp)
  if (cardMatches) {
    return {
      type: "card",
      owner: cardMatches[1],
      item: cardMatches[2]
    }
  }

  const refineMatches = mes.match(refineRegExp)
  if (refineMatches) {
    return {
      type: "refine",
      owner: refineMatches[1],
      refine: parseInt(refineMatches[2]) || 0,
      item: refineMatches[3]
    }
  }

  const buyMatches = mes.match(buyRegExp)
  if (buyMatches) {
    return {
      type: "buy",
      owner: buyMatches[1],
      title: buyMatches[2],
      map: buyMatches[3],
      x: parseInt(buyMatches[4]) || 0,
      y: parseInt(buyMatches[5]) || 0
    }
  }

  const sellMatches = mes.match(sellRegExp)
  if (sellMatches) {
    return {
      type: "sell",
      owner: sellMatches[1],
      title: sellMatches[2],
      map: sellMatches[3],
      x: parseInt(sellMatches[4]) || 0,
      y: parseInt(sellMatches[5]) || 0
    }
  }

  return {
    type: "text",
    text: mes
  }
}
