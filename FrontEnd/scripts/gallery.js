 const fetchTravaux = async () => {
    try {
        const response = await fetch ("http://localhost:5678/api/works") ; 

        if (!response.ok) { 
            throw new Error ("Erreur de récupération des travaux") ; 
        }

        const data = await response.json() ; 

        // Generate pictures gallery + titles from database/server
        generateGallery(data) ; 

    }
    catch (error) { 
        console.error (error) ; 
    }
} 


function generateGallery(travaux) {

    // gallery container : <div class="gallery"> 
    const galleryContainer = document.querySelector(".gallery") ; 

    // array of all pictures file path/name
    let pixPath = "" ; 
    const pixArray = [] ; 

    for (i=0; i<travaux.length; i++) {
        pixPath = travaux[i].imageUrl ; 
        pixArray.push(pixPath) ; 
    }

    // Insert pictures + titles into DOM
    for (i=0; i < pixArray.length; i++) {     // parse of pictures array

        // Picture + Title container (<figure>)
        const figureElt = document.createElement("figure") ;

        // gallery img elements
        const imgElt = document.createElement("img") ; 
        imgElt.src = travaux[i].imageUrl ; 

        // titles elements
        const figcaptionElt = document.createElement("figcaption") ; 
        figcaptionElt.textContent = travaux[i].title; 

        // Insert pictures + titles into DOM
        figureElt.appendChild(imgElt) ; 
        figureElt.appendChild(figcaptionElt) ; 

        galleryContainer.appendChild(figureElt) ; 
    }
}

