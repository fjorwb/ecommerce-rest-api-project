
function Convert (num) {
  let numb = 0
  let digit = ''

  isNaN(num) ? numb = Number(num) : numb = num

  if (numb < 10) {
    digit = '00000' + String(numb)
  } else if (numb >= 10 && numb < 100) {
    digit = '0000' + String(numb)
  } else if (numb >= 100 && numb < 1000) {
    digit = '000' + String(numb)
  } else if (numb >= 1000 && numb < 10000) {
    digit = '00' + String(numb)
  } else if (numb >= 10000 && numb < 100000) {
    digit = '0' + String(numb)
  } else {
    digit = String(numb)
  }

  return digit
}

module.exports = Convert
