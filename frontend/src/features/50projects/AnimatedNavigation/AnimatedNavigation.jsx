import { useState } from "react";
import "./AnimatedNavigation.css";

export default function AnimatedNavigation() {
  const [active, setActive] = useState(false);

  return (
    <nav className={active ? "nav active" : "nav"}>
      <div className="container">
        <h1 className="logo">MySite</h1>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">About</a></li>
        </ul>
        <button className="toggle" onClick={() => setActive(!active)}>
          <div className="line"></div>
          <div className="line"></div>
        </button>
      </div>
    </nav>
  );
}
