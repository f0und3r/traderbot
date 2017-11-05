import { selectItems } from "../db/queries"
import { ItemIdToName } from "../types"

export default (ids: number[]): Promise<ItemIdToName> =>
  new Promise((resolve, reject) => {
    selectItems(ids)
      .then(items => {
        resolve((id: number) => {
          const item = items.find(item => item.id === id)
          return item ? item.name_japanese : id.toString()
        })
      })
      .catch(reject)
  })
