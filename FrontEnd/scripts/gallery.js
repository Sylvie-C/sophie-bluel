const fetchTravaux = async () => {
    try {
        const response = await fetch ("http://localhost:5678/api/works") ; 

        if (!response.ok) { 
            throw new Error ("Erreur de récupération des travaux") ; 
        }

        // fetch works data from JSON/Database 
        const works = await response.json() ; 

        // generate array of objects necessary for the gallery display
        const galleryObj = galleryObjects(works) ;  

        // display all works on page
        display(galleryObj) ; 

        // on click on filter button, display of pictures filter
        const parentElt = document.querySelector(".filters") ; 

        // "click" event listened by container of clickable elements (filter buttons)
        parentElt.addEventListener ( "click" , function (evt) {  
            // catch filter button data-identifier
            const filterId = evt.target.dataset.filter ;  

            // apply filter
            let filterArray = filterBtn(galleryObj , filterId) ; 

            // empty current gallery display
            emptyGallery() ; 

            // display updated content
            display(filterArray) ; 
        } ) ; 
    }
    catch (error) { 
        console.error (error) ; 
    }
 }

function galleryObjects (worksDb) {
/*
    Function to return an Array of objects extracting 
    all pictures path/filename, captions and categoryId from works JSON/database. 
    Each object contains { Picture path/filename , caption , categoryId } then.  
    Objects keys are "pix" , "pixText" , "categoryId" . 
    Files name, caption : String type. Category id : Number type. 
    Parameters : 1 -> database. 
    Return : 1 -> Array of objects. 
*/

    // local variables
    let galleryArray = [] ; 

    for (i=0; i<worksDb.length; i++) {
        const pix = worksDb[i].imageUrl ; 
        const caption = worksDb[i].title ; 
        categoryId = worksDb[i].categoryId ; 

        const galleryItem = { pix : pix , pixText : caption , categoryId : categoryId } ; 

        galleryArray.push( galleryItem ) ; 
    }

    return galleryArray ; 
}

function emptyGallery () {
    let gallery = document.querySelector(".gallery") ; 
    gallery.replaceChildren() ; 
}

function display (arrayObjects) {
    
    // gallery container : <div class="gallery"> 
    const galleryContainer = document.querySelector(".gallery") ; 

    // Insert pictures + titles into DOM
    for (i=0; i < arrayObjects.length; i++) {     // parse array of objects
        // Picture + Title container (<figure>)
        const figureElt = document.createElement("figure") ;

        // gallery img elements
        const imgElt = document.createElement("img") ; 
        imgElt.src = arrayObjects[i].pix ; 

        // titles elements
        const figcaptionElt = document.createElement("figcaption") ;
        figcaptionElt.textContent = arrayObjects[i].pixText; 

        // Insert pictures + titles into DOM
        figureElt.appendChild(imgElt) ; 
        figureElt.appendChild(figcaptionElt) ; 

        galleryContainer.appendChild(figureElt) ; 
    }
}

function filterBtn (arrayObjects , filterId) {
/*
    Function to apply a filter on elements to be displayed in DOM, 
    depending on filter button clicked by user. 
    Parameters : 2 
        -> array of all works database objects, 
        each containing "pix" , "pixText" and "categoryId" keys.
        -> clicked filter button id
    Return : updated array of objects
*/ 
    let newArray = [] ; 

    switch (filterId) {
        case "objects" : 
            // return Array of "Objects" (categoryId 1)
            arrayObjects.forEach(element => {
                if (element.categoryId === 1) {
                    newArray.push(element) ; 
                }
            }); 
            return newArray ; 
            break ; 

        case "flats" : 
            // return Array of "Appartements" (categoryId 2)
            arrayObjects.forEach(element => {
                if (element.categoryId === 2) {
                    newArray.push(element) ; 
                }
            }); 
            return newArray ; 
            break ; 

        case "hotels" : 
            // return Array of "Hotels & restaurants" (categoryId 3)
            arrayObjects.forEach(element => {
                if (element.categoryId === 3) {
                    newArray.push(element) ; 
                }
            }); 
            return newArray ; 
            break ; 

        default : 
            return arrayObjects ; 
    }
}