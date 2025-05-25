import { useState, useEffect } from "react";
import "./TestimonialBoxSwitcher.css";

const testimonials = [
  {
    name: "Tanya Sinclair",
    position: "UX Engineer",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "I've been interested in coding for a while but never taken the jump, until now."
  },
  {
    name: "John Tarkpor",
    position: "Frontend Developer",
    photo: "https://randomuser.me/api/portraits/men/46.jpg",
    text: "If you want to lay the best foundation possible I'd recommend this to anyone."
  }
];

export default function TestimonialBoxSwitcher() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[index];

  return (
    <div className="testimonial-container">
      <div className="testimonial">
        <div className="text">{testimonial.text}</div>
        <div className="user">
          <img src={testimonial.photo} alt={testimonial.name} />
          <div className="user-info">
            <h4>{testimonial.name}</h4>
            <small>{testimonial.position}</small>
          </div>
        </div>
      </div>
    </div>
  );
}
