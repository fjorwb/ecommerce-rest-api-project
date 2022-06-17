
const cors = require('cors')

const corsOptions = {
  origin: '*',
  optionsSuccessfulStatus: 200
}

module.exports = cors(corsOptions)
