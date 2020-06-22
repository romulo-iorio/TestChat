const imageInput = document.querySelector("input[name=image]");
const imageLabel = document.querySelector("label[for=image]");
const imageIcon  = document.getElementById("input-image-icon");
const imageSample = document.getElementById("image-sample");
const imageShow = document.getElementById("image-modal");
let imageChosen = 0;

imageLabel.addEventListener("click", imageLabelClick);

function imageLabelClick(){
    //imageInput.click();
    if(imageChosen){
        imageInput.value = "";
        imageIcon.src = "../img/camera.svg";
        imageLabel.style = "background: #F0F0F5";
        imageChosen = 0;
    }
}

imageInput.addEventListener("input", () => {
    if(imageInput.value != 0){
        //alert("Imagem registrada no formulário! Passe o mouse por cima do ícone para ver a imagem, ou clique novamente nele para fazer upload de uma nova imagem")
        imageIcon.src = "../img/checked.svg";
        imageSample.src = URL.createObjectURL(imageInput.files[0]);
        console.log(imageInput.value)
        console.log(imageInput.files[0]);
        imageLabel.style = "background: #e8f0fe";
        imageChosen = 1;
    }
});

imageLabel.addEventListener("mouseenter", () => {
    if(imageChosen == 1){
        imageShow.classList.remove("hide");
    }else{
        imageShow.classList.add("hide");
    }
});

imageLabel.addEventListener("mousedown", () => {
    if(imageChosen == 1){
        imageShow.classList.remove("hide");
    }else{
        imageShow.classList.add("hide");
    }
});

imageLabel.addEventListener("mouseleave", () => {
    if(imageChosen == 1){
        imageShow.classList.add("hide");
    }else{
        imageShow.classList.add("hide");
    }
});

password = document.querySelector("input[name=password]");
passwordRepeat = document.querySelector("input[name=password-repeat]");
buttonSendForm = document.querySelector("button[id=send-form]");
form = document.querySelector("form");
passwordError = document.querySelector("p[id=password-error]");
imageError = document.querySelector("p[id=image-error]");

buttonSendForm.addEventListener("click", formValidation)

function passwordValidation() {
    if((passwordRepeat.value != "") && (password.value != "")) {
        if((password.value == passwordRepeat.value)){
            console.log("passwords ok")
            return true;
        }else{
            return false;
        }
    }
}

function imageValidation() {
    if((imageInput.value)){
        console.log("image ok")
        return true;
    }else{
        console.log("image not ok")
        return false;
    }
}

function formValidation() {
    if(passwordValidation() && imageValidation()){
        console.log("form validated")
        form.submit();
    }
    if(!passwordValidation()){
        passwordError.classList.remove("hidden");
        passwordRepeat.classList.add("input-error");
    }else{
        passwordError.classList.add("hidden");
        passwordRepeat.classList.remove("input-error");
    }
    if(!imageValidation()){
        imageError.classList.remove("hidden");
        imageLabel.classList.add("input-error");
    }else{
        imageError.classList.add("hidden");
        imageLabel.classList.remove("input-error");
    }
}