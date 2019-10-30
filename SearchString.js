// Load a book from disk

function loadBook(filename, displayName){
    let currentBook = ""; //
    let url = "books/" + filename;
    console.log("Did it work?")

    //resett the UI when we load a new book
    document.getElementById("fileName").innerHTML = displayName; 
    document.getElementById('searchstat').innerHTML = "";
    document.getElementById("keyword").value = "";

    //create a server request to load the book
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true); //setting this to true means it will run asyncronously
    xhr.send();

    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200)  { //readystate has 4 numbers it can be
            currentBook = xhr.responseText;

            document.getElementById("fileContent").innerHTML = currentBook; 

            // this will scroll back to the top when books change
            var elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0;
        }
    };
}