import React from "react";

export default function PriceBox({ title, price, amount, buyCredits, url, description }) {
  return (
<div className="bg-gray-500 w-[300px] text-white rounded-lg shadow-lg p-6 text-center flex flex-col justify-between border  border-white">
      {url && (
        <img
          src={url}
          alt={title}
          className="mx-auto mb-4 max-h-24 object-contain"
        />
      )}
      <p className="text-3xl font-semibold mb-1">{title}</p>
      {description && (
        <p className="text-gray-300 text-2xl mb-4">{description}</p>
      )}
      <p className="text-green-400 text-3xl mb-6">£{price}</p>
         <button
        onClick={() => buyCredits(amount)}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold uppercase tracking-widest py-2 px-8 rounded shadow-md transition duration-300 ease-in-out select-none mx-auto max-w-[140px]"
        style={{ fontFamily: "'VT323', monospace" }}
      >
        Buy
      </button>
    </div>
  );
}
