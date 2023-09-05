import { account, project, todo, item } from "./backend"
import { parse, format } from 'date-fns'
const modal = document.getElementById('project-todo')
const contentDiv = document.getElementById('content')

// helper function
const modalController = (() => {
    const title = document.getElementById('title')
    const description = document.getElementById('description')
    const duedate = document.getElementById('duedate')
    const priority = document.getElementById('priority')
    const create = async function() {
        let data 
        let closeEvent = new Promise((resolve) => {
            modal.addEventListener('close', (e) => {
                if(e.target.returnValue == 'save') {
                    
                    data = [title.value, description.value, duedate.value, priority.value]
                    // data = [title.value, description.value, dateFormatted, priorityFormatted]
                } else {
                    data = ''
                }
                resolve()
            })
        })
        modal.showModal()
        await closeEvent
        return data
    }
    
    const newModal = async function() {
        title.value = ''
        description.value = ''
        duedate.value = ''
        priority.value = ''
        let data = await create()
        return data 
    }
    const edit = async function(object) {
        // supply modal with default value
        title.value = object.title
        description.value = object.description
        duedate.value = object.duedate
        priority.value = object.priority
        let data = await create()
        return data
    }
    return { newModal, edit }
})()
function cleanNode(node) {
    while(node.lastElementChild){
        node.lastElementChild.remove()
    }
}
function formatDate(string) {
    let duedate = parse(string, 'yyyy-MM-dd', new Date())
    return format(duedate, "EEEE, MMMM do, yyyy")
}
function convertPriority(number) {
    switch(number) {
        case "1": 
            return "Very important!";
        case "2":
            return "Important";
        case "3":
            return "Normal";
        case "4":
            return "Can finish any time";
    }
}
const displayItem = (item) => {
    let template = document.getElementById('item')
    let content = template.content.cloneNode(true)
    let checkBox = content.querySelector('li input')
    let itemContent = content.querySelector('li div')
    let editBtn = content.querySelectorAll('button')[0]

    function basicInfo() {
        checkBox.checked = item.complete
        itemContent.textContent = item.content
    }
    const perform = () => {
        basicInfo()
        eventHandler()
        
        return content
    }
    
    
    const eventHandler = () => {
        checkBox.addEventListener('click', () => {
            // update data of item object
            item.complete = checkBox.checked
        })
        editBtn.addEventListener('click', async function() {
            await edit(itemContent) 
        })
        
    }

    const edit = async function(itemContent) {
        itemContent.contentEditable = true 
        itemContent.focus()
        let keyupEvent = new Promise((resolve) => {
            document.addEventListener('keyup', (e) =>{
                if(e.key === 'Enter') {
                    // lock the edit function 
                    itemContent.contentEditable = false
                    // send data to item object
                    item.content = itemContent.textContent
                    resolve()
                }
            })
        }) 
        let blurEvent = new Promise((resolve) => {
            itemContent.addEventListener('blur', () => {
                // lock the edit function 
                itemContent.contentEditable = false
                // send data to item object
                item.content = itemContent.textContent
                resolve()
            })
        })
        await Promise.any([keyupEvent, blurEvent])
    }
    
    return { perform, edit }
}
const displayTodo = (todo) => {
    let template = document.getElementById('todo')
    let content = template.content.cloneNode(true)
    let title = content.querySelector('li button')
    let bodyDiv = content.querySelector('li div')
    let checkListDiv = bodyDiv.getElementsByTagName('ul')[0]

    let addBtn = bodyDiv.getElementsByTagName('button')[2]
    let editBtn = bodyDiv.getElementsByTagName('button')[0]
   
    function expandableTodo() {
        // create an expandable to-do list
        bodyDiv.classList.add('disappear')
        title.textContent = todo.title
        title.addEventListener('click', () => {
            title.classList.toggle("active")
            bodyDiv.classList.toggle("disappear")
        })
    }
    function addBtnEvent() {
        // add function to the add button of checklist to add item
        addBtn.addEventListener('click', async function(){
            let newItem = item('')
            todo.add(newItem)
            let newItemDiv = addItemContent(newItem)
            checkListDiv.appendChild(newItemDiv)
            let itemContent = checkListDiv.lastElementChild.querySelector('div')
            await displayItem(newItem).edit(itemContent)
        })
    }
    function editBtnEvent() {
        editBtn.addEventListener('click', async function() {
            let data = await modalController.edit(todo)
            if(data !== '') {
                todo.edit(...data)
                // update new data 
                title.textContent = todo.title
                basicInfo()
            }
        })
    }
    
    
    function basicInfo() {
        let dateFormatted = formatDate(todo.duedate)
        let priorityFormatted = convertPriority(todo.priority)

        bodyDiv.getElementsByTagName('p')[0].textContent = `Description: ${todo.description}`
        bodyDiv.getElementsByTagName('input')[0].checked = todo.complete
        bodyDiv.getElementsByTagName('p')[2].textContent = `Due date: ${dateFormatted}`
        bodyDiv.getElementsByTagName('p')[3].textContent = `Priority: ${priorityFormatted}`
    }
    function checklist() {
        todo.checklist.forEach((item) => {
            let itemDiv = addItemContent(item)
            checkListDiv.appendChild(itemDiv)
        })
    }
    function addItemContent(item) {
        const itemDiv = displayItem(item).perform()
        const deleteItemBtn = itemDiv.querySelectorAll('li button')[1]
        deleteItemBtn.addEventListener('click', (event) => {
            // remove display of item 
            event.target.parentElement.remove()
            // remove item from checklist
            todo.remove(item)
        })
        return itemDiv
    }
    const perform = () => {
        basicInfo()
        checklist()
        expandableTodo()
        addBtnEvent()
        editBtnEvent()

        return content
    }
    return { perform }
}
const displayProject = (project) => {
    let template = document.getElementById('project')
    let content = template.content.cloneNode(true)
    let addBtn = content.querySelectorAll('button')[2]
    let editBtn = content.querySelectorAll('button')[0]
    const todosDiv = content.querySelector('ul')


    function addTodoContent(todo) {
        const todoDiv = displayTodo(todo).perform()
        const deleteTodoBtn = todoDiv.querySelectorAll('li div button')[1]
        deleteTodoBtn.addEventListener('click', (event) => {
            project.remove(todo)
            event.target.parentElement.parentElement.remove()
        })
        return todoDiv
    }
    
    function basicInfo(content) {
        let dateFormatted = formatDate(project.duedate)
        let priorityFormatted = convertPriority(project.priority)

        content.querySelector('h2').textContent = project.title
        content.querySelectorAll('p')[0].textContent = `Description: ${project.description}`
        content.querySelector('input').checked = project.complete
        content.querySelectorAll('p')[2].textContent = `Due date: ${dateFormatted}`
        content.querySelectorAll('p')[3].textContent = `Priority: ${priorityFormatted}`
    }
    function todoDiv() {
        project.todos.forEach((todo) => {
            const todoContent = addTodoContent(todo)
            todosDiv.appendChild(todoContent)
        })
    }

    const perform = () => {
        cleanNode(contentDiv)
        basicInfo(content)
        todoDiv(project)
        addBtnEvent(project)
        editBtnEvent(project)
        return content
    }
    function editBtnEvent() {
        editBtn.addEventListener('click', async function(){
            let data =  await modalController.edit(project)
            if(data !== '') {
                project.edit(...data)
                basicInfo(contentDiv)
            }
        })
    }
    function addBtnEvent() {
        addBtn.addEventListener('click', async function(){
            // display modal to get data 
           let data = await modalController.newModal() 
           if (data !== '') {
               // create new todo object  & add it the todos of project
               let newTodo = todo(...data)
               project.add(newTodo)
               // use data of newly create project object to display
               let newTodoDiv = addTodoContent(newTodo)
               todosDiv.appendChild(newTodoDiv)
           }
       })
    }
    
    
    return { perform }
}
const displayAccount = (account) => {
    const nav = document.getElementById('nav')
    const addBtn = nav.children[1]
    function createTab(project) {
        // create project tab in the nav bar
        let tab = document.createElement('button')
        tab.textContent = project.title
        // add event listener when clicking the tab
        tab.addEventListener('click', () => {
            addProjectContent(project)
        })
        document.getElementById('tabs').appendChild(tab)
    }
    function addBtnEvent() {
        addBtn.addEventListener('click', async function() {
            let data = await modalController.newModal()
            if(data !== '') {
                let newProject = project(...data)
                account.add(newProject)
                // display project
                createTab(newProject)
                addProjectContent(newProject)
            }
        })
    }
    function addProjectContent(project) {
        let projectTemplate = displayProject(project).perform()
        // add event listener to the delete button
        projectTemplate.querySelectorAll('button')[1].addEventListener('click', () => {
            // retrieve account object to perform delete 
            account.remove(project)
            // chang display
            cleanNode(contentDiv)
            removeTab(project)
        })
        contentDiv.appendChild(projectTemplate)
    }
    
    const perform = () => {
        account.projects.forEach((project) => {
            createTab(project)
            addProjectContent(project)
        })
        addBtnEvent()
    }
   
    const removeTab = (project) => {
        const tabs = document.getElementById('tabs').children
        for(const tab of tabs) {
            if(tab.textContent === project.title) {
                tab.remove()
            }
        }
    }
    return { perform }
    
}
export { displayAccount }