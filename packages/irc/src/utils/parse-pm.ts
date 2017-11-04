import { Pm } from "../types"

const ownerRegExp = /^::::: \[ (.+) \] \((.+),(\d+),(\d+)\)$/
const itemRegExp = /^\[(.+)\] -- (\d+) z \| (\d+) шт$/

export default (mes: string): Pm => {
  const ownerMatches = mes.match(ownerRegExp)
  if (ownerMatches) {
    return {
      type: "owner",
      title: ownerMatches[1],
      map: ownerMatches[2],
      x: parseInt(ownerMatches[3]) || 0,
      y: parseInt(ownerMatches[4]) || 0
    }
  }

  const itemMatches = mes.match(itemRegExp)
  if (itemMatches) {
    return {
      type: "item",
      item: itemMatches[1],
      amount: parseInt(itemMatches[2]) || 0,
      count: parseInt(itemMatches[3]) || 0
    }
  }

  return {
    type: "text",
    text: mes
  }
}
