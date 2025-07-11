"use client";

import React, { useState } from "react";
import MovieCard from "@/components/MovieComponents/MovieCard";
import PriceBox from "@/components/pricing/PriceBox"
interface CreditPackage {
  id: number;
  amount: number;
  price: string;
}

export default function BuyCredits() {
  // Simulate user credits state
  const [userCredits, setUserCredits] = useState<number>(50);

  // Packages for purchase
  const creditPackages: CreditPackage[] = [
    { id: 1, amount: 10, price: "$4.99" },
    { id: 2, amount: 25, price: "$9.99" },
    { id: 3, amount: 50, price: "$17.99" },
  ];

  // Handler for buying credits
  const buyCredits = (amount: number) => {
    alert(`You bought ${amount} credits!`);
    setUserCredits((prev) => prev + amount);
  };

  return (
    <div >
            <h1 className="text-5xl font-semibold text-center text-white mt-8 mb-4">Buy More Credits</h1>
<div
  className="w-[80vw] mx-auto text-white bg-slate-600 bg-opacity-30
    backdrop-blur-md
    border border-white border-opacity-20 px-6 py-3 rounded-md font-semibold flex items-center justify-center space-x-4"
  aria-label="User credits"
  title="Your available credits"
>
  <img src="icons/buyCredits.png" alt="Buy Credits" className="w-232 h-232" />
    <div className="flex flex-col">
    <h1 className="text-5xl font-bold">Your Remaining Credits:</h1>
  <div
  className="
    bg-slate-600 bg-opacity-30
    rounded-md
    px-8
    py-4
    text-xl
    font-semibold
    text-center
    w-full max-w-md
    flex
    items-center
    justify-center
    gap-3
    backdrop-blur-md
    border border-white border-opacity-20
    shadow-md
  "
>
  <img
    src="/icons/coin.png"
    alt="Coin"
    className="w-8 h-8 object-contain"
  />
  Credits Left: {userCredits}
</div>


  </div>
</div>






<div className="flex justify-center mt-4">
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <PriceBox
  title="Bronze"
  price={5.99}
  amount={30}
  url="coins/bronzePackage.png"
  description="Great for here and there movie watchers."
  // buyCredits={(100) => console.log(`Buying ${amt} credits`)}
  buyCredits={""}

/>

<PriceBox
  title="Silver"
  price={12.99}
  amount={90}
  url="coins/silverPackage.png"
  description="Perfect for regular streamers and binge-watchers."
  // buyCredits={(amt) => console.log(`Buying ${amt} credits`)}
    buyCredits={""}
/>

<PriceBox
  title="Gold"
  price={20.99}
  amount={150}
  url="coins/goldPackage.png"
  description="Best value for power users and cinephiles."
  // buyCredits={(amt) => console.log(`Buying ${amt} credits`)}
    buyCredits={""}
/>

 

</div>

      </div>
    </div>
  );
}
