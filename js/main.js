const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const passwRegExp = /^[a-zA-Z0-9._-]{8,12}$/;

const $loginForm = document.forms.loginForm;
//const $taskAddForm = document.forms.taskAddForm;
const $loginPage = document.getElementById('login');
const $todoPage  = document.getElementById('todo');
const $taskAdd   = document.getElementById('taskAdd');
const $taskText  = document.getElementById('taskText');


const $wrongLoginMessage = document.getElementById('wrongLogin');
const $wrongPasswMessage = document.getElementById('wrongPassw');

//  login form
$loginForm.onsubmit = function() {
    const showError = function(objMessage){
        const delayShowErr = 3 * 1000; 

        objMessage.classList.remove('login__form__wrong_off');
        objMessage.classList.add('login__form__wrong_on');
    
        setTimeout(() => {
            objMessage.classList.remove('login__form__wrong_on');
            objMessage.classList.add('login__form__wrong_off');
        }, delayShowErr);
    }

    const verValue = function(val, valRegExp, message){
        const isValid = valRegExp.test(val);

        if( ! isValid ) showError(message);

        return isValid;
    }

    if( verValue($loginForm.email.value, emailRegExp, $wrongLoginMessage) && verValue($loginForm.passw.value, passwRegExp, $wrongPasswMessage) ) {
        $loginPage.classList.add('element__off');
        $todoPage.classList.remove('element__off');
        $todoPage.classList.add('element__on');
        initTodo();
    };
};

//  todo 

//$taskAddForm.onsubmit = function() {}

function initHandler(){
    // привязываем обработку событий через addEventListener вместо onclick
    $taskAdd.addEventListener('click', add);
    $taskText.addEventListener('keydown', e => {
       if(e.keyCode === 13) add(); 
    });
  }  

function add(){

}  

function initTodo(){
    initHandler();
    /*
    load();
    render();
    */
  }

  
