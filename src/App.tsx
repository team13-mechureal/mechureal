import React, { JSX } from "react";

function App(): JSX.Element {

  return (
    <div className="w-screen h-screen bg-gray-200 flex flex-col">
      <p className="text-red-600 tj-eb-64">tailwind를 적용해봐요</p>
      <p className="text-red-600">
        cra로 tailwind를 적용하려면 tailwind v3를 사용해요
      </p>
      <p className="text-red-600">
        그 후 npx tailwindcss init -p를 해서 config 파일을 생성해요
      </p>
      <p className="text-red-600">
        그리고 index.css에 @import "tailwindcss/base"; @import
        "tailwindcss/components"; @import "tailwindcss/utilities"; 를 추가해주면
        적용 끝!
      </p>
    </div>
  );
}

export default App;
