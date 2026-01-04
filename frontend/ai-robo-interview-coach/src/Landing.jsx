import "./landing.css";
import CardSwap, { Card } from "./components/Avatar/CardSwap/CardSwap.jsx";
import TextType from "./TextType";

export default function Landing({ onEnter }) {
  return (
    <div className="landing-root">

      {/* FIXED HEADING (independent layer) */}
      <div className="landing-heading">
        <TextType
          text={[
            "AI Interview Coach",
            "Your AI Career Partner",
            "Crack Interviews Smarter",
          "Perform Better with Us.",
          "Careers, Guided by AI"
          ]}
          typingSpeed={75}
          pauseDuration={2000}
          showCursor={true}
          cursorCharacter="|"
        />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="landing-content">
        <div className="landing-left">
          <p>Your dedicated AI assistant for interview preparation, and placement guidance, to help you prepare smarter and perform better in job interviews.</p>

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

    </div>
  );
}
