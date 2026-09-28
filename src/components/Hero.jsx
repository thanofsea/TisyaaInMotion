import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const bars = Array.from({ length: 12 }, (_, index) => index);

export default function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.72,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="hero-section"
      id="home"
    >
      <div aria-hidden="true" className="hero-light" />
      <div aria-hidden="true" className="hero-grid" />
      <div className="hero-copy">
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow hero-eyebrow"
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.15, duration: 0.55 }}
        >
          <span className="live-mark" /> PALEMBANG, ID · EST. 2012
        </motion.p>
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.24, duration: 0.72, ease: [0.2, 0.8, 0.2, 1] }}
        >
          FIND YOUR
          <span className="hero-title-line">
            OWN <em>RHYTHM</em>
            <i>.</i>
          </span>
        </motion.h1>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="hero-bottom flex w-full items-end justify-between"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.42, duration: 0.6 }}
        >
          <p>
            Gerak adalah caraku bercerita.
            <br />
            <span>Ini ruang kecil untuk semua yang bergerak.</span>
          </p>
          <a
            className="circle-link"
            href="#profile"
            aria-label="Lihat profil Tisya"
          >
            <ArrowDown size={20} />
          </a>
        </motion.div>
      </div>
      <motion.div
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        className="hero-portrait"
        initial={{ opacity: 0, scale: 0.96, rotate: 2 }}
        transition={{ delay: 0.28, duration: 0.9, ease: "easeOut" }}
      >
        <img
          alt="Siluet penari bergerak di bawah lampu panggung"
          className="hero-photo"
          fetchPriority="high"
          src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=960&q=80"
        />
        <div className="portrait-wash" />
        <span className="portrait-index">01 / 04</span>
        <span className="portrait-caption">
          DANCE LIKE
          <br />
          NO ONE'S WATCHING
        </span>
        <span aria-hidden="true" className="portrait-ring" />
      </motion.div>
      <div aria-hidden="true" className="hero-eq">
        {bars.map((bar) => (
          <span key={bar} style={{ animationDelay: `${bar * 0.035}s` }} />
        ))}
      </div>
      <a className="hero-scroll" href="#profile">
        <span>SCROLL TO FEEL IT</span>
        <ArrowDown size={14} />
      </a>
      <div aria-hidden="true" className="hero-orbit orbit-one" />
      <div aria-hidden="true" className="hero-orbit orbit-two" />
    </motion.section>
  );
}
