"use client";
import React, { useState, useEffect } from "react";
import { GoHistory } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { RiCloseCircleLine } from "react-icons/ri";

const HistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchData, setSearchData] = useState<{ term: string }[]>([]);

  const fetchSearchData = () => {
    const searchDataFromStorage = Object.keys(localStorage)
      .filter((key) => key.startsWith("search"))
      .reduce<{ [term: string]: boolean }>((acc, key) => {
        const term = key.replace("search-", "").split("-")[0];
        acc[term] = true;
        return acc;
      }, {});

    setSearchData(Object.keys(searchDataFromStorage).map((term) => ({ term })));
  };
  const handleClick = (term: string) => {
    window.location.href = `/?searchTerm=${encodeURIComponent(term)}`;
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRemove = (term: string) => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`search-${term}-`)) {
        localStorage.removeItem(key);
      }
    });

    fetchSearchData();
  };

  useEffect(() => {
    fetchSearchData();
  }, []);

  const filteredSearchData = searchData.filter(({ term }) =>
    term.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-darkGrey min-h-[93vh] py-10">
      <div className="bg-grey w-[90%] md:w-1/2 mx-auto rounded-lg p-5">
        <h1 className="text-2xl">Search History</h1>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-grey border-borderColor border-[2px] rounded px-4 py-2 pl-8 text-white my-2"
          />
          <IoIosSearch
            size={20}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        {filteredSearchData.length > 0 ? (
          <ul>
            {filteredSearchData.map(({ term }, index) => (
              <div
                className="border-borderColor flex items-center gap-3 my-3 p-3 rounded-md border cursor-pointer justify-between text-lg"
                key={index}
              >
                <div className="flex items-center gap-3">
                  <GoHistory size={25} />
                  <li key={index} onClick={() => handleClick(term)}>
                    {term}
                  </li>
                </div>
                <RiCloseCircleLine
                  onClick={() => handleRemove(term)}
                  size={25}
                  className="cursor-pointer"
                />
              </div>
            ))}
          </ul>
        ) : (
          <p>No search history available</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
