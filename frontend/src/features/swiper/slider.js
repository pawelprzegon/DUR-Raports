
export function Slider(){
 new Swiper(".slide-content", {
    slidesPerView: 3,
    // centeredSlides: true,
    spaceBetween: 25,
    loop: false,
    
    fade: false,
    grabCursor: true,
    keyboard: {
      enabled: true,
    },
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
        750: {
            slidesPerView: 2,
            slidesPerGroup: 2,
        },
        1100: {
            slidesPerView: 3,
            slidesPerGroup: 3,
        },
    },
  });
}

export function SliderForm(){
new Swiper(".slide-content", {
    slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      grabCursor: 'true',
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
  });
}

