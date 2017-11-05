import { Watch, Store, StoreItem } from "../db/types"
import { ItemIdToName } from "../types"
import prettyAmount from "./pretty-amount"

export default (w: Watch, s: Store, si: StoreItem, t: ItemIdToName): string => {
  const parts: string[] = []

  if (w.type === "sell") {
    parts.push("Открылся магазин")
  } else {
    parts.push("Открылась скупка")
  }

  parts.push(`[${s.map}<${s.x},${s.y}>] [${s.title}] продавца [${s.owner}]`)
  parts.push(
    `[${t(si.item_id)}] за [${prettyAmount(
      si.amount
    )}] в количестве [${si.count}]`
  )

  return parts.join(" ")
}
