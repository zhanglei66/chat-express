let createError = require('http-errors')
let express = require('express')
let expressWs =require('express-ws')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
let bodyParser = require('body-parser')

let app = express()
expressWs(app)

let indexRouter = require('./routes/index')
let socketRouter = require('./routes/socket')
let usersRouter = require('./routes/friends')

app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())

app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Content-Type')
	res.header('Access-Control-Allow-Methods', '*')
	res.header('Content-Type', 'application/json;charset=utf-8')
	next()
});

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/friends', usersRouter)
app.use('/socket', socketRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
});


module.exports = app