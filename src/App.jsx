import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import BeatIntro from "./components/BeatIntro";
import CustomCursor from "./components/CustomCursor";
import DancerNav from "./components/DancerNav";
import EqualizerFooter from "./components/EqualizerFooter";
import Hero from "./components/Hero";
import JournalSection from "./components/JournalSection";
import ProfileSection from "./components/ProfileSection";
import VideoShowcase from "./components/VideoShowcase";
import useDanceBeat from "./hooks/useDanceBeat";

function App() {
  const [entered, setEntered] = useState(false);
  const [beatsOn, setBeatsOn] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const [sparks, setSparks] = useState([]);
  const { startBeat, stopBeat } = useDanceBeat();

  async function toggleBeats() {
    if (beatsOn) {
      stopBeat();
      setBeatsOn(false);
      setAudioUnavailable(false);
      return;
    }

    setBeatsOn(true);
    setAudioUnavailable(!(await startBeat()));
  }

  function makeRipple(event) {
    if (!event.target.closest("a, button")) return;
    const id = Date.now() + Math.random();
    setSparks((current) => [
      ...current,
      { id, x: event.clientX, y: event.clientY },
    ]);
    window.setTimeout(() => {
      setSparks((current) => current.filter((spark) => spark.id !== id));
    }, 620);
  }

  return (
    <div className="site-shell">
      {entered ? (
        <div className={`site-content${beatsOn ? " is-beats-on" : ""}`}>
          <CustomCursor />
          <DancerNav />
          <button
            className={`beat-toggle${beatsOn ? " is-active" : ""}`}
            type="button"
            aria-pressed={beatsOn}
            onClick={toggleBeats}
            title={
              audioUnavailable
                ? "Audio tidak didukung; visual beat tetap aktif"
                : beatsOn
                  ? "Matikan musik dan visual beat"
                  : "Nyalakan musik dan visual beat"
            }
          >
            <span className="beat-dot" />
            <span>
              {beatsOn
                ? audioUnavailable
                  ? "VISUAL BEATS"
                  : "BEATS ON"
                : "BEATS OFF"}
            </span>
          </button>
          <main onPointerDown={makeRipple}>
            <Hero />
            <ProfileSection />
            <VideoShowcase />
            <JournalSection />
          </main>
          <EqualizerFooter />
          <AnimatePresence>
            {sparks.map((spark) => (
              <motion.span
                aria-hidden="true"
                className="click-spark"
                key={spark.id}
                initial={{ opacity: 0.9, scale: 0.1 }}
                animate={{ opacity: 0, scale: 3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.58, ease: "easeOut" }}
                style={{ left: spark.x, top: spark.y }}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <section aria-labelledby="intro-title" className="intro-screen">
          <BeatIntro onEnter={() => setEntered(true)} />
        </section>
      )}
    </div>
  );
}

export default App;
