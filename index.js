$(document).ready(function () {
    (async function () {
        const response = await fetch("./data.json");
        const data = await response.json();
        localStorage.setItem("todo", JSON.stringify(data));
    })();

    if ($("#form_type").val() == "login") {
        $("#login_form button").text("Login");
        $(".register_msg").hide();
        $(".login_msg").show();
    }

    $("#login_form").submit(function (e) {
        e.preventDefault();
        let formValType = $("#form_type").val();
        console.log(formValType);
        let valuename = $("#user_name").val();
        let valuepwd = $("#user_pwd").val();
        const data = JSON.parse(localStorage.getItem("todo"))


        if (formValType == "login") {
            let loginSuccess = false
            data.data.forEach(d => {
                if (d.user_creds.user_name == valuename) {
                    if (d.user_creds.user_password == valuepwd) {
                        loginSuccess = true
                    } else {
                        showToast("Invalid password", 2000);
                        return
                    }
                } else {
                    showToast("Invalid username", 2000);
                    return
                }
            });
            if (loginSuccess) {
                showToast("Login successful!", 1000);
                setTimeout(() => {
                    window.location.href = `dashboard.html?username=${valuename}`;
                }, 1000);
            }
        } else if (formValType == "register") {
            let registerSuccess = false
            data.data.forEach(d => {
                if (d.user_creds.user_name == valuename) {
                        showToast("Username already taken", 2000);
                        return
                } else {
                    registerSuccess =true
                }
            });
            if (registerSuccess) {
                const tempData = {
                "user_creds": {
                    "user_name": `${valuename}`,
                    "user_password": `${valuepwd}`
                }, 
                "user_data": []
            }
            data.data.push(tempData)
            localStorage.setItem("todo", JSON.stringify(data));
                showToast("Register successful!", 1000);
                setTimeout(() => {
                    window.location.href = `dashboard.html?username=${valuename}`;
                }, 1000);
            }
        }
        this.reset();
    });
});
function switchToRegister() {
    $("#form_type").val("register");
    $(".register_msg").show();
    $(".login_msg").hide();
    $("#login_form button").text("Register");
}
function switchToLogin() {
    $("#form_type").val("login");
    $(".register_msg").hide();
    $(".login_msg").show();
    $("#login_form button").text("Login");
}
function showToast(message, duration = 3000) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
}
