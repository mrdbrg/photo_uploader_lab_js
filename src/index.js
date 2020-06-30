function app() {
    // DOM elements
    const photoContainer = document.querySelector('#photoContainer')
    const addPicButton = document.querySelector('#addPicButton')
    const newPicForm = document.querySelector('#newPicForm')
    const editPicForm = document.querySelector('#editPicForm')
    let divChange;
    let formOpen = false

    addPicButton.addEventListener('click', () => {
        openNewPicForm("new")
    })

    function openNewPicForm(action){
        const actionPicContainer = document.querySelector(`#${action}PicFormContainer`)    
        if(formOpen){
            actionPicContainer.style.height = '0px'
            actionPicContainer.style.padding = '0px'
        }
        else{
            actionPicContainer.style.height = '280px'
            actionPicContainer.style.padding = '20px'
        }
        formOpen = !formOpen
    }

    //****Start coding below****//

    newPicForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const newPhoto = {
            name: event.target[0].value,
            photo_image_url: event.target[1].value,
            owner: event.target[2].value
        }
        // console.log(newPhoto)
        fetch("http://localhost:3000/photos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify(newPhoto)
        })
        .then(resp => resp.json())
        .then(newPhoto => {
            displayEachPhoto(newPhoto)
        })
    })


    // Fetch request
    fetch("http://localhost:3000/photos")
    .then(resp => resp.json())
    .then(photosData => {
        photosData.forEach(displayEachPhoto)
    })

    // Display Helpers
    function displayEachPhoto(photoData) {
        const divContainer = document.createElement('div')
        divContainer.classList.add("photo")
        divContainer.dataset.id = photoData.id
        divContainer.innerHTML = `
            <h3>${photoData.name}</h3>
            <p>${photoData.owner}</p>
            <img src=${photoData.photo_image_url}>
            <div class="btnContainer">
                <button class="removeButton">Remove</button>
                <button class="editButton">Edit</button>
            </div>  
        `
        photoContainer.append(divContainer)
        
        const deleteBtn = divContainer.querySelector('.removeButton')

        divContainer.addEventListener('click', (event) => {
            if (event.target.matches('.editButton')) {
                divChange = divContainer
                openNewPicForm("update")
                editPicForm[0].value = photoData.name
                editPicForm[1].value = photoData.photo_image_url
                editPicForm[2].value = photoData.owner    
            }
        })

        deleteBtn.addEventListener('click', (event) => {
            // closest() finds the closest parent with the given name.
            // event.target.closest('.photo').remove()
            divContainer.remove()

            fetch(`http://localhost:3000/photos/${photoData.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            }
            })
            .then(resp => resp.json())
            .then(deletePhoto => {
                console.log("Success! Your photo was deleted.")
            })
        })
    }

    function updateForm() {
        editPicForm.addEventListener('submit', (event) => {
            event.preventDefault()

            const photo_id = divChange.dataset.id
            const updatePhoto = {
                name: event.target[0].value,
                photo_image_url: event.target[1].value,
                owner: event.target[2].value
            }
        
            divChange.children[0].innerText = updatePhoto.name
            divChange.children[2].src = updatePhoto.photo_image_url
            divChange.children[1].innerText = updatePhoto.owner

            updatePhotoFetch(updatePhoto, photo_id) 
        })
    }

    function updatePhotoFetch(updatePhoto, id) {
        fetch(`http://localhost:3000/photos/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify(updatePhoto)
        })
        .then(resp => resp.json())
    }

    updateForm()
}

app()