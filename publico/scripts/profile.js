const imageInput = document.querySelector("input[name=image]");
const changePhoto = document.querySelector("div[id=change-photo-circle]");
const changePhotoForm = document.getElementById("changePhotoForm");
let imageChosen = 0;

changePhoto.addEventListener("click", changePhotoClick);

function changePhotoClick(){
    imageInput.click();
}

imageInput.addEventListener("input", () => {
    //alert("Imagem registrada no formulário! Passe o mouse por cima do ícone para ver a imagem, ou clique novamente nele para fazer upload de uma nova imagem")
    console.log(imageInput.value)
    console.log(imageInput.files[0]);
    changePhotoForm.submit();
});