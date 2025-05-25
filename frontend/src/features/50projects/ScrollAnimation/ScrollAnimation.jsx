import { useEffect, useRef } from "react";
import "./ScrollAnimation.css";

export default function ScrollAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const boxes = containerRef.current.querySelectorAll(".box");

    const checkBoxes = () => {
      const triggerBottom = (window.innerHeight / 5) * 4;
      boxes.forEach((box) => {
        const boxTop = box.getBoundingClientRect().top;
        if (boxTop < triggerBottom) {
          box.classList.add("show");
        } else {
          box.classList.remove("show");
        }
      });
    };

    window.addEventListener("scroll", checkBoxes);
    checkBoxes();

    return () => window.removeEventListener("scroll", checkBoxes);
  }, []);

  return (
    <div className="scroll-container" ref={containerRef}>
      <h1>Scroll to see the animation</h1>
      {[...Array(10)].map((_, i) => (
        <div className="box" key={i}>
          Content Box {i + 1}
        </div>
      ))}
    </div>
  );
}
