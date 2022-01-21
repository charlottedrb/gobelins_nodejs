const { body, validationResult, param } = require('express-validator');

/**
 * Error Messages
 */

const isStringError = (field) => `Champ ${field} : Vous n'avez pas rentré une chaîne de caractères. Merci de réessayer.`
const isURLError = (field) => `Champ ${field} : Vous n'avez pas rentré une URL. Merci de réessayer.`
const isLengthError = (field) => `Champ ${field} : Vous avez rentré trop de caractères.`

/**
 * Validators
 */

const checkName = [
    body('name')
        .exists().notEmpty()
        .isString().withMessage(isStringError('name'))
        .isLength({ max: 64 }).withMessage(isLengthError('name'))
        .trim().escape()
]

const checkId = [
    param('id')
        .exists().notEmpty()
        .isLength({ min: 20, max: 20 }).withMessage('L\'ID renseigné n\'est pas correct')
        .escape(),
]

const addMovie = [
    ...checkName,
    body('author')
        .exists().notEmpty()
        .isString().withMessage(isStringError('author'))
        .isLength({ max: 64 }).withMessage(isLengthError('author'))
        .trim().escape(),
    body('img')
        .exists().notEmpty()
        .isURL().withMessage(isURLError('img'))
        .trim(),
    body('video')
        .exists().notEmpty()
        .isURL().withMessage(isURLError('video'))
        .trim(),
    body('category')
        .exists().notEmpty()
        .isString()
        .isLength({ max: 20 }).withMessage(isLengthError('category'))
        .trim().escape(),
    body('description')
        .exists().notEmpty()
        .isLength({ max: 1024 }).withMessage(isLengthError('description'))
        .trim().escape(),
    body('likes')
        .default(0)
]

const editMovie = [
    body('name')
        .isString().withMessage(isStringError('name'))
        .isLength({ max: 64 }).withMessage(isLengthError('name'))
        .optional().escape().notEmpty().trim(),
    body('author')
        .isString().withMessage(isStringError('author'))
        .isLength({ max: 64 }).withMessage(isLengthError('author'))
        .optional().escape().notEmpty().trim(),
    body('img')
        .isURL().withMessage(isURLError('img'))
        .optional().notEmpty().trim(),
    body('video')
        .isURL().withMessage(isURLError('video'))
        .optional().notEmpty().trim(),
    body('category')
        .isString()
        .isLength({ min: 20, max: 20 }).withMessage(isLengthError('category'))
        .optional().escape().notEmpty().trim()
    ,
    body('description')
        .isLength({ max: 1024 }).withMessage(isLengthError('description'))
        .optional().escape().trim(),
]

function validatorError(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(500).json({
            title: 'Une erreur s\'est produite. ',
            error: result.array()
        });
    }

    next()
}

module.exports = { addMovie, checkId, editMovie, checkName, validatorError }

