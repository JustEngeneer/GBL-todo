const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const passwRegExp = /^[a-zA-Z0-9._-]{8,12}$/;
const delayShow = 3 * 1000; 
const storage = window.localStorage;

const $loginForm = document.forms.loginForm;
const $loginPage = document.getElementById('login');
const $todoPage  = document.getElementById('todo');
const $taskAdd   = document.getElementById('taskAdd');
const $taskText  = document.getElementById('taskText');
const $taskEdit  = document.getElementById('taskEdit');
const $textEdit  = document.getElementById('textEdit');
const $taskRemove  = document.getElementById('taskRemove');
const $taskContainer = document.getElementById('taskList');
const $wrongLoginMessage = document.getElementById('wrongLogin');
const $wrongPasswMessage = document.getElementById('wrongPassw');
const $emptyTask = document.getElementById('emptyTask');

// использование одного обьекта для разнообразных переменных 
// позволяет сохранять код чистым  
const App = {
    items: []
  };  

//  login form
$loginForm.onsubmit = function() {
    const showError = function(objMessage){
        objMessage.classList.remove('login__form__wrong_off');
        objMessage.classList.add('login__form__wrong_on');
    
        setTimeout(() => {
            objMessage.classList.remove('login__form__wrong_on');
            objMessage.classList.add('login__form__wrong_off');
        }, delayShow);
    }

    const verValue = function(val, valRegExp, message){
        const isValid = valRegExp.test(val);

        if( ! isValid ) showError(message);

        return isValid;
    }

    if( verValue($loginForm.email.value, emailRegExp, $wrongLoginMessage) && verValue($loginForm.passw.value, passwRegExp, $wrongPasswMessage) ) {
        $loginPage.classList.add('element__off');
        $todoPage.classList.remove('element__off');
        initTodo();
    };
}

//  todo 
function initHandler(){
    // привязываем обработку событий через addEventListener вместо onclick
    $taskAdd.addEventListener('click', add);
    $taskText.addEventListener('keydown', e => {
       if(e.keyCode === 13) add(); 
    });
}  

function add(){
    if($taskText.value.trim().length === 0){
        $emptyTask.classList.remove('element__off');
        $emptyTask.classList.add('element__on');

        setTimeout(() => {
            $emptyTask.classList.remove('element__on');
            $emptyTask.classList.add('element__off');
        },delayShow);
        return;
    }

    const task = {
        id: App.items.length,
        priority: 1,
        date: Date.now(),
        text: $taskText.value.trim(),
        done: false
    };

    $taskText.value = '';
    App.items.push(task);
    save();
    render();
}  

function editSave(){
    const itemIndex = window.activeTaskId;
    App.items[itemIndex].text = $textEdit.value.trim();
    $textEdit.value = '';
    $taskEdit.classList.add('element__off');
    save();
    render();
}

function editCancel(){
    $textEdit.value = '';
    $taskEdit.classList.add('element__off');
}

//для этого примера используем напрямую переданый индекс (айди)
function edit(itemIndex){
    window.activeTaskId = itemIndex;
    $textEdit.value = App.items[itemIndex].text.trim();
    $taskEdit.classList.remove('element__off');
}

//для этого примера используем напрямую переданый индекс (айди)
function done(itemIndex){
  // если done === false то становится true и наоборот
    App.items[itemIndex].done = !App.items[itemIndex].done;
    save();
    render();
}

function removeNo(){
    $taskRemove.classList.add('element__off');
}

function removeYes(){
    const itemIndex = window.activeTaskId;

    $taskRemove.classList.add('element__off');
    App.items.splice(itemIndex,1);
    save();
    render();
}

//для этого примера используем напрямую переданый индекс (айди)
function remove(itemIndex){
    window.activeTaskId = itemIndex;
    $taskRemove.classList.remove('element__off');
}

// использование отдельных функций для работы с сохранением и загрузкой данных
// позволяет легко подменять код внутри (например загружать данные с сервера), 
// при этом внешний код будет изменяться совсем немного, например, переход на использование
// callback или Promise если есть асинхронность (сетевой запрос) 
function load(){
    const storage_key = getStorageKey();
    const itemsFromStorage = storage.getItem(storage_key);
    App.items = itemsFromStorage ? JSON.parse(itemsFromStorage) : [];
}

//не нужно заранее пытатся писать код универсальный который будет работать например
//в будущем с запросами, если текущий код рассчитан на работу с Storage, то этого достаточно
// этот анти-паттерн называется "преждевременная оптимизация"
function save(){
    const storage_key = getStorageKey();
    const saveData = JSON.stringify(App.items);
    storage.setItem(storage_key, saveData);

}

/* действия связанные с форматирование текста, формированием каких то обьектов лучше всего
 выносить в отдельные функции с конкретным действием внутри
 старатся минимизировать использование внешних данных
 например эта функция зависит только от параметра date, и не работает ни с чем снаружи 
 такие функции называются "чистые" */
 function genDate(date){
    // использование маленьких внутрених функций позволяет экономить код
    function withZero(num){
      return num < 10 ? '0'+ num: num;
    }
    // разбивка на отдельные константы (переменные) позволяет с легкостью манипулировать 
    // порядком елементов, после получения нужного порядка можно оптимизировать до одной строки.
    const pDate = new Date();
    pDate.setTime(date);
    const hour = withZero(pDate.getHours());
    const min = withZero(pDate.getMinutes());
    const day = withZero(pDate.getDate());
    const month = withZero(pDate.getMonth() + 1);
    const year = pDate.getFullYear();

    return `
        <span class="todo__task__date">${day}.${month}.${year}</span>
        <span class="todo__task__time">${hour}:${min}</span>
    `
  }  
  
/* в качестве альтернативы этому варианту можна собирать HTML который отрисовывает такс с 
   отдельных кусочков, вызывая document.createElement('div') и добавляя их куда нужно
   используя appendChild и тд */
   function genItem(task, index){
  // после каждого рендера таска его индекс будет разный в зависимости от порядка елементов

  let classBtnDone = 'task-is-not-done';
  if(task.done) classBtnDone = 'task-is-done';

  const template = `
        <div class="todo__task__dt">${genDate(task.date)}</div>
        <div class="todo__task__pr">
            <span class="todo__task__pr-val">${String(task.priority)}</span>
            <div class="todo__task__pr__btn">
                <button class="todo__task__pr-up"></button>
                <button class="todo__task__pr-down"></button>
            </div>    
        </div>
        <div class="todo__task__desc">${task.text.trim()}</div>
        <ul class="todo__task__actions">
            <li><button class="todo__task__actions_edit" onclick="edit(${index})"></button></li>
            <li><button class="todo__task__actions_done ${classBtnDone}" onclick="done(${index})"></button></li>
            <li><button class="todo__task__actions_remove" onclick="remove(${index})"></button></li>
        </div>
    `;
  let $task = document.createElement('div');
  $task.id = index;
  $task.classList.add("todo__task");  
  $task.innerHTML = template;

  return $task;
}

//функция занимается только отрисовкой, любые изменнения в данных вызовут перерисовку 
//всего списка тасков, с этим нужно быть осторожным что бы не вызвать проблем с скоростью работы
//в данном примере этого достаточно но в рабочих приложениях нужно это учитывать, и не
// перерисовывать все без необходимости (Angular и другие фреймворки берут это на себя,
// вы работает в основном же с данными)
function render(){
    $taskContainer.innerHTML = '';  // clear task list before redrawing
    for (let i = 0; i < App.items.length; i++){
        const item = genItem(App.items[i],i);
        $taskContainer.appendChild(item);
    }
}

function getStorageKey(){
    return $loginForm.email.value + '##' + $loginForm.passw.value;
}

function initTodo(){
    initHandler();
    load();
    render();
}

  
