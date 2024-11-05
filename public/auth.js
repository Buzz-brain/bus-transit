const btnSignup = document.getElementsByClassName("btn-signup");
        for(i=0; i<btnSignup.length; i++) {
            btnSignup[i].addEventListener("click", () => {
            window.location.href = "/signup.html";
            })
        }
        const btnLogin = document.getElementsByClassName("btn-login");

        for(i=0; i<btnLogin.length; i++) {
            btnLogin[i].addEventListener("click", () => {
            window.location.href = "/login.html";
            })
        }

        const logoBtn = document.getElementsByClassName("logo");
        for(i=0; i<logoBtn.length; i++) {
            logoBtn[i].addEventListener("click", () => {
            window.location.href = "/index.html";
            })
        }
