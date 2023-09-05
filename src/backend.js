const account = () => {
    let projects = []
    function add(project) {
        this.projects.push(project)
    }
    function remove(project) {
        let index = this.projects.indexOf(project)
        delete this.projects[index]
        // if all of the item of projects are undefined, empty it
        if(this.projects.every((project) => project === 'undefined')) {
            this.projects = []
        }
    }
    // function serialize() {
    //     return JSON.stringify(this, replacer)
    // }
    // function replacer(key, value) {
    //     if(Array.isArray(value)) {
    //         return value.map((project) => project.serialize())
    //     }
    //     else {
    //         console.log(typeof value)
    //         return value
    //     }
    // }
    return { projects, add, remove}
}
const project = (title, description, duedate, priority) => {
    let todos = []
    function add(todo) {
        this.todos.push(todo)
    }
    function edit(newTitle, newDescription, newDuedate, newPriority){
        this.title = newTitle
        this.description = newDescription
        this.duedate = newDuedate
        this.priority = newPriority
    }
    function remove(todo) {
        let index = this.todos.indexOf(todo)
        delete this.todos[index]
        // if all of the item of projects are undefined, empty it
        if(this.todos.every((todo) => todo === 'undefined')) {
            this.todos = []   
        }
    }
    // function serialize() {
    //     return JSON.stringify(this, replacer)
    // }
    // function replacer(key, value) {
    //     if(Array.isArray(value)) {
    //         return value.map((todo) => todo.serialize())
    //     }
    //     else {
    //         return value
    //     }
    // }
    
    return {todos, add, title, description, duedate, priority, edit, remove}
}
const todo = (title, description, duedate, priority) => {
    let checklist = []
    function edit(newTitle, newDescription, newDuedate, newPriority) {
        this.title = newTitle
        this.description = newDescription
        this.duedate = newDuedate
        this.priority = newPriority
    }
    function add(item) {
        this.checklist.push(item)
    }
    function remove(item) {
        let index = this.checklist.indexOf(item)
        delete this.checklist[index]
        // if all of the item of projects are undefined, empty it
        if(this.checklist.every((item) => item === 'undefined')) {
            this.checklist = []   
        }
    }
    // function serialize() {
    //     return JSON.stringify(this, replacer)
    // }
    // function replacer(key, value) {
    //     if(Array.isArray(value)) {
    //         return value.map((item) => item.serialize())
    //     }
    //     else {
    //         return value
    //     }
    // }
    return { title, description, duedate, priority, edit, checklist, remove, add }
}
const item = (content, complete = false) => {
    // function serialize() {
    //     return JSON.stringify(this)
    // }
    return { content, complete } 
}
function deserialize(string) {
    let newAccount = JSON.parse(string)
    // stub method back to account
    let fullNewAccount = Object.assign(account(), newAccount)
    // stub method back to each project
    fullNewAccount.projects = fullNewAccount.projects.map((p) => Object.assign(project(), p))
    // stub method back to todo 
    fullNewAccount.projects.forEach((project) => {
        project.todos = project.todos.map((t) => Object.assign(todo(), t))
    })
    // stub method back to item
    fullNewAccount.projects.forEach((project) => {
        project.todos.forEach((todo) => {
            todo.checklist = todo.checklist.map((i) => Object.assign(item(), i))
        })
    })
    return fullNewAccount
    
}
export { account, project, todo, item, deserialize}