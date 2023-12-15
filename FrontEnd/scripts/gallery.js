
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

function filterBtn (worksResource , filterId) {
/*
    Function to return new array of objects, according to filter button clicked by user.  
    Parameters : 2 
        -> Array of works resource from server. Format : 
        Array [ { id: , title: , imageUrl: , category: {...} , categoryId: , userId: } , { ... } , ... ]
        -> clicked filter button id
    Return : array of filtered objects (same format that worksResource)
*/ 
    let newArray = [] ; 

    switch (filterId) {
        case "objects" : 
            // return Array of "Objects" (categoryId 1)
            worksResource.forEach(element => {
                if (element.categoryId === 1) {
                    newArray.push(element) ; 
                }
            }); 
            return newArray ; 
            break ; 

        case "flats" : 
            // return Array of "Appartements" (categoryId 2)
            worksResource.forEach(element => {
                if (element.categoryId === 2) {
                    newArray.push(element) ; 
                }
            }); 
            return newArray ; 
            break ; 

        case "hotels" : 
            // return Array of "Hotels & restaurants" (categoryId 3)
            worksResource.forEach(element => {
                if (element.categoryId === 3) {
                    newArray.push(element) ; 
                }
            }); 
            return newArray ; 
            break ; 

        default : 
            return worksResource ; 
    }
}

function filter(worksFiltered) {
/*  Function to display pictures filtered, according to filter button clicked by user. 
    Parameters : Array of filtered works. 
    Return : none. 
*/
    // Local variables
    const filtersContainer = document.querySelector(".filters") ; // filter buttons container

    // detect filter button clicked (event listener) and apply event function (-> display updated gallery)
    filtersContainer.addEventListener ( "click" , function (evt) { 

        // local variables
        const filterId = evt.target.dataset.filter ; // catch filter button data-identifier

        const filteredArray = filterBtn(worksFiltered,filterId) ; // apply filter -> return array of filtered objects
        
        emptyGallery() ; 

        // display updated content
        displayGallery(filteredArray) ; 
    } ) ; 
}


// EXPORTS MODULE
export async function generateHome() {
    // local variables
    let worksResource = await fetchWorks() ; 

    // display all works on page
    displayGallery(worksResource) ; 

    // generate filter buttons functionality
    filter(worksResource) ; 
}
