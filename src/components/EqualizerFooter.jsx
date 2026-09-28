import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Camera } from "lucide-react";

const bars = Array.from({ length: 36 }, (_, index) => index);

export default function EqualizerFooter() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.footer
      className="site-footer"
      id="contact"
      initial={reducedMotion ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: reducedMotion ? 0 : 0.72,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="footer-main">
        <div className="footer-callout">
          <span className="eyebrow">UNTIL THE NEXT BEAT</span>
          <h2>
            KEEP IT
            <br />
            <em>IN MOTION.</em>
          </h2>
        </div>
        <div className="footer-contact">
          <span className="eyebrow">SAY HELLO</span>
          <a
            href="https://www.instagram.com/geb_ran55?stkn=MXgzdWM3Z3hyc3ozeQ=="
            rel="noreferrer"
            target="_blank"
          >
            <Camera size={18} /> @GEB_RAN55 <ArrowUpRight size={15} />
          </a>
          <span className="footer-location">
            PALEMBANG, INDONESIA
            <br />
            MADE WITH RHYTHM © 2026
          </span>
        </div>
      </div>
      <div aria-hidden="true" className="footer-wave">
        <svg
          aria-hidden="true"
          preserveAspectRatio="none"
          viewBox="0 0 730 130"
        >
          <defs>
            <linearGradient id="wavePink" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#ff007f" stopOpacity="0.18" />
              <stop offset="0.5" stopColor="#ff3c9b" />
              <stop offset="1" stopColor="#ff007f" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {bars.map((bar) => {
            const height = 16 + Math.abs(Math.sin(bar * 0.58)) * 92;
            return (
              <rect
                fill="url(#wavePink)"
                height={height}
                key={bar}
                rx="2"
                width="7"
                x={bar * 20}
                y={(130 - height) / 2}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  opacity: 0.5 + Math.abs(Math.sin(bar)) * 0.5,
                  animationDelay: `${bar * 0.035}s`,
                }}
              />
            );
          })}
        </svg>
      </div>
      <div className="footer-bottom flex items-center justify-between">
        <span>TISYA / MOVEMENT LOG</span>
        <span>STAY SOFT. MOVE LOUD.</span>
        <a href="#home">BACK TO TOP ↑</a>
      </div>
    </motion.footer>
  );
}
