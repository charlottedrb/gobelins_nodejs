const { body, validationResult, param, matchedData } = require('express-validator');

/**
 * Error Messages
 */

 const isStringError = (field) => `Champ ${field} : Vous n'avez pas rentré une chaîne de caractères. Merci de réessayer.`
 const isURLError = (field) => `Champ ${field} : Vous n'avez pas rentré une URL. Merci de réessayer.`
 const isLengthError = (field) => `Champ ${field} : Vous avez rentré trop de caractères.`

/**
 * Validators
 */

const addMovie = [
    body('name')
        .exists().escape().notEmpty().trim()
        .isString().withMessage(isStringError('name'))
        .isLength({ max: 64 }).withMessage(isLengthError('name')),
    body('author')
        .exists().escape().notEmpty().trim()
        .isString().withMessage(isStringError('author'))
        .isLength({ max: 64 }).withMessage(isLengthError('author')),
    body('img')
        .exists().notEmpty().trim()
        .isURL().withMessage(isURLError('img'))
        .escape(),
    body('video')
        .exists().notEmpty().trim()
        .isURL().withMessage(isURLError('video'))
        .escape(),
    body('category')
        .exists().escape().notEmpty().trim()
        .isString()
        .isLength({ max: 20 }).withMessage(isLengthError('category')),
    body('description')
        .exists().escape().notEmpty().trim()
        .isLength({ max: 1024 }).withMessage(isLengthError('description')),
    (req, res, next) => {
        // validationResult : renvoie les erreurs
        const result = validationResult(req);
        console.log(result);
        if (!result.isEmpty()) {
            return res.status(500).json({
                title: 'Une erreur s\'est produite. ',
                error: result.errors
            });
        }
        next()
    }
]

const movieId = [
    param('movieId')
        .exists().escape().notEmpty()
        .isLength({ max: 20 }).withMessage('L\'ID renseigné n\'est pas correct'),
    (req, res, next) => {
        const result = validationResult(req);
        console.log(result);
        if (!result.isEmpty()) {
            return res.status(500).json({
                title: 'Une erreur s\'est produite. ',
                error: result.array()
            });
        }

        next()
    }
]

const editMovie = [
    param('movieId')
        .exists().escape().notEmpty()
        .isLength({ max: 20 }).withMessage('L\'ID renseigné n\'est pas correct'),
    (req, res, next) => {
        const result = validationResult(req);
        console.log(result);
        if (!result.isEmpty()) {
            return res.status(500).json({
                title: 'Une erreur s\'est produite. ',
                error: result.array()
            });
        }

        next()
    }
]

module.exports.addMovie = addMovie
module.exports.movieId = movieId
module.exports.editMovie = editMovie

