'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import dotenv from 'dotenv';

dotenv.config();

export default function Home() {
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    console.log('User input:', userInput);
  }, [userInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('User input on Enter:', userInput);
    }
  };

  const handleButtonClick = () => {
    console.log("I'm feeling peckish");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          Welcome to our app
        </h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border p-2"
            placeholder="Type your message here..."
          />
          <button onClick={() => console.log('User input on Enter:', userInput)} className="btn-orange">
            Enter
          </button>
        </div>
        <button onClick={handleButtonClick} className="btn-orange">
          I&apos;m feeling peckish
        </button>
      </main>
    </div>
  );
}
