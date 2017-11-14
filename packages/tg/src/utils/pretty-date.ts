import * as moment from "moment"

moment.locale("ru")

export default (d: Date): string => {
  return moment(d).calendar()
}
