// I am aware this might be a bit messy, but it's my first time using JavaScript

let fullbody = document.body;
let header = document.getElementById("header");
let filenamesIframe = document.getElementById("doc_names");
let navbar = document.getElementById("navbar");
let body = document.getElementById("bodytext");
let toggleicon = document.getElementById("toggle");


// When the list of filnames is loaded, it creates another iframe that contains the file contents, and creates menu divs for each one with an onclick event to run displayFile()
// It also grabs the first line (which is always the article title) for the menu items

filenamesIframe.onload = function () {
    let filenamesRawStr = filenamesIframe.contentWindow.document.body.innerText;

    let filenamesArray = filenamesRawStr.split("\n");

    for (var i = 0; i < filenamesArray.length; i++) {

        let individualFileIframe = document.createElement("iframe");
        individualFileIframe.setAttribute("class", "hidden");
        let filename = "pages/" + filenamesArray[i] + ".txt";
        individualFileIframe.setAttribute("src", filename);
        navbar.appendChild(individualFileIframe);

        individualFileIframe.onload = function () {
            let currentFileContentRaw = individualFileIframe.contentWindow.document.body.innerText;
            let currentFileContentArray = currentFileContentRaw.split("\n");

            let navbarItemDiv = document.createElement("div");
            navbarItemDiv.setAttribute("onclick", "displayFile('" + filename + "')");
            navbarItemDiv.setAttribute("class", "nav-bar-div");

            let navbarItemLabel = document.createTextNode((currentFileContentArray[0]).slice(1));
            navbarItemDiv.appendChild(navbarItemLabel);
            navbar.appendChild(navbarItemDiv);


        }


    }
}


// Loads the html created in the document parser into the main bit of the site

function displayFile(filename) {
    individualFileIframe = document.createElement("iframe");
    individualFileIframe.setAttribute("class", "hidden");
    individualFileIframe.setAttribute("src", filename );
    navbar.appendChild(individualFileIframe);

    individualFileIframe.onload = function () {
        let currentFileContentRaw = individualFileIframe.contentWindow.document.body.innerText;
        body.innerHTML = docParser(currentFileContentRaw);
        individualFileIframe.remove();
    }
}

function darkMode() {
    
    let navdivs = document.querySelectorAll(".nav-bar-div");
    navdivs.forEach(el => { el.classList.toggle("nav-item-dark-mode"); });

    

    header.classList.toggle("header-dark-mode");
    fullbody.classList.toggle("body-dark-mode");
    navbar.classList.toggle("nav-dark-mode");
    toggleicon.classList.toggle("icon-dark-mode");
    console.log("Success");
}

function docParser(text) {
    

    
    let output = text
    // this handles headings, links (including images), bold, and italics

        .replace(/^###### (.*$)/gm, '<h6 placeholder="placeholder">$1</h6>')
        .replace(/^##### (.*$)/gm, '<h5 placeholder="placeholder">$1</h5>')
        .replace(/^#### (.*$)/gm, '<h4 placeholder="placeholder">$1</h4>')
        .replace(/^### (.*$)/gm, '<h3 placeholder="placeholder">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 placeholder="placeholder">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 placeholder="placeholder">$1</h1>')
        .replace(/(\[img\])\((.*?)\)/gm, '<img src="$2">')
        .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>')
        .replace(/\*\*(.*?)\*\*/gm, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gm, '<em>$1</em>');

    let outArr = output.split("\n");
    let isList = false;
    let isOrdered = false;

    // jumping
    for (var k = 0; k < outArr.length; k++) {
        if (outArr[k].substr(0, 5) == "[jump") {
            outArr[k + 1] = outArr[k + 1].replace('placeholder="placeholder"', 'id="' + outArr[k].slice(6, -1) + '"');
            outArr[k] = "";
        }
    }

    // lists
    for (var k = 0; k < outArr.length; k++) {

        if (outArr[k].substr(0, 9) == "[ordered]") {
            outArr[k] = "<ol>";
            isOrdered = true;
            isList = true;
            continue;
        }

        if (outArr[k].substr(0, 11) == "[unordered]") {
            outArr[k] = "<ul>";
            isOrdered = false;
            isList = true;
            continue;
        }

        if (isList && outArr[k][0] == "*") {
            outArr[k] = "<li>" + outArr[k].slice(2) + "</li>"
            continue;
        }

        if (outArr[k].substr(0, 5) == "[end]") {
            if (isOrdered) {
                outArr[k] = "</ol>";
                continue;
            } else {
                outArr[k] = "</ul>";
                continue;
            }
        }

    }

    // paragraphs
    for (var k = 0; k < outArr.length; k++) {

        if (outArr[k][0] == "<") {
            continue;
        } else {
            outArr[k] = "<p>" + outArr[k] + "</p>"
        }
        
    }

    // removes blank paragraphs
    for (var k = 0; k < outArr.length; k++) {

        if (outArr[k] == "<p></p>") {
            outArr[k] = "";
        }
        
    }

    output = "";


    // recombines into html document
    for (var l = 0; l < outArr.length; l++) {
        output = output + outArr[l] + "\n";
    }

    
    return output;
}