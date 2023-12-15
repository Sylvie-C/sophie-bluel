import { generateHome } from './gallery.js' ; 

// back to home page = token removal
window.localStorage.removeItem("tokenID") ; 

// load home page
generateHome() ; 








