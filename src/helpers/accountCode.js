/* eslint-disable camelcase */

function AccountNumber (num, user_id) {
  const date = new Date(Date.now())
  console.log(date)
  const year = dateToString(date.getFullYear())
  const month = dateToString(date.getMonth() + 1)
  const day = dateToString(date.getDate())

  const acctype = digit(num)

  console.log(year, month, day)

  const account_number = year.toString() +
                         month.toString() +
                         day.toString() +
                         '-' +
                         user_id +
                         '-' +
                         acctype

  console.log(account_number)

  return account_number
}

function digit (num) {
  let numb = 0
  let digit = ''

  isNaN(num) ? numb = Number(num) : numb = num

  if (numb < 10) {
    digit = '00' + String(numb)
  } else if (numb >= 10 && numb < 100) {
    digit = '0' + String(numb)
  } else {
    digit = String(numb)
  }

  return digit
}

function dateToString (num) {
  let numb = 0
  let digit = ''

  isNaN(num) ? numb = Number(num) : numb = num

  if (numb < 10) {
    digit = '0' + String(numb)
  } else {
    digit = String(numb)
  }

  return digit
}

module.exports = AccountNumber
