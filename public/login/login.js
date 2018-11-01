var attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
function onLogin() {
    console.log("Windowlocation:"+window.location)
    window.location.href = "/signup/signup.html"; // Redirecting to other page.
    // var username = document.getElementsByName("email").value;
    // var password = document.getElementsByName("password").value;
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
}