import { fetchWorks , fetchCategory , emptyGallery , displayGallery } from "./gallery.js" ;


// -------  VARIABLES  -------

let token = window.localStorage.getItem("tokenID") ; 
let worksResource = await fetchWorks() ; 
let categoriesResource = await fetchCategory() ; 

const logoutLink = document.getElementById("logout-link") ; 

const modalLink = document.getElementById("modal-open") ;

const modal = document.querySelector(".modal") ; 
const modalWrapper = document.querySelector(".modal-wrapper") ; 

const modalCloseLink = document.querySelector(".modal-close") ; 

// delete works modal
const modalDelete = document.querySelector (".modal-delete") ; 
const modalGallery = document.querySelector(".modal-gallery") ; 
const modalBtn = document.querySelector(".modal-btn") ;

// add works modal
let fileUploaded ;

const modalAdd = document.querySelector (".modal-add") ; 
const modalArrow = document.querySelector(".modal-arrowLeft") ; 

const formAddFile = document.querySelector(".form-addFile") ; 
const modalDragDrop = document.querySelector(".modal-dragdrop") ; 

const titleInput = document.querySelector("input[name=title]") ; 
const categoryInput = document.getElementById("category") ; 
const modalAddBtn = document.querySelector(".modal-addBtn") ; 


// -------  FUNCTIONS  -------

function onlogin() {
    // Local variables 
    const modifierContainer = document.getElementById("modifier") ; 
    const banner = document.getElementById("banner") ; 

    // Instructions
    if (!token) {
        window.location.href = "index.html" ; 
        modifierContainer.style.display = "none" ; 
        banner.style.display = "none" ; 
    }
}

const logoutEditmode = () => {
    window.location.href = "index.html" ; 
    window.localStorage.clear() ; 
    token = null ; 
}

// Functions to generate modals
const generateModal = (works , token) => {
/*  Function to open the modal on click on "modifier" link, 
    then displays "delete pictures" modal (default) and "add pictures" modal.
    Parameters : 2 -> works resource , token. 
    Return : none. 
*/
    // Generate pictures gallery in Delete modal
    generateModalGallery(works , token) ; 

    // Dynamically generate category options for select tag in "Add works" modal
    generateCategorySelect() ; 

    // EVENT LISTENERS

    // open modal on click on "modifier" link and display "Delete modal" content
    modalLink.addEventListener("click" , function () {
        modal.style.display = "flex" ; 
        displayDeleteModal() ;
        resetAddModal() ; 
    } ) ;

    // close modal on click on "x" icon
    modalCloseLink.addEventListener ("click" , function () {
        modal.style.display = "none" ;
        resetAddModal() ; 
    } ) ; 
    
    // close modal on click outside modal
    modal.addEventListener ("click" , function (evt) {
        if (!modalWrapper.contains(evt.target)) {
        // if click not inside modal wrapper (modal window) , close modal
            modal.style.display = "none" ;
            resetAddModal() ; 
        }
    }) ; 

    // open "Add modal" on click on "Ajout Photo" button
    modalBtn.addEventListener ("click" , function () { 
        resetAddModal() ; 
        displayAddModal() ; 
    } ) ;

    // open "Delete modal" content on click on "arrow left" icon
    modalArrow.addEventListener ("click" , function () {
        displayDeleteModal() ; 
        resetAddModal() ; 
    } ) ;  
}

function generateModalGallery(worksResource , token) { 
/*  Function to display pictures gallery in Delete pictures modal, 
    with a little trash icon to enable deletion, based on all works resource 
    fetched from server. 
    Parameters : none. 
    Return : none. 
*/
    // Parse works resource
    for (let i=0; i<worksResource.length; i++) {

        // Add a div container : <div class="modal-elt" id= "work id number">
        const imgContainer = document.createElement("div") ; 
        imgContainer.classList.add("modal-elt") ; 
        imgContainer.setAttribute ("id" , worksResource[i].id) ; // worksResource.id = work id number in database

        // Add a picture : <div class="modal-elt" id="work id number"> <img src="pix" alt="pixText">
        const imgElt = document.createElement("img") ; 
        imgElt.src = worksResource[i].imageUrl ; 
        imgElt.alt = worksResource[i].title ; 
        imgContainer.appendChild(imgElt) ; 

        /*  Add trash link icon : 
            <div class="modal-elt" id="work id number"> 
                <img src="pix" alt="pixText"> <a href="#" class="trash"> </a> 
            </div>
        */
        const trashLink = document.createElement("a") ; 
        trashLink.setAttribute("href" , "#") ; 
        trashLink.classList.add("trash") ; 

        /*  Add icon image of trash : 
            <div class="modal-elt" id= "work id number"> 
                <img src="pix" alt="pixText"> 
                <a href="#" class="trash"> <img src="assets/icons/trash.svg" alt=""> </a> 
            </div>
        */
        const trashImg = document.createElement("img") ; 
        trashImg.src = "assets/icons/trash.svg" ; 
        trashImg.alt = "" ; 

        trashLink.appendChild(trashImg) ; 
        imgContainer.appendChild(trashLink) ; 
        modalGallery.appendChild(imgContainer) ; 

        trashLink.addEventListener("click" , function () {
            // delete picture from server and from gallery
            deleteWorks (token , imgContainer.id) ; 
        }) ; 
    } // end of loop "for"
}

function displayDeleteModal() {
/*  Function to display Delete pictures modal, update aria-hidden attributes, 
    hide arrow icon (only for Add pictures modal). 
    Parameters : none. 
    Return : none. 
*/
    modalDelete.style.display = "flex" ; 
    modalDelete.setAttribute ("aria-hidden" , false) ;

    modalAdd.style.display = "none" ; 
    modalAdd.setAttribute ("aria-hidden" , true) ; 

    modalArrow.style.display = "none" ;
}
    
function displayAddModal() {
/*  Function to display Add pictures modal, update aria-hidden attributes, 
    show arrow icon (only for Add pictures modal). 
    Parameters : none. 
    Return : none. 
*/

    modalDelete.style.display = "none" ; 
    modalDelete.setAttribute ("aria-hidden" , true) ;

    modalAdd.style.display = "flex" ;
    modalAdd.setAttribute ("aria-hidden" , false) ; 

    modalArrow.style.display = "flex" ;
}

// Function to delete picture in "delete" modal. Called by generateModalGallery() function
async function deleteWorks(token , workID) {
    try {
        const serverCall = await fetch (
            `http://localhost:5678/api/works/${workID}` ,

            {   method: 'DELETE',
                headers: { 'Authorization' : 'Bearer ' + token } , }
        ) ;

        if (!serverCall.ok) { 
            throw new Error ("Erreur de suppression de travaux") ; 
        } else {
            updateGallery() ; 
            updateModalGallery(token) ; 
        }
    }
    catch (error) { 
        console.error (error) ; 
    } 
}

async function updateGallery () {
/*  Function to update Home page pictures gallery. 
    Parameters : none. 
    Return : none. 
*/
    const works = await fetchWorks() ; 
    emptyGallery() ; 
    
    // gallery container : <div class="gallery"> 
    const galleryContainer = document.querySelector(".gallery") ; 

    // Insert pictures + titles into DOM
    for (let i=0; i < works.length; i++) {     // parse works array of objects
        // Picture + Title container (<figure>)
        const figureElt = document.createElement("figure") ;

        // gallery img elements
        const imgElt = document.createElement("img") ; 
        imgElt.src = works[i].imageUrl ; 

        // titles elements
        const figcaptionElt = document.createElement("figcaption") ;
        figcaptionElt.textContent = works[i].title; 

        // Insert pictures + titles into DOM
        figureElt.appendChild(imgElt) ; 
        figureElt.appendChild(figcaptionElt) ; 

        galleryContainer.appendChild(figureElt) ; 
    } 
}

async function updateModalGallery(token) {
// Function to update "delete pictures" modal gallery content
    const works = await fetchWorks() ; 
    modalGallery.replaceChildren() ; 
    generateModalGallery(works , token)
}

// Functions to add works

function serverSendWork (token , formDataObject) {
    // fetch/send work to server
    fetch( 'http://localhost:5678/api/works'  ,  
    { 
        method : 'POST' , 
        headers : { 'Authorization' : 'Bearer ' + token } ,
        body :  formDataObject
    } 
    )
    .then(response => { 
        response.json() ; 
        if (response.ok) { 
            alert('Connexion au serveur réussie / Fichier envoyé.');
            updateGallery() ; 
            updateModalGallery(token) ;  

            // back to edit mode page + reset "add modal"
            displayDeleteModal() ; 
            // resetAddModal() ; 
        } else { 
            alert( "Un problème est survenu. Fichier non envoyé."); 
        } 
    } ) 
    .catch(error => { 
        console.log('Erreur de connexion au serveur : ', error); 
    } ) ;
}

function resetAddModal() {
    modalDragDrop.replaceChildren() ; 
    modalDragDrop.innerHTML = 
    `
        <img src="assets/icons/picture.svg" alt="">
        <label for="input-file" class="label-file">+ Ajouter photo</label>
        <input id="input-file" type="file">
        .jpg , .png : 4mo max
    ` ; 

    fileUploaded = "" ; 
}

function generateCategorySelect() {
    categoriesResource.forEach ( categoriesElt => {
        const optionElt = document.createElement("option") ; 
        optionElt.setAttribute("value" , categoriesElt.id) ; 
        optionElt.innerText = categoriesElt.name ; 

        categoryInput.append(optionElt) ; 
    } ) ; 
}

function uploadWork (token) {

    // -------  LOCAL VARIABLES :  
    let newImage = document.createElement("img") ;   

    // event listener on file upload
    modalDragDrop.addEventListener("input" , function(event) {  

        // Uploaded File object
        fileUploaded = event.target.files[0] ; 

        // image HTML object for display
        newImage.src = "/assets/images/" + event.target.files[0].name ; 
        newImage.alt = "votre image ajoutée" ; 
        newImage.style.width = "150px" ;

        // image HTML object display
        modalDragDrop.replaceChildren() ; 
        modalDragDrop.append(newImage) ; 

    } ) ; // end of event listener on file upload button


    // event listener on validate button click
    modalAddBtn.addEventListener ( "click" , function(event) {
        let titleData = titleInput.value ; 
        titleData = titleData.trim() ; 

        if (!fileUploaded) {
            event.preventDefault() ;
            alert("Une photo est obligatoire. ") ;  
        } else if (titleData === "") {
            event.preventDefault() ; 
            alert("Un titre est obligatoire. ") ; 
        }
    } ) ; 


    // event listener on validate button click
    formAddFile.addEventListener ("submit" , function (event) {

        event.preventDefault() ; 

        // Make FormData object
        let formDataObj = new FormData() ; 

        formDataObj.append ("image" , fileUploaded) ;
        formDataObj.append ("title" , titleInput.value ) ; 
        formDataObj.append ("category" , parseInt(categoryInput.value)) ; 

        // Send FormData object to server
        serverSendWork (token , formDataObj) ;  

        // Reset input fields
        titleInput.value = "" ; 
    } ) ; 

} // End of uploadFile() function

// ------- END OF FUNCTIONS SECTION


// ------- EVENT LISTENERS -------

// Log out on click on "logout" link
logoutLink.addEventListener ( "click" , function () {
    logoutEditmode() ; 
} ) ; 

// ------- END OF EVENT LISTENERS

onlogin() ; 

displayGallery (worksResource) ; 

generateModal (worksResource , token) ; 

uploadWork(token) ; 