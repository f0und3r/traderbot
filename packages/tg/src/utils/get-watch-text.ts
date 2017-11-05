import { Watch } from "../db/types"
import { ItemIdToName } from "../types"
import prettyAmount from "./pretty-amount"

export default (watch: Watch, itemIdToName: ItemIdToName): string => {
  const parts: string[] = [`[${watch.id}]`]

  if (watch.type === "sell") {
    parts.push(`Продажа предмета [${itemIdToName(watch.item_id)}]`)

    if (watch.amount !== 0) {
      parts.push(
        `с максимальной суммой продажи [${prettyAmount(watch.amount)}]`
      )
    }
  } else {
    parts.push(`Скупка предмета [${itemIdToName(watch.item_id)}]`)

    if (watch.amount !== 0) {
      parts.push(`с минимальной суммой скупки [${prettyAmount(watch.amount)}]`)
    }
  }

  return parts.join(" ")
}
