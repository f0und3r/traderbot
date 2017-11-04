import { Message } from "../types"

const cardRegExp = /^#main : \[Server\].*'(.+)'.*'(.+)'/
const refineRegExp = /^#main : \[Server\].*'(.+)'.*\+(\d+) (.+)./
const buyRegExp = /^#main : \[Server\].*'(.+)'.*скупку.*'(.+)'.*: (.+) <(\d+),(\d+)>/
const sellRegExp = /^#main : \[Server\].*'(.+)'.*'(.+)'.*: (.+) <(\d+),(\d+)>/

export default (mes: string): Message => {
  return {
    type: "text",
    text: mes
  }
}
