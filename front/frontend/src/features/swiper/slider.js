export function Slider(id) {
  let indexToGet = $('.swiper .card').index($(`#${id}`));

  let mySwiper = new Swiper('.slide-content', {
    slidesPerView: 5,
    spaceBetween: 25,
    loop: false,
    initialSlide: indexToGet,
    fade: false,
    grabCursor: true,
    keyboard: {
      enabled: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
      751: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
      1510: {
        slidesPerView: 5,
        slidesPerGroup: 5,
      },
    },
  });
  return mySwiper;
}

export function SliderForm() {
  new Swiper('.slide-content', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: false,
    grabCursor: false,
    allowTouchMove: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: false,
    },
    keyboard: {
      enabled: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}
