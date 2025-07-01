import React from "react";
import "./Banner.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";




const Banner = () => {
  const isDesktop = window.innerWidth > 992;


  return (
    <div>
      <Swiper
        spaceBetween={30}
        effect="fade"
        navigation={isDesktop}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={window.innerWidth < 700 ? false : { dynamicBullets: true }}
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        className="mySwiper h-auto"
      >

        <SwiperSlide className="bg-[#ffffff]">
          <Link
            to="/shop"
            className="flex items-center lg:items-start"
          >
            <img
              className="w-full h-auto z-10 rounded-lg"
              src="https://cdn.shopify.com/s/files/1/0597/9422/7350/files/iPhone15_HP_Banner_1160x450__1.jpg?v=1706175313"
              alt="Banner1"
              loading="lazy"
            />
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;
