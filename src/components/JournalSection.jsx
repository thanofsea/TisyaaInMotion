import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Clock3, X } from "lucide-react";

const articles = [
  {
    id: "warm-up",
    category: "TUTORIAL",
    number: "01",
    time: "4 MIN READ",
    title: "Pemanasan kecil, gerakan besar",
    excerpt:
      "Sebelum latihan, beri tubuh waktu untuk bangun. Ini rutinitas singkat yang bisa bikin sesi dance terasa lebih siap dan nyaman.",
    body: [
      "Mulai dengan lima menit gerak ringan. Pemanasan membantu tubuh beralih dari aktivitas biasa ke latihan, jadi jangan langsung meminta otot melakukan gerakan besar.",
      "1. Jalan di tempat atau lakukan step touch selama satu menit. Biarkan napas tetap santai sambil menggerakkan lengan.",
      "2. Putar bahu, pergelangan tangan, pinggul, dan pergelangan kaki perlahan. Lakukan beberapa putaran kecil ke dua arah, tanpa memaksa sendi.",
      "3. Lakukan side lunge dangkal dan calf raise beberapa kali. Kalau terasa nyeri, berhenti dan pilih gerakan yang lebih nyaman.",
      "4. Akhiri dengan groove pelan mengikuti lagu pilihanmu. Setelah tubuh terasa hangat, baru mulai latihan koreografi. Minum air dan beri jeda kalau mulai lelah.",
    ],
    image: "photo-1518611012118-696072aa579a",
    imageAlt: "Latihan peregangan sebelum menari",
  },
  {
    id: "learn-choreo",
    category: "K-POP",
    number: "02",
    time: "5 MIN READ",
    title: "Belajar koreografi tanpa buru-buru",
    excerpt:
      "Potong gerakan jadi bagian kecil, hitung beat-nya, lalu gabungkan. Cara sederhana supaya detail koreografi lebih mudah melekat.",
    body: [
      "Koreografi K-Pop sering terlihat cepat karena banyak detail terjadi berurutan. Belajar sedikit demi sedikit biasanya lebih efektif daripada mengulang seluruh video dari awal.",
      "1. Tonton satu kali tanpa ikut menari. Perhatikan formasi, arah hadap, dan bagian lagu yang menjadi penanda gerakan.",
      "2. Pecah koreografi menjadi potongan pendek, misalnya delapan hitungan. Perlambat video bila perlu dan latih kaki serta tangan secara terpisah.",
      "3. Hitung beat dengan suara, lalu ulangi potongan itu beberapa kali. Rekam latihanmu dan bandingkan timing serta arah gerak, bukan untuk mencari kesalahan kecil.",
      "4. Sambungkan dua potongan setelah masing-masing terasa cukup nyaman. Istirahat sejenak di antara pengulangan agar latihan tetap menyenangkan dan tubuh tidak dipaksa.",
    ],
    image: "photo-1504609813442-a8924e83f76e",
    imageAlt: "Penari berlatih koreografi di ruang studio",
  },
  {
    id: "find-groove",
    category: "HIPHOP",
    number: "03",
    time: "3 MIN READ",
    title: "Temukan groove-mu sendiri",
    excerpt:
      "Groove bukan soal terlihat sempurna. Mulai dari mendengar bass, melembutkan lutut, dan membiarkan tubuh merespons musik.",
    body: [
      "Groove adalah cara tubuh merespons musik. Tidak ada satu bentuk yang wajib terlihat sama untuk semua orang; rasa nyaman dan ketukan yang konsisten lebih penting.",
      "1. Pilih lagu dengan beat yang jelas. Dengarkan bass atau kick drum beberapa kali sebelum mulai bergerak.",
      "2. Lembutkan lutut dan coba memindahkan berat badan dari satu kaki ke kaki lain mengikuti beat. Jaga gerakannya kecil dulu.",
      "3. Tambahkan bahu atau ayunan tangan setelah ritme terasa stabil. Coba variasikan besar-kecil gerakan tanpa kehilangan ketukan.",
      "4. Rekam satu putaran singkat, lalu pilih satu hal yang ingin dicoba lagi. Groove berkembang lewat eksplorasi, bukan dengan menyalin gaya orang lain persis.",
    ],
    image: "photo-1547153760-18fc86324498",
    imageAlt: "Gerakan penari dengan pencahayaan panggung",
  },
];

const filters = ["SEMUA", "TUTORIAL", "K-POP", "HIPHOP"];

function DanceCard({ article, onRead }) {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [4, -4]), {
    stiffness: 180,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 180,
    damping: 18,
  });

  function handleMove(event) {
    if (reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function resetTilt() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.article
      className="journal-card"
      layout
      onMouseLeave={resetTilt}
      onMouseMove={handleMove}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={reducedMotion ? undefined : { y: -7 }}
      transition={{ layout: { duration: 0.35, ease: "easeOut" } }}
    >
      <div className="journal-image-wrap">
        <img
          alt={article.imageAlt}
          loading="lazy"
          src={`https://images.unsplash.com/${article.image}?auto=format&fit=crop&w=900&q=80`}
        />
        <span className="journal-image-index">
          FIELD NOTE / {article.number}
        </span>
        <span aria-hidden="true" className="journal-image-arrow">
          <ArrowUpRight size={19} />
        </span>
      </div>
      <div className="journal-card-body">
        <div className="journal-meta">
          <span>{article.category}</span>
          <span>
            <Clock3 size={12} /> {article.time}
          </span>
        </div>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <button
          aria-label={`Baca artikel: ${article.title}`}
          className="read-link"
          onClick={() => onRead(article)}
          type="button"
        >
          BACA CATATAN <ArrowUpRight size={14} />
        </button>
      </div>
    </motion.article>
  );
}

export default function JournalSection() {
  const reducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState("SEMUA");
  const [openArticle, setOpenArticle] = useState(null);
  const filteredArticles =
    activeFilter === "SEMUA"
      ? articles
      : articles.filter((article) => article.category === activeFilter);

  useEffect(() => {
    if (!openArticle) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpenArticle(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [openArticle]);

  return (
    <motion.section
      className="section journal-section"
      id="journal"
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
          <span className="section-number">03</span> NOTES FROM THE FLOOR
        </span>
        <span className="section-note">A LITTLE PRACTICE, EVERY DAY</span>
      </div>
      <div className="journal-heading-row">
        <div>
          <h2>
            THE <em>JOURNAL</em>
          </h2>
          <p>
            Catatan kecil tentang belajar, latihan, dan jatuh cinta lagi pada
            dance.
          </p>
        </div>
        <div
          aria-label="Filter artikel"
          className="journal-filters"
          role="group"
        >
          {filters.map((filter) => (
            <button
              aria-pressed={activeFilter === filter}
              className={
                activeFilter === filter
                  ? "filter-button is-active"
                  : "filter-button"
              }
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <motion.div className="journal-grid" layout>
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((article) => (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              initial={{ opacity: 0, scale: 0.96 }}
              key={article.id}
              layout
              transition={{ duration: 0.28 }}
            >
              <DanceCard article={article} onRead={setOpenArticle} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {openArticle && (
          <motion.div
            animate={{ opacity: 1 }}
            className="reader-backdrop"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setOpenArticle(null)}
          >
            <motion.article
              animate={{ opacity: 1, y: 0, scale: 1 }}
              aria-labelledby="reader-title"
              aria-modal="true"
              className="reader-modal"
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
            >
              <button
                aria-label="Tutup artikel"
                className="reader-close"
                onClick={() => setOpenArticle(null)}
                type="button"
              >
                <X size={19} />
              </button>
              <span className="eyebrow pink-label">
                {openArticle.category} / FIELD NOTE {openArticle.number}
              </span>
              <h3 id="reader-title">{openArticle.title}</h3>
              <div className="reader-copy">
                {openArticle.body.map((paragraph, index) => (
                  <p key={`${openArticle.id}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
