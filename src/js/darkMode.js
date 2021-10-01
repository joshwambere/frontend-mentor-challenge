function DarkModeSwitcher(){
 let dark=true
 const btn = document.getElementById('mode')
 const head = document.getElementById('header-w')
 const bod= document.getElementById('body-w')
 const inp = document.getElementById('input-w')
 const todo = document.getElementById('todo-w')
 const headWidget = document.getElementById('head-widget')
 
 btn.addEventListener("click", ()=>{
  dark = !dark
  
  if(!dark){
   head.classList.add('light')
   bod.classList.add('light')
   inp.classList.add('light')
   todo.classList.add('light')
   btn.src='./resources/images/icon-moon.svg'
   headWidget.style.background="#fff url('./resources/images/bg-desktop-light.jpg')"
   headWidget.style.backgroundRepeat="no-repeat"
   headWidget.style.backgroundSize="cover"
  }else{
   head.classList.remove('light')
   bod.classList.remove('light')
   inp.classList.remove('light')
   todo.classList.remove('light')
   btn.src='./resources/images/icon-sun.svg'
   headWidget.style.background="#fff url('./resources/images/bg-desktop-dark.jpg')"
   headWidget.style.backgroundRepeat="no-repeat"
   headWidget.style.backgroundSize="cover"
  }
 })
}

function draggs(){
 const draggables=document.querySelectorAll('.draggable')
 const containers=document.querySelectorAll('.draggings')
 draggables.forEach(draggable=>{
   draggable.addEventListener('dragstart',(e)=>{
     draggable.classList.add('dragging')
     draggable.classList.add('dragged')
   })

   draggable.addEventListener('dragend',()=>{
     draggable.classList.remove('dragging')
   }) 
 })

 containers.forEach(container=>{   
   container.addEventListener('dragover',(e)=>{
     e.stopPropagation();
     e.preventDefault()
     containerId=container.id;
     const draggable=document.querySelector('.dragging')
     const afterElement=getDraggAfterElement(container,e.clientY)
       if(afterElement==null){
           container.appendChild(draggable)
       }else{
           container.insertBefore(draggable, afterElement)
       }
   })
   container.addEventListener("dragleave", function( event ) {
    // reset background of potential drop target when the draggable element leaves it
    if ( event.target.className == "dropzone" ) {
        event.target.style.background = "";
    }

}, false);
 })

 //get previous element to drop after
 const getDraggAfterElement=(container,y)=>{
   const draggableElements=[...container.querySelectorAll('.draggable:not(.dragging)')]
   return draggableElements.reduce((closest,child)=>{
     const box=child.getBoundingClientRect()
     const offset=y- box.top - box.height /2
     if(offset<0 && offset>closest.offset){
       return {offset:offset, element:child}
     }else{
       return closest
     }
   }, {offset:Number.NEGATIVE_INFINITY}).element
 }

}
let todos = [
  {'status':'pending','name':'Cleaning my room'},
  {'status':'pending','name':'Going to class for math prep'},
  {'status':'pending','name':'Jogging in the backyard 3x'},
  {'status':'completed','name':'Take a nap for 2 hours'}
];

function addTodo(){
  const inputs=document.getElementById('input-w')
  
  let todo={}
  inputs.addEventListener('keyup',(e)=>{
    let inputValue = inputs.value
    e.preventDefault()
    if(e.keyCode==13 && inputValue ){
      let status = document.getElementById('in-check')
      status.checked ? todo={'status':'completed', 'name': inputValue} : todo={'status':'pending', 'name': inputValue}
      todos.push(todo)
      appendTodo()
      return todos
    }
  })
  
}

function displayTodo(){
  const uncompleted = document.querySelector('#uncompleted')
  let remainingTask=0
  todos.forEach((element,index) => {
    const todoCont = document.getElementById('draggings')
    element.status=='pending'? remainingTask++ :remainingTask
    todoCont.innerHTML+=`
    <div class="todo-tab draggable" draggable="true" data-id="${index}">
      <div class="todo-text">
        <input type="checkbox" ${element.status== "completed" ? 'checked' :null } class="todo-comp" onchange="CompleteTodo(${index})">
        <p class="${element.status== "completed" ? 'completed-task' :'uncompleted' }">${element.name}</p>
      </div>
      <div class="close">
        <img src="./resources/images/icon-cross.svg" alt="" id="delete" onclick="popTodo(${index})">
      </div>
    </div>  `
  });
  uncompleted.innerHTML=`${remainingTask} Items Left`
}

function appendTodo(){
  const todoCont = document.getElementById('draggings')
  const displayedTodo= document.querySelectorAll('.todo-tab')
  let nextIndex=displayedTodo.length
  let unDisplayedTodo = todos.filter((item, index)=>{
    if(index > displayedTodo.length - 1){
      return item
    }
  })
  
  unDisplayedTodo.forEach(item=>{
    let child=`
    <div class="todo-tab draggable" draggable="true" data-id="${nextIndex}">
      <div class="todo-text">
        <input type="checkbox" ${item.status== "completed" ? 'checked' :null } class="todo-comp" onchange="CompleteTodo(${nextIndex})">
        <p class="${item.status== "completed" ? 'completed-task' :'uncompleted' }">${item.name}</p>
      </div>
      <div class="close">
        <img src="./resources/images/icon-cross.svg" alt="" id="delete" onclick="popTodo(${nextIndex})">
      </div>
    </div>  `
    nextIndex++
    todoCont.innerHTML+=child
    
  })
}

function CompleteTodo(index){
  const complete = document.querySelector(`div[data-id="${index}"]`)
  let todoName = complete.querySelector('.todo-text > p')
  
  if (todoName.className=='uncompleted'){
    todoName.classList.add('completed-task')
    todoName.classList.remove('uncompleted')
    todoName.style.textDecoration="line-through"
  }else{
    todoName.classList.remove('completed-task')
    todoName.classList.add('uncompleted')
    todoName.style.textDecoration="none"
  }
}

function popTodo(index){
  const todoCont = document.getElementById('draggings')
  const uncompleted = document.querySelector('#uncompleted')
  const uncompletedText = uncompleted.innerText;
  todos.splice(index,1)
  const TodoRemoved = document.querySelector(`div[data-id="${index}"]`)
  const todoRemovedName = TodoRemoved.querySelector('.todo-text > p')
  let leftItems = parseInt(uncompletedText.split("")[0],10)
  todoCont.removeChild(TodoRemoved)

  if(todoRemovedName.className == 'completed-task'){
    leftItems
  }else{
    leftItems--
  }
  uncompleted.innerHTML=`${leftItems} Items Left`
}


document.addEventListener("DOMContentLoaded", function(){
 displayTodo()
 DarkModeSwitcher()
 draggs()
 addTodo()
 
});