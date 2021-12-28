let todoList = [];
let currentTasksList = [];

/* get data from Local Storage */
todoList = JSON.parse(localStorage.getItem('todoList'));
if( todoList == undefined ) todoList = [];

const showTodo = function() {
    // alert('It is time to show the todo list!!!');
}