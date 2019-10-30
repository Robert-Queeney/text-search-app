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

            getDocStats(currentBook);

            //remove line breaks and carriage returns & replace with a <br>
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

            document.getElementById("fileContent").innerHTML = currentBook; 

            // this will scroll back to the top when books change
            var elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0;
        }
    };
}

//get the stats from the book
function getDocStats(fileContent){
    var docLength = document.getElementById('docLength');
    var wordCount = document.getElementById('wordCount');
    var charCount = document.getElementById('charCount');

    let text = fileContent.toLowerCase();
    let wordArray = text.match(/\b\S+\b/g);  //returns an array of words
    let wordDictionary = {}; //creating an object that olds multiple key value pairs in order to count the amount

    //count every word in the array
    for( let word in wordArray){
        let wordValue = wordArray[word];
        if (wordDictionary[wordValue] > 0){
            wordDictionary[wordValue] += 1; 
        } else {
            wordDictionary[wordValue] = 1; 
        }
    }

    //sort the array based on its value
    let wordList = sortProperties(wordDictionary);

    //return top 5 words
    let top5Words = wordList.slice(0,6);
    //return the bottom 5 words
    let least5Words = wordList.slice(-6, wordList.length)

    //wriet them to the page
    ULTemplate(top5Words, document.getElementById("mostUsed"));
    ULTemplate(least5Words, document.getElementById("leastused"));

}

function ULTemplate(items, element){
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";

    for(i-0; i < items.length-1; i++){
        resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + "time(s)");
    }

    element.innerHTML = resultsHTML; 
}

function sortProperties(obj){
    //1. return the obj as an array
    let rtnArray = Object.defineProperties(obj);

    //2. sort it
    rtnArray.sort(function(first, second){
        return second[1] - first[1]; //comparing 2 side by side numbers and returnning the larger one
    }); 

    return rtnArray; 
}
