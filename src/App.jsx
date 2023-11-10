// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";

const initialWords = [
  "amigo",
  "joven",
  "pared",
  "calle",
  "gente",
  "salto",
  "ebrio",
  "fuego",
  "canto",
  "libro",
];
const initialIndex = 0;

export function Game() {
  const [originalWords, setOriginalWords] = useState(initialWords);
  const [originalWord, setOriginalWord] = useState(originalWords[initialIndex]);
  const [scrambledWord, setScrambledWord] = useState("");
  const [inputValues, setInputValues] = useState(
    Array(originalWord.length).fill("")
  );
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [message, setMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    let scrambled = "";
    do {
      scrambled = originalWord
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
    } while (scrambled === originalWord);

    setScrambledWord(scrambled);
  }, [originalWord]);

  const handleInputChange = (event) => {
    const currentValue = event.target.value;
    const updatedInputValues = [...inputValues];
    updatedInputValues[currentInputIndex] = currentValue;
    setInputValues(updatedInputValues);

    if (/^[A-Za-z]*$/.test(currentValue)) {
      if (currentValue === originalWord[currentInputIndex]) {
        if (currentInputIndex === originalWord.length - 1) {
          // Guessed the word, remove it from the array
          setMessage(`Correcto! La palabra es ${originalWord}`);
          const newWords = originalWords.filter(
            (word) => word !== originalWord
          );
          setOriginalWords(newWords);
          if (newWords.length > 0) {
            const newIndex = Math.floor(Math.random() * newWords.length);
            setCurrentIndex(newIndex);
            setOriginalWord(newWords[newIndex]);
            setCurrentInputIndex(0);
            setInputValues(Array(newWords[newIndex].length).fill(""));
            setMessage("");
          } else {
            setMessage("felicidades eres todo un master!");
          }
        } else {
          setCurrentInputIndex(currentInputIndex + 1);
          setMessage("Correcto, avanza a la siguiente casilla");
        }
      } else {
        setLives(lives - 1);
        setMessage("Intenta de nuevo la letra no es correcta");
        if (lives === 1) {
          setMessage("GAME OVER");
        }
      }
    } else {
      setMessage("Solo Insertar letras");
    }
  };

  const handleDelete = () => {
    setInputValues((prevInputValues) => {
      const updatedInputValues = [...prevInputValues];
      updatedInputValues[currentInputIndex] = "";
      return updatedInputValues;
    });
  };

  const handleRestart = () => {
    const newIndex = Math.floor(Math.random() * originalWords.length);
    setCurrentIndex(newIndex);
    setOriginalWord(originalWords[newIndex]);
    setCurrentInputIndex(0);
    setInputValues(Array(originalWords[newIndex].length).fill(""));
    setMessage("");
    setLives(3);
  };

  const inputBoxes = inputValues.map((value, index) => {
    const isDisabled = index !== currentInputIndex || lives === 0;

    return (
      <div
        key={index}
        className="flex flex-col-reverse items-center justify-center"
      >
        <input
          type="text"
          value={value}
          onChange={isDisabled ? null : handleInputChange}
          disabled={isDisabled}
          className={`w-32 text-center border-2 border-slate-700 bg-gray-200 ${
            isDisabled ? "cursor-not-allowed" : ""
          }`}
        />
        {index === currentInputIndex && !isDisabled && (
          <button
            onClick={handleDelete}
            className="absolute p-1 rounded text-white bg-red-600 bottom-[17.6rem]"
          >
            Borrar
          </button>
        )}
      </div>
    );
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="bg-gray-200 p-6 rounded flex flex-col justify-center items-center">
        <h1 className="text-2xl font-black">Adivina la palabra</h1>
        <div className="flex flex-row items-center justify-center w-full mt-10 gap-x-36">
          <p className="p-2 font-black text-black bg-blue-200 rounded">
            Palabra desordenada: {scrambledWord}
          </p>
          <p
            className={`p-2 font-black rounded ${
              lives === 2
                ? "bg-orange-500"
                : lives === 1
                ? "bg-red-500"
                : "text-black"
            } bg-green-400`}
          >
            Vidas: {lives}
          </p>
        </div>

        <div>
          <div className="flex flex-row items-center justify-center mt-10 border">
            {inputBoxes}
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="p-2 mt-32 rounded text-white bg-blue-700"
        >
          Reiniciar
        </button>
        <p className="mt-10 text-2xl">{message}</p>
      </div>
    </div>
  );
}
