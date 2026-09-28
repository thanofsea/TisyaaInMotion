import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  ["Profil", "#profile"],
  ["Showcase", "#showcase"],
  ["Jurnal", "#journal"],
];

export default function DancerNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-nav">
      <a aria-label="Tisya, kembali ke beranda" className="brand" href="#home">
        <span className="brand-mark">
          T<span>.</span>
        </span>
        <span className="brand-name">
          TISYA<span> / MOVEMENT LOG</span>
        </span>
      </a>
      <nav aria-label="Navigasi utama" className="desktop-nav">
        {links.map(([label, href], index) => (
          <a href={href} key={href}>
            <span className="nav-index">0{index + 1}</span>
            {label}
          </a>
        ))}
      </nav>
      <a className="nav-contact" href="#contact">
        LET'S MOVE <ArrowUpRight size={14} strokeWidth={1.8} />
      </a>
      <button
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
        className="menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            animate={{ opacity: 1, y: 0 }}
            aria-label="Navigasi mobile"
            className="mobile-nav"
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: -8 }}
          >
            {links.map(([label, href], index) => (
              <a href={href} key={href} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>
                {label}
              </a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              <span>04</span>Kontak
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
