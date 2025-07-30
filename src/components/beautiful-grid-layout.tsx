"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const AutoScrollGallery = ({
  images,
  delay,
}: {
  images: string[];
  delay: number;
}) => {
  return (
    <div className="relative overflow-hidden rounded-lg aspect-video">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay, // Use the passed delay prop
          disableOnInteraction: false,
        }}
        speed={1000} // Smooth transition duration (1 second)
        className="w-full h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full relative">
              <Image
                src={src || "/placeholder.svg"}
                alt={`Gallery image ${index + 1}`}
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const SingleImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative overflow-hidden rounded-lg aspect-video">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={400}
        height={200}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};

export default function GalleryGrid() {
  const galleryImages1 = [
    "https://ucarecdn.com/801da607-cad8-4886-bbaf-8e0611635088/DSC_6220.jpg",
    "https://ucarecdn.com/87dc1080-0c2c-491f-a2ef-6396aab5b3b2/DSC_4978.jpg",
    "https://ucarecdn.com/d6d12591-a21b-4777-adde-1256d07185ba/5.jpg",
  ];

  const galleryImages2 = [
    "https://ucarecdn.com/41941176-7d44-4749-8588-c26be01fc89c/1.jpg",
    "https://ucarecdn.com/87dc1080-0c2c-491f-a2ef-6396aab5b3b2/DSC_4978.jpg",
    "https://ucarecdn.com/a249ab75-206e-4a47-991f-8cb9d2cff577/DSC_5745.JPG",
  ];

  return (
    <div className="container mx-auto flex flex-col justify-center items-center p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 w-full max-w-7xl gap-4">
        {/* Row 1 */}
        <SingleImage
          src="https://ucarecdn.com/a249ab75-206e-4a47-991f-8cb9d2cff577/DSC_5745.JPG"
          alt="Portrait"
        />
        <AutoScrollGallery images={galleryImages1} delay={3000} />
        <SingleImage
          src="https://ucarecdn.com/f095f56e-ff77-4ef4-bf00-20439a33ea9d/DJI_0232.JPG"
          alt="Street scene"
        />

        {/* Row 2 */}
        <AutoScrollGallery images={galleryImages2} delay={4000} />
        <SingleImage
          src="https://ucarecdn.com/f3365db0-f55e-4f81-b48d-9b797761838c/DJI_0236.JPG"
          alt="Macro photography"
        />
        <AutoScrollGallery images={galleryImages2} delay={5000} />
      </div>
    </div>
  );
}
