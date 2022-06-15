
function ConvertObject (obj) {
  const arr = []
  for (let i = 0; i < obj.length; i++) {
    arr.push(Object.values(obj)[i])
  }
  return arr
}

module.exports = ConvertObject
