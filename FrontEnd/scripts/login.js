// Variables
const loginForm = document.querySelector("form"); 
const tokenID = window.localStorage.getItem("tokenID") ; 

// Functions
function inputTest(email , pwd) {
/*  Function to test and treat email / password entered by user. 
    Parameters : 2 -> email , password
    Return : 1 -> object { "email" : email , "pwd" : password }
*/

    email = email.trim() ; 
    pwd = pwd.trim() ; 

    // local variables
    const emailRegexp =  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
    let result = emailRegexp.test(email) ;

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

        'http://localhost:5678/api/users/login' ,

        {   method: 'POST',
            headers: { 'Content-Type' : 'application/json' } ,
            body: bodyRequest
        }
    ) ;

    // server call treatment
    responseTreatment (serverCall) ; 
    
    // wait for Promise returned by server to be solved before conversion to a JS object
    const serverResponse = await serverCall.json() ;  

    return serverResponse ; 
} 

function responseTreatment (serverResponse) {
/*  Function to treat a server response after request response received. 3 things done : 
    - save server connection status (successful or not) in localStorage, based on 
    server response of "Promise" type (unsolved) received as parameter. 
    Status type = integer (200, 401, 404). 
    - prompt a message to inform user if connection successful or not. 
    - go to appropriate window based on server response. 
    Parameters : 1 -> server response (Promise pending)
    Return : none.
*/
    // if connection status ok (email/password approved), back to home page
    if (serverResponse.status === 200) {
        window.localStorage.setItem ("connectionStatus" , serverResponse.status) ; 
        alert("Connexion au serveur réussie") ;  
        window.location.href = "index.html" ; 

    } else {
        alert ("Échec connexion au serveur. \L'email ou le mot de passe n'existe pas.") ; 
        window.location.href = "login.html" ; 
    }
}

loginForm.addEventListener("submit", async function (event) {
/*  Event listener to treat form submit by user (email / password input)
    Parameters : 2
    Return : none.
*/

    // prevent page reload at submit
    event.preventDefault();

    // local variables
    let email = document.querySelector("[name=email]").value ;
    let password = document.querySelector("[name=pwd]").value ;

    // Test input (email / password)
    const inputObj = inputTest (email , password) ; 

    email = inputObj.email ; 
    password = inputObj.pwd ; 

    const dataInput = { email: email , password: password } ;

    // conversion to String type for body HTTP Request sending
    const chargeUtile = JSON.stringify(dataInput);

    // fetch token ID from server
    // wait for return of asynchronous event function, launched on event listener trigger 
    const tokenObj = await fetchToken(chargeUtile) ;

    window.localStorage.setItem ("tokenID" , tokenObj.token) ;  
} ) ;

export function editMode() {
    const banner = document.querySelector("#banner") ; 
    const filters = document.querySelector(".filters") ; 
    const modifier = document.getElementById("modifier") ; 

    console.log (tokenID) ; 

    if (tokenID) {
        banner.style.display = "flex" ; 
        filters.style.display = "none" ; 
        modifier.style.display = "inline" ; 

        window.localStorage.removeItem ("tokenID") ; 
    }
}

