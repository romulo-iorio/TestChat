passwordInput = document.querySelector("input[name=password]");
passwordError = document.querySelector("p[id=password-error]");
emailInput = document.querySelector("input[name=email]");
emailError = document.querySelector("p[id=email-error]");
buttonSendForm = document.querySelector("button[id=send-form]");
form = document.querySelector("form");

buttonSendForm.addEventListener("click", formValidation)

function formValidation() {
    if(passwordInput.value && emailInput.value){
        console.log("form validated")
        form.submit();
    }
    if(!passwordInput.value){
        passwordError.classList.remove("hidden");
        passwordInput.classList.add("input-error");
    }else{
        passwordError.classList.add("hidden");
        passwordInput.classList.remove("input-error");
    }
    if(!emailInput.value){
        emailError.classList.remove("hidden");
        emailInput.classList.add("input-error");
    }else{
        emailError.classList.add("hidden");
        emailInput.classList.remove("input-error");
    }
}