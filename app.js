const express = require("express")
const app = express();
const itemsRoutes = require("./items")
const ExpressError = require("./expressError")

app.use(express.json())
app.use('/items', itemsRoutes)

//404 handler
app.use(function (req,res, next) {
    const err = new ExpressError('Page Not Found', 404)
    return next(err)
})

//general error handler
app.use(function (err, req, res, next) {
    //default status is 500 internal server error
    let status = err.status || 500
    let message = err.message
    //set the status and alert the user
    return res.status(status).json({
        error: { message, status }
    })
})

module.exports = app