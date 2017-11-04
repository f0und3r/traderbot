import { getItemsByNames } from "../db/queries"

export type ItemNameToIds = (name: string) => number[]
export default (names: string[]): Promise<ItemNameToIds> =>
  new Promise((resolve, reject) => {
    getItemsByNames(names)
      .then(items => {
        resolve((name: string) =>
          items.filter(item => item.name_japanese === name).map(item => item.id)
        )
      })
      .catch(reject)
  })
