import React from "react";
import styles from "@/styles/home/card.module.css";

interface CardInterface {
  logo?: React.ReactNode;
  title: string;
  subtitle: string;
}

export const Card = ({ logo, title, subtitle }: CardInterface) => {
  return (
    <div
      className={`group flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg transform transition-transform hover:shadow-pink-300 hover:translate-y-[-2px] hover:shadow-lg ${styles["custom-shine"]}`}
    >
      <div className={`p-2 bg-black bg-opacity-50 rounded-full `}>
        {logo ? (
          logo
        ) : (
          <svg
            className="text-white h-6 w-6 mb-2 opacity-75"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
        )}
      </div>
      <h2 className="text-xl font-bold text-white ">{title}</h2>
      <p className="text-zinc-200 dark:text-zinc-100">{subtitle}</p>
    </div>
  );
};

export default Card;
