const wrongLoginMessage = document.getElementById('wrongLogin');
const wrongPasswMessage = document.getElementById('wrongPassw');

const showError = function(objMessage){
    const delayShowErr = 3 * 1000; 

    objMessage.classList.remove('login__form__wrong_off');
    objMessage.classList.add('login__form__wrong_on');

    setTimeout(() => {
        objMessage.classList.remove('login__form__wrong_on');
        objMessage.classList.add('login__form__wrong_off');
    }, delayShowErr);
}

const verLogin = function(login){
    const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const isValid = emailRegExp.test(login);
    
    if( ! isValid ) showError(wrongLoginMessage);

    return isValid;
}

const verPassw = function(password){
    const passwRegExp = /^[a-zA-Z0-9._-]{8,12}$/;
    const isValid = passwRegExp.test(password)
    
    if( ! isValid ) showError(wrongPasswMessage);

    return isValid;
}