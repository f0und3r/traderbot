import { expect } from "chai"
import parsePm from "../src/utils/parse-pm"
import { TextPm, OwnerPm, ItemPm } from "../src/types"

describe("parsePm", () => {
  it("should return TextPm", () => {
    const text = "[Бурылин] сейчас не держит открытых скупок."
    const pm = parsePm(text) as TextPm

    expect(pm.type).to.equal("text")
    expect(pm.text).to.equal("[Бурылин] сейчас не держит открытых скупок.")
  })

  it("should return OwnerPm", () => {
    const text = "::::: [ Химпром ] (brasilis,278,307)"
    const pm = parsePm(text) as OwnerPm

    expect(pm.type).to.equal("owner")
    expect(pm.title).to.equal("Химпром")
    expect(pm.map).to.equal("brasilis")
    expect(pm.x).to.equal(278)
    expect(pm.y).to.equal(307)
  })

  it("should return ItemPm", () => {
    const text = "[Key of Underground] -- 35000 z | 89 шт"
    const pm = parsePm(text) as ItemPm

    expect(pm.type).to.equal("item")
    expect(pm.item).to.equal("Key of Underground")
    expect(pm.amount).to.equal(35000)
    expect(pm.count).to.equal(89)
  })
})
