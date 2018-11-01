document.addEventListener('DOMContentLoaded', () => {
  formSubmit()

  /////////error handler - - change message text input for situation\\\\\\\\\\\\\\
  const errorMessageFunction = (messageText) => {
    setTimeout(() => {
      errorMessage.style.display = "inline"
      errorMessage.innerText = messageText
    }, 500)
    errorMessage.style.animation = "fade-out 5s linear 1 forwards"
  }
})

function formSubmit() {
  let createBtn = document.getElementById('createSubmit')
  if (!createBtn) {
    let messageText = 'Please close create window and try again'
    errorMessageFunction(messageText)
  }
  createBtn.addEventListener('submit', (e) => {
    e.preventDefault()
    // grab all values from the form
    let successMessage = document.getElementById('createPostSuccessMessage')
    let promoterSubmit = document.getElementById('promoterSubmitPopup')
    let promoterSubmitBtn = document.getElementById('promoterSubmit')
    let newEventName = e.target.elements[0].value
    let newFoodName = e.target.elements[1].value
    let newAddress = e.target.elements[5].value
    let newCity = e.target.elements[6].value
    let newState = e.target.elements[7].value
    let newZip = e.target.elements[9].value
    let newCountry = e.target.elements[10].value
    let newImageUrl = e.target.elements[11].value
    let newStartTime = `${e.target.elements[2].value} ${e.target.elements[3].value}:00 UTC`
    let newEndTime = `${e.target.elements[2].value} ${e.target.elements[4].value}:00 UTC`
    let newDate = e.target.elements[2].value
    // e.target.elements[11].getAttribute('name')
    let newPromoted = document.getElementById('tagCheckbox').checked

    let newPostObj = {
      eventName: newEventName,
      foodName: newFoodName,
      address: newAddress,
      city: newCity,
      zipcode: newZip,
      country: newCountry,
      state: newState,
      imageUrl: newImageUrl,
      startTime: newStartTime,
      endTime: newEndTime,
      date: newDate,
      promoted: newPromoted
    }
    var post_id

    //logic to have a promoted login
    if (newPromoted === true) {
      setTimeout(() => {
        promoterSubmit.style.display = "inline"

      }, 500)
      promoterSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault()
        promoterSubmit.style.display = "none"
      })
    }


    axios.post('/posts', newPostObj)
      .then((res) => {
        post_id = res.data
      })
      .then(() => {
        //tags to be dealt with here
        //deal with tag tagsArray
        let newTags = e.target.elements[12].value
        let newTagsArr = newTags.split(`, `)
        let convertedTagsArr = []

        for (var i = 0; i < newTagsArr.length; i++) {
          if (newTagsArr[i] === "OUTDOORS") {
            convertedTagsArr.push(1)
          }
          if (newTagsArr[i] === "INDOORS") {
            convertedTagsArr.push(2)
          }
          if (newTagsArr[i] === "21+") {
            convertedTagsArr.push(3)
          }
          if (newTagsArr[i] === "BEER") {
            convertedTagsArr.push(4)
          }
          if (newTagsArr[i] === "PIZZA") {
            convertedTagsArr.push(5)
          }
          if (newTagsArr[i] === "RECURRING") {
            convertedTagsArr.push(6)
          }
          if (newTagsArr[i] === "ICE CREAM") {
            convertedTagsArr.push(7)
          }
          if (newTagsArr[i] === "FLASH EVENT") {
            convertedTagsArr.push(8)
          }
          if (newTagsArr[i] === "COLLEGE/UNIVERSITY") {
            convertedTagsArr.push(9)
          }
        }

        //build up each post body using the converted tag array
        convertedTagsArr.forEach(tag => {
          let tagPostBody = {
            post_id: post_id,
            tag_id: tag
          }
          axios.post('/posts_tags', tagPostBody)
            .then((res) => {
              if (res) {
                setTimeout(() => {
                  successMessage.style.display = "inline"
                }, 500)
                successMessage.style.animation = "fade-out 5s linear 1 forwards"
              }
              return res
            })
        })
      })
      .catch((err) => {
        let messageText = `Create post error - please try again (${err})`
        errorMessageFunction(messageText)
      })
  })
}