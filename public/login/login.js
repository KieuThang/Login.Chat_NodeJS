var attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
function onLogin() {
    // alert("Login successfully");
    console.log("Test test");
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    if (email == null || email == "") {
        alert("Email cannot empty:" + email);
        return true;
    }
    if (password == null || password == "") {
        alert("Password is not valid");
        return true;
    }
    const userData = {
        "email": email,
        "password": password
    }
    const Http = new XMLHttpRequest();
    const url = 'https://jsonplaceholder.typicode.com/posts';
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
    // if (username == "Formget" && password == "formget#123") {
    //     alert("Login successfully");
    //     window.location = "/signup/signup.html"; // Redirecting to other page.
    //     return false;
    // }
    // else {
    //     attempt--;// Decrementing by one.
    //     alert("You have left " + attempt + " attempt;");
    //     // Disabling fields after 3 attempts.
    //     if (attempt == 0) {
    //         document.getElementsByName("username").disabled = true;
    //         document.getElementsByName("password").disabled = true;
    //         document.getElementById("submit").disabled = true;
    //         return false;
    //     }
    // }
    return false;
}

function onRedirectLoginPage() {
    window.event.returnValue = false;
    window.location.href = "/login/login.html";
    return false;
}

function onRedirectRegisterPage() {
    window.event.returnValue = false;
    window.location.href = "/login/signup.html";
    return false;
}