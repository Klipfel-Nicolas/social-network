/**
 * Authentification Errors
 * @param {*} err 
 * @returns 
 */
module.exports.signUpErrors = (err) => {
    let errors = {pseudo : '', email: '', password: ''}

    if(err.message.includes('pseudo'))
        errors.pseudo = "Pseudo incorrect"
    
    if(err.message.includes('email'))
        errors.pseudo = "Email incorrect"
    
    if(err.message.includes('password'))
        errors.pseudo = "Le mot de passe doit faire 6 caractères minimum"
    
    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo')) {
        errors.pseudo = 'Ce pseudo est déjà enregistré'
    }

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes('email')) {
        errors.email = 'Cet email est déjà enregistré'
    }

    return errors; 
}

module.exports.signInErrros = (err) => {
    let errors = { email: '', password: ''}

    if(err.message.includes("email"))
        errors.email = "Email inconnu";
    
    if(err.message.includes("password"))
        errors.password = "Le mot de passe ne correspond pas";

    return errors;
}

/**
 * Upload Error
 * @param {*} err 
 * @returns 
 */
module.exports.uploadErrors = (err) => {
    let errors = {format : '', maxSize: ''};

    if(err.message.includes('invalid file'))
        errors.format = "Format incompatible";

    if(err.message.includes('max size'))
        errors.format = "Le fichier dépasse 500ko";

    return errors;
}