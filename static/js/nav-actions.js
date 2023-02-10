window.onload=function(){
    $('html, body').css({
        overflow: 'hidden',
        height: '100%'
    });

const newNavAnim = document.querySelector(".top-row");
const navOverlay = document.querySelector(".nav-overlay");
const navButton = document.querySelector(".nav-btn");

navButton.addEventListener("click", e =>{
    const elem = document.getElementById("anim-row")
    elem.style.height = "250px";
    // navMenu.classList.add("nav-open");
    navOverlay.classList.add("nav-overlay-open");
});

newNavAnim.addEventListener('click', e =>{
    const elem = document.getElementById("anim-row")
    elem.style.height = "250px";
    navOverlay.classList.add("nav-overlay-open");
});

navOverlay.addEventListener("click", () =>{
    const elem = document.getElementById("anim-row")
    elem.style.height = "60px";
    // navMenu.classList.remove("nav-open");
    navOverlay.classList.remove("nav-overlay-open");
})
}


