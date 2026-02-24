import Lottie from "lottie-react";

export default function Chibi() {
  const url =
    "https://assets2.lottiefiles.com/packages/lf20_57TxAX.json";

  return (
    <div className="w-60 mx-auto">
      <Lottie
        animationData={require("../animations/chibi.json")}
        loop={true}
      />
    </div>
  );
}
