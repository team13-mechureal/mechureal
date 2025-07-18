import React, { JSX } from "react";

function App(): JSX.Element {

  return (
    <div className="w-screen h-screen bg-gray-200 flex flex-col">
      <p className="text-darkBrown tj-eb-64">tailwind 커스텀 컬러는</p>
      <p className="text-red-600">
        잘 적용이 되는데,,,
      </p>
      <p className="text-red-600">
        기존 tailwind 컬러는 왜
      </p>
      <p className="text-red-600">
        적용이 안 될까요??
      </p>
    </div>
  );
}

export default App;
