import "./landing.css";
import CardSwap, { Card } from "./components/Avatar/CardSwap/CardSwap.jsx";


export default function Landing({ onEnter }) {
  return (
    <div className="landing-root">
  <div className="landing-left">
    <h1>AI Robo Interview Coach</h1>
    <p>Your personal AI guide for careers, interviews, and skills.</p>

    <div className="button-wrapper">
      <button className="enter-btn" onClick={onEnter}>
        Enter App
      </button>
    </div>
  </div>

  <div className="landing-right">
    <div className="cards-wrapper">
      <CardSwap width={360} height={240}>
        <Card />
        <Card />
        <Card />
        <Card />
      </CardSwap>
    </div>
  </div>
</div>


       
    );
}
