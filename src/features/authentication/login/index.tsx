"use client"; // This component needs to be a Client Component for Framer Motion

import LoginForm from "../components/LoginForm";
import logo from "@/../public/png/logo.png";
import stock2 from "@/../public/png/stock2.png";
import stock3 from "@/../public/png/stock3.png";
import stock4 from "@/../public/png/stock4.png";
import Image from "next/image";
import { motion } from "framer-motion"; // Import motion from framer-motion

function LoginScreen() {
  // Variants for the container to stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger the appearance of direct children by 0.1 seconds
      },
    },
  };

  // Variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Start invisible and slightly below
    visible: { opacity: 1, y: 0 }, // Fade in and move to original position
  };

  const statsVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: 0.8,
      },
    },
  };

  return (
    <div className="w-full flex flex-col justify-center items-center overflow-hidden min-h-screen ">
      {" "}
      {/* Use min-h-screen for better mobile scrolling */}
      <div className="w-full max-w-full  md:max-w-7xl grid grid-cols-1 md:grid-cols-12 min-h-screen">
        {" "}
        {/* Responsive grid */}
        {/* Login Form */}
        <div className="col-span-1 flex flex-col  h-full md:col-span-5 p-4 py-8 md:p-16 md:py-20">
          {" "}
          {/* Responsive column span and padding */}
          <div className="w-24 mb-8">
            {" "}
            {/* Center logo on mobile */}
            <Image
              src={logo || "/placeholder.svg"}
              alt="stepperImg"
              className="w-full"
              width={96}
              height={96}
            />
          </div>
          <motion.div
            className="w-full h-[200px] md:hidden rounded-[10px] bg-card overflow-hidden"
            variants={itemVariants}
          >
            <video
              loop
              width="100%"
              height="100%"
              className="h-full object-cover"
              autoPlay
              muted
              preload="none"
            >
              <source
                src="https://produceforlagos.com//wp-content//uploads//2025//07//video-bg.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </motion.div>
          <LoginForm />
        </div>
        {/* Side Images */}
        {/* Right Side */}
        <div className="p-5 md:col-span-7 hidden md:flex  flex-col justify-center items-center md:justify-start md:items-end h-screen">
          <div className="col-span-1  bg-card relative rounded-[20px]  md:col-span-7 p-4 2xl:p-10 lg:p-10 flex flex-col justify-center items-center md:justify-start md:items-end h-full">
            {" "}
            {/* Responsive column span, padding, and alignment */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-full sm:max-w-md lg:max-w-lg gap-3 w-full" // Responsive image grid
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Column 1 - Video */}
              <motion.div
                className="w-full h-[200px] md:hidden lg:flex rounded-[20px] bg-card overflow-hidden"
                variants={itemVariants}
              >
                <video
                  loop
                  width="100%"
                  height="100%"
                  className="h-full object-cover"
                  autoPlay
                  muted
                  preload="none"
                >
                  <source
                    src="https://produceforlagos.com//wp-content//uploads//2025//07//video-bg.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </motion.div>

              {/* Column 2 - Images */}
              <motion.div
                className="flex flex-col gap-3"
                variants={containerVariants} // Use containerVariants here to stagger its children
              >
                <motion.div
                  className="w-full h-[300px] rounded-[20px] overflow-hidden"
                  variants={itemVariants}
                >
                  <Image
                    src={stock2 || "/placeholder.svg"}
                    alt="Red tractor working in agricultural field"
                    width={200}
                    height={300}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </motion.div>
                <motion.div
                  className="w-full h-[100px] rounded-[20px] overflow-hidden"
                  variants={itemVariants}
                >
                  <Image
                    src={stock3 || "/placeholder.svg"}
                    alt="Cattle grazing in green pasture"
                    width={200}
                    height={100}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </motion.div>
              </motion.div>

              {/* Column 3 - Image and Video */}
              <motion.div
                className="flex flex-col gap-3"
                variants={containerVariants} // Use containerVariants here to stagger its children
              >
                <motion.div
                  className="w-full h-[200px] rounded-[20px] bg-card overflow-hidden"
                  variants={itemVariants}
                >
                  <Image
                    src={stock4 || "/placeholder.svg"}
                    alt="Lagos Nigeria city skyline"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </motion.div>
                <motion.div
                  className="w-full h-[300px] bg-card rounded-[20px] overflow-hidden"
                  variants={itemVariants}
                >
                  <video
                    loop
                    width="100%"
                    height="100%"
                    className="h-full object-cover"
                    autoPlay
                    muted
                    preload="none"
                  >
                    <source
                      src="http://cdn.pixabay.com/video/2021/08/10/84624-585553977_tiny.mp4"
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </motion.div>
              </motion.div>
            </motion.div>
            {/* Simple Stats Section - Bottom Left Corner */}
            <motion.div
              className="absolute bottom-4 left-4 md:bottom-6 md:left-6"
              variants={statsVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-gray-100">
                <div className="flex items-center divide-x divide-gray-200">
                  {/* Stat 1 - Fund4Food Project */}
                  <div className="text-center px-3 md:px-4">
                    <div className="text-lg md:text-xl font-bold text-primary mb-1">
                      ₦500B
                    </div>
                    <div className="text-xs text-gray-600 font-medium leading-tight">
                      Fund4Food
                    </div>
                    <div className="text-xs text-gray-500">Project</div>
                  </div>

                  {/* Stat 2 - Annual reduction food prices */}
                  <div className="text-center px-3 md:px-4">
                    <div className="text-lg md:text-xl font-bold text-primary mb-1">
                      20%
                    </div>
                    <div className="text-xs text-gray-600 font-medium leading-tight">
                      Annual reduction
                    </div>
                    <div className="text-xs text-gray-500">food prices</div>
                  </div>

                  {/* Stat 3 - Jobs creation */}
                  <div className="text-center px-3 md:px-4">
                    <div className="text-lg md:text-xl font-bold text-primary mb-1">
                      4M
                    </div>
                    <div className="text-xs text-gray-600 font-medium leading-tight">
                      Jobs creation
                    </div>
                    <div className="text-xs text-gray-500">in 3yrs</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
