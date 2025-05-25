import { useState } from "react";
import "./ExpandingCards.css";

export default function ExpandingCards() {
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = [
    { title: "Explore the World", image: "/images/img1.jpg" },
    { title: "Wild Forest", image: "/images/img2.jpg" },
    { title: "Sunny Beach", image: "/images/img3.jpg" },
    { title: "City on Winter", image: "/images/img4.jpg" },
    { title: "Mountains - Clouds", image: "/images/img5.jpg" }
  ];

  return (
    <div className="expanding-container">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`panel ${activeIndex === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${card.image})` }}
          onClick={() => setActiveIndex(index)}
        >
          <h3>{card.title}</h3>
        </div>
      ))}
    </div>
  );
}
