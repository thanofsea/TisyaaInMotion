import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";

const videos = [
  {
    title: "How You Like That",
    type: "OFFICIAL MUSIC VIDEO",
    id: "ioNng23DkIM",
    number: "01",
  },
  {
    title: "SADISTIC",
    type: "OFFICIAL MUSIC VIDEO",
    id: "YpVjU4OJ4Ms",
    number: "02",
  },
  {
    title: "OMG",
    type: "OFFICIAL MUSIC VIDEO",
    id: "sVTy_wmn5SU",
    number: "03",
  },
];

export default function VideoShowcase() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      className="section showcase-section"
      id="showcase"
      initial={reducedMotion ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reducedMotion ? 0 : 0.72,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="section-topline">
        <span className="eyebrow">
          <span className="section-number">02</span> ON REPEAT
        </span>
        <span className="section-note">REFERENCE TRACKS / BLACKPINK</span>
      </div>
      <div className="showcase-heading">
        <motion.h2
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          THE <em>SHOWCASE</em>
        </motion.h2>
        <p>
          Three tracks. Three different energies.
          <br />
          Which one would you learn first?
        </p>
      </div>
      <div className="video-grid">
        {videos.map((video, index) => (
          <motion.article
            className="video-card"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            key={video.id}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: index * 0.1 }}
          >
            <div className="video-frame">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                title={`BLACKPINK - ${video.title}`}
              />
              <span className="video-number">{video.number}</span>
              <span aria-hidden="true" className="video-play">
                <Play size={14} fill="currentColor" />
              </span>
            </div>
            <div className="video-caption">
              <div>
                <span className="eyebrow">{video.type}</span>
                <h3>{video.title}</h3>
              </div>
              <a
                aria-label={`Buka ${video.title} di YouTube`}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                rel="noreferrer"
                target="_blank"
              >
                <ArrowUpRight size={18} />
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
