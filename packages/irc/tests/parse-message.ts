import { expect } from "chai"
import parseMessage from "../src/utils/parse-message"
import {
  TextMessage,
  CardMessage,
  RefineMessage,
  BuyMessage,
  SellMessage,
  RefineBreakMessage
} from "../src/types"

describe("parseMessage", () => {
  it("should return TextMessage", () => {
    const text = "Это обычное текстовое сообщение"
    const message = parseMessage(text) as TextMessage

    expect(message.type).to.equal("text")
    expect(message.text).to.equal("Это обычное текстовое сообщение")
  })

  it("should return CardMessage", () => {
    const text = "#main : [Server] 'Анеша' выбила 'Cursering Card'. Грац!"
    const message = parseMessage(text) as CardMessage

    expect(message.type).to.equal("card")
    expect(message.owner).to.equal("Анеша")
    expect(message.item).to.equal("Cursering Card")
  })

  it("should return RefineMessage", () => {
    const text =
      "#main : [Server] 'Mortesadi' успешно заточил +5 Orc Archer Bow[0]."
    const message = parseMessage(text) as RefineMessage

    expect(message.type).to.equal("refine")
    expect(message.owner).to.equal("Mortesadi")
    expect(message.refine).to.equal(5)
    expect(message.item).to.equal("Orc Archer Bow[0]")
  })

  it("should return BuyMessage", () => {
    const text =
      "#main : [Server] 'ОпятьРабота' открывает скупку под названием 'СиняяТрава 1600' (коорд.: payon <160,57>)."
    const message = parseMessage(text) as BuyMessage

    expect(message.type).to.equal("buy")
    expect(message.owner).to.equal("ОпятьРабота")
    expect(message.title).to.equal("СиняяТрава 1600")
    expect(message.map).to.equal("payon")
    expect(message.x).to.equal(160)
    expect(message.y).to.equal(57)
  })

  it("should return SellMessage", () => {
    const text =
      "#main : [Server] 'SellAll' открывает магазин 'Желтые гемы' (коорд.: izlude <138,128>)."
    const message = parseMessage(text) as SellMessage

    expect(message.type).to.equal("sell")
    expect(message.owner).to.equal("SellAll")
    expect(message.title).to.equal("Желтые гемы")
    expect(message.map).to.equal("izlude")
    expect(message.x).to.equal(138)
    expect(message.y).to.equal(128)
  })

  it("should return RefineBreakMessage", () => {
    const text =
      "#main : [Server] 'Kasumi Seiga Freslight' сломал +5 Platinum Shotel[1] во время заточки..."
    const message = parseMessage(text) as RefineBreakMessage

    expect(message.type).to.equal("refine-break")
    expect(message.owner).to.equal("Kasumi Seiga Freslight")
    expect(message.refine).to.equal(5)
    expect(message.item).to.equal("Platinum Shotel[1]")
  })
})
