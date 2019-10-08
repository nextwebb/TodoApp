function itemTemplate(item) {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
              <span class="item-text">${item.text}</span>
              <div>
                <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
              </div>
            </li>`
}

// Initial Page Load Render
let ourHTML = items.map((item)=>{
  return itemTemplate(item)
}).join('');

document.getElementById("item-list").insertAdjacentHTML('beforeend',ourHTML);


// Create Feature
let createField = document.getElementById("create-field");

document.getElementById("create-form").addEventListener("submit", (e)=> {
  e.preventDefault();
  axios.post('/create-item', {text: createField.value}).then(function (response) {
    // Create the HTML for a new item
    document.getElementById("item-list").insertAdjacentHTML("beforeend",itemTemplate(response.data) );
    createField.value="";
    createField.focus();
  
  }).catch(function() {
    console.log("Please try again later.");
  });

});

document.addEventListener("click", function(e) {

  //Delete Feature
  if(e.target.classList.contains("delete-me")){
      if(confirm("Do you really want to delete this task?")){
        axios.post('/delete-item', { id: e.target.getAttribute("data-id")}).then(function () {
         e.target.parentElement.parentElement.remove();
       }).catch(function() {
         console.log("Please try again later.");
       });
      }
  }

  
  //update Feature
  if (e.target.classList.contains("edit-me")) {
     //e.target returns the element
    let userInput = prompt("Enter your desired new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
    // we're using axios because we're sending data from the bowser to the node server.
  //we could fetch().then().catch() promise
    if (userInput) {
      axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function () {
         //if it sends successfully to the server
      //update the list on browser without refreshing the entire page
        e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput;
      }).catch(function() {
        console.log("Please try again later.");
      });
    }
  }

    
});