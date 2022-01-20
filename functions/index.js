const express = require('express')

// Firebase
const functions = require("firebase-functions");

// Firebase
const admin = require('firebase-admin')

// Init Firebase
admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

const app = express()

const router = require('./router')
// Lancement avec Express
// const port = 3001

// app.listen(port, () => {
//     console.log(`Exemple app listening at http://127.0.0.1:${port}`)
// })

app.use('/v1/movies', router.moviesRouter(db))

// Permet de déléguer à Express les requêtes qu'on reçoit
exports.api = functions.region('europe-west-3').https.onRequest(app)

// Init DB
// db.collection("movies").get().then(qs => qs.forEach(doc => console.log(doc.data())))

// app.get('/v1/movies', (req, res) => {
//     db.collection("movies").get().then(qs => { 
//         let all = []
//         qs.forEach(doc => all.push(doc.data()))
//         res.send(all)
//     })
// })

// app.get('/v1/movies/recent', (req, res) => {
//     db.collection("movies").get().then(qs => qs.forEach(doc => res.send(doc.data())))
// })

// ADD

// app.get('/movies/add', (req, res) => {
//     res.sendFile(__dirname+'/index.html');
// })

// app.get('/movie/:name/edit', (req, res) => {
//     const movieByName = db.collection("movies").where('name', '==', req.params.name).get()
//     console.log(movieByName);
// })

// app.post('/movies/add', (req, res) => {
//     db.collection("movies").add(req.body).then(res.send('Film ajouté !'))
// })

// app.put('/movies/:name/edit', (req, res) => {
//     db.collection("movies").add(req.body).then(res.send('Film ajouté !'))
// })


