import { ArrowRight } from "lucide-react";
import "../Intro.css";

const bars = Array.from({ length: 20 }, (_, index) => index);

export default function BeatIntro({ onEnter }) {
  return (
    <>
      <div className="intro-content">
        <header className="intro-header">
          <a
            className="intro-brand"
            href="#home"
            aria-label="Tisya Movement Log"
          >
            <span className="intro-mark">
              T<span>.</span>
            </span>
            <span>
              TISYA <i>/ MOVEMENT LOG</i>
            </span>
          </a>
          <span className="intro-edition">ENTRY SEQUENCE / 001</span>
        </header>

        <div className="intro-center">
          <p className="intro-kicker">
            <span className="intro-beat-mark" /> SOUND CHECK / PALEMBANG, ID
          </p>
          <h1 id="intro-title">
            MOVE TO YOUR
            <br />
            <em>OWN BEAT.</em>
          </h1>
          <div aria-hidden="true" className="intro-spectrum">
            {bars.map((bar) => (
              <span
                key={bar}
                style={{
                  height: `${16 + ((bar * 17) % 48)}px`,
                  animationDelay: `${-bar * 0.065}s`,
                }}
              />
            ))}
          </div>
          <button className="intro-enter" onClick={onEnter} type="button">
            <span>MASUK KE BLOG</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <footer className="intro-footer">
          <span>DANCE / PRACTICE / REPEAT</span>
          <span>
            MOVE WITH TISYA <i>·</i> EST. 2026
          </span>
        </footer>
      </div>
      <span aria-hidden="true" className="intro-orbit intro-orbit-one" />
      <span aria-hidden="true" className="intro-orbit intro-orbit-two" />
    </>
  );
}
