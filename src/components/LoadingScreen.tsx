import React from "react";
import Spinner from "./ui/Spinner";

function LoadingScreen() {
  return (
    <div className="w-full h-full justify-center items-center flex">
      <Spinner />
    </div>
  );
}

export default LoadingScreen;
