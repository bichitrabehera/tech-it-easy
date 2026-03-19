import React from "react";

const Stats = () => {
  return (
    <div
      className="flex flex-wrap gap-6 md:gap-12 justify-center py-8 px-4
  bg-orange-500/5 backdrop-blur-xl
  border-y border-white/10
  shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    >
      <div>
        <p className="text-xl md:text-4xl font-bold text-orange-500">24+</p>
        <p className="text-gray-400">
          Hours of <br /> Hacking
        </p>
      </div>
      <div>
        <p className="text-xl md:text-4xl font-bold text-orange-500">1000+</p>
        <p className="text-gray-400">
          Prizes <br /> Available
        </p>
      </div>
      <div>
        <p className="text-xl md:text-4xl font-bold text-orange-500">200</p>
        <p className="text-gray-400">
          Hackers
        </p>
      </div>
      <div>
        <p className="text-xl md:text-4xl font-bold text-orange-500">Free</p>
        <p className="text-gray-400">
          Food & <br /> Swags
        </p>
      </div>
    </div>
  );
};

export default Stats;
