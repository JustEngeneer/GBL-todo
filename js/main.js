const loginForm = document.forms.loginForm;
const loginPage = document.getElementById('login');
const todoPage  = document.getElementById('todo');

/* Check: do field values follow rules? */
/*
loginForm.email.onchange = function() {verLogin(loginForm.email.value)};
loginForm.passw.onchange = function() {verPassw(loginForm.passw.value)};
*/

loginForm.onsubmit = function() {
    if( verLogin(loginForm.email.value) && verPassw(loginForm.passw.value) ) {
        loginPage.classList.add('element__off');
        todoPage.classList.remove('element__off');
        todoPage.classList.add('element__on_block');
        showTodo();
    };
};
