
function darkMode() {

    
    if (checkCookie() == "notset") {
        console.log(checkCookie());
        setCookie("dark");
    }

    else if (checkCookie() == "dark") {
        console.log(checkCookie());
        setCookie("light");
    }

    else if (checkCookie() == "light") {
        console.log(checkCookie());
        setCookie("dark");
    }



    let navdivs = document.querySelectorAll(".nav-bar-div");
    navdivs.forEach(el => { el.classList.toggle("nav-item-dark-mode"); });



    header.classList.toggle("header-dark-mode");
    fullbody.classList.toggle("body-dark-mode");
    navbar.classList.toggle("nav-dark-mode");
    toggleicon.classList.toggle("icon-dark-mode");
    console.log("Success");
}

function checkCookie() {
    let cookie = getCookie();
    if (cookie == "") {
        return "notset";
    } else if (cookie == "dark") {
        return "dark";
    } else {
        return "light";
    }
}



function setCookie(cvalue) {
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = "theme=" + cvalue + ";" + expires + ";path=/";
}

function getCookie() {
    let name = "theme=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

