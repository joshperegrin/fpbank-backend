const validateAddress = require("../validator/address.validator.js");
const validateDateString = require("../validator/datestring.validator.js");
const validatePassword = require("../validator/password.validator.js");
const validateEmail = require("../validator/email.validator.js");
const { validateName } = require("../validator/name.validator.js");
const validateNationality = require("../validator/nationality.validator.js");
const validateValidIDType = require("../validator/valid_id_type.validator.js");
const validateValidIDFile = require("../validator/validid_file.validator.js");

function openAccountMiddleware(req, res, next) {
    const errors = {};
    let validationResult;

    validationResult = validateName(req.body.firstname);
    if (validationResult !== null) errors.firstname = validationResult;

    validationResult = (req.body.middlename)? validateName(req.body.middlename): null;
    if (validationResult !== null) errors.middlename = validationResult;

    validationResult = validateName(req.body.lastname);
    if (validationResult !== null) errors.lastname = validationResult;

    validationResult = validateEmail(req.body.email);
    if (validationResult !== null) errors.email = validationResult;

    validationResult = validatePassword(req.body.password);
    if (validationResult !== null) errors.password = validationResult;

    validationResult = validateDateString(req.body.dateOfBirth);
    if (validationResult !== null) errors.dateOfBirth = validationResult;

    validationResult = validateNationality(req.body.nationality);
    if (validationResult !== null) errors.nationality = validationResult;

    validationResult = validateAddress(req.body.address);
    if (validationResult !== null) errors.address = validationResult;

    validationResult = validateValidIDType(req.body.idtype);
    if (validationResult !== null) errors.idtype = validationResult;

    validationResult = validateValidIDFile(req.file);
    if (validationResult !== null) errors.validid = validationResult;

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    next();
}

module.exports = openAccountMiddleware;
