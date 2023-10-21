
const { body, check, param, query } = require('express-validator');

const datePattern = /^\d{2}\/\d{2}\/\d{4}$/; const dateExample = "MM/DD/YYYY";

//const namePattern = /^[A-Z]{1}[a-zA-Z]$/; const nameExample = "John";

//Game collection variables
const gameNameExa = 'God of War, Spider-man, The Last of Us - Part 2, Mario: The Mushroom Kingdom 4';

const betaValues = ['active', 'expecting', 'released'];

const releaseYearExp = /^\d{4}$/; const releaseYearSub = 'pending';

const gameVersionExp = /^(\d+\.\d+|\d+\.\d+\.\d+|\d+\.\d+\.\d+\.\d+)$/;
const gameVersionExa = ['x.x', 'xx.x.xx', 'x.xx.x.xx']

const gameKeys = ['name', 'currentVersion', 'releaseYear', 'betaStatus'];

//Player collection variables.
const playerNameExa = 'guy43Sd';
const sha256Exp = /^[a-fA-F0-9]{64}$/
const refundWindowValues = ['expired', 'active'];
const playerKeys = ['name', 'id', 'game', 'gameVersion', 'purchaseDate', 'refundWindow', 'lastPlayed'];



//Game collection validations
exports.addGameValidation = [
    check('name', `Game name is required. Example: ${gameNameExa}`).notEmpty(),
    check('currentVersion', `Current game version is required. Where x is a digit. Examples:`+
    `${gameVersionExa[0]}, ${gameVersionExa[1]}, ${gameVersionExa[2]}`).matches(gameVersionExp),
    check('releaseYear').custom(value => {
        let stringValue = value.toString();
        if(value == releaseYearSub){
            return true;
        }
        console.log(value);console.log(stringValue)
        if(!stringValue.match(releaseYearExp) || !Number.isInteger(value)){
            throw new Error('Must be a valid year, or have the "pending" status.');
        }
        return true;
    }),
    check('betaStatus', `Must have valid Beta status: ${betaValues[0]}, ${betaValues[1]}, ${betaValues[2]}`).isIn(betaValues)
]

exports.putGameValidation = [
    body().isObject().withMessage('Invalid data format. Expected an object.'),
    body().custom((value) => {
        const errors = []
        console.log(value);
        for(const item in value){
            console.log(item)
            if(item == gameKeys[0]){
                check('name', `Game name is required. Example: ${gameNameExa}`).notEmpty()
            }
            else if(item == gameKeys[1]){
                check('currentVersion', `Current game version is required. Examples:`+
    `${gameVersionExa[0]}, ${gameVersionExa[1]}, ${gameVersionExa[2]}`).matches(gameVersionExp);
            }
            else if (item == 'releaseYear' && (!(value['releaseYear'].toString().match(releaseYearExp) || Number.isInteger(value['releaseYear'])) && value['releaseYear'] != releaseYearSub )) {
                errors.push('Must be a valid year, or have the "pending" status.');
            }
            else if (item == 'betaStatus' && !(betaValues.includes(value['betaStatus']))) {
                errors.push(`Must have valid Beta status: ${betaValues[0]}, ${betaValues[1]}, ${betaValues[2]}`);
            }
        }

        if (errors.length > 0) {
            throw new Error(errors.join(' '));
        }

        return true;
    })
]



//Player collection validations.
exports.addPlayerValidation = [
    check('name', `Must have a username for a player. Example: ${playerNameExa}`).not().isEmpty(),
    check('id', 'Not a valid SHA-256 hash. Id must be a SHA-256 hash or follow hexadecimal standards with the length of 64 characters.').matches(sha256Exp),
    check('game', `Game name is required. Example: ${gameNameExa}`).not().isEmpty(),
    check('gameVersion', `Game version is required. Examples:`+
    `${gameVersionExa[0]}, ${gameVersionExa[1]}, ${gameVersionExa[2]}`).matches(gameVersionExp),
    check('purchaseDate', `Must have a valid date value. Example: ${dateExample}`).matches(datePattern),
    check('refundWindow', 'Refund status must equal "expired" or "active"').isIn(refundWindowValues),
    check('lastPlayed', `Must have a valid date value. Example: ${dateExample}`).matches(datePattern)
]

exports.putPlayerValidation = [
    body().isObject().withMessage('Invalid data format. Expected an object.'),
    body().custom((value) => {
        const errors = []
        for(const item in value){
            if(item == playerKeys[0] && (value.name == null || value.name == "")){
                errors.push(`Must have a username for a player. Example: ${playerNameExa}`)
            }
            else if(item == playerKeys[1] && !value.id.match(sha256Exp)){
                errors.push('Not a valid SHA-256 hash. Id must be a SHA-256 hash or follow hexadecimal standards with the length of 64 characters.')
            }
            else if(item == playerKeys[2] && (value.game == null || value.game == "")){
                errors.push(`Game name is required. Example: ${gameNameExa}`);
            }
            else if(item == playerKeys[3] && !value.gameVersion.match(gameVersionExp)){
                errors.push(`Game version is required. Examples:`+
                `${gameVersionExa[0]}, ${gameVersionExa[1]}, ${gameVersionExa[2]}`);
            }
            else if(item == playerKeys[4] && !value.purchaseDate.match(datePattern)){
                errors.push(`Must have a valid date value. Example: ${dateExample}`);
            }
            else if(item == playerKeys[5] && !refundWindowValues.includes(value.refundWindow)){
                errors.push('Refund status must equal "expired" or "active"');
            }
            else if(item == playerKeys[6] && !value.lastPlayed.match(datePattern)){
                errors.push(`Must have a valid date value. Example: ${dateExample}`);
            }

        }

        if (errors.length > 0) {
            throw new Error(errors.join(' '));
        }

        return true;
    })
]

exports.deleteValidation = [
    param('id').isMongoId().withMessage('Invalid ID format'),
]

//GET Validation

exports.getGameValidation = [
    query('name').optional().not().isEmpty().withMessage(`Game name must not be empty if included. Example: ${gameNameExa}`),
    query('year').optional().custom(value => {
        if(value == releaseYearSub){
            return true;
        }
        if(!value.match(releaseYearExp)){
            throw new Error('Must be a valid year, or have the "pending" status.');
        }
        return true;
    }),
    query('beta').optional().isIn(betaValues).withMessage(`Must have valid Beta status: ${betaValues[0]}, ${betaValues[1]}, ${betaValues[2]}`)
]

exports.getPlayerValidation = [
    query('name').optional().not().isEmpty().withMessage(`Must have a username for a player. Example: ${playerNameExa}`),
    query('playerId').optional().matches(sha256Exp).withMessage('Not a valid SHA-256 hash. Id must be a SHA-256 hash or follow hexadecimal standards with the length of 64 characters.'),
    query('game').optional().not().isEmpty().withMessage(`Game name is required. Example: ${gameNameExa}`),
    query('purchase').optional().matches(datePattern).withMessage(`Must have a valid date value. Example: ${dateExample}`),
    query('refund').optional().isIn(refundWindowValues).withMessage('Refund status must equal "expired" or "active"'),
    query('lastPlayed').optional().matches(datePattern).withMessage(`Must have a valid date value. Example: ${dateExample}`)
]