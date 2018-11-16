$(function () {
    $('.login-form').on('submit', function (event) {
        event.preventDefault();
        var email = $("#email").val();
        var password = $("#password").val();

        var isOk = true;

        if (email == null || email == "") {
            alert("Email cannot empty:" + email);
            isOk = false;
        }
        if (password == null || password == "") {
            alert("Password is not valid");
            isOk = false;
        }
        if (!isOk) return;

        const userData = {
            "email": email,
            "password": password
        }

        $.post('/users/login', { email: email, password: password }, function (data) {
            if(data.code != 0){
                alert(data.message);
                return;
            }

            localStorage.accessToken = JSON.stringify(data);
            window.event.returnValue = false;
            console.log(localStorage.accessToken);
            window.location.href = "/main/index.html";
        });
    });
});

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