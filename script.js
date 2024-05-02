
let filenamesIframe = document.getElementById("doc_names");
let navbar = document.getElementById("navbar");
let body = document.getElementById("bodytext");

filenamesIframe.onload = function () {
    let filenamesRawStr = filenamesIframe.contentWindow.document.body.innerText;
    console.log(filenamesRawStr);

    let filenamesArray = filenamesRawStr.split("\n");
    console.log(filenamesArray);

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

            console.log(currentFileContentArray[0]);

            let navbarItemLabel = document.createTextNode((currentFileContentArray[0]).slice(1));
            navbarItemDiv.appendChild(navbarItemLabel);
            navbar.appendChild(navbarItemDiv);


        }


    }
}


function displayFile(filename) {

    let individualFileIframe = document.createElement("iframe");
    individualFileIframe.setAttribute("class", "hidden");
    individualFileIframe.setAttribute("src", filename );
    navbar.appendChild(individualFileIframe);

    individualFileIframe.onload = function () {
        let currentFileContentRaw = individualFileIframe.contentWindow.document.body.innerText;
        body.innerHTML = markdownParser(currentFileContentRaw);
        console.log("success");
    }
}

function markdownParser(text) {
    

    
    let output = text
    // this handles most things

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

    for (var k = 0; k < outArr.length; k++) {
        if (outArr[k].substr(0, 5) == "[jump") {
            outArr[k + 1] = outArr[k + 1].replace('placeholder="placeholder"', 'id="' + outArr[k].slice(6, -1) + '"');
            outArr[k] = "";
        }
    }

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

    for (var k = 0; k < outArr.length; k++) {

        if (outArr[k][0] == "<") {
            continue;
        } else {
            outArr[k] = "<p>" + outArr[k] + "</p>"
        }
        
    }

    output = "";

    for (var l = 0; l < outArr.length; l++) {
        output = output + outArr[l] + "\n";
    }

    console.log(output);
    return output;
}