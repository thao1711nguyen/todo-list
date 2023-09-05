import { account, deserialize} from "./backend"
import { displayAccount } from "./display"
import './style.css'


let newAccount
window.addEventListener('load', () => {
    if(localStorage.getItem('account') === null || localStorage.getItem('account') === "undefined") {
        newAccount = account()
    } else {
        // reconstruct objects
        newAccount = deserialize(localStorage.getItem('account'))
        console.log(newAccount)
    }
    displayAccount(newAccount).perform()
})

window.addEventListener('beforeunload', () => {
    let newAccountJson = JSON.stringify(newAccount)
    localStorage.setItem("account", newAccountJson)
})
