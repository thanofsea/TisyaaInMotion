import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Camera, MessageCircle } from "lucide-react";

const profileFacts = [
  ["Nama", "Natisya Haira Putri Suji", "01"],
  ["Nama panggilan", "Tisya", "02"],
  ["Hobi", "Dance", "03"],
  ["Sekolah", "SMKN 4 Palembang · RPL", "04"],
  ["Kelas", "X RPL 2", "05"],
  ["TTL", "Palembang, 19 Juni 2012", "06"],
];

const skills = [
  ["K-Pop Dance", 95],
  ["HipHop", 90],
  ["Contemporary", 80],
];

export default function ProfileSection() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      className="section profile-section"
      id="profile"
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
          <span className="section-number">01</span> THE DANCER PROFILE
        </span>
        <span className="section-note">GET TO KNOW THE GIRL IN MOTION</span>
      </div>
      <div className="profile-layout">
        <motion.div
          className="profile-intro"
          initial={reducedMotion ? false : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow pink-label">HELLO, I'M TISYA</p>
          <h2>
            MOVE WITH
            <br />
            <em>ME.</em>
          </h2>
          <p className="profile-bio">
            Aku jatuh cinta pada dance karena setiap gerakan bisa bercerita
            tanpa kata. Dari K-Pop sampai hip-hop, aku terus belajar menemukan
            warna dan ritmeku sendiri. Panggung paling seru adalah saat aku
            berani jadi diriku sendiri.
          </p>
          <div className="social-links flex flex-wrap gap-2.5">
            <a
              href="https://www.instagram.com/geb_ran55?stkn=MXgzdWM3Z3hyc3ozeQ=="
              rel="noreferrer"
              target="_blank"
            >
              <Camera size={17} /> INSTAGRAM <ArrowUpRight size={13} />
            </a>
            <a
              href="https://wa.me/6283838441669"
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle size={17} /> WHATSAPP <ArrowUpRight size={13} />
            </a>
          </div>
          <p className="privacy-note">
            Sebelum dipublikasikan, pertimbangkan untuk menyembunyikan tanggal
            lahir, kelas, dan kontak pribadi.
          </p>
        </motion.div>

        <motion.div
          className="profile-details"
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <div className="facts-list">
            {profileFacts.map(([label, value, number]) => (
              <div className="fact-row" key={number}>
                <span className="fact-number">{number}</span>
                <span className="fact-label">{label}</span>
                <span className="fact-value">{value}</span>
              </div>
            ))}
          </div>
          <div className="skills-block">
            <div className="skills-heading">
              <span className="eyebrow">MY SKILL SET</span>
              <span>LEVEL / 100</span>
            </div>
            {skills.map(([skill, level], index) => (
              <div className="skill-row" key={skill}>
                <div className="skill-meta">
                  <span>{skill}</span>
                  <span>{level}%</span>
                </div>
                <div
                  aria-label={`${skill} ${level}%`}
                  className="skill-track"
                  role="img"
                >
                  <motion.span
                    animate={{ width: `${level}%` }}
                    initial={{ width: 0 }}
                    transition={{
                      delay: 0.12 * index,
                      duration: 1.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="profile-stamp" aria-hidden="true">
            <span>KEEP</span>
            <strong>MOVING</strong>
            <span>PALembang · 2026</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
