userPhoto = document.getElementById('photo-circle');

userPhoto.addEventListener("click", redirectProfile);

function redirectProfile() {
    window.location = "/profile";
}