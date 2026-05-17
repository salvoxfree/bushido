import { useState, useEffect } from "react";

// ============ THEME ============
const G = "#00A86B";
const DARK = "#0a0a14";
const CARD = "#111120";
const BORDER = "#1e1e30";
const TEXT = "#E8E8EC";
const COLORS = {
  warmup: "#7C7C8A",
  skill: "#D4A017",
  strength: "#2563EB",
  weightlifting: "#38BDF8",
  vo2: "#DC6B1A",
  accessory: "#1B7A4A",
  cooldown: "#5A5A6A",
};

// ============ 1RM (kg) — tune these when you re-test ============
const ONERM = { bs: 118, fs: 94, dl: 162, bp: 90, sp: 70, sn: 72, cj: 70 };
const round25 = (n) => Math.round(n / 2.5) * 2.5;
const k = (lift, pct) => round25(ONERM[lift] * pct / 100);
const fmt = (v) => (Number.isInteger(v) ? v : v.toFixed(1));

// ============ PERIODIZATION — Block + DUP, 8 weeks ============
// Sources: Issurin 2010 (block periodization); Rhea 2002, Zourdos 2016 (DUP);
// Helms 2018 (RPE/RIR); Helgerud 2007 (Norwegian 4x4); Buchheit & Laursen 2013 (HIIT).
const PHASE = {
  1: { name: "Accumulation 1/4", color: "#2563EB" },
  2: { name: "Accumulation 2/4", color: "#2563EB" },
  3: { name: "Accumulation 3/4", color: "#2563EB" },
  4: { name: "Deload", color: "#5A5A6A" },
  5: { name: "Intensification 1/3", color: "#DC6B1A" },
  6: { name: "Intensification 2/3", color: "#DC6B1A" },
  7: { name: "Peak", color: "#E11D48" },
  8: { name: "Deload + Test", color: "#5A5A6A" },
};

// Main lifts (BS / FS / DL / BP / SP) — wave 3:1 then 3:1
const MAIN = {
  1: { pct: 70, sets: 4, reps: 6, rest: "2:30", rpeNote: "RPE 6 — facile per design" },
  2: { pct: 72.5, sets: 4, reps: 6, rest: "2:30", rpeNote: "RPE 6.5" },
  3: { pct: 75, sets: 5, reps: 5, rest: "2:30", rpeNote: "RPE 7" },
  4: { pct: 60, sets: 3, reps: 5, rest: "2:00", rpeNote: "DELOAD — leggero, solo pattern" },
  5: { pct: 80, sets: 5, reps: 4, rest: "3:00", rpeNote: "RPE 7.5" },
  6: { pct: 82.5, sets: 5, reps: 3, rest: "3:00", rpeNote: "RPE 8" },
  7: { pct: 85, sets: 4, reps: 3, rest: "3:00", rpeNote: "RPE 8.5 — peak" },
  8: { pct: 92, sets: 1, reps: 1, rest: "—", rpeNote: "TEST 1RM: lavora fino a single @92-100%" },
};

// Olympic lifts (Snatch / C&J) — schemi tipici weightlifting, % più alte ma volume basso
const OLY = {
  1: { pct: 70, sets: 5, complex: "2+1", rest: "2:00-2:30" },
  2: { pct: 73, sets: 5, complex: "2+1", rest: "2:00-2:30" },
  3: { pct: 76, sets: 5, complex: "1+1", rest: "2:30" },
  4: { pct: 65, sets: 3, complex: "1+1", rest: "2:00", deload: true },
  5: { pct: 80, sets: 5, complex: "1+1", rest: "2:30-3:00" },
  6: { pct: 83, sets: 5, complex: "1", rest: "3:00" },
  7: { pct: 87, sets: 3, complex: "1", rest: "3:00" },
  8: { pct: 90, sets: 1, complex: "1", rest: "—", test: true },
};

// VO2max LONG intervals (Wed) — rotation
const VO2_LONG = {
  1: { name: "Norwegian 4×4' / 3' rec — Rower", detail: "4 round: 4' @95% HRmax (pace target ~1:55-2:00/500m) / 3' easy rec. Gold standard VO2max (Helgerud 2007). Se cala >5s/500m tra round, stop." },
  2: { name: "5×3' / 2' rec — Rower o Skierg", detail: "5 round: 3' @95-100% vVO2max / 2' easy rec. Volume work alto, recupero corto." },
  3: { name: "6×500m Rower @ pace 5k / 1:30 rec", detail: "Pace target ~1:55-2:00/500m, costante. Allena lattate capacity + soglia." },
  4: { name: "DELOAD — 30' Rower Z2 continuous", detail: "Nasale. Pace easy 2:15-2:25/500m. SPM 18-22. Solo flow aerobico." },
  5: { name: "5×4' / 3' rec @95% — Rower", detail: "Stessa Norwegian ma scendi 2-3s/500m vs sett 1. Pace target ~1:52-1:58." },
  6: { name: "4×6' / 3' rec @threshold — Rower", detail: "Pace ~2:00-2:05/500m. Lavoro a soglia (~85% HRmax) per sostenere VO2max più a lungo." },
  7: { name: "4×4' RETEST — Rower (PR attempt)", detail: "Stesso protocollo Norwegian sett 1, prova a battere il pace. Logga il pace medio per ogni round." },
  8: { name: "DELOAD — 20' Rower Z2", detail: "Recupero. Easy 2:15-2:25/500m." },
};

// VO2max SHORT intervals (Fri) — rotation
const VO2_SHORT = {
  1: { name: "30/30 × 20 — Rower o Skierg", detail: "20 round: 30\" forte (pace 1:45-1:50/500m) / 30\" easy (2:20). Buchheit & Laursen 2013: short intervals ben tollerati, HR resta alto." },
  2: { name: "Fartlek 12×1'/1' — Rower o Bike", detail: "12 round: 1' forte / 1' easy. Sostieni lo stesso pace su tutti i round." },
  3: { name: "Tabata 8×20\"/10\" + 2 round — Skierg", detail: "8 round Tabata standard. Riposo 2'. Ripeti 1-2 round addizionali. Anaerobic + VO2." },
  4: { name: "DELOAD — 10×20\"/40\" easy — Rower", detail: "Pace 2:10/500m, 20\" attivo, 40\" rest. Solo flush." },
  5: { name: "Fartlek 15×1'/1' — Rower o Bike", detail: "Volume +25% vs sett 2. Stesso pace target." },
  6: { name: "20×30\" hard / 30\" rec — Skierg o Bike", detail: "Volume + intensità. Pace 1:42-1:48/500m skierg." },
  7: { name: "8×400m equiv. — Rower (first 200m faster)", detail: "Pace 1:50/500m primi 200, 1:55/500m secondi 200. ~1'30\" rec. Allena negative split." },
  8: { name: "OFF / mobility 20'", detail: "Recovery. Camminata + stretching globale." },
};

// Bench/SP also wave but with their own DUP positions (heavy day Mon for BP, Wed for SP)
// Bench Fri is technique/light
const BENCH_LIGHT = {
  1: { pct: 65, sets: 3, reps: 8, rest: "2:00" },
  2: { pct: 67.5, sets: 3, reps: 8, rest: "2:00" },
  3: { pct: 70, sets: 3, reps: 6, rest: "2:00" },
  4: { pct: 55, sets: 3, reps: 6, rest: "1:30" },
  5: { pct: 72.5, sets: 3, reps: 6, rest: "2:00" },
  6: { pct: 75, sets: 3, reps: 5, rest: "2:00" },
  7: { pct: 77.5, sets: 3, reps: 4, rest: "2:00" },
  8: { pct: 55, sets: 3, reps: 5, rest: "1:30" },
};

// Skill assignments per day (cycled, low fatigue — Schmidt 2008 motor learning)
const SKILL = {
  mon: { name: "Handstand hold nose-to-wall + shoulder taps", detail: "4×30s hold + 3×8/lato shoulder taps. CNS fresco, no cedimento.", fields: ["tempo", "note"] },
  tue: { name: "Hang power snatch from blocks — technique", detail: "3×2 @ ~50% snatch (≈36-40 kg). Focus pulizia 2° pull e ricezione.", fields: ["peso", "note"] },
  wed: { name: "Handstand walk attempt / wall walk", detail: "5' free practice. 5-8 tentativi. Esplora la posizione, no time pressure.", fields: ["distanza", "note"] },
  thu: { name: "Jerk balance + Jerk recovery", detail: "3×3 @ ~40 kg. Drill timing split, dip-drive lineare.", fields: ["peso", "note"] },
  fri: { name: "DU EMOM 5' (5 DU + 20 SU) + Snatch barbell complex tecnico", detail: "EMOM 5min DU. Poi 3×3 (Snatch grip DL + High Pull + OHS) @40 kg.", fields: ["reps", "note"] },
};

// HSPU / pull / accessory rotation by week (volume wave aligned with main wave)
const ACC = {
  1: { hspu: "4×3-5 strict facing wall (deficit 1 abmat se ci riesci)", pull: "4×6 strict pull-up", dipChin: "3×AMRAP dip + 3×AMRAP chin-up" },
  2: { hspu: "4×4-6 strict facing wall", pull: "4×7 strict pull-up", dipChin: "3×AMRAP dip + 3×AMRAP chin-up" },
  3: { hspu: "5×3-5 strict facing wall (deficit 2 abmat)", pull: "5×6 strict pull-up", dipChin: "4×AMRAP dip + 4×AMRAP chin-up" },
  4: { hspu: "3×3 strict (no deficit) — deload", pull: "3×5 strict pull-up — deload", dipChin: "2×AMRAP dip + 2×AMRAP chin-up — deload" },
  5: { hspu: "5×3 deficit 2 abmat", pull: "5×5 weighted pull-up (+5 kg) o 5×8 strict", dipChin: "4×AMRAP weighted dip + 4×AMRAP chin-up" },
  6: { hspu: "5×3 deficit 2-3 abmat", pull: "5×4 weighted pull-up (+7.5 kg)", dipChin: "4×AMRAP" },
  7: { hspu: "4×3 deficit 3 abmat", pull: "4×3 weighted pull-up (+10 kg)", dipChin: "3×AMRAP" },
  8: { hspu: "3×3 strict no deficit — test: max strict HSPU unbroken", pull: "test: max strict pull-up unbroken", dipChin: "2×AMRAP — flush" },
};

// ============ HELPERS ============
const setLine = (lift, w, label) => {
  const p = MAIN[w];
  const kg = k(lift, p.pct);
  return {
    name: `${label} — ${p.sets}×${p.reps} @${p.pct}%`,
    detail: `${fmt(kg)} kg. Rest ${p.rest}. ${p.rpeNote}.`,
  };
};

const olyLine = (lift, w, label) => {
  const o = OLY[w];
  const kg = k(lift, o.pct);
  const reps = o.complex; // es. "2+1", "1+1", "1"
  return {
    name: `${label} complex ${reps} — ${o.sets} set @${o.pct}%`,
    detail: `${fmt(kg)} kg. Rest ${o.rest}.${o.test ? " TEST: lavora fino a heavy single." : ""}${o.deload ? " DELOAD." : ""}`,
  };
};

const benchLightLine = (w) => {
  const p = BENCH_LIGHT[w];
  const kg = k("bp", p.pct);
  return {
    name: `Bench Press (light/tech) — ${p.sets}×${p.reps} @${p.pct}%`,
    detail: `${fmt(kg)} kg. Rest ${p.rest}. Focus tecnica e ROM, no grinder.`,
  };
};

// ============ DAY BUILDER ============
const buildDays = (week) => {
  const w = week;
  const acc = ACC[w];
  const isDeloadWeek = w === 4 || w === 8;

  return [
    // ============ MON ============
    {
      id: "mon",
      label: "LUN",
      title: "Squat heavy + Push light",
      subtitle: "Back Squat + Bench moderate + skill HS",
      totalTime: "~75 min",
      blocks: [
        {
          id: "wu", name: "WARM-UP", tag: "post-bici, corto", duration: "~8 min", color: COLORS.warmup,
          note: "Hai già fatto 30' Z2 in bici — qui solo mobility specifica + ramp set.",
          exercises: [
            { id: "wu1", name: "Mobility caviglia/anca/t-spine", detail: "3 min: 3-way ankle, 90/90 hip, t-spine rotation." },
            { id: "wu2", name: "Ramp Back Squat", detail: `Vuoto×8 → ${k("bs",40)}×5 → ${k("bs",55)}×3 → ${k("bs",65)}×2. ~5 min.` },
          ],
        },
        {
          id: "sk", name: "SKILL", tag: SKILL.mon.name, duration: "~5 min", color: COLORS.skill,
          note: "CNS fresco. Mai a cedimento (Schmidt 2008, motor learning).",
          exercises: [{ id: "sk1", name: SKILL.mon.name, detail: SKILL.mon.detail, loggable: true, logFields: SKILL.mon.fields }],
        },
        {
          id: "str", name: "STRENGTH A", tag: `Back Squat — ${PHASE[w].name}`, duration: "~22 min", color: COLORS.strength,
          note: "Tempo discesa 2s controllato, esplosivo concentrico. Niente bouncing.",
          exercises: [
            { id: "a1", ...setLine("bs", w, "Back Squat"), loggable: true, logFields: ["peso", "reps", "note"] },
          ],
        },
        {
          id: "str2", name: "STRENGTH B", tag: "Bench Press moderate", duration: "~15 min", color: COLORS.strength,
          note: "Pausa 1s al petto, full lockout, gomiti ~45° dal busto.",
          exercises: [
            { id: "b1", ...setLine("bp", w, "Bench Press"), loggable: true, logFields: ["peso", "reps", "note"] },
          ],
        },
        {
          id: "acc", name: "ACCESSORY", tag: "Pull + posterior + core", duration: "~18 min", color: COLORS.accessory,
          exercises: [
            { id: "ac1", name: "Strict Pull-up", detail: `${acc.pull}. Rest 1:30. Pausa 1s mento sopra.`, loggable: true, logFields: ["reps", "peso aggiunto"] },
            { id: "ac2", name: "Romanian Deadlift", detail: `3×8 @ ${k("dl",50)} kg (50% DL). Rest 1:30. Hip hinge prep per martedì.`, loggable: true, logFields: ["peso", "reps"] },
            { id: "ac3", name: "Hollow hold + Plank", detail: "3×30s hollow + 3×30s plank. Rest 30s.", loggable: true, logFields: ["tempo"] },
          ],
        },
        { id: "cd", name: "COOL-DOWN", tag: "stretch", duration: "~5 min", color: COLORS.cooldown,
          exercises: [{ id: "cd1", name: "Static stretch quad/hip flexor/petto", detail: "30s per zona." }] },
      ],
    },

    // ============ TUE ============
    {
      id: "tue",
      label: "MAR",
      title: "Snatch + Deadlift heavy",
      subtitle: "Snatch complex + DL heavy + DU skill",
      totalTime: "~80 min",
      blocks: [
        {
          id: "wu", name: "WARM-UP", tag: "oly + DL prep", duration: "~10 min", color: COLORS.warmup,
          exercises: [
            { id: "wu1", name: "Mobility polsi/caviglie/spalle", detail: "3 min." },
            { id: "wu2", name: "Snatch barbell complex vuoto", detail: "Snatch grip RDL ×5 + High Pull ×5 + OHS ×5 + Drop Snatch ×5. 2 round. ~4 min." },
            { id: "wu3", name: "Ramp Snatch", detail: `30×3 → 40×2 → ${k("sn",65)}×1.` },
          ],
        },
        {
          id: "sk", name: "SKILL", tag: SKILL.tue.name, duration: "~5 min", color: COLORS.skill,
          note: "Technique only, no fatigue.",
          exercises: [{ id: "sk1", name: SKILL.tue.name, detail: SKILL.tue.detail, loggable: true, logFields: SKILL.tue.fields }],
        },
        {
          id: "wl", name: "WEIGHTLIFTING A", tag: `Snatch — ${PHASE[w].name}`, duration: "~22 min", color: COLORS.weightlifting,
          note: "Drop tra le reps OK. Focus posizione di ricezione.",
          exercises: [{ id: "sn1", ...olyLine("sn", w, "Snatch"), loggable: true, logFields: ["peso", "reps", "note"] }],
        },
        {
          id: "str", name: "STRENGTH", tag: "Deadlift heavy", duration: "~18 min", color: COLORS.strength,
          note: "Tempo neutro, NO touch&go. Setup completo ogni rep.",
          exercises: [{ id: "dl1", ...setLine("dl", w, "Deadlift"), loggable: true, logFields: ["peso", "reps", "note"] }],
        },
        {
          id: "acc", name: "ACCESSORY", tag: "Snatch Pull + DU", duration: "~15 min", color: COLORS.accessory,
          exercises: [
            { id: "ac1", name: "Snatch Pull", detail: `3×3 @ ${k("sn",80)} kg (80% snatch). Rest 2:00. Focus pulizia 2° pull, no bend dei gomiti.`, loggable: true, logFields: ["peso", "reps"] },
            { id: "ac2", name: "Double Unders EMOM 5'", detail: "5 DU + 20 SU ogni minuto. Se rompi i DU, riprova con 5 singoli.", loggable: true, logFields: ["reps", "note"] },
          ],
        },
        { id: "cd", name: "COOL-DOWN", tag: "stretch", duration: "~5 min", color: COLORS.cooldown,
          exercises: [{ id: "cd1", name: "Stretch posteriore + lower back", detail: "30s hamstring/glute/lumbar." }] },
      ],
    },

    // ============ WED ============
    {
      id: "wed",
      label: "MER",
      title: "VO2max LONG + Strict Press",
      subtitle: VO2_LONG[w].name.split(" — ")[0],
      totalTime: "~75 min",
      blocks: [
        {
          id: "wu", name: "WARM-UP", tag: "cardio ramp", duration: "~10 min", color: COLORS.warmup,
          exercises: [
            { id: "wu1", name: "Mobility 3'", detail: "Spalle + t-spine + caviglie." },
            { id: "wu2", name: "Rower progressivo 5'", detail: "2' Z1 (2:20/500m) → 2' Z2 (2:10/500m) → 1' Z3 (2:00/500m)." },
            { id: "wu3", name: "Pickup 2×20\"", detail: "@ pace target VO2max (~1:55/500m), 1' rest tra i due." },
          ],
        },
        {
          id: "vo2", name: "VO2MAX — LONG", tag: VO2_LONG[w].name, duration: "~25 min", color: COLORS.vo2,
          note: "Logga pace medio /500m per ogni round. Se cala troppo, ferma.",
          exercises: [{ id: "v1", name: VO2_LONG[w].name, detail: VO2_LONG[w].detail, loggable: true, logFields: ["pace medio", "round completati", "note"] }],
        },
        {
          id: "str", name: "STRENGTH", tag: `Strict Press — ${PHASE[w].name}`, duration: "~15 min", color: COLORS.strength,
          note: "Full lockout sopra la testa, no arching lombare, glutei attivi.",
          exercises: [{ id: "sp1", ...setLine("sp", w, "Strict Press"), loggable: true, logFields: ["peso", "reps", "note"] }],
        },
        {
          id: "acc", name: "ACCESSORY", tag: "Pull + HS skill", duration: "~15 min", color: COLORS.accessory,
          exercises: [
            { id: "ac1", name: "Pull-up", detail: `${acc.pull}. Rest 1:30. Strict o alternativa chin-up.`, loggable: true, logFields: ["reps", "peso aggiunto"] },
            { id: "ac2", name: "HS walk practice", detail: SKILL.wed.detail, loggable: true, logFields: SKILL.wed.fields },
          ],
        },
        { id: "cd", name: "COOL-DOWN", tag: "Z1 + stretch", duration: "~5 min", color: COLORS.cooldown,
          exercises: [{ id: "cd1", name: "Rower 3' Z1 + stretch spalle", detail: "Pace 2:30/500m. Stretch petto/lat/tricipiti." }] },
      ],
    },

    // ============ THU ============
    {
      id: "thu",
      label: "GIO",
      title: "Clean & Jerk + Front Squat",
      subtitle: "C&J (jerk focus) + FS moderate + HSPU",
      totalTime: "~80 min",
      blocks: [
        {
          id: "wu", name: "WARM-UP", tag: "oly + front rack", duration: "~10 min", color: COLORS.warmup,
          exercises: [
            { id: "wu1", name: "Front rack mobility", detail: "3 min: front rack stretch, lats, polsi." },
            { id: "wu2", name: "C&J barbell complex vuoto", detail: "Front Squat ×3 + Push Press ×3 + Jerk grip pull ×3. 2 round." },
            { id: "wu3", name: "Ramp C&J", detail: `30×2 → 40×1 → ${k("cj",65)}×1.` },
          ],
        },
        {
          id: "sk", name: "SKILL", tag: SKILL.thu.name, duration: "~5 min", color: COLORS.skill,
          note: "Tuo bottleneck è il JERK (C&J=SP indica limite tecnico, non forza). Drill split.",
          exercises: [{ id: "sk1", name: SKILL.thu.name, detail: SKILL.thu.detail, loggable: true, logFields: SKILL.thu.fields }],
        },
        {
          id: "wl", name: "WEIGHTLIFTING A", tag: `Clean & Jerk — ${PHASE[w].name}`, duration: "~22 min", color: COLORS.weightlifting,
          note: "1 clean + 1 jerk per set. Se il jerk fallisce, ripeti il jerk (non il clean).",
          exercises: [{ id: "cj1", ...olyLine("cj", w, "Clean & Jerk"), loggable: true, logFields: ["peso", "reps", "note"] }],
        },
        {
          id: "str", name: "STRENGTH", tag: "Front Squat moderate", duration: "~18 min", color: COLORS.strength,
          note: "Gomiti alti per tutta la rep. No torso flex in buca.",
          exercises: [{ id: "fs1", ...setLine("fs", w, "Front Squat"), loggable: true, logFields: ["peso", "reps", "note"] }],
        },
        {
          id: "acc", name: "ACCESSORY", tag: "HSPU + core", duration: "~15 min", color: COLORS.accessory,
          exercises: [
            { id: "ac1", name: "Strict HSPU facing wall", detail: `${acc.hspu}. Rest 1:30. Scaling: piked push-up se non strict.`, loggable: true, logFields: ["reps", "deficit"] },
            { id: "ac2", name: "Hollow rock + V-up", detail: "3×15 hollow rock + 3×10 V-up. Rest 1:00.", loggable: true, logFields: ["reps"] },
          ],
        },
        { id: "cd", name: "COOL-DOWN", tag: "stretch", duration: "~5 min", color: COLORS.cooldown,
          exercises: [{ id: "cd1", name: "Stretch quad/front rack/spalle", detail: "30s per zona." }] },
      ],
    },

    // ============ FRI ============
    {
      id: "fri",
      label: "VEN",
      title: "VO2max SHORT + Bench tech",
      subtitle: VO2_SHORT[w].name.split(" — ")[0],
      totalTime: "~75 min",
      blocks: [
        {
          id: "wu", name: "WARM-UP", tag: "mobility + DU skill", duration: "~10 min", color: COLORS.warmup,
          exercises: [
            { id: "wu1", name: "Mobility 3'", detail: "Polsi, spalle, caviglie." },
            { id: "wu2", name: "Skill DU EMOM 5'", detail: SKILL.fri.detail, loggable: true, logFields: SKILL.fri.fields },
            { id: "wu3", name: "Rower 2' progressivo", detail: "2:20 → 2:00/500m." },
          ],
        },
        {
          id: "vo2", name: "VO2MAX — SHORT", tag: VO2_SHORT[w].name, duration: "~20 min", color: COLORS.vo2,
          note: "Mantieni stesso pace su tutti i round. Se cala >5s, fermati prima.",
          exercises: [{ id: "v1", name: VO2_SHORT[w].name, detail: VO2_SHORT[w].detail, loggable: true, logFields: ["pace medio", "round completati", "note"] }],
        },
        {
          id: "str", name: "STRENGTH", tag: "Bench tech/light", duration: "~12 min", color: COLORS.strength,
          note: "Recovery bench. Tecnica pulita, no grinder.",
          exercises: [{ id: "bp1", ...benchLightLine(w), loggable: true, logFields: ["peso", "reps", "note"] }],
        },
        {
          id: "acc", name: "ACCESSORY", tag: "Dip + Chin-up", duration: "~12 min", color: COLORS.accessory,
          exercises: [
            { id: "ac1", name: "Dip + Chin-up", detail: `${acc.dipChin}. Rest 1:30. Strict, anelli se disponibili.`, loggable: true, logFields: ["dip reps", "chin reps"] },
          ],
        },
        { id: "cd", name: "COOL-DOWN", tag: "stretch ampio", duration: "~10 min", color: COLORS.cooldown,
          exercises: [{ id: "cd1", name: "Stretch globale fine settimana", detail: "Anche, posteriore, spalle, petto. 1 min per zona. Weekend off — recupero attivo." }] },
      ],
    },
  ];
};

// ============ COMPONENTS ============
function ExRow({ ex, week, dayId }) {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState({});
  const [saved, setSaved] = useState(false);
  const key = `log:w${week}:${dayId}:${ex.id}`;
  const hasLog = Object.values(log).some((v) => v && v !== "");

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage?.get?.(key);
        if (r?.value) setLog(JSON.parse(r.value));
      } catch {}
    })();
  }, [key]);

  const save = async () => {
    try {
      await window.storage?.set?.(key, JSON.stringify(log));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {}
  };

  return (
    <div style={{ borderBottom: "1px solid #1a1a2a", padding: "10px 0" }}>
      <div onClick={() => ex.loggable && setOpen(!open)} style={{ display: "flex", gap: 8, cursor: ex.loggable ? "pointer" : "default", alignItems: "flex-start" }}>
        <span style={{ minWidth: 18, marginTop: 2, fontSize: 14, color: hasLog ? G : ex.loggable ? "#444" : "#2a2a3a" }}>
          {hasLog ? "✓" : ex.loggable ? "○" : "·"}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, fontFamily: "'Fira Code',monospace", lineHeight: 1.4 }}>{ex.name}</div>
          <div style={{ color: "#999", fontSize: 11.5, marginTop: 3, lineHeight: 1.5, fontFamily: "system-ui,sans-serif" }}>{ex.detail}</div>
        </div>
        {ex.loggable && <span style={{ color: "#444", fontSize: 11, marginTop: 4 }}>{open ? "▲" : "▼"}</span>}
      </div>
      {open && ex.loggable && (
        <div style={{ marginTop: 8, marginLeft: 26, display: "flex", flexDirection: "column", gap: 6 }}>
          {(ex.logFields || []).map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ color: "#666", fontSize: 11, minWidth: 75, textTransform: "capitalize", fontFamily: "system-ui" }}>{f}</label>
              <input
                type="text"
                value={log[f] || ""}
                onChange={(e) => setLog((p) => ({ ...p, [f]: e.target.value }))}
                placeholder="—"
                style={{ flex: 1, background: "#0d0d1a", border: "1px solid #2a2a3a", borderRadius: 6, color: TEXT, padding: "7px 10px", fontSize: 13, fontFamily: "'Fira Code',monospace", outline: "none", maxWidth: 150 }}
              />
            </div>
          ))}
          <button
            onClick={save}
            style={{ background: saved ? G : "#1a1a2e", border: `1px solid ${G}`, borderRadius: 6, color: saved ? "#fff" : G, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start", transition: "all 0.2s", fontFamily: "system-ui" }}
          >
            {saved ? "✓ Salvato" : "Salva"}
          </button>
        </div>
      )}
    </div>
  );
}

function Block({ block, week, dayId }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: CARD, borderRadius: 10, marginBottom: 8, border: `1px solid ${open ? block.color + "55" : BORDER}`, transition: "border-color 0.2s" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", padding: "12px 14px", cursor: "pointer", gap: 10 }}>
        <div style={{ width: 3, height: 32, borderRadius: 2, background: block.color, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: TEXT, fontFamily: "'Fira Code',monospace" }}>{block.name}</div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 1, fontFamily: "system-ui" }}>
            {block.tag} — <span style={{ color: G }}>{block.duration}</span>
          </div>
        </div>
        <span style={{ color: "#444", fontSize: 12, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▼</span>
      </div>
      {open && (
        <div style={{ padding: "0 14px 12px" }}>
          {block.note && (
            <div style={{ fontSize: 11, color: G, marginBottom: 8, padding: "6px 8px", background: "#0d1a14", borderRadius: 6, lineHeight: 1.5, fontFamily: "system-ui" }}>{block.note}</div>
          )}
          {block.exercises.map((ex) => (
            <ExRow key={ex.id} ex={ex} week={week} dayId={dayId} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============ MAIN ============
export default function App() {
  // Program start: Mon 18 May 2026 = week 1
  const PROGRAM_START = new Date(2026, 4, 18); // month 0-indexed
  const todayDow = new Date().getDay(); // 0=Sun..6=Sat
  // weekend (Sat/Sun) → show Monday as next training day
  const dayMap = { 0: 0, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 0 };
  const computedWeek = (() => {
    const today = new Date();
    const diffMs = today - PROGRAM_START;
    const wk = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
    return Math.max(1, Math.min(8, wk));
  })();

  const [sel, setSel] = useState(dayMap[todayDow] ?? 0);
  const [week, setWeek] = useState(computedWeek);
  const days = buildDays(week);
  const day = days[sel];
  const phase = PHASE[week];

  return (
    <div style={{ minHeight: "100vh", background: DARK, color: TEXT, fontFamily: "system-ui,-apple-system,sans-serif", maxWidth: 480, margin: "0 auto" }}>
      {/* HEADER */}
      <div style={{ padding: "16px 14px 6px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 10, color: phase.color, fontWeight: 700, letterSpacing: 2.5, fontFamily: "'Fira Code',monospace" }}>
          BUSHIDO — {phase.name.toUpperCase()}
        </div>
        {/* Week selector */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, padding: "10px 0" }}>
          <button
            onClick={() => setWeek((w) => Math.max(1, w - 1))}
            disabled={week === 1}
            style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 6, color: week === 1 ? "#333" : "#888", padding: "5px 12px", cursor: week === 1 ? "default" : "pointer", fontSize: 15 }}
          >
            ←
          </button>
          <span style={{ color: TEXT, fontSize: 14, fontWeight: 700, fontFamily: "'Fira Code',monospace", minWidth: 90, textAlign: "center" }}>WEEK {week}/8</span>
          <button
            onClick={() => setWeek((w) => Math.min(8, w + 1))}
            disabled={week === 8}
            style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 6, color: week === 8 ? "#333" : "#888", padding: "5px 12px", cursor: week === 8 ? "default" : "pointer", fontSize: 15 }}
          >
            →
          </button>
        </div>
        {/* Day picker */}
        <div style={{ display: "flex", gap: 4, justifyContent: "center", paddingBottom: 8 }}>
          {days.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setSel(i)}
              style={{
                background: i === sel ? G : "#111120",
                border: i === sel ? `1px solid ${G}` : `1px solid #1e1e30`,
                borderRadius: 8,
                padding: "7px 0",
                width: 54,
                color: i === sel ? "#fff" : "#777",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Fira Code',monospace",
                transition: "all 0.15s",
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
      {/* DAY HEADER */}
      <div style={{ padding: "14px 14px 6px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Fira Code',monospace" }}>{day.title}</div>
          <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{day.subtitle}</div>
        </div>
        <div style={{ background: "#0d1a14", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: G, fontWeight: 700, fontFamily: "'Fira Code',monospace" }}>{day.totalTime}</div>
      </div>
      {/* BLOCKS */}
      <div style={{ padding: "8px 10px 80px" }}>
        {day.blocks.map((b) => (
          <Block key={b.id} block={b} week={week} dayId={day.id} />
        ))}
      </div>
    </div>
  );
}
