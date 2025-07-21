import React, { JSX } from "react";
import mechureal from "./asset/img/mechureal.png";

function App(): JSX.Element {
  return (
    <div className="w-screen h-screen bg-ivory flex flex-col items-center">
      <img
        src={mechureal}
        alt="Mechureal Logo"
        className="w-[250px] h-[250px] mt-[100px]"
      />
      <p className="tj-eb-64 mt-[88px] text-darkBrown">메추리얼 화이팅</p>
      <p className="tj-b-24 text-darkBrown">뭘 먹고 싶은지 맞춰볼게!</p>
    </div>
  );
}

export default App;
