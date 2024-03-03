"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import { ModalProps } from "../types/types";

const Modal: React.FC<ModalProps> = ({ imageUrl, title, likes, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setIsLoading(false);
    };
    image.src = imageUrl;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [imageUrl]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 px-5"
      onClick={handleOverlayClick}
    >
      <div className="bg-darkGrey p-4 rounded-md text-white">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <img
              src={imageUrl}
              alt={title}
              className="md:h-[36rem] w-full h-[34rem]"
            />
            <p>Title: {title}</p>
            <p>Likes: {likes}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
