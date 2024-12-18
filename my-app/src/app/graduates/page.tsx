"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "../ThemeContext";
import { TopicAnswerData } from "../helpers/interfaces";
import { getData } from "../helpers/databaseFunctions";
import GraduateDuckCard from "../components/GraduateDuckCard";
import Link from "next/link";
const DisplayStoredData = () => {
  const { isDarkMode } = useTheme();

  // States for stored data and editing ------------------------------------------------
  const [storedData, setStoredData] = useState<TopicAnswerData[]>([]);
  const [indexOfCardBeingEdited, setIndexOfCardBeingEdited] = useState<
    number | null
  >(null);
  const [categoryBeingEdited, setCategoryBeingEdited] = useState<
    keyof TopicAnswerData
  >("placeholderForEditing");

  const [textBeingEdited, setTextBeingEdited] = useState<string>("");

  // Use Effect for getting stored data -------------------------------------------------
  useEffect(() => {
    setStoredData(getData);
  }, []);

  // Toggle edit > typing > saving edit > reset states -----------------------------------
  const handleToggleEdit = (index: number, category: keyof TopicAnswerData) => {
    setIndexOfCardBeingEdited(index);
    setCategoryBeingEdited(category);
    setTextBeingEdited(storedData[index][category] || ""); // Safely access the category
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextBeingEdited(e.target.value);
  };
  const handleSaveEdit = (index: number, category: keyof TopicAnswerData) => {
    const updatedData = [...storedData];
    updatedData[index][category] = textBeingEdited; // Safely access the property with category
    localStorage.setItem("topicAnswerData", JSON.stringify(updatedData));
    setStoredData(updatedData);
    resetStatesForNextEdit();
  };
  function resetStatesForNextEdit() {
    setIndexOfCardBeingEdited(null);
    setCategoryBeingEdited("placeholderForEditing"); // reset to default placeholder
    setTextBeingEdited("");
  }
  console.log(storedData);
  return (
    <section
      className={`flex-1 p-4  h-screen flex flex-col items-center ${
        isDarkMode
          ? "bg-gray-900 text-white border-gray-700"
          : "bg-sky-200 text-gray-900 border-gray-300"
      }`}
    >
      <section className="max-w-[1100px]">
        <h2 className="text-2xl font-semibold mb-4">Duck graduates</h2>
        {storedData.length !== 0 ? (
          <section>
            <p>
              You have helped <strong>{storedData.length} </strong> ducks to
              graduate from their degree.
            </p>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {storedData.map((item, index) => (
                <div key={index}>
                  <GraduateDuckCard
                    key={index}
                    item={item}
                    index={index}
                    isDarkMode={isDarkMode}
                    indexOfCardBeingEdited={indexOfCardBeingEdited}
                    categoryBeingEdited={categoryBeingEdited}
                    textBeingEdited={textBeingEdited}
                    handleToggleEdit={handleToggleEdit}
                    handleTextChange={handleTextChange}
                    handleSaveEdit={handleSaveEdit}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div>
            <p>
              To help ducks graduate from University, go to the Practice
              section!
            </p>{" "}
            <div className="flex flex-col justify-center items-center p-4">
              <Link
                href="/practice"
                className="px-6 py-3 rounded-lg bg-sky-900 text-white hover:bg-sky-700 transition-all"
              >
                Let&apos;s get started!
              </Link>
            </div>
          </div>
        )}
      </section>
    </section>
  );
};

export default DisplayStoredData;
