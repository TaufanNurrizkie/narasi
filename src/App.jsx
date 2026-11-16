import { useEffect, useState } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { CARDS } from "./data/cards";

const LEVELS = {
  1: "Level 1: Buzzer Konvensional",
  2: "Level 2: Bot & Otomatisasi",
  3: "Level 3: Generative AI",
};
const LABEL = {
  buzzer: "Terindikasi Buzzer",
  bukan: "Bukan Buzzer / Belum Cukup Bukti",
};
const HS_KEY = "narasi-highscore";
const THRESHOLD = 100;

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const readBest = () => {
  try {
    return Number(localStorage.getItem(HS_KEY)) || 0;
  } catch {
    return 0;
  }
};
const saveBest = (n) => {
  try {
    localStorage.setItem(HS_KEY, String(n));
  } catch {
    /* abaikan */
  }
};

function Button({ children, variant = "primary", className = "", ...p }) {
  const base =
    "rounded-xl px-6 py-3 font-display text-base sm:text-lg font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer";
  const styles =
    variant === "primary"
      ? "bg-ink text-white shadow-md hover:bg-ink/90 hover:shadow-lg"
      : "border-2 border-line bg-white text-ink hover:bg-paper";
  return (
    <button {...p} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

function Landing({ onStart, best }) {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-6 px-6 py-12 md:py-16">
      <div className="flex flex-col gap-2">
        <span className="w-fit rounded-full bg-mark/10 px-3.5 py-1 font-display text-xs sm:text-sm font-bold tracking-wide text-mark uppercase">
          Edukasi Literasi Digital
        </span>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-ink">
          NARASI
        </h1>
        <p className="font-display text-2xl sm:text-3xl font-semibold text-mark">
          Swipe the Narrative
        </p>
      </div>

      <p className="text-base sm:text-lg leading-relaxed text-ink/90">
        Uji ketelitianmu membaca pola propaganda digital. Kamu akan menganalisis{" "}
        <b>{CARDS.length} kartu konten</b> media sosial — mulai dari kasus nyata sindikat buzzer,
        bot otomatisasi, hingga akun AI yang terbongkar.
      </p>

      <div className="rounded-2xl border border-line bg-white/70 p-4 sm:p-5 backdrop-blur-sm">
        <p className="text-sm sm:text-base font-semibold text-ink">Cara Kerja:</p>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-ink/80">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-no/15 font-bold text-no">←</span>
            <span><b>Geser Kiri:</b> Terindikasi Buzzer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yes/15 font-bold text-yes">→</span>
            <span><b>Geser Kanan:</b> Bukan Buzzer</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button onClick={onStart}>Mulai Bermain</Button>
        {best > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm">
            <span className="text-ink/60">Skor Tertinggi:</span>
            <span className="font-display font-bold text-mark">{best} pts</span>
          </div>
        )}
      </div>
    </section>
  );
}

function Tutorial({ onGo }) {
  const rows = [
    {
      dir: "← Geser ke Kiri",
      title: "Terindikasi Buzzer",
      desc: "Geser kartu ke kiri jika kamu melihat pola koordinasi, teks identik, akun bot, deepfake, atau bukti brief terpusat.",
      tone: "text-no",
      badge: "bg-no/10 border-no/30",
    },
    {
      dir: "Geser ke Kanan →",
      title: "Bukan Buzzer",
      desc: "Geser ke kanan jika konten adalah opini organik, kritik warga biasa, atau otomatisasi yang transparan.",
      tone: "text-yes",
      badge: "bg-yes/10 border-yes/30",
    },
    {
      dir: "🔍 Periksa Bukti",
      title: "Fokus pada Pola",
      desc: "Periksa foto, timestamp, template teks, dan usia akun. Jangan nilai semata-mata dari pilihan politiknya.",
      tone: "text-mark",
      badge: "bg-mark/10 border-mark/30",
    },
    {
      dir: "💡 Pelajari Penjelasan",
      title: "Bedah Fakta & Indikator",
      desc: "Setiap kartu dilengkapi ulasan mendalam tentang mengapa konten tersebut termasuk manipulasi atau organik.",
      tone: "text-ink",
      badge: "bg-ink/10 border-ink/30",
    },
  ];

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center gap-6 px-6 py-12 md:py-16">
      <div>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-ink">
          Panduan Bermain
        </h2>
        <p className="mt-1 text-sm sm:text-base text-ink/70">
          Sistem murni menggunakan gesture swipe (geser). Di komputer/laptop, kamu juga bisa pakai tombol panah keyboard ← / →.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rows.map((r) => (
          <div
            key={r.title}
            className={`rounded-2xl border bg-white p-5 shadow-xs transition-shadow hover:shadow-md ${r.badge}`}
          >
            <span className={`font-display text-xs font-bold uppercase tracking-wider ${r.tone}`}>
              {r.dir}
            </span>
            <p className={`mt-1 font-display text-xl font-bold ${r.tone}`}>{r.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{r.desc}</p>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Button onClick={onGo}>Saya Siap Main</Button>
      </div>
    </section>
  );
}

function SwipeCard({ card, onSwipe }) {
  const x = useMotionValue(0);
  const opacity = useMotionValue(1);
  const rotate = useTransform(x, [-260, 260], [-10, 10]);
  const stampBuzzer = useTransform(x, [-130, -25], [1, 0]);
  const stampBukan = useTransform(x, [25, 130], [0, 1]);
  const redGlow = useTransform(x, [-THRESHOLD, 0], [0.15, 0]);
  const greenGlow = useTransform(x, [0, THRESHOLD], [0, 0.15]);
  const [imgOpen, setImgOpen] = useState(false);
  const [flying, setFlying] = useState(false);

  const fly = (dir) => {
    if (flying) return;
    setFlying(true);
    const exitX = dir * (typeof window !== "undefined" ? Math.max(window.innerWidth * 0.75, 450) : 450);
    Promise.all([
      animate(x, exitX, { duration: 0.22, ease: [0.32, 0.72, 0, 1] }),
      animate(opacity, 0, { duration: 0.18, ease: "easeOut" }),
    ]).then(() => {
      onSwipe(dir < 0 ? "buzzer" : "bukan");
    });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (imgOpen || flying) return;
      if (e.key === "ArrowLeft") fly(-1);
      if (e.key === "ArrowRight") fly(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <motion.article
        drag={imgOpen || flying ? false : "x"}
        dragMomentum={false}
        dragElastic={0.4}
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, opacity, rotate }}
        onDragEnd={(_, info) => {
          if (flying) return;
          if (Math.abs(info.offset.x) > THRESHOLD) {
            fly(Math.sign(info.offset.x));
          } else {
            animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
          }
        }}
        className="relative w-full max-w-sm sm:max-w-md md:max-w-lg cursor-grab touch-pan-y select-none rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-xl active:cursor-grabbing"
      >
        {/* Glow warna halus saat ditarik */}
        <motion.div style={{ opacity: redGlow }} className="pointer-events-none absolute inset-0 rounded-3xl bg-no" />
        <motion.div style={{ opacity: greenGlow }} className="pointer-events-none absolute inset-0 rounded-3xl bg-yes" />

        {/* Cap STAMP visual instan ala Tinder */}
        <motion.div
          style={{ opacity: stampBuzzer }}
          className="pointer-events-none absolute left-5 top-6 z-20 -rotate-12 rounded-xl border-4 border-no bg-white/95 px-3.5 py-1.5 font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-no shadow-lg"
        >
          BUZZER
        </motion.div>
        <motion.div
          style={{ opacity: stampBukan }}
          className="pointer-events-none absolute right-5 top-6 z-20 rotate-12 rounded-xl border-4 border-yes bg-white/95 px-3.5 py-1.5 font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-yes shadow-lg"
        >
          BUKAN
        </motion.div>

        <div className="relative flex flex-col gap-4">
          {/* Header Platform & Tanggal */}
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-paper px-2.5 py-1 font-display text-base font-bold text-ink">
                {card.platform}
              </span>
              {card.type === "real" ? (
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  Kasus Nyata
                </span>
              ) : (
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  Simulasi Pola
                </span>
              )}
            </div>
            <span className="text-xs sm:text-sm font-medium text-ink/60">{card.date}</span>
          </header>

          {/* Screenshot Bukti jika ada */}
          {card.image && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImgOpen(true);
              }}
              className="group relative mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-line bg-paper shadow-xs transition-shadow hover:shadow-md cursor-pointer"
            >
              <img
                src={card.image}
                alt="Bukti tangkapan layar"
                className="max-h-56 sm:max-h-64 w-full object-contain p-1"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-xs sm:text-sm font-semibold text-white opacity-0 transition-all group-hover:bg-ink/40 group-hover:opacity-100">
                🔍 Klik untuk Perbesar
              </span>
            </button>
          )}

          {/* Konteks */}
          <p className="text-xs sm:text-sm italic text-ink/80 bg-paper/60 p-2.5 rounded-xl">
            {card.context}
          </p>

          {/* Isi Postingan */}
          <div className="flex flex-col gap-2.5 max-h-[38vh] sm:max-h-[42vh] overflow-y-auto pr-1">
            {card.posts.map((p, idx) => (
              <div key={idx} className="rounded-xl border border-line/40 bg-paper/80 p-3">
                <p className="text-xs sm:text-sm font-bold text-mark">{p.u}</p>
                <p className="mt-1 text-sm sm:text-base leading-snug text-ink">{p.t}</p>
              </div>
            ))}
          </div>

          {/* Fakta / Bukti yang Ditemukan */}
          <div className="rounded-xl bg-paper/40 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-1.5">
              Fakta & Rekam Jejak:
            </p>
            <ul className="list-disc pl-4 text-xs sm:text-sm space-y-1 text-ink/80">
              {card.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.article>

      {/* Lightbox Screenshot */}
      {imgOpen && card.image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 p-4 backdrop-blur-xs"
          onClick={() => setImgOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-2xl overflow-auto rounded-3xl bg-white p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={card.image} alt="Bukti screenshot (diperbesar)" className="w-full rounded-2xl object-contain" />
            <button
              onClick={() => setImgOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-ink/80 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-ink cursor-pointer"
            >
              ✕ Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Feedback({ card, fb, last, onNext }) {
  const tone = fb.ok ? "text-yes" : "text-no";
  const badgeBg = fb.ok ? "bg-yes/10 text-yes border-yes/30" : "bg-no/10 text-no border-no/30";

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/60 p-4 sm:items-center backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg md:max-w-xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-line"
      >
        <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
          <h3 className={`font-display text-2xl sm:text-3xl font-extrabold ${tone}`}>
            {fb.ok ? "Jawaban Tepat! ✓" : "Kurang Tepat ✗"}
          </h3>
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${badgeBg}`}>
            {LABEL[card.category]}
          </span>
        </div>

        {card.image && (
          <img
            src={card.image}
            alt="Bukti screenshot"
            className="mt-4 max-h-48 sm:max-h-60 w-full object-contain rounded-xl border border-line bg-paper/50"
          />
        )}

        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Penjelasan Analisis:</p>
          <p className="mt-1 text-sm sm:text-base leading-relaxed text-ink/90">{card.explanation}</p>
        </div>

        <div className="mt-4 rounded-2xl bg-paper/70 p-3.5 sm:p-4 border border-line/60">
          <p className="font-display text-sm font-bold text-ink">Indikator Kunci:</p>
          <ul className="mt-2 list-disc pl-5 text-xs sm:text-sm space-y-1 text-ink/80">
            {card.evidence.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>

        <p className="mt-4 text-xs text-ink/60">
          {card.type === "real" ? "📰 Sumber Nyata:" : "🧪 Berdasarkan Pola Riil:"} {card.source}
        </p>

        <div className="mt-6 pt-2">
          <Button autoFocus onClick={onNext} className="w-full sm:w-auto">
            {last ? "Lihat Hasil Akhir" : "Kartu Berikutnya →"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Game({ deck, onFinish }) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [fb, setFb] = useState(null);
  const card = deck[i];
  const score = answers.filter(Boolean).length * 10;
  const last = i === deck.length - 1;

  const next = () => {
    setFb(null);
    if (last) onFinish(answers);
    else setI(i + 1);
  };

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-4 px-4 py-6 sm:py-10 overflow-hidden">
      {/* Status Bar Atas */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm sm:text-base">
          <span className="font-medium text-ink/70">
            Kartu <b>{i + 1}</b> dari <b>{deck.length}</b>
          </span>
          <span className="font-display text-lg sm:text-xl font-bold text-mark">
            Skor: {score}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line/70">
          <div
            className="h-full bg-mark transition-all duration-300"
            style={{ width: `${((i + 1) / deck.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-semibold text-mark">{LEVELS[card.level]}</span>
          <span className="text-ink/50 hidden sm:inline">Navigasi: keyboard ← / → atau drag</span>
        </div>
      </div>

      {/* Petunjuk Geser Header */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg flex items-center justify-between px-1 text-xs sm:text-sm font-semibold">
        <span className="flex items-center gap-1 rounded-full bg-no/10 px-3 py-1 text-no">
          👈 Geser Kiri: Buzzer
        </span>
        <span className="flex items-center gap-1 rounded-full bg-yes/10 px-3 py-1 text-yes">
          Bukan Buzzer : Geser Kanan 👉
        </span>
      </div>

      {/* Area Kartu (Overflow hidden mencegah viewport mobile membesar saat kartu melayang) */}
      <div className="relative flex w-full max-w-sm sm:max-w-md md:max-w-lg justify-center overflow-hidden py-1 min-h-[480px] sm:min-h-[520px]">
        {!fb && (
          <SwipeCard
            key={card.id}
            card={card}
            onSwipe={(choice) => {
              const ok = choice === card.category;
              setAnswers((a) => [...a, ok]);
              setFb({ ok });
            }}
          />
        )}
      </div>

      {fb && <Feedback card={card} fb={fb} last={last} onNext={next} />}
    </section>
  );
}

function Result({ answers, best, onAgain }) {
  const right = answers.filter(Boolean).length;
  const total = answers.length;
  const pct = Math.round((right / total) * 100);
  const msg =
    pct >= 80
      ? "Luar biasa! Kamu sangat jeli membedakan antara opini organik, bot amplifikasi, dan buzzer AI. Pertahankan daya kritis ini."
      : pct >= 50
      ? "Cukup baik! Kamu sudah mengenali sebagian besar trik manipulasi, namun perlu lebih teliti membedakan kemiripan teks dan opini pribadi."
      : "Masih perlu latihan. Fokus pada bukti konkret: jam posting berdekatan, kata-kata identik, akun tanpa profil, dan artefak AI.";

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-6 px-6 py-12 md:py-16">
      <div className="flex flex-col gap-1">
        <span className="w-fit rounded-full bg-mark/10 px-3.5 py-1 font-display text-xs sm:text-sm font-bold text-mark uppercase">
          Evaluasi Permainan
        </span>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-ink">Hasil Analisis</h2>
      </div>

      <div className="flex items-baseline gap-3">
        <p className="font-display text-6xl sm:text-8xl font-black text-mark">{right * 10}</p>
        <span className="text-xl sm:text-2xl font-bold text-ink/60">poin</span>
      </div>

      <dl className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
        {[
          ["Benar", right, "text-yes"],
          ["Salah", total - right, "text-no"],
          ["Akurasi", `${pct}%`, "text-mark"],
        ].map(([k, v, c]) => (
          <div key={k} className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-xs">
            <dt className="text-xs sm:text-sm font-semibold text-ink/60">{k}</dt>
            <dd className={`mt-1 font-display text-2xl sm:text-3xl font-extrabold ${c}`}>{v}</dd>
          </div>
        ))}
      </dl>

      <p className="text-base sm:text-lg leading-relaxed text-ink/90">{msg}</p>

      {best > 0 && (
        <p className="text-sm font-medium text-ink/70">
          Skor tertinggi tersimpan: <b>{best} pts</b>
        </p>
      )}

      <div className="pt-2">
        <Button onClick={onAgain}>Main Lagi</Button>
      </div>
    </section>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [deck, setDeck] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [best, setBest] = useState(readBest);
  const [round, setRound] = useState(0);

  const play = () => {
    setDeck(shuffle(CARDS));
    setRound((r) => r + 1);
    setScreen("game");
  };

  const finish = (ans) => {
    const s = ans.filter(Boolean).length * 10;
    if (s > best) {
      setBest(s);
      saveBest(s);
    }
    setAnswers(ans);
    setScreen("result");
  };

  if (screen === "landing") return <Landing best={best} onStart={() => setScreen("tutorial")} />;
  if (screen === "tutorial") return <Tutorial onGo={play} />;
  if (screen === "game") return <Game key={round} deck={deck} onFinish={finish} />;
  return <Result answers={answers} best={best} onAgain={play} />;
}
