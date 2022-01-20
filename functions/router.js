const express = require('express');

/**
 * Routers
 */

const router = express.Router();
const moviesRouter = express.Router();

/**
 * Validators Imports
 */

const validators = require('./validators')

/**
 * Movies Routes
 */
const movies = (db) => {
    moviesRouter.get('/', function (req, res, next) {
        db.collection("movies").get().then(qs => {
            let all = []
            qs.forEach(doc => all.push({
                id: doc.id,
                name: doc.data().name,
                author: doc.data().author,
                img: doc.data().img,
                video: doc.data().video,
                category: doc.data().category,
                description: doc.data().description
            }))
            res.send(all)
        })
    });

    moviesRouter.get('/:movieId', validators.movieId, (req, res) => {
        db.collection("movies").doc(req.params.movieId).get().then(qs => res.send(qs.data()))
    });

    moviesRouter.post('/add', validators.addMovie , (req, res) => {
        db.collection("movies").add({
            name: req.body.name,
            author: req.body.author,
            img: decodeURI(req.body.img),
            video: decodeURI(req.body.video),
            category: req.body.category,
            description: req.body.description,
            likes: 0    
        }).then(res.send('Film ajouté !'))
    });

    moviesRouter.patch('/:movieId', validators.editMovie, (req, res) => {
        db.collection("movies").doc(req.params.movieId).set({
            
        })
    })

    moviesRouter.delete('/:movieId', validators.movieId, (req, res) => {
        db.collection("movies").doc(req.params.movieId).delete().then(res.send('Film supprimé !'))
    })

    // moviesRouter.patch('/v1/movie/:name/add_like', function (req, res, next) {
    //     const movieByName = db.collection("movies").where('name', '==', req.params.name).get()
    //     db.collection("movies").get().then(qs => { 
    //         let all = []
    //         qs.forEach(doc => all.push(doc.data()))
    //         res.send(all)
    //     })
    // });

    return moviesRouter
}



module.exports.moviesRouter = (db) => movies(db)