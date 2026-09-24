import { useEffect, useRef } from "react";
import gsap from "gsap";

const useGsapFadeIn = () => {
  const ref = useRef();

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }
    );
  }, []);

  return ref;
};

export default useGsapFadeIn;