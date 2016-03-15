var express = require('express')
var app = express()

app.set('port', process.env.PORT || 3000)
app.use(express.static('app'))
app.listen(app.get('port'))
