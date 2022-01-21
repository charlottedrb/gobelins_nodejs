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

app.use('/v1/movies', router.moviesRouter(db, admin))
app.use('/v1/categories', router.categoriesRouter(db))

// Permet de déléguer à Express les requêtes qu'on reçoit
exports.api = functions.region('europe-west-3').https.onRequest(app)
