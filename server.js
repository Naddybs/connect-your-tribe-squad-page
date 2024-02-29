// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = 'https://fdnd.directus.app/items'

// Haal alle squads uit de WHOIS API op
const squadData = await fetchJson(apiUrl + '/squad')

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// ZORG DAT WERKEN MET REQUEST DATA MAKKELIJKER WORDT
app.use(express.urlencoded({extended: true}))

//ARRAY OM PERSONEN IN OP TE SLAAN
let persons = []

//ARRAY OM MESSAGES IN OP TE SLAAN VOOR MESSAGEBOARD
const messages =[]


// Maak een GET route voor de index
app.get('/', function (request, response) {
  // Haal alle personen uit de WHOIS API op
  fetchJson(apiUrl + '/person/?filter={"squad_id":3}').then((apiData) => {
    // apiData bevat gegevens van alle personen uit alle squads
    // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

    // Zorgt ervoor dat persons altijd bestaat, zelfs als het leeg is
    // Dit is nodig omdat persons anders niet bestaat als er geen personen zijn
    // Dit kan problemen opleveren in de view
    persons = apiData.data || [];  


    // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons, 
    //VOEG OOK MESSAGES TOE ALS VARIABELE
  
    response.render('index', {
      persons: persons, 
      squads: squadData.data,
      messages: messages})
  })
})

// Maak een POST route voor de index
app.post('/', function (request, response) {
  console.log(request.body)
  //VOEG DE INGEVULDE MESSAGE TOE AAN DE ARRAY
  messages.push(request.body.bericht)

  // Er is nog geen afhandeling van POST, redirect naar GET op /
  // redirect is een HTTP response status code 303, die aangeeft dat de browser een GET request moet doen
  response.redirect(303, '/')
})

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/person/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson(apiUrl + '/person/' + request.params.id).then((apiData) => {
    // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
    response.render('person', {person: apiData.data, squads: squadData.data})
  })
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 9000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})


