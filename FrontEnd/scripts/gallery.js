
// FUNCTIONS

export const fetchWorks = async () => {
/*  Asynchronous function to return works from server of JavaScript Object type. 
    Object format : 
    [ { id: ... , title: ... , imageUrl: ... , categoryId: ... , 
        userId: ... , category: { id: ... , name: ...} } 
    ]
    Parameters : none. 
    Return : 1 -> works resource (type = JS Object)
*/
    try {
        const response = await fetch ("http://localhost:5678/api/works") ; 

        if (!response.ok) { 
            throw new Error ("Erreur de récupération des travaux") ; 
        }

        // Wait server response before conversion to JavaScript object
        const works = await response.json() ; 

        return works ; 
    }
    catch (error) { 
        console.error (error) ; 
    }
}

export function displayGallery(worksResource) {
/*  Function to display pictures on web page, 
    from specific array of objects generated by galleryObjects() function. 
    Parameters : 1 -> array of objects
    Return : none.
*/
    // Local variables
    // gallery container : <div class="gallery"> 
    const galleryContainer = document.querySelector(".gallery") ; 

    // Insert pictures + titles into DOM
    for (let i=0; i < worksResource.length; i++) {     // parse array of objects
        // Picture + Title container (<figure>)
        const figureElt = document.createElement("figure") ;

        // gallery img elements
        const imgElt = document.createElement("img") ; 
        imgElt.src = worksResource[i].imageUrl ; 

        // titles elements
        const figcaptionElt = document.createElement("figcaption") ;
        figcaptionElt.textContent = worksResource[i].title; 

        // Insert pictures + titles into DOM
        figureElt.appendChild(imgElt) ; 
        figureElt.appendChild(figcaptionElt) ; 

        galleryContainer.appendChild(figureElt) ; 
    }
}

export function emptyGallery () {
    let gallery = document.querySelector(".gallery") ; 
    gallery.replaceChildren() ; 
}


// ------- FILTERS 

export async function fetchCategory() {
    try {
        const response = await fetch ("http://localhost:5678/api/categories") ; 

        if (!response.ok) { 
            throw new Error ("Erreur de récupération des categories") ; 
        }

        // Wait server response before conversion to JavaScript object
        const categories = await response.json() ; 

        return categories ; 
    }
    catch (error) { 
        console.error (error) ; 
    }
}

async function generateFilters (categories) {
    const filtersContainer = document.querySelector (".filters") ; 
    let btnElt = document.createElement("button") ; 

    btnElt.setAttribute("data-filter" , "all") ; 
    btnElt.textContent = "All" ; 
    filtersContainer.appendChild(btnElt) ; 

    categories.forEach( function(categoriesElt) {
        btnElt = document.createElement("button");
        btnElt.setAttribute("data-filter", categoriesElt.id);
        btnElt.textContent = categoriesElt.name;

        filtersContainer.appendChild(btnElt);
    });

}

function displayFiltered (worksResource) {

    // local variables
    const filtersContainer = document.querySelector(".filters") ; 
    
    filtersContainer.addEventListener ( "click" , function (evt) {
        let filterId = evt.target.dataset.filter ; // catch filter button data-identifier

        if (filterId !== "all") {
            filterId = parseInt (filterId) ; 
     
            const arrayFiltered = worksResource.filter(worksElt => worksElt.categoryId === filterId) ; 

            emptyGallery() ; 
            displayGallery(arrayFiltered)
        } else {
            emptyGallery() ; 
            displayGallery(worksResource) ; 
        }

    } )  ; 
}

// EXPORTS MODULE
export async function generateHome() {
    // local variables
    let worksResource = await fetchWorks() ; 
    let categoryResource = await fetchCategory() ; 

    // display all works on page
    displayGallery(worksResource) ; 

    generateFilters(categoryResource) ; 

    displayFiltered(worksResource , categoryResource) ; 
}
