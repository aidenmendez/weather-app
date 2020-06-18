const path = require('path')
const express = require('express')
const hbs = require('hbs')

const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const app = express()
// port is set to Heroku's environment variable so we access the correct port.
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//set up static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Aiden Mendez'
    })
})

// ===========ROUTE HANDLERS/ END POINTS===========

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Aiden Mendez'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'Some helpful text',
        name: 'Aiden Mendez'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }
    const address = req.query.address
    geocode(address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            res.send({error})
            return
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                res.send({error})
                return
            }
            const forecastReturn = {
                location,
                forecastData,
                address
            }
            res.send(forecastReturn)
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found.',
        name: 'Aiden Mendez'
    })
})

// 404 page
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found.',
        name: 'Aiden Mendez'
    })
})

// starts server
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})