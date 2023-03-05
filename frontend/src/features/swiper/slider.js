
export function Slider(){
  var swiper = new Swiper(".slide-content", {
    slidesPerView: 3,
    spaceBetween: 25,
    slidesPerGroup: 3,
    loop: false,
    centerSlide: 'true',
    fade: 'true',
    grabCursor: 'true',
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints:{
        0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
        },
        700: {
            slidesPerView: 2,
            slidesPerGroup: 2,
        },
        1050: {
            slidesPerView: 3,
            slidesPerGroup: 3,
        },
    },
  });
}

export function SliderForm(){
  var swiper = new Swiper(".slide-content", {
    slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      grabCursor: 'true',
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
  });
}

