"use client";
import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import Modal from "./components/Modal";
import { useFetch } from "./hooks/useFetch";
import { Data } from "./types/types";
import { IoIosSearch } from "react-icons/io";
import { FaArrowCircleUp } from "react-icons/fa";

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const CLIENT_ID: string = process.env.NEXT_PUBLIC_CLIENT_ID as string;
  const [selectedImage, setSelectedImage] = useState<Data | null>(null);
  const [showGoUpButton, setShowGoUpButton] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const termFromQueryParam = params.get("searchTerm") || "";
    setSearchTerm(termFromQueryParam);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 425);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const { data: images, loading } = useFetch({
    searchTerm: debouncedSearchTerm,
    page,
    clientId: CLIENT_ID,
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
  };

  const handleClearCache = (): void => {
    setSearchTerm("");
    setPage(1);
  };

  useEffect(() => {
    const handleScroll = (): void => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        if (!loading) {
          setPage((prev) => prev + 1);
        }
      }
      setShowGoUpButton(document.documentElement.scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  const handleImageClick = (image: Data): void => {
    setSelectedImage(image);
  };

  const handleCloseModal = (): void => {
    setSelectedImage(null);
  };

  const handleOverlayClick = (e: MouseEvent): void => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSelectedImage(null);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      document.addEventListener("mousedown", handleOverlayClick);
    } else {
      document.removeEventListener("mousedown", handleOverlayClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOverlayClick);
    };
  }, [selectedImage]);

  const handleGoUp = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-8">Popular Images</h1>
      <div className="flex mb-4 relative">
        <IoIosSearch
          size={20}
          className="text-[#747474] absolute left-2.5 top-1/2 transform -translate-y-1/2"
        />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="bg-grey border-borderColor border-[2px] rounded px-4 py-2 pl-8 text-white w-full"
        />
        <button
          onClick={handleClearCache}
          className="bg-white text-black px-5 py-1 rounded"
        >
          Clear
        </button>
      </div>

      {images.length === 0 && !loading && <p>No photo available</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {images.map((image: Data, index: number) => (
          <div
            key={`${image.id}-${index}`}
            className="border border-gray-300 rounded overflow-hidden"
            onClick={() => handleImageClick(image)}
          >
            <img
              src={image.urls.small}
              alt={`Image ${index}`}
              className="w-full h-96 cursor-pointer"
            />
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {selectedImage && (
        <div ref={modalRef}>
          <Modal
            imageUrl={selectedImage.urls.full}
            title={selectedImage.alt_description}
            likes={selectedImage.likes}
            onClose={handleCloseModal}
          />
        </div>
      )}

      {showGoUpButton && (
        <button
          className="fixed bottom-10 right-10 bg-darkGrey text-white p-3 rounded-full shadow-md  focus:outline-none"
          onClick={handleGoUp}
        >
          <FaArrowCircleUp size={30} />
        </button>
      )}
    </div>
  );
};

export default Home;
