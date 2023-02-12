
export function navBehav(){

const navOverlay = document.querySelector(".nav-overlay");
const navButton = document.querySelector(".nav-btn");
const btns = document.querySelector("nav");
const pic = document.getElementById("logo")
const elem = document.getElementById("anim-row")
const navSecondRow = document.getElementById("btns-pics")

navButton.addEventListener("click", e =>{
    let navSize = '40px';
        if ( $(window).width() <= 600) {     
            navSize = '250px';
        }
        else if (( $(window).width() > 600) && ( $(window).width() <= 900)){
            navSize = '100px';
        }else{
            navSize = '100px';
        }
    elem.style.height = navSize;
    elem.classList.add("big-row", "show-anim")
    pic.classList.add('big')
    btns.classList.remove("nav-close")
    navSecondRow.classList.add("nav-btns")
    navOverlay.classList.add("nav-overlay-open");
});

// newNavAnim.addEventListener('click', e =>{
//     elem.style.height = "250px";
//     elem.classList.add("big-row", "show-anim")
//     pic.classList.add('big')
//     btns.classList.remove("nav-close")
//     navSecondRow.classList.add("nav-btns")
//     navOverlay.classList.add("nav-overlay-open");
// });

navOverlay.addEventListener("click", () =>{
    elem.style.height = "40px";
    elem.classList.remove("big-row", "show-anim")
    pic.classList.remove('big')
    btns.classList.add("nav-close")
    navOverlay.classList.remove("nav-overlay-open");
})

}


