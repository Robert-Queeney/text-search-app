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
    console.log(wordArray)
    var uncommonWords = [];

    //filter out the uncommon words
    uncommonWords = filterStopWords(wordArray);


    //count every word in the array
    for( let word in uncommonWords){
        let wordValue = uncommonWords[word];
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
    ULTemplate(least5Words, document.getElementById("leastUsed"));

    docLength.innerText = "Document Length: " + text.length; //length of docuemnt
    wordCount.innerText = "Word Count: " + wordArray.length; 

}

function ULTemplate(items, element){
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";

    for(i=0; i < items.length-1; i++){
        resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
    }

    element.innerHTML = resultsHTML; 
}

function sortProperties(obj){
    //1. return the obj as an array
    let rtnArray = Object.entries(obj);

    //2. sort it
    rtnArray.sort(function(first, second){
        return second[1] - first[1]; //comparing 2 side by side numbers and returnning the larger one
    }); 

    return rtnArray; 
}

//filter out stop words
const filterStopWords = (wordArray) => {
    let commonWords = getStopWords();
    let commonObject = {};
    let uncommonArr = [];

    for(i=0; i<commonWords.length; i++){
        commonObject[commonWords[i].trim()] = true; 
    }

    for(i=0; i < wordArray.length; i ++){
        word = wordArray[i].trim().toLowerCase();
        if(!commonObject[word]){
            uncommonArr.push(word);
        }
    }

    return uncommonArr;

}

const getStopWords = () => {
    return ["a", "it'd", "out", "up", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
} 

//inserts HTMl into the document to mark the highlighted words in search
const performMark = () => {
    
    //read the keyword
    let keyword = document.getElementById("keyword").value; 
    let display = document.getElementById("fileContent");

    let newContent = " ";

    // find all the currently marked items
    let spans = document.querySelectorAll('mark');  // <mark> </mark>  this is what it will look for
    
    for (let i = 0; i < spans.length;  i++){
        spans[i].outerHTML = spans[i].innerHTML; // outer is the html and the content   inner is just the content  ie:  turns <mark> Harry </mark> into Harry
    }

    let re = new RegExp(keyword, "gi" );   //"gi" means globally and case insensitive
    let replaceText = "<mark id='markme'>$&</mark>"; //the $& allows the current content to go into the middle 
    let bookContent = display.innerHTML; 

    // add the mark to the book content
    newContent = bookContent.replace(re, replaceText); 

    display.innerHTML = newContent;
    let count = document.querySelectorAll('mark').length; 
    document.getElementById("searchstat").innerHTML = "found " + count + " matches";

    if(count > 0) {
        let element = document.getElementById("markme");
        element.scrollIntoView();
    }

}
