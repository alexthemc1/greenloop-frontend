import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { API_BASE_URL } from "../config/api";

export default function ProductGallery({ images = [] }) {
  const [miniaturesSwiper, setMiniaturesSwiper] = useState(null);

  const ImageNotFound = "/ImageNotFound.webp";

  const sortedImages = [...images].sort((a, b) => {
    const order = {
      main: 1,
      gallery: 2,
      info: 3
    };

    return order[a.typeImage] - order[b.typeImage];
  });

  const imagesFormat =
    sortedImages.length > 0
      ? sortedImages.map((img) =>
          img?.imagePath
            ? `${API_BASE_URL}${img.imagePath}`
            : ImageNotFound
        )
      : [ImageNotFound];
      
  return (
    <div className="w-full flex flex-col md:h-full md:gap-6">
      <div className="flex-1">
        <Swiper
          modules={[Navigation, Thumbs]}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          thumbs={{ swiper: miniaturesSwiper }}
          className="w-full rounded-lg overflow-hidden"
        >
          {imagesFormat.map((source, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-96 aspect-square md:aspect-4/5">
                <img
                  src={source}
                  alt={`Image ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-contain bg-white"
                  onError={(e) => {
                    e.currentTarget.src = ImageNotFound;
                  }}
                />
              </div>
            </SwiperSlide>
          ))}

          <button className="custom-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full w-10 h-10 flex items-center justify-center"
           style={{ backgroundColor: "var(--color-primary)"}}>
            <img src="/icons/chevron-left-solid-full.svg" alt="flèche gauche" />
          </button>

          <button className="custom-next absolute right-2 top-1/2 -translate-y-1/2 z-10  rounded-full w-10 h-10 flex items-center justify-center"
           style={{ backgroundColor: "var(--color-primary)"}}>
            <img src="/icons/chevron-right-solid-full.svg" alt="" />
          </button>
        </Swiper>
      </div>

      {imagesFormat.length > 1 && (
        <div className="">
          <div className="w-full rounded-lg md:shadow-sm py-5 md:py-0 ">
            <Swiper
              onSwiper={setMiniaturesSwiper}
              spaceBetween={12}
              slidesPerView={4}
              breakpoints={{
                0: { slidesPerView: 3 },
                540: { slidesPerView: 4 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
              }}
              className="w-full"
            >
              {imagesFormat.map((source, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-auto aspect-square">
                    <img
                      src={source}
                      alt={`image ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover rounded-md bg-white cursor-pointer"
                      onError={(e) => {
                        e.currentTarget.src = ImageNotFound;
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

    </div>
  );
}