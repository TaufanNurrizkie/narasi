import { useEffect, useState } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { CARDS } from "./data/cards";

const LEVELS = { 1: "Level 1: Buzzer konvensional", 2: "Level 2: Bot dan otomatisasi", 3: "Level 3: Generative AI" };
const LABEL = { buzzer: "Terindikasi buzzer", bukan: "Bukan buzzer / belum cukup indikasi" };
const HS_KEY = "narasi-highscore";
const THRESHOLD = 110;

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const readBest = () => { try { return Number(localStorage.getItem(HS_KEY)) || 0; } catch { return 0; } };
const saveBest = (n) => { try { localStorage.setItem(HS_KEY, String(n)); } catch { /* abaikan */ } };

function Button({ children, ...p }) {
  return (
    <button {...p} className="rounded-xl bg-ink px-6 py-3 font-display text-lg font-semibold text-white active:scale-95 transition-transform">
      {children}
    </button>
  );
}

function Landing({ onStart, best }) {
  return (
    <section className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-10">
      <h1 className="font-display text-6xl font-extrabold tracking-tight">NARASI</h1>
      <p className="font-display text-2xl font-semibold text-mark">Swipe the Narrative</p>
      <p className="leading-relaxed">
        Kamu akan melihat {CARDS.length} kartu konten media sosial — sebagian berdasarkan kasus nyata. Tugasmu: nilai apakah buktinya cukup untuk menunjukkan aktivitas buzzer,
        dari buzzer konvensional, bot, sampai Generative AI.
      </p>
      <p className="text-sm text-ink/70">Geser kartu ke kiri untuk buzzer, ke kanan untuk bukan buzzer.</p>
      <div className="flex items-center gap-4">
        <Button onClick={onStart}>Mulai bermain</Button>
        {best > 0 && <span className="text-sm">Skor tertinggi: <b>{best}</b></span>}
      </div>
    </section>
  );
}

function Tutorial({ onGo }) {
  const rows = [
    ["Geser ke kiri", "Kamu menilai konten ini terindikasi buzzer.", "text-no"],
    ["Geser ke kanan", "Kamu menilai ini bukan buzzer, atau buktinya belum cukup.", "text-yes"],
    ["Baca penjelasan", "Setiap jawaban disertai alasan dan indikatornya.", "text-mark"],
    ["Cari bukti", "Nilai pola dan bukti, bukan keberpihakan politik atau satu opini.", "text-mark"],
  ];
  return (
    <section className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-10">
      <h2 className="font-display text-4xl font-extrabold">Cara bermain</h2>
      <ul className="flex flex-col gap-4">
        {rows.map(([h, d, c]) => (
          <li key={h} className="border-l-4 border-line pl-4">
            <p className={`font-display text-xl font-semibold ${c}`}>{h}</p>
            <p>{d}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm text-ink/70">Di laptop kamu juga bisa memakai tombol panah kiri dan kanan.</p>
      <div><Button onClick={onGo}>Saya siap</Button></div>
    </section>
  );
}

function SwipeCard({ card, locked, onSwipe }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const redOpacity = useTransform(x, [-THRESHOLD, 0], [0.4, 0]);
  const greenOpacity = useTransform(x, [0, THRESHOLD], [0, 0.4]);
  const [imgOpen, setImgOpen] = useState(false);

  const fly = (dir) =>
    animate(x, dir * 700, { duration: 0.22 }).then(() => onSwipe(dir < 0 ? "buzzer" : "bukan"));

  useEffect(() => {
    const onKey = (e) => {
      if (locked || imgOpen) return;
      if (e.key === "ArrowLeft") fly(-1);
      if (e.key === "ArrowRight") fly(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <motion.article
        drag={locked || imgOpen ? false : "x"}
        dragMomentum={false}
        dragElastic={0.5}
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, rotate }}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > THRESHOLD) fly(Math.sign(info.offset.x));
          else animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
        }}
        className="relative w-full max-w-md cursor-grab touch-pan-y select-none rounded-2xl border border-line bg-white p-5 shadow-lg active:cursor-grabbing"
      >
        <motion.div style={{ opacity: redOpacity }} className="pointer-events-none absolute inset-0 rounded-2xl bg-no" />
        <motion.div style={{ opacity: greenOpacity }} className="pointer-events-none absolute inset-0 rounded-2xl bg-yes" />
        <div className="relative flex flex-col gap-4">
          <header className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
            <span className="font-display text-lg font-semibold">{card.platform}</span>
            <span className="text-ink/70">{card.date}</span>
          </header>
          {card.image && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setImgOpen(true); }}
              className="group relative mx-auto w-full max-w-xs overflow-hidden rounded-lg border border-line shadow-sm transition-shadow hover:shadow-md"
            >
              <img src={card.image} alt="Bukti screenshot" className="w-full object-contain" loading="lazy" />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-sm font-semibold text-white opacity-0 transition-all group-hover:bg-ink/40 group-hover:opacity-100">
                🔍 Perbesar
              </span>
            </button>
          )}
          <p className="text-sm italic text-ink/80">{card.context}</p>
          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
            {card.posts.map((p, i) => (
              <div key={i} className="rounded-lg bg-paper p-3">
                <p className="text-sm font-semibold">{p.u}</p>
                <p className="mt-1 leading-snug">{p.t}</p>
              </div>
            ))}
          </div>
          <ul className="list-disc pl-5 text-sm text-ink/80">
            {card.facts.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
      </motion.article>

      {/* Lightbox untuk gambar bukti */}
      {imgOpen && card.image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4"
          onClick={() => setImgOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-2xl overflow-auto rounded-2xl bg-white p-2 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <img src={card.image} alt="Bukti screenshot (diperbesar)" className="w-full rounded-lg object-contain" />
            <button
              onClick={() => setImgOpen(false)}
              className="absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-sm font-semibold text-white hover:bg-ink"
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
  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-ink/50 p-3 sm:items-center">
      <div role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5">
        <h3 className={`font-display text-3xl font-extrabold ${tone}`}>{fb.ok ? "Jawaban benar ✓" : "Kurang tepat ✗"}</h3>
        <p className="mt-1 font-semibold">Klasifikasi: {LABEL[card.category]}</p>
        {card.image && (
          <img src={card.image} alt="Bukti screenshot" className="mt-3 w-full max-h-48 object-contain rounded-lg border border-line" />
        )}
        <p className="mt-3 leading-relaxed">{card.explanation}</p>
        <p className="mt-4 font-display font-semibold">Indikator</p>
        <ul className="list-disc pl-5 text-sm">
          {card.evidence.map((e) => <li key={e}>{e}</li>)}
        </ul>
        <p className="mt-3 text-xs text-ink/70">
          {card.type === "real" ? "📰 Kasus nyata" : "🧪 Kasus simulasi"}. Sumber: {card.source}
        </p>
        <div className="mt-5"><Button autoFocus onClick={onNext}>{last ? "Lihat hasil" : "Kartu berikutnya"}</Button></div>
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
    <section className="mx-auto flex min-h-screen max-w-md flex-col items-center gap-4 px-4 py-6">
      <div className="flex w-full items-baseline justify-between">
        <span className="text-sm">Kartu {i + 1} dari {deck.length}</span>
        <span className="font-display text-xl font-semibold">Skor {score}</span>
      </div>
      <p className="w-full text-sm font-semibold text-mark">{LEVELS[card.level]}</p>
      <div className="flex w-full justify-between text-sm font-semibold">
        <span className="text-no">Geser kiri: buzzer</span>
        <span className="text-yes">Geser kanan: bukan</span>
      </div>
      <SwipeCard
        key={card.id}
        card={card}
        locked={!!fb}
        onSwipe={(choice) => {
          const ok = choice === card.category;
          setAnswers((a) => [...a, ok]);
          setFb({ ok });
        }}
      />
      {fb && <Feedback card={card} fb={fb} last={last} onNext={next} />}
    </section>
  );
}

function Result({ answers, best, onAgain }) {
  const right = answers.filter(Boolean).length;
  const total = answers.length;
  const pct = Math.round((right / total) * 100);
  const msg =
    pct >= 80 ? "Kamu jeli membaca pola dan tidak mudah menuduh. Pertahankan."
    : pct >= 50 ? "Cukup baik. Coba perhatikan lagi bedanya opini biasa dan pola koordinasi."
    : "Wajar jika sulit. Ulangi dan fokus pada bukti: waktu, pola teks, usia akun, dan sumber.";
  return (
    <section className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-5 px-6 py-10">
      <h2 className="font-display text-4xl font-extrabold">Hasil permainan</h2>
      <p className="font-display text-7xl font-extrabold text-mark">{right * 10}</p>
      <dl className="grid grid-cols-3 gap-3 text-center">
        {[["Benar", right], ["Salah", total - right], ["Akurasi", `${pct}%`]].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-line bg-white p-3">
            <dt className="text-sm">{k}</dt>
            <dd className="font-display text-2xl font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="leading-relaxed">{msg}</p>
      <p className="text-sm">Skor tertinggi: <b>{best}</b></p>
      <div><Button onClick={onAgain}>Main lagi</Button></div>
    </section>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [deck, setDeck] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [best, setBest] = useState(readBest);
  const [round, setRound] = useState(0);

  const play = () => { setDeck(shuffle(CARDS)); setRound((r) => r + 1); setScreen("game"); };
  const finish = (ans) => {
    const s = ans.filter(Boolean).length * 10;
    if (s > best) { setBest(s); saveBest(s); }
    setAnswers(ans);
    setScreen("result");
  };

  if (screen === "landing") return <Landing best={best} onStart={() => setScreen("tutorial")} />;
  if (screen === "tutorial") return <Tutorial onGo={play} />;
  if (screen === "game") return <Game key={round} deck={deck} onFinish={finish} />;
  return <Result answers={answers} best={best} onAgain={play} />;
}
