import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { useState, useEffect, useCallback } from "react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type Image = {
  src: string;
  id: number;
};

const images: Image[] = [
  {
    src: "https://iiif.bodleian.ox.ac.uk/iiif/image/8be32ee7-f38b-4309-96b0-66c42a19926c/full/256,/0/default.jpg",
    id: 1,
  },
  {
    src: "https://iiif.bodleian.ox.ac.uk/iiif/image/79bf8325-22fa-4696-afe5-7d827d84f393/full/256,/0/default.jpg",
    id: 2,
  },
  // Add more images as necessary
];

export default function Index() {
  const [currentImage, setCurrentImage] = useState<Image | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<string>("");
  const [animateOut, setAnimateOut] = useState<boolean>(false);
  const [animateIn, setAnimateIn] = useState<boolean>(false);

  // Method to handle keyboard events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp": // Accept image
          console.log("Image Accepted: ", currentImage?.id);
          setDirection("up");
          break;
        case "ArrowRight": // Reject image
          console.log("Image Rejected: ", currentImage?.id);
          setDirection("right");
          break;
        default:
          return;
      }
    },
    [currentImage?.id]
  );

  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < images.length - 1) {
        return prevIndex + 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    setCurrentImage(images[currentIndex]);
    setAnimateIn(true);
  }, [currentIndex]);

  useEffect(() => {
    if (direction !== "") {
      setAnimateOut(true);
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentImage, handleKeyDown]);

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-200 overflow-hidden">
        <img
          className={`object-contain h-96 w-full 
          ${
            animateOut && direction === "up"
              ? "transition-all duration-500 ease-in-out transform translate-y-full"
              : ""
          } 
          ${
            animateOut && direction === "right"
              ? "transition-all duration-500 ease-in-out transform translate-x-full"
              : ""
          }`}
          src={currentImage?.src}
          alt="random"
          onAnimationEnd={() => {
            setAnimateOut(false);
            goToNextImage();
          }}
        />
        {animateIn && currentImage && (
          <img
            className={`object-contain h-96 w-full 
            ${
              direction === "up"
                ? "transition-all duration-500 ease-in-out transform -translate-y-full"
                : ""
            } 
            ${
              direction === "right"
                ? "transition-all duration-500 ease-in-out transform -translate-x-full"
                : ""
            }`}
            src={images[(currentIndex + 1) % images.length].src}
            alt="next"
            onAnimationEnd={() => {
              setAnimateIn(false);
            }}
          />
        )}
      </div>
    </>
  );
}
