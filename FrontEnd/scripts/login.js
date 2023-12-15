
// -------  GLOBAL VARIABLES  -------

const loginLink = document.getElementById("login-link") ; 
const modalLogin = document.querySelector (".modal-login") ; 

const homeLink = document.getElementById("home-link") ; 
const modalMain = document.querySelector (".main-content") ; 
const inputFocus = document.querySelector("[name=email]") ; 

const loginForm = document.querySelector(".login-form") ; 


// -------  FUNCTIONS  -------

function inputTest(email , pwd) {
/*  Function to test and treat email / password entered by user. 
    Parameters : 2 -> email , password
    Return : 1 -> object { "email" : email , "pwd" : password }
*/
        // delete white spaces at begining and end of strings
        email = email.trim() ; 
        pwd = pwd.trim() ; 
    
        // local variables
        const emailRegexp =  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
        let result = emailRegexp.test(email) ;  // test if email format
    
        // Prevent empty fields
        if ( (email === "") || (pwd === "") ) {
    
            alert("Email et mot de passe de connexion sont obligatoires.") ; 
            window.location.href = "login.html" ; 
    
        }else if (!result) {
        // Check email format
            alert ("Votre email est incorrect.") ; 
            window.location.href = "login.html" ;
        }else{
            return { "email" : email , "pwd" : pwd } ; 
        }    
}
    
const fetchToken = async (bodyRequest) => {
/*  Asynchronous function that sends a request (POST method) to backend API server, 
    to submit email and password entered by user for backend test.
    If email and password match backend ressource, returns server response. 
    Parameters : none. 
    Return : 1 -> object { userID , token n° }
*/

    const serverCall = await fetch (
    // wait for server connection before sending request

        'http://localhost:5678/api/users/login' ,

        {   method: 'POST',
            headers: { 'Content-Type' : 'application/json' } ,
            body: bodyRequest
        }
    ) ;

    // wait for Promise returned by server to be solved before conversion to a JS object
    const serverResponse = await serverCall.json() ;  

    return serverResponse.token ; 
} 

// focus email input field on page load
inputFocus.focus() ; 

// Event listener on login form submit
loginForm.addEventListener("submit", async function (event) {
/*  Event listener to treat form submit by user (email / password input). 
    If email/password valid, server response returned with token id, saved 
    in local storage. 
*/
    // prevent page reload on submit
    event.preventDefault();

    // local variables
    let email = document.querySelector("[name=email]").value ;
    let password = document.querySelector("[name=pwd]").value ;

    // Test input (email / password)
    const inputObj = inputTest (email , password) ; 

    email = inputObj.email ; 
    password = inputObj.pwd ; 

    // JS object to be sent to server
    const dataInput = { email: email , password: password } ;

    // JS object conversion to String type for body HTTP Request sending
    const chargeUtile = JSON.stringify(dataInput);

    // fetch token ID from server
    const token = await fetchToken(chargeUtile) ;

    // Test of server response (token returned if connection successful)
    if (!token) {
        alert("Votre email ou mot de passe est incorrect.") ; 
        window.location.href = "login.html" ; 
    } else {
        alert("Connexion réussie.") ; 
        window.localStorage.setItem("tokenID" , token) ; 
        window.location.href = "editmode.html" ; 
    }

} ) ;