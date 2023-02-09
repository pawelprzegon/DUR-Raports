window.onload=function(){
const navMenu = document.querySelector(".nav");
const navOverlay = document.querySelector(".nav-overlay");
const navButton = document.querySelector(".nav-btn");

navButton.addEventListener("click", e =>{
    navMenu.classList.add("nav-open");
    navOverlay.classList.add("nav-overlay-open");
});
navOverlay.addEventListener("click", () =>{
    navMenu.classList.remove("nav-open");
    navOverlay.classList.remove("nav-overlay-open");
})
}