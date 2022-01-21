const express = require('express');
const { matchedData } = require('express-validator');

/**
 * Routers
 */
const moviesRouter = express.Router();
const categoriesRouter = express.Router();

/**
 * Validators Imports
 */

const { addMovie, checkId, editMovie, checkName, validatorError } = require('./validators')

/**
 * Movies Routes
 */
const movies = (db, admin) => {
    moviesRouter.get('/', (req, res) => {
        db.collection("movies").get().then(doc => {
            let all = []
            doc.forEach(doc => all.push({ id: doc.id, ...doc.data() }))
            res.send(all)
        })
    });

    moviesRouter.route('/:id')
        .get(checkId, validatorError, (req, res) => {
            db.collection("movies").doc(req.params.id).get().then(doc => {
                if (doc.exists) {
                    res.status(200).send({ id: doc.id, ...doc.data() })
                } else {
                    res.status(500).send("ID invalide")
                }
            })
                .catch(error => res.status(500).send('Erreur : ' + error))
        })

        .patch([editMovie, ...checkId], validatorError, (req, res) => {
            const ref = db.collection("movies").doc(req.params.id)
            ref.get().then(doc => {
                if (doc.exists) {
                    const body = matchedData(req, { locations: ['body'] })
                    ref.update({ ...body, img: encodeURI(req.body.img), video: encodeURI(req.body.video) })
                        .then(res.status(200).send('Film mis à jour'))
                        .catch(error => res.status(500).send(error.json()))
                } else {
                    res.status(500).send("ID invalide")
                }
            })
                .catch(error => res.status(500).send('Erreur : ' + error))
        })

        .delete(checkId, validatorError, (req, res) => {
            db.collection("movies").doc(req.params.id).delete().then(doc => checkId(doc, res, 'Film supprimé'))
        });

    moviesRouter.post('/add', addMovie, validatorError, (req, res) => {
        const body = matchedData(req, { locations: ['body'] })
        const category = db.collection("categories").doc(req.body.category)
        category.get().then(doc => {
            if (doc.exists) {
                db.collection("movies").add({ ...body, img: encodeURI(req.body.img), video: encodeURI(req.body.video) }).then(res.status(201).send('Film ajouté !'))
            } else {
                res.status(500).send("ID de la catégorie invalide")
            }
        })
    });

    moviesRouter.patch('/:id/like', checkId, validatorError, (req, res) => {
        const ref = db.collection("movies").doc(req.params.id)
        ref.get().then(doc => {
            if (doc.exists) {
                ref.update({ likes: admin.firestore.FieldValue.increment(1) })
                    .then(res.status(200).send('Liké !'))
                    .catch(error => res.status(500).send(error.json()))
            } else {
                res.status(500).send("ID invalide")
            }
        })
            .catch(error => res.status(500).send('Erreur : ' + error))
    })

    return moviesRouter
}

/**
 * Categories Routes
 */
const categories = (db) => {
    categoriesRouter.get('/', (req, res) => {
        db.collection("categories").get().then(doc => {
            let all = []
            doc.forEach(doc => all.push({ id: doc.id, ...doc.data() }))
            res.status(200).send(all)
        })
    })

    categoriesRouter.route('/:id')
        .get(checkId, validatorError, (req, res) => {
            db.collection("categories").doc(req.params.id).get().then(doc => res.status(200).send({ id: doc.id, ...doc.data() }))
        })

        .put(checkName, checkId, validatorError, (req, res) => {
            db.collection("categories").doc(req.params.id).update(matchedData(req, { locations: ['body'] })).then(() => res.status(200).send('Catégorie mise à jour'))
        })

        .delete((req, res) => {
            db.collection("categories").doc(req.params.id).delete().then(() => res.status(200).send('Catégorie supprimée !'))
        });

    categoriesRouter.post('/add', checkName, validatorError, (req, res) => {
        db.collection("categories").add(matchedData(req, { locations: ['body'] })).then(() => res.status(201).send('Catégorie ajoutée !'))
    });

    return categoriesRouter
}

/** 
 * Functions
 */

module.exports.moviesRouter = (db, admin) => movies(db, admin)
module.exports.categoriesRouter = (db) => categories(db)