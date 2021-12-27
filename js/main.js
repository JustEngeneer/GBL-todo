const loginForm = document.forms.loginForm;

/* Check: do field values follow rules? */
/*
loginForm.email.onchange = function() {verLogin(loginForm.email.value)};
loginForm.passw.onchange = function() {verPassw(loginForm.passw.value)};
*/
loginForm.onsubmit = function() {
    if( verLogin(loginForm.email.value) && verPassw(loginForm.passw.value) ) {
        showTodo();
    };
};
