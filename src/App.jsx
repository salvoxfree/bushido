import { useState, useEffect } from "react";

const G = "#00A86B";
const G2 = "#00C853";
const DARK = "#0a0a14";
const CARD = "#111120";
const BORDER = "#1e1e30";
const TEXT = "#E8E8EC";
const DIM = "#777";
const COLORS = { rilascio: "#1B7A4A", skill: "#D4A017", strength: "#2563EB", weightlifting: "#38BDF8", endurance: "#0891B2", conditioning: "#DC6B1A", fs: "#E8E8EC", gymnastics: "#E11D48" };

// ============ WEEK-SPECIFIC DATA ============
const WD = {
  1: {
    squat_note: "Tempo 3030: 3s eccentrica, no pausa in basso, 3s concentrica, no pausa in alto. Settimana 1: costruisci il pattern motorio prima del carico.",
    squat_warmup: "8-10 min. Vuoto x8 → 50% (55kg) x5 → 60% (66kg) x3 → 70% (77kg) x2. Ogni set in tempo 3030.",
    squat_s1: ["Set 1 — 5 reps @75%", "82.5 kg. Tempo 3030. Rest 3:00 min."],
    squat_s2: ["Set 2 — 4 reps @80%", "88 kg. Tempo 3030. Rest 3:00 min."],
    squat_s3: ["Set 3 — 3 reps @82.5%", "91 kg. Tempo 3030. Rest 3:00 min."],
    squat_s4: ["Set 4 — 2-3 reps @85%", "94 kg. Tempo 3030. Se perdi il tempo, non salire di carico."],
    du_skill: "5 min. EMOM 5min → 5 DU attempts + 20 single unders. Focus: polsi rilassati, salto basso.",
    hs_skill: "5 min. Nose-to-wall hold 3×30s + shoulder taps al muro 3×10/lato + weight shift (solleva 1 mano 2cm) 3×8/lato.",
    mon_cond_note: "Intensità Z2, respirazione nasale. Se non respiri dal naso, stai andando troppo forte.",
    mon_cond_name: "3-4 round for quality",
    mon_cond_detail: "400m Rower @2:00-2:05/500m (SPM 22-24) → 12 KB Swing @24kg → 8 Box Jump Overs @60cm → 1:00 rest. Obiettivo: volume aerobico, non andare in debito.",
    sn_note: "Focus: pulizia tecnica, esplosività, posizioni. Adatta il carico per percepire il gesto pulito.",
    sn_w2: "2+1+1 @50% = 30kg. Rest 1:30.", sn_w3: "1+2+1 @55% = 33kg", sn_w4: "1+1+1 @60% = 36kg", sn_w5: "1+1+1 @62% = 37kg",
    sn_w6: "1+1+1 @65% = 39kg. Non salire se perdi le posizioni.",
    tue_gym_name: "3 round for quality",
    tue_gym_detail: "2-3 Wall Walks (lento, nose-to-wall) + 3-5 Strict Facing Wall HSPU + 5-10m HS walk attempt OPPURE shoulder taps ×8/lato. Rest 1:30 tra i round.",
    wed_end_note: "Respirazione NASALE. Sett 1: Opzione A (Tri-Modal). Alterna A/B ogni settimana.",
    bench_note: "Tempo 3030 invariato. Settimana 1: focus sulla qualità del movimento sotto carico moderato.",
    bench_warmup: "Vuoto x8 → 40kg x5 → 50kg x3 → 55kg x2. ~5 min.",
    bench_m1: ["Bench Set 1 — 5 reps @75%", "60 kg. Tempo 3030. Rest 2:00."],
    bench_m2: ["Bench Set 2 — 4 reps @80%", "64 kg. Tempo 3030. Rest 2:00."],
    bench_m3: ["Bench Set 3-4 — 2-3 reps @82.5-85%", "66-68 kg. Tempo 3030. Rest 2:00."],
    press_m4: ["Strict Press Set 1 — 5 @70%", "49 kg. Rest 2:00."],
    press_m5: ["Strict Press Set 2 — 4 @75%", "52 kg. Rest 2:00."],
    press_m6: ["Strict Press Set 3 — 3 @80%", "56 kg."],
    thu_cond_detail: "15 Burpees Box Jump Overs @60cm + 20/15 cal Air Bike (RPM 65-75) + 30m Dual KB Farmer Carry @32kg. Target: 5-6 round. Scaling: altezza box 50cm o KB 24kg.",
    cj_note: "Focus: tecnica di base, esplosività dal pavimento. Adatta il carico per percepire il gesto pulito.",
    cj_w2: "2+1+1 @63% = 44kg", cj_w3: "1+2+1 @67% = 47kg", cj_w4: "1+1+1 @70% = 49kg", cj_w5: "1+1+1 @72% = 50kg",
    cj_w6: "1+1+1 @73% = 51kg. Rest as needed. Non salire se perdi posizione.",
    fri_cond_detail: "AMRAP per intervallo: 5 Dual DB Devil Press @22.5/15kg + 10 Dual DB Thruster @22.5/15kg + 5 Bar Muscle Ups (scala: C2B x2-3 o Pull Ups x3) + 30 Double Unders. Target: 1-2 round per intervallo.",
    sat_subtitle: "Gymnastics + Aerobic (opzionale)", sat_note: "RPE 5 massimo. Se sei stanco, fai solo la Mini Routine e vai a casa. Il recupero è parte del programma.",
    sat_g1_name: "HS walk practice libera", sat_g1_detail: "10-15 tentativi. Esplora la posizione senza pressione.",
    sat_g5_name: "DU practice libera", sat_g5_detail: "5 min. Sett 1: sperimenta timing della corda, single-double combo.",
    sat_a1_name: "5000m Rower @2:10-2:15/500m", sat_a1_detail: "Z1. SPM 18-20. Nasale. Puro recovery.",
  },
  2: {
    squat_note: "Tempo 3030 invariato. Settimana 2: primo incremento di carico. Mantieni la tecnica fino a 96kg.",
    squat_warmup: "8-10 min. Vuoto x8 → 52% (57kg) x5 → 62% (68kg) x3 → 72% (79kg) x2. Ogni set in tempo 3030.",
    squat_s1: ["Set 1 — 4 reps @78%", "86 kg. Tempo 3030. Rest 3:00 min."],
    squat_s2: ["Set 2 — 3 reps @82%", "90 kg. Tempo 3030. Rest 3:00 min."],
    squat_s3: ["Set 3 — 2 reps @85%", "93.5 kg → 94 kg. Tempo 3030. Rest 3:30 min."],
    squat_s4: ["Set 4 — 2 reps @87.5%", "96 kg. Tempo 3030. Se perdi il tempo, fermati a 94 kg."],
    du_skill: "5 min. EMOM 5min → max unbroken DU (cap 10). Se rompi subito, 5 tentativi singoli poi riprova.",
    hs_skill: "5 min. Kick-up to freestanding hold 5 tentativi × max sec + wall walk-away: stacca i piedi e fai 2-3 passi ×5.",
    mon_cond_note: "Intensità Z2, respirazione nasale. Ritmo costante, non accelerare nei box jump.",
    mon_cond_name: "3-4 round for quality",
    mon_cond_detail: "400m Rower @2:00-2:05/500m (SPM 22-24) → 12 KB Swing @24kg → 8 Box Jump Overs @60cm → 1:00 rest. Target: stesso ritmo dal round 1 al 4.",
    sn_note: "Settimana 2: obiettivo 67% = 40kg. Focus pull + ricezione.",
    sn_w2: "2+1+1 @52% = 31kg. Rest 1:30.", sn_w3: "1+2+1 @57% = 34kg", sn_w4: "1+1+1 @62% = 37kg", sn_w5: "1+1+1 @65% = 39kg",
    sn_w6: "1+1+1 @67% = 40kg. Non salire se perdi le posizioni.",
    tue_gym_name: "3 round for quality",
    tue_gym_detail: "2-3 Wall Walks (lento) + 3-5 Strict Facing Wall HSPU + 5-10m HS walk attempt. Rest 1:30. Aggiungi 1 rep per esercizio vs sett 1.",
    wed_end_note: "Respirazione NASALE. Sett 2: Opzione B (Sport Specific AMRAP). Mantieni nasale per tutta la durata.",
    bench_note: "Settimana 2: primo incremento bench. Mantieni il tempo 3030 sotto ogni carico.",
    bench_warmup: "Vuoto x8 → 40kg x5 → 50kg x3 → 58kg x2. ~5 min.",
    bench_m1: ["Bench Set 1 — 5 reps @77%", "62 kg. Tempo 3030. Rest 2:00."],
    bench_m2: ["Bench Set 2 — 3 reps @82%", "66 kg. Tempo 3030. Rest 2:00."],
    bench_m3: ["Bench Set 3-4 — 2-3 reps @85%", "68 kg. Tempo 3030. Rest 2:00."],
    press_m4: ["Strict Press Set 1 — 5 @72%", "50 kg. Rest 2:00."],
    press_m5: ["Strict Press Set 2 — 4 @77%", "54 kg. Rest 2:00."],
    press_m6: ["Strict Press Set 3 — 3 @80%", "56 kg."],
    thu_cond_detail: "15 Burpees Box Jump Overs @60cm + 20/15 cal Air Bike (RPM 65-75) + 30m Dual KB Farmer Carry @32kg. Target: 5-6 round. Scaling: altezza box 50cm o KB 24kg.",
    cj_note: "Settimana 2: +2-4kg rispetto alla sett 1. Focus sulla qualità del jerk.",
    cj_w2: "2+1+1 @65% = 45kg", cj_w3: "1+2+1 @68% = 48kg", cj_w4: "1+1+1 @70% = 49kg", cj_w5: "1+1+1 @72% = 50kg",
    cj_w6: "1+1+1 @75% = 52kg. Rest as needed. Non salire se perdi posizione.",
    fri_cond_detail: "AMRAP per intervallo: 5 Dual DB Devil Press @22.5/15kg + 10 Dual DB Thruster @22.5/15kg + 5 Bar Muscle Ups (scala: C2B x2-3 o Pull Ups x3) + 30 Double Unders. Target: 1-2 round per intervallo.",
    sat_subtitle: "Gymnastics + Aerobic (opzionale)", sat_note: "RPE 5 massimo. Fai almeno la mini routine e 1 opzione di ginnastica. Il recupero è produttivo.",
    sat_g1_name: "HS walk practice", sat_g1_detail: "10-15 tentativi. Focus allineamento di spalla, push per 3+ passi consecutivi.",
    sat_g5_name: "DU practice", sat_g5_detail: "5 min. Target: sequenze di 5-10 DU unbroken.",
    sat_a1_name: "5000m Rower @2:10-2:15/500m", sat_a1_detail: "Z1. SPM 18-20. Nasale. Puro recovery.",
  },
  3: {
    squat_note: "Tempo 3030 invariato. Settimana 3: primo test a 90% = 99kg. Preparati mentalmente.",
    squat_warmup: "8-10 min. Vuoto x8 → 55% (60kg) x5 → 64% (70kg) x3 → 74% (81kg) x2. Ogni set in tempo 3030.",
    squat_s1: ["Set 1 — 4 reps @80%", "88 kg. Tempo 3030. Rest 3:00 min."],
    squat_s2: ["Set 2 — 3 reps @84%", "92 kg. Tempo 3030. Rest 3:00 min."],
    squat_s3: ["Set 3 — 2 reps @87.5%", "96 kg. Tempo 3030. Rest 3:30 min."],
    squat_s4: ["Set 4 — 1-2 reps @90%", "99 kg. Tempo 3030. Primo tocco a 90%. Fermati se il tempo crolla."],
    du_skill: "5 min. EMOM 5min → max unbroken DU (cap 15). Se rompi <5, fai 3 tentativi singoli di recupero.",
    hs_skill: "5 min. HS walk attempts, target 2-3m. 6-8 tentativi. Calcia e cammina, passi corti.",
    mon_cond_note: "Intensità Z2, respirazione nasale. Sett 3: aumenta la continuità aerobica.",
    mon_cond_name: "3-4 round for quality",
    mon_cond_detail: "400m Rower @1:58-2:03/500m (SPM 22-24) → 12 KB Swing @24kg → 8 Box Jump Overs @60cm → 1:00 rest. Leggero aumento di pace sul rower.",
    sn_note: "Settimana 3: obiettivo 70% = 42kg. Velocità sotto il bilanciere prioritaria.",
    sn_w2: "2+1+1 @55% = 33kg. Rest 1:30.", sn_w3: "1+2+1 @60% = 36kg", sn_w4: "1+1+1 @63% = 38kg", sn_w5: "1+1+1 @67% = 40kg",
    sn_w6: "1+1+1 @70% = 42kg. Non salire se perdi l'OHS.",
    tue_gym_name: "3 round for quality",
    tue_gym_detail: "2-3 Wall Walks + 3-5 Strict HSPU + 5-10m HS walk attempt. Rest 1:30. Consolida le rep e spingi per distanza HS Walk.",
    wed_end_note: "Respirazione NASALE. Sett 3: Opzione B (Sport Specific AMRAP). Focus: ritmo uniforme per tutti i round.",
    bench_note: "Settimana 3: consolidamento a 80%. Prepara il terreno per le settimane di peak.",
    bench_warmup: "Vuoto x8 → 40kg x5 → 52kg x3 → 60kg x2. ~5 min.",
    bench_m1: ["Bench Set 1 — 4 reps @80%", "64 kg. Tempo 3030. Rest 2:00."],
    bench_m2: ["Bench Set 2 — 3 reps @83%", "66 kg. Tempo 3030. Rest 2:00."],
    bench_m3: ["Bench Set 3-4 — 2 reps @85%", "68 kg. Tempo 3030. Rest 2:30."],
    press_m4: ["Strict Press Set 1 — 4 @75%", "52 kg. Rest 2:00."],
    press_m5: ["Strict Press Set 2 — 3 @80%", "56 kg. Rest 2:00."],
    press_m6: ["Strict Press Set 3 — 2-3 @83%", "58 kg."],
    thu_cond_detail: "15 Burpees Box Jump Overs @60cm + 20/15 cal Air Bike (RPM 65-75) + 30m Dual KB Farmer Carry @32kg. Target: 6-7 round. Scaling: altezza box 50cm o KB 24kg.",
    cj_note: "Settimana 3: obiettivo 77% = 54kg. Jerk stabile e diretto, niente lurch in avanti.",
    cj_w2: "2+1+1 @65% = 45kg", cj_w3: "1+2+1 @70% = 49kg", cj_w4: "1+1+1 @73% = 51kg", cj_w5: "1+1+1 @75% = 52kg",
    cj_w6: "1+1+1 @77% = 54kg. Rest as needed.",
    fri_cond_detail: "AMRAP per intervallo: 5 Dual DB Devil Press @22.5/15kg + 10 Dual DB Thruster @22.5/15kg + 5 Bar Muscle Ups (scala: C2B x3) + 30 Double Unders. Target: 2 round per intervallo.",
    sat_subtitle: "Gymnastics + Aerobic (opzionale)", sat_note: "RPE 5 aerobico, RPE 6-7 sulle skill. Spingi un po' di più sulla ginnastica questa settimana.",
    sat_g1_name: "HS walk — push distanza", sat_g1_detail: "10-15 tentativi. Target: 3-5 metri unbroken. Log distanza migliore.",
    sat_g5_name: "DU — set continuati", sat_g5_detail: "5 min. Target: 10-15 DU unbroken. Ritmo costante.",
    sat_a1_name: "5000m Rower @2:08-2:13/500m", sat_a1_detail: "Z1-Z2 leggero. SPM 18-20. Nasale.",
  },
  4: {
    squat_note: "Tempo 3030 invariato. Settimana 4: consolidamento ad alta intensità. Prepari il terreno per il peak della sett 5.",
    squat_warmup: "8-10 min. Vuoto x8 → 55% (60kg) x5 → 65% (71kg) x3 → 75% (82kg) x2. Ogni set in tempo 3030.",
    squat_s1: ["Set 1 — 3 reps @83%", "91 kg. Tempo 3030. Rest 3:00 min."],
    squat_s2: ["Set 2 — 2-3 reps @85%", "93.5 kg → 94 kg. Tempo 3030. Rest 3:30 min."],
    squat_s3: ["Set 3 — 2 reps @88%", "96-97 kg → 96 kg. Tempo 3030. Rest 3:30 min."],
    squat_s4: ["Set 4 — 1 rep @90%", "99 kg. Tempo 3030. Singola pesante — pattern per il peak della sett 5."],
    du_skill: "5 min. Every 30s x10 → max unbroken, target 15+. Se rompi <10, recupera e riparti.",
    hs_skill: "5 min. HS walk attempts, push per 3-5m. 8 tentativi. Passi corti e choppy, core stretto.",
    mon_cond_note: "Intensità Z2, respirazione nasale. Sett 4: mantieni il ritmo di sett 3.",
    mon_cond_name: "3-4 round for quality",
    mon_cond_detail: "400m Rower @1:58-2:03/500m (SPM 22-24) → 12 KB Swing @24kg → 8 Box Jump Overs @60cm → 1:00 rest. Cerca 4 round con lo stesso ritmo.",
    sn_note: "Settimana 4: obiettivo 72% = 43kg. Consolida le posizioni prima del peak della sett 5.",
    sn_w2: "2+1+1 @57% = 34kg. Rest 1:30.", sn_w3: "1+2+1 @62% = 37kg", sn_w4: "1+1+1 @65% = 39kg", sn_w5: "1+1+1 @68% = 41kg",
    sn_w6: "1+1+1 @72% = 43kg. Non salire se OHS non è solido.",
    tue_gym_name: "3-4 round for quality",
    tue_gym_detail: "2-3 Wall Walks + 3-5 Strict HSPU (o kipping attempts) + 10m HS walk attempt. Rest 1:30. Push per 4 round se possibile.",
    wed_end_note: "Respirazione NASALE. Sett 4: Opzione A. Mantieni i ritmi di sett 3 sui pezzi di macchina.",
    bench_note: "Settimana 4: primo tocco @87% = 70kg. Importante per abituarsi al carico prima del peak.",
    bench_warmup: "Vuoto x8 → 40kg x5 → 52kg x3 → 60kg x2 → 64kg x1. ~5 min.",
    bench_m1: ["Bench Set 1 — 4 reps @80%", "64 kg. Tempo 3030. Rest 2:00."],
    bench_m2: ["Bench Set 2 — 3 reps @83%", "66 kg. Tempo 3030. Rest 2:30."],
    bench_m3: ["Bench Set 3-4 — 2 reps @87%", "70 kg. Tempo 3030. Rest 2:30. Primer per il peak di sett 5."],
    press_m4: ["Strict Press Set 1 — 4 @77%", "54 kg. Rest 2:30."],
    press_m5: ["Strict Press Set 2 — 3 @82%", "57 kg. Rest 2:30."],
    press_m6: ["Strict Press Set 3 — 2 @84%", "59 kg. Avvicinamento al peak."],
    thu_cond_detail: "15 Burpees Box Jump Overs @60cm + 20/15 cal Air Bike (RPM 65-75) + 30m Dual KB Farmer Carry @32kg. Target: 6-7 round. Scaling: altezza box 50cm o KB 24kg.",
    cj_note: "Settimana 4: obiettivo 80% = 56kg. Jerk stabile, ampiezza massima dello split.",
    cj_w2: "2+1+1 @67% = 47kg", cj_w3: "1+2+1 @72% = 50kg", cj_w4: "1+1+1 @75% = 52kg", cj_w5: "1+1+1 @77% = 54kg",
    cj_w6: "1+1+1 @80% = 56kg. Rest as needed.",
    fri_cond_detail: "AMRAP per intervallo: 5 Dual DB Devil Press @22.5/15kg + 10 Dual DB Thruster @22.5/15kg + 5 Bar Muscle Ups (scala: C2B x3) + 30 Double Unders. Target: 2 round per intervallo.",
    sat_subtitle: "Gymnastics + Aerobic (opzionale)", sat_note: "RPE 5-6 massimo. Consolida le skill. Domenica riposo completo — sett 5 è il peak.",
    sat_g1_name: "HS walk — consolida", sat_g1_detail: "10-15 tentativi. Target: 5+ metri unbroken. Rest 90s tra tentativi.",
    sat_g5_name: "DU — set lunghi", sat_g5_detail: "5 min. Target: 15-20 DU unbroken. Pochi tentativi di qualità.",
    sat_a1_name: "5000m Rower @2:07-2:12/500m", sat_a1_detail: "Z1-Z2 leggero. SPM 18-20. Nasale.",
  },
  5: {
    squat_note: "WEEK 5 — PEAK INTENSITY. Sonno 8h28 → readiness ALTA. Tempo 3030: 3s giù, 3s su. Volume ridotto a 4 set, intensità massima del ciclo. Obiettivo: avvicinare il massimale.",
    squat_warmup: "10-12 min. Vuoto x8 → 55% (60kg) x5 → 65% (71kg) x3 → 75% (82kg) x2 → 80% (88kg) x1. Ogni set in tempo 3030. Arriva già caldo ai set di lavoro.",
    squat_s1: ["Set 1 — 3 reps @85%", "94 kg. Tempo 3030. Rest 3:30 min. Primo set pesante del ciclo — concentrazione massima."],
    squat_s2: ["Set 2 — 2-3 reps @87.5%", "96 kg. Tempo 3030. Rest 3:30 min. 3 rep se Set 1 era solido, 2 se hai lottato."],
    squat_s3: ["Set 3 — 2 reps @90%", "99 kg. Tempo 3030. Rest 4:00 min. Questo è il vero test della settimana."],
    squat_s4: ["Set 4 — 1-2 reps @92.5% · PEAK", "102 kg. Tempo 3030. Solo se Set 3 perfetto. Avvicina il massimale. Rest 4:00 min."],
    du_skill: "5 min. WEEK 5: Every 30s x10 → max unbroken. Target: 20+ unbroken. Se rompi prima di 15, recupera 10s e riparte. Log PR del giorno.",
    hs_skill: "5 min. WEEK 5: HS walk attempts, 8-10 tentativi. Push per distanza massima. Passi corti e choppy, core stretto, glutei contratti, sguardo tra le mani. Target: 5+ metri. Log distanza migliore.",
    mon_cond_note: "Peak week: 3 round (non 4). La bici A/R Great Wave (~50 min, Z1-Z2) è già carico aerobico. Respirazione NASALE. Qualità > quantità.",
    mon_cond_name: "3 round for quality — Peak Week",
    mon_cond_detail: "400m Rower @2:00-2:05/500m (SPM 22-24) → 12 KB Swing @24kg → 8 Box Jump Overs @60cm → 1:00 rest. Nasale. Non andare in debito ossigeno.",
    sn_note: "WEEK 5 PEAK SNATCH — Target 75% = 45kg. Focus: velocità sotto il bilanciere e OHS stabile. Ogni kg si guadagna solo con tecnica pulita. Se il receive è instabile, non salire.",
    sn_w2: "2+1+1 @62% = 37kg. Rest 1:30.", sn_w3: "1+2+1 @67% = 40kg. Rest 1:30.", sn_w4: "1+1+1 @70% = 42kg. Rest 2:00.", sn_w5: "1+1+1 @73% = 44kg. Rest 2:00.",
    sn_w6: "1+1+1 @75% = 45kg. Solo se 44kg era pulito. Fermati se perdi l'OHS o il receive.",
    tue_gym_name: "4 round for quality — Peak Week",
    tue_gym_detail: "2 Wall Walks (lento, nose-to-wall) + 3-5 Strict Facing Wall HSPU (o kipping attempts se già solido a 5 strict) + 10-15m HS walk attempt (push per distanza massima). Rest 1:30 tra i round. 4 round — picco di volume ginnastica.",
    wed_end_note: "WEEK 5 — Commuta in bici (~50 min A/R, Z1-Z2) già integrata nel volume. Questa sessione: OPZIONE B (Sport Specific). Respirazione NASALE per tutta la durata. Se esci dalla nasale, rallenta.",
    bench_note: "WEEK 5 PEAK UPPER — Bench target 87.5% = 70kg, Press target 85% = 60kg. Tempo 3030 invariato. Volume ridotto, intensità massima del ciclo.",
    bench_warmup: "Vuoto x8 → 40kg x5 → 52kg x3 → 60kg x2 → 64kg x1. ~6 min. Primer @80% prima dei lavori.",
    bench_m1: ["Bench Set 1 — 4 reps @80%", "64 kg. Tempo 3030. Rest 2:30."],
    bench_m2: ["Bench Set 2 — 3 reps @82.5%", "66 kg. Tempo 3030. Rest 2:30."],
    bench_m3: ["Bench Set 3-4 — 2-3 reps @87.5% · PEAK", "70 kg. Tempo 3030. Rest 3:00. PEAK BENCH del ciclo — mantieni il tempo anche sotto fatica."],
    press_m4: ["Strict Press Set 1 — 4 @77.5%", "54 kg. Rest 2:30. Bracing attivo prima di ogni rep."],
    press_m5: ["Strict Press Set 2 — 3 @82.5%", "58 kg. Rest 2:30."],
    press_m6: ["Strict Press Set 3 — 2 @85% · PEAK", "60 kg. PEAK SET. Se esci pulito, log per prossimo ciclo: 62 kg."],
    thu_cond_detail: "15 Burpees Box Jump Overs @60cm + 20/15 cal Air Bike (RPM 65-75) + 30m Dual KB Farmer Carry @32kg. Target: 7-8 round — peak week, readiness alta. No scaling se la settimana ha filato. Scaling: box 50cm o KB 24kg solo se necessario.",
    cj_note: "WEEK 5 PEAK C&J — Target 82% = 57kg. Focus: velocità del catch, stabilità split jerk, ampiezza del jerk. L'ampiezza vale più del carico — non sacrificarla.",
    cj_w2: "2+1+1 @70% = 49kg. Rest 1:30.", cj_w3: "1+2+1 @75% = 52kg. Rest 1:30.", cj_w4: "1+1+1 @78% = 55kg. Rest 2:00.", cj_w5: "1+1+1 @80% = 56kg. Rest 2:00.",
    cj_w6: "1+1+1 @82% = 57kg. Solo se split jerk a 56kg era stabile. Rest as needed.",
    fri_cond_detail: "AMRAP per intervallo: 5 Dual DB Devil Press @22.5/15kg + 10 Dual DB Thruster @22.5/15kg + 5 Bar Muscle Ups (scala: 3 BMU o C2B x3) + 30 Double Unders. Riprendi da dove interrompi. Target: 2+ round per intervallo — peak week, push. Rest 2:30 tra intervalli: rispettalo.",
    sat_subtitle: "Test PR + Recovery", sat_note: "CHIUSURA WEEK 5 — Testa i PR di skill. RPE 7 sulle skill, RPE 4-5 sul resto. Poi recupero completo domenica prima del deload (Week 6).",
    sat_g1_name: "HS Walk — PR TEST", sat_g1_detail: "10-15 tentativi. Push per distanza massima. Rest 90s tra tentativi. Log miglior distanza del ciclo.",
    sat_g5_name: "DU — Max Unbroken PR TEST", sat_g5_detail: "3-5 tentativi max unbroken. Rest 2:00 tra tentativi. Log PR del ciclo — test finale delle 5 settimane.",
    sat_a1_name: "5000m Rower — Pace Check", sat_a1_detail: "@2:05-2:10/500m. Fine peak week: cuore adattato. Log split/500m medio e FC finale.",
  },
  6: {
    squat_note: "WEEK 6 — DELOAD. Volume e intensità ridotti. Obiettivo: recupero attivo. NON aggiungere set extra.",
    squat_warmup: "8-10 min. Vuoto x8 → 50% (55kg) x5 → 60% (66kg) x3. Ogni set in tempo 3030. Leggero.",
    squat_s1: ["Set 1 — 5 reps @65%", "72 kg. Tempo 3030. Rest 2:00 min. Leggero — focus sulla perfezione tecnica."],
    squat_s2: ["Set 2 — 4 reps @70%", "77 kg. Tempo 3030. Rest 2:00 min."],
    squat_s3: ["Set 3 — 3 reps @72%", "79 kg. Tempo 3030. Rest 2:00 min. Fine — non fare Set 4."],
    squat_s4: ["(Deload) Nessun Set 4", "Salta questo set. 3 set sono sufficienti nella settimana di deload."],
    du_skill: "5 min. Deload: EMOM 5min → 10 DU unbroken. Focus ritmo pulito, polsi rilassati. Niente PR attempt.",
    hs_skill: "5 min. Deload: Nose-to-wall hold 3×30s + shoulder taps leggeri. Niente HS walk attempts.",
    mon_cond_note: "DELOAD: 2-3 round al massimo. Nessuna intensità. Recupero attivo.",
    mon_cond_name: "2-3 round for quality — Deload",
    mon_cond_detail: "400m Rower @2:05-2:10/500m (SPM 20-22) → 10 KB Swing @20kg → 6 Box Step-overs @60cm → 1:30 rest. Movimento leggero.",
    sn_note: "DELOAD SNATCH — 3 set leggeri, focus tecnica. Nessun carico pesante. Mantieni il feeling del gesto.",
    sn_w2: "2+1+1 @50% = 30kg. Rest 1:30.", sn_w3: "1+2+1 @53% = 32kg", sn_w4: "1+1+1 @55% = 33kg. Fine — solo 3 set questa settimana.", sn_w5: "— (skip in deload)",
    sn_w6: "— (solo 3 set questa settimana)",
    tue_gym_name: "2-3 round for quality — Deload",
    tue_gym_detail: "2 Wall Walks leggeri + 3 Strict HSPU (non al massimo) + 5m HS walk attempt leggero. Rest 2:00. Deload: niente PR attempt.",
    wed_end_note: "DELOAD — Opzione A leggera. Pace più facile del solito. Obiettivo: circolazione e recupero, non performance.",
    bench_note: "WEEK 6 — DELOAD. Carico ridotto, volume ridotto. Recupero completo. Il prossimo ciclo inizierà con massimali più alti.",
    bench_warmup: "Vuoto x8 → 40kg x5 → 48kg x3. ~4 min. Leggero.",
    bench_m1: ["Bench Set 1 — 5 reps @65%", "52 kg. Tempo 3030. Rest 2:00. Leggero."],
    bench_m2: ["Bench Set 2 — 3 reps @70%", "56 kg. Tempo 3030. Rest 2:00. Fine bench."],
    bench_m3: ["(Deload) Nessun Set 3", "Non fare il 3° set. 2 set sono sufficienti."],
    press_m4: ["Strict Press Set 1 — 5 @65%", "46 kg. Rest 2:00."],
    press_m5: ["Strict Press Set 2 — 3 @70%", "49 kg. Rest 2:00. Fine press."],
    press_m6: ["(Deload) Nessun Set 3", "Non fare il 3° set. 2 set sufficienti."],
    thu_cond_detail: "15 Burpees Box Jump Overs @60cm + 20/15 cal Air Bike (RPM 60-70) + 30m Dual KB Farmer Carry @24kg. Target: 4-5 round. Deload: scala automaticamente a KB 24kg.",
    cj_note: "DELOAD C&J — 3 set leggeri. Obiettivo: mantenere il feeling del gesto, non il carico.",
    cj_w2: "2+1+1 @58% = 40kg", cj_w3: "1+2+1 @62% = 43kg", cj_w4: "1+1+1 @65% = 45kg. Fine — solo 3 set questa settimana.", cj_w5: "— (skip in deload)",
    cj_w6: "— (solo 3 set questa settimana)",
    fri_cond_detail: "AMRAP per intervallo: 5 DB Devil Press @15kg + 8 DB Thruster @15kg + 3 Kipping Pull Ups (o Ring Rows) + 20 Single Unders. Target: 1-2 round. Deload: tutto scalato.",
    sat_subtitle: "Recovery Completo", sat_note: "FINE CICLO — Settimana 6 è deload totale. Solo rilascio miofasciale e aerobico leggero. Niente test, niente PR. Preparati per il prossimo ciclo con massimali più alti.",
    sat_g1_name: "HS hold leggero", sat_g1_detail: "5 tentativi. Solo freestanding hold — niente walk. Qualità e calma.",
    sat_g5_name: "DU leggeri", sat_g5_detail: "3 min. 10-15 rep al ritmo, niente max attempt. Deload.",
    sat_a1_name: "5000m Rower @2:13-2:18/500m", sat_a1_detail: "Z1 puro. SPM 16-18. Nasale. Ultima sessione del ciclo — goditi il recupero.",
  },
};

// ============ PROGRAM DATA (week-parametric) ============
const getDays = (week) => {
  const wd = WD[week] || WD[1];
  return [
    {
      id: "mon", label: "LUN", title: "Strength Lower", subtitle: "Squat + Conditioning", totalTime: "~103 min",
      blocks: [
        { id: "ril", name: "RILASCIO MIOFASCIALE", tag: "#1 Core / Resp / Flex Toracica", duration: "~35 min", color: COLORS.rilascio, note: "Alterna versione strutturata e Follow Along ogni settimana",
          exercises: [
            { id:"r1", name:"Respirazioni passive diaframmatiche prona", detail:"2 min in posizione prona. Respira lento, lascia il diaframma espandersi verso il pavimento." },
            { id:"r2", name:"Respirazioni attive mani intorno al busto", detail:"x10 ripetizioni. Mantieni piedi sollevati. Senti espansione postero-laterale del torace." },
            { id:"r3", name:"Rilascio miofasciale sit bone", detail:"2 min con pallina sotto l'ischio. Fermati sul punto dolente, respira finché non si calma." },
            { id:"r4", name:"Rilascio miofasciale schiena", detail:"2 min con pallina al muro lungo gli erettori spinali e la zona sacro-iliaca." },
            { id:"r5", name:"SS-A (2 round) — Protrazione scapolare: flex/ext collo", detail:"x10 movimenti completi. Vedi video esplicativo Gius. Protrai le scapole, poi fletti ed estendi il collo controllato.", loggable:true, logFields:["note"] },
            { id:"r6", name:"SS-A — Plank cervicale lunghezza", detail:"1-2 min sotto tensione. TEST: segna il tempo. Obiettivo: aumentare ogni settimana.", loggable:true, logFields:["tempo"] },
            { id:"r7", name:"SS-B (2 round) — Estensione toracica prona CON foam roller", detail:"Segui video. Foam roller sotto il torace, estendi lentamente vertebra per vertebra." },
            { id:"r8", name:"SS-B — T position protrazione scapolare + sollevamento mani", detail:"Segui video. Inserisci sollevamento mani a fine protrazione. Focus gran dentato." },
            { id:"r9", name:"SS-B — T position plank cervicale inverso", detail:"Segui video. Mantieni la posizione, collo lungo, attiva la catena posteriore cervicale." },
            { id:"r10", name:"SS-B — Estensione toracica prona SENZA foam roller", detail:"Segui video. Stessa cosa ma senza supporto — richiede più controllo attivo." },
            { id:"r11", name:"SS-B — Rilascio miofasciale schiena", detail:"1 min tra i round. Pallina al muro sugli erettori." },
            { id:"r12", name:"SS-C (2 round) — Apnea", detail:"Fino a sfinimento. Fermati quando l'addome brucia. Non forzare, ascolta il corpo.", loggable:true, logFields:["tempo"] },
            { id:"r13", name:"SS-C — Flow cat: espansione dorso + lunghezza collo", detail:"1-2 min sotto tensione. TEST: vedi Video Didattici nel portale. Espandi il dorso in flessione, allunga il collo.", loggable:true, logFields:["tempo"] },
          ]
        },
        { id: "skill", name: "SKILL", tag: "DU + HS Walk", duration: "10 min", color: COLORS.skill,
          exercises: [
            { id:"s1", name:"Double Unders — drill progressivo", detail: wd.du_skill, loggable:true, logFields:["reps","note"] },
            { id:"s2", name:"Handstand Walk — progressione", detail: wd.hs_skill, loggable:true, logFields:["distanza","note"] },
          ]
        },
        { id: "str", name: "STRENGTH", tag: "Tempo Back Squat — 3030", duration: "~28 min (warm-up incluso)", color: COLORS.strength, note: wd.squat_note,
          exercises: [
            { id:"m0", name:"Warm-up bilanciere", detail: wd.squat_warmup },
            { id:"m1", name: wd.squat_s1[0], detail: wd.squat_s1[1], loggable:true, logFields:["peso","reps","note"] },
            { id:"m2", name: wd.squat_s2[0], detail: wd.squat_s2[1], loggable:true, logFields:["peso","reps","note"] },
            { id:"m3", name: wd.squat_s3[0], detail: wd.squat_s3[1], loggable:true, logFields:["peso","reps","note"] },
            { id:"m4", name: wd.squat_s4[0], detail: wd.squat_s4[1], loggable:true, logFields:["peso","reps","note"] },
          ]
        },
        { id: "cond", name: "CONDITIONING", tag: "Z2 Mixed Modal", duration: "~18 min", color: COLORS.conditioning, note: wd.mon_cond_note,
          exercises: [
            { id:"c1", name: wd.mon_cond_name, detail: wd.mon_cond_detail, loggable:true, logFields:["round","note"] },
          ]
        },
        { id: "fs", name: "FUNCTIONAL STRENGTH", tag: "Squat + Estensione Anca", duration: "~12 min", color: COLORS.fs, note: "Scegli 2-3 esercizi dalla lista. Ruota nelle settimane. Respirazione ATTIVA postero-laterale.",
          exercises: [
            { id:"fs1", name:"Split Squat", detail:"3x8/gamba. Carico moderato, focus postura e profondità. Video: split squat.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs2", name:"Squat Bulgarian", detail:"2x10/gamba. Solo BW o KB leggero. Video: squat bulgarian.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs3", name:"Squat Kettlebell", detail:"3x10. Focus baricentro e attivazione glutei. Video: squat kettlebell.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs4", name:"Squat Trapbar", detail:"3x6. Carico moderato, focus posizione. Video: squat trapbar.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs5", name:"Squat con Banda Elastica", detail:"2x12. Attivazione laterale. Video: squat con banda elastica.mp4", loggable:true, logFields:["reps"] },
            { id:"fs6", name:"Squat Baricentro Corporeo", detail:"2x8. Drill posturale. Video: squat baricentro corporeo.mp4", loggable:true, logFields:["reps"] },
            { id:"fs7", name:"Glute Bridge Loop Band", detail:"2x15. Isometria 3s in alto. Video: glute bridge loop band.mp4", loggable:true, logFields:["reps"] },
            { id:"fs8", name:"Glute Bridge Loop Band Isometria", detail:"3x30s hold. Max contrazione glutei. Video: glute bridge loop band isometria.mp4", loggable:true, logFields:["tempo"] },
          ]
        },
      ]
    },
    {
      id: "tue", label: "MAR", title: "Weightlifting", subtitle: "Snatch + Gymnastics", totalTime: "~108 min",
      blocks: [
        { id:"ril", name:"RILASCIO MIOFASCIALE", tag:"#2 Anca 3D", duration:"~30 min", color:COLORS.rilascio,
          exercises: [
            { id:"r1", name:"Respirazioni passive diaframmatiche prona", detail:"2 min. Posizione prona." },
            { id:"r2", name:"Respirazioni attive mani intorno al busto", detail:"x10. Mantieni piedi sollevati." },
            { id:"r3", name:"Rotazioni articolari controllate anca (decubito laterale)", detail:"x3 per lato. Lente e controllate, cerchi ampi." },
            { id:"r4", name:"SS-A (2 round) — Rilascio miofasciale quad + IT band", detail:"1-2 min per lato. Foam roller o pallina." },
            { id:"r5", name:"SS-A — Reverse glute bridge", detail:"8-10 reps. TEST: tensiona al massimo l'upper back.", loggable:true, logFields:["reps"] },
            { id:"r6", name:"SS-A — Hamstring stretch", detail:"8-10 reps per gamba. TEST.", loggable:true, logFields:["reps"] },
            { id:"r7", name:"SS-A — Glute bridge", detail:"8-10 reps. Squeeze massimo in alto." },
            { id:"r8", name:"SS-A — Glute bridge isometria con protrazione", detail:"Fino a sfinimento. TEST.", loggable:true, logFields:["tempo"] },
            { id:"r9", name:"SS-B (1 round) — Rotazione anca kneeling isometria", detail:"1:30 per lato. Mantieni posizione e respira." },
            { id:"r10", name:"SS-B — Rotazione anca kneeling dinamico", detail:"1 min per lato. Sfinisci i glutei." },
            { id:"r11", name:"SS-B — Flessione laterale kneeling isometria", detail:"1:30 per lato. TEST.", loggable:true, logFields:["tempo"] },
            { id:"r12", name:"SS-B — Flessione laterale kneeling dinamico", detail:"1 min per lato. TEST.", loggable:true, logFields:["reps"] },
            { id:"r13", name:"SS-C (2 round) — Estensione anca in half kneeling", detail:"~4 min segui video con Andrea. Entrambi i lati." },
            { id:"r14", name:"TEST FINALE: Split Squat wide stance isometria", detail:"1 serie per gamba. Segna il tempo.", loggable:true, logFields:["tempo"] },
          ]
        },
        { id:"skill", name:"SKILL", tag:"DU + HSPU kipping", duration:"10 min", color:COLORS.skill,
          exercises: [
            { id:"s1", name:"Double Unders drill", detail: wd.du_skill, loggable:true, logFields:["reps","note"] },
            { id:"s2", name:"HSPU kipping practice", detail:"5 min. Hai 5 strict — ora costruisci il kip. Focus: kick-up, tocca testa a terra, kip esplosivo. 5-8 tentativi singoli poi prova set di 2-3.", loggable:true, logFields:["reps","note"] },
          ]
        },
        { id:"wl", name:"WEIGHTLIFTING", tag:"Snatch Complex", duration:"~43 min (warm-up incluso)", color:COLORS.weightlifting, note: wd.sn_note,
          exercises: [
            { id:"w0", name:"Warm-up bilanciere vuoto — 2 round", detail:"3 Snatch grip push press + 3 Snatch balance half squat + 3 OHS + 3 Shoulder pull + 3 Hang high pull + 3 Low hang power snatch. ~8 min." },
            { id:"w1", name:"Complex A: SN DL + Hang SQ SN + OHS + SN Balance", detail:"1+1+1+1 dal 40% al 55% 1RM SN (24-33kg) x 5 set progressivi. Rest 1:30-2:00. ~15 min." },
            { id:"w2", name:"Complex B Set 1 — SQ SN + Hang SQ SN + OHS", detail: wd.sn_w2, loggable:true, logFields:["peso","note"] },
            { id:"w3", name:"Complex B Set 2", detail: wd.sn_w3, loggable:true, logFields:["peso","note"] },
            { id:"w4", name:"Complex B Set 3", detail: wd.sn_w4, loggable:true, logFields:["peso","note"] },
            { id:"w5", name:"Complex B Set 4", detail: wd.sn_w5, loggable:true, logFields:["peso","note"] },
            { id:"w6", name:"Complex B Set 5", detail: wd.sn_w6, loggable:true, logFields:["peso","note"] },
          ]
        },
        { id:"gym", name:"GYMNASTICS", tag:"HS + HSPU skill", duration:"~15 min", color:COLORS.gymnastics,
          exercises: [
            { id:"g1", name: wd.tue_gym_name, detail: wd.tue_gym_detail, loggable:true, logFields:["reps","note"] },
          ]
        },
        { id:"fs", name:"FUNCTIONAL STRENGTH", tag:"Hinge", duration:"~10 min", color:COLORS.fs, note:"Transfer per il pull dello snatch + posterior chain.",
          exercises: [
            { id:"fs1", name:"Stacco Trapbar", detail:"3x6 @RPE 7. Focus breath bracing e posizione schiena. Video: stacco trapbar.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs2", name:"Trapbar Row", detail:"3x10 leggero. Squeeza le scapole in alto per 1s. Video: trapbar row.mp4", loggable:true, logFields:["peso","reps"] },
          ]
        },
      ]
    },
    {
      id: "wed", label: "MER", title: "Endurance", subtitle: "Aerobic Dev + Core", totalTime: "~95 min",
      blocks: [
        { id:"ril", name:"RILASCIO MIOFASCIALE", tag:"#3 Piedi e Flessione Anca", duration:"~25 min", color:COLORS.rilascio,
          exercises: [
            { id:"r1", name:"Circuito tibiali / fascia plantare", detail:"~6 min. Segui video guidato." },
            { id:"r2", name:"SS-A (1 round) — Oscillazioni sull'ischio (focus avanti)", detail:"2 min. Mantieni 3-4 respirazioni attive per oscillazione." },
            { id:"r3", name:"SS-A — Squat isometrico", detail:"1 min. Esegui di fila per sentire glutei a fuoco.", loggable:true, logFields:["tempo"] },
            { id:"r4", name:"SS-A — Rilascio miofasciale sit bone o medio gluteo", detail:"1 min per lato." },
            { id:"r5", name:"SS-B (1 round) — Oscillazioni sull'ischio", detail:"2 min. Stesse indicazioni di sopra." },
            { id:"r6", name:"SS-B — Squat isometrico", detail:"1 min. TEST.", loggable:true, logFields:["tempo"] },
            { id:"r7", name:"SS-B — Forward plank", detail:"Fino a sfinimento. TEST.", loggable:true, logFields:["tempo"] },
            { id:"r8", name:"SS-B — Rilascio miofasciale medio gluteo", detail:"1 min per lato." },
            { id:"r9", name:"SS-C (2 round) — Oscillazioni sull'ischio focus pavimento pelvico", detail:"2 min." },
            { id:"r10", name:"SS-C — Squat isometrico", detail:"1 min. TEST.", loggable:true, logFields:["tempo"] },
            { id:"r11", name:"TEST FINALE: Forward Plank", detail:"1 serie max. Segna il tempo.", loggable:true, logFields:["tempo"] },
          ]
        },
        { id:"skill", name:"SKILL", tag:"DU + HS Walk", duration:"10 min", color:COLORS.skill,
          exercises: [
            { id:"s1", name:"Double Unders drill", detail: wd.du_skill, loggable:true, logFields:["reps"] },
            { id:"s2", name:"HS Walk progression", detail: wd.hs_skill, loggable:true, logFields:["distanza"] },
          ]
        },
        { id:"end", name:"ENDURANCE", tag:"Aerobic Development @Z2", duration:"~38 min", color:COLORS.endurance, note: wd.wed_end_note,
          exercises: [
            { id:"e1", name:"OPZIONE A — Tri-Modal descending", detail:"Set 1: 50 cal Bike Erg (damper 2-3) + 800m Rower @2:00-2:05/500m + 25 cal AirBike → 1:00 rest. Set 2: 40 cal Bike + 600m Row + 20 cal AirBike → 1:00 rest. Set 3: 30 cal Bike + 400m Row + 15 cal AirBike → 2:00 rest. Totale ~35 min.", loggable:true, logFields:["note"] },
            { id:"e2", name:"OPZIONE B — Sport Specific AMRAP 35 min", detail:"35:00 AMRAP @Z2/RPE 6: 500m SkiErg (2:10-2:15/500m, nasale) + 20 KB Swing @24kg + 400m Run (corsa facile, nasale) + 20 GHD Sit-ups + 10 Empty Barbell Bradford Press → 1:00 rest. Target: 4+ round. Log round e avg HR.", loggable:true, logFields:["round","note"] },
          ]
        },
        { id:"fs", name:"FUNCTIONAL STRENGTH", tag:"Core + Piano Frontale", duration:"~12 min", color:COLORS.fs,
          exercises: [
            { id:"fs1", name:"Crunch su Panca", detail:"3x12. Segui tecnica video. Video: crunch su panca.mp4", loggable:true, logFields:["reps"] },
            { id:"fs2", name:"Spinte Orizzontali ai Cavi", detail:"3x10/lato. Anti-rotazione, core stabile. Video: spinte orizzontali ai cavi.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs3", name:"Lateral Steps Kettlebell", detail:"2x10/lato. Piano frontale, stabilità anca. Video: lateral steps kettlebell.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs4", name:"Lateral Steps Loop Band", detail:"2x12/lato. Alternativa leggera. Video: lateral steps loop band.mp4", loggable:true, logFields:["reps"] },
            { id:"fs5", name:"Quadrato dei Lombi Hold", detail:"2x30s/lato. Isometria laterale. Video: quadrato dei lombi hold.mp4", loggable:true, logFields:["tempo"] },
          ]
        },
      ]
    },
    {
      id: "thu", label: "GIO", title: "Strength Upper", subtitle: "Bench + Press + Conditioning", totalTime: "~105 min",
      blocks: [
        { id:"ril", name:"RILASCIO MIOFASCIALE", tag:"#4 Stabilità Laterale", duration:"~30 min", color:COLORS.rilascio, note:"Alterna versione strutturata e Follow Along Abd/Add ogni settimana.",
          exercises: [
            { id:"r1", name:"90/90 con yoga block sotto gluteo", detail:"1:30-2 min per lato. Solo respirazioni lente e controllate." },
            { id:"r2", name:"TEST INIZIALE: Flow puppy pose", detail:"1 serie. TEST: segna il risultato.", loggable:true, logFields:["note"] },
            { id:"r3", name:"SS-A (2 round) — Plank laterale adduttore ripetizioni", detail:"x6 reps." },
            { id:"r4", name:"SS-A — Plank laterale adduttore isometria", detail:"1:30-2 min sotto tensione. Obiettivo.", loggable:true, logFields:["tempo"] },
            { id:"r5", name:"SS-B (2 round) — Plank laterale medio gluteo ripetizioni", detail:"x6. TEST.", loggable:true, logFields:["reps"] },
            { id:"r6", name:"SS-B — Plank laterale medio gluteo isometria", detail:"1:30-2 min sotto tensione. TEST.", loggable:true, logFields:["tempo"] },
            { id:"r7", name:"SS-C (2 serie) — Standing lateral hip dinamico", detail:"Segui video. TEST.", loggable:true, logFields:["reps"] },
            { id:"r8", name:"SS-C — Glute bridge isometria + add/abd ginocchio", detail:"Max reps. Glutei distanti dal pavimento, core attivo. TEST.", loggable:true, logFields:["reps"] },
            { id:"r9", name:"TEST FINALE: Flow puppy pose", detail:"1 serie. Confronta con test iniziale.", loggable:true, logFields:["note"] },
          ]
        },
        { id:"skill", name:"SKILL", tag:"DU + HSPU / HS hold", duration:"10 min", color:COLORS.skill,
          exercises: [
            { id:"s1", name:"Double Unders drill", detail: wd.du_skill, loggable:true, logFields:["reps"] },
            { id:"s2", name:"HSPU kipping o freestanding HS hold", detail:"5 min. Alterna: settimane dispari HSPU kipping attempts, settimane pari freestanding HS hold (kick-up dal muro, mantieni max sec, 6-8 tentativi).", loggable:true, logFields:["reps","note"] },
          ]
        },
        { id:"str", name:"STRENGTH", tag:"Tempo Bench + Strict Press", duration:"~30 min", color:COLORS.strength, note: wd.bench_note,
          exercises: [
            { id:"m0", name:"Warm-up bench", detail: wd.bench_warmup },
            { id:"m1", name: wd.bench_m1[0], detail: wd.bench_m1[1], loggable:true, logFields:["peso","reps"] },
            { id:"m2", name: wd.bench_m2[0], detail: wd.bench_m2[1], loggable:true, logFields:["peso","reps"] },
            { id:"m3", name: wd.bench_m3[0], detail: wd.bench_m3[1], loggable:true, logFields:["peso","reps"] },
            { id:"m4", name: wd.press_m4[0], detail: wd.press_m4[1], loggable:true, logFields:["peso","reps"] },
            { id:"m5", name: wd.press_m5[0], detail: wd.press_m5[1], loggable:true, logFields:["peso","reps"] },
            { id:"m6", name: wd.press_m6[0], detail: wd.press_m6[1], loggable:true, logFields:["peso","reps"] },
          ]
        },
        { id:"cond", name:"CONDITIONING", tag:"21 min AMRAP", duration:"~21 min", color:COLORS.conditioning,
          exercises: [
            { id:"c1", name:"21:00 AMRAP", detail: wd.thu_cond_detail, loggable:true, logFields:["round","note"] },
          ]
        },
        { id:"fs", name:"FUNCTIONAL STRENGTH", tag:"Spinta + Deltoidi", duration:"~12 min", color:COLORS.fs,
          exercises: [
            { id:"fs1", name:"Viking Press", detail:"3x8. Transfer per push press/jerk. Video: viking press.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs2", name:"Viking Press Braccio Singolo", detail:"2x8/lato. Stabilità unilaterale. Video: viking press braccio singolo.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs3", name:"Pullover Manubrio", detail:"2x10. Apertura toracica + gran dorsale. Video: pullover manubrio.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs4", name:"Push Up Protrazione Scapolare", detail:"2x10. Focus protrazione a fine push up. Video: push up protrazione scapolare.mp4", loggable:true, logFields:["reps"] },
            { id:"fs5", name:"Push Up Protrazione e Retrazione Scapolare", detail:"2x8. Ciclo completo protrazione-retrazione. Video: push up protrazione e retrazione scapolare.mp4", loggable:true, logFields:["reps"] },
            { id:"fs6", name:"Spinta Orizzontale su Panca", detail:"3x10. Video: spinta orizzontale su panca.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs7", name:"Alzate Laterali con Manubri", detail:"2x15 leggero. Video: alzate laterali con manubri.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs8", name:"Alzate Laterali Singole al Cavo", detail:"2x12/lato. Video: alzate laterali singole al cavo.mp4", loggable:true, logFields:["peso","reps"] },
          ]
        },
      ]
    },
    {
      id: "fri", label: "VEN", title: "Weightlifting", subtitle: "C&J + Conditioning", totalTime: "~108 min",
      blocks: [
        { id:"ril", name:"RILASCIO MIOFASCIALE", tag:"#5 Piedi / Tibiali", duration:"~20 min", color:COLORS.rilascio, note:"Alternativa: Follow Along 'Ginocchia, caviglia, fascia plantare' ~30 min",
          exercises: [
            { id:"r1", name:"Inversione/eversione caviglia al muro", detail:"Segui video. Lenta e controllata, tibiali duri e attivi." },
            { id:"r2", name:"Circuito tibiali / fascia plantare", detail:"Segui video completo." },
            { id:"r3", name:"Flessione plantare (sottomodulo gamba & piede)", detail:"Segui video." },
            { id:"r4", name:"Pails & Rails — rotazione esterna tibia", detail:"Segui video. Contrai in isometria 20-30s poi muovi nella nuova ampiezza." },
            { id:"r5", name:"Pails & Rails — rotazione interna tibia", detail:"Segui video. Stessa logica: isometria poi mobilità attiva." },
          ]
        },
        { id:"skill", name:"SKILL", tag:"DU + HS Walk", duration:"10 min", color:COLORS.skill,
          exercises: [
            { id:"s1", name:"Double Unders drill", detail: wd.du_skill, loggable:true, logFields:["reps"] },
            { id:"s2", name:"HS Walk progression", detail: wd.hs_skill, loggable:true, logFields:["distanza"] },
          ]
        },
        { id:"wl", name:"WEIGHTLIFTING", tag:"C&J Complex", duration:"~40 min", color:COLORS.weightlifting, note: wd.cj_note,
          exercises: [
            { id:"w0", name:"Warm-up bilanciere vuoto — 2 round", detail:"3 Push press in split (o push press) + 3 Split jerk / power jerk + 3 Hang shoulder pull + 3 Hang high pull + 3 Low hang squat clean. ~8 min." },
            { id:"w1", name:"Complex A: Clean Pull + Hang SQ Clean + Front SQ + Push Jerk", detail:"1+1+1+1 dal 40% al 60% 1RM PWCL+PJ (28-42kg) x 5 set. Rest 1:30-2:00. ~15 min." },
            { id:"w2", name:"Complex B Set 1 — PC + PJ + Split Jerk", detail: wd.cj_w2, loggable:true, logFields:["peso","note"] },
            { id:"w3", name:"Complex B Set 2", detail: wd.cj_w3, loggable:true, logFields:["peso","note"] },
            { id:"w4", name:"Complex B Set 3", detail: wd.cj_w4, loggable:true, logFields:["peso","note"] },
            { id:"w5", name:"Complex B Set 4", detail: wd.cj_w5, loggable:true, logFields:["peso","note"] },
            { id:"w6", name:"Complex B Set 5", detail: wd.cj_w6, loggable:true, logFields:["peso","note"] },
          ]
        },
        { id:"cond", name:"CONDITIONING", tag:"5:00 on / 2:30 off", duration:"~23 min", color:COLORS.conditioning,
          exercises: [
            { id:"c1", name:"3 interval: 5:00 on / 2:30 off", detail: wd.fri_cond_detail, loggable:true, logFields:["round","note"] },
          ]
        },
        { id:"fs", name:"FUNCTIONAL STRENGTH", tag:"Trazione + Braccia", duration:"~12 min", color:COLORS.fs,
          exercises: [
            { id:"fs1", name:"Rematore Flow", detail:"3x10. Segui tecnica video. Video: rematore flow.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs2", name:"Rematore Flow Singolo Braccio", detail:"2x10/lato. Anti-rotazione. Video: rematore flow singolo braccio.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs3", name:"Trazione Orizzontale Singola Half Kneeling", detail:"2x10/lato. Video: trazione orizzontale singola half kneeling.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs4", name:"Trazione Orizzontale Singola", detail:"2x10/lato. Video: trazione orizzontale singola.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs5", name:"Trazione Orizzontale su Panca Inclinata", detail:"3x10. Video: trazione orizzontale su panca inclinata.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs6", name:"Trazione Verticale Lat Machine", detail:"3x10. Video: trazione verticale lat machine.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs7", name:"Trazione Verticale Singola Half Kneeling", detail:"2x10/lato. Video: trazione verticale singola half kneeling.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs8", name:"Flow French Press Manubri", detail:"2x12. Tricipiti, transfer per push/jerk. Video: flow french press manubri.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs9", name:"Bicipite Braccio Singolo", detail:"2x10/lato. Prevenzione, leggero. Video: bicipite braccio singolo.mp4", loggable:true, logFields:["peso","reps"] },
            { id:"fs10", name:"Tricipiti Push Down Cavo Alto", detail:"2x12. Video: tricipiti push down cavo alto.mp4", loggable:true, logFields:["peso","reps"] },
          ]
        },
      ]
    },
    {
      id: "sat", label: "SAB", title: week === 6 ? "Recovery Completo" : week === 5 ? "Test + Recovery" : "Recovery", subtitle: wd.sat_subtitle, totalTime: "~65 min", note: wd.sat_note,
      blocks: [
        { id:"ril", name:"RILASCIO MIOFASCIALE", tag:"Mini Routine", duration:"~25 min", color:COLORS.rilascio,
          exercises: [
            { id:"r1", name:"Rilascio miofasciale zone a scelta", detail:"5-15 min in base al tempo. Trapezi, erettori, medio gluteo, adduttori, ischio, cosce." },
            { id:"r2", name:"Respirazione & Core supina: 4 esercizi passivi + attivi", detail:"10-15 min. Diaframmatiche + attive postero-laterali." },
            { id:"r3", name:"Rotazioni articolari controllate", detail:"5-10 min. Tutte le articolazioni, movimenti lenti e ampi." },
          ]
        },
        { id:"gym", name:"GYMNASTICS", tag:"Practice libera", duration:"~20 min", color:COLORS.gymnastics, note:"Lavoro for quality, niente clock. Scegli 2-3:",
          exercises: [
            { id:"g1", name: wd.sat_g1_name, detail: wd.sat_g1_detail, loggable:true, logFields:["distanza","note"] },
            { id:"g2", name:"Ring Muscle Up tecnica", detail:"5x2-3 reps. Focus kip efficiente e transizione.", loggable:true, logFields:["reps"] },
            { id:"g3", name:"L-Sit hold", detail:"Accumula 1 min totale. Anche in set da 10-15s.", loggable:true, logFields:["tempo"] },
            { id:"g4", name:"Rope Climb legless", detail:"3 salite. Se non hai il legless, fai normali ma lento.", loggable:true, logFields:["reps"] },
            { id:"g5", name: wd.sat_g5_name, detail: wd.sat_g5_detail, loggable:true, logFields:["reps"] },
          ]
        },
        { id:"aer", name:"ENDURANCE", tag:"Recovery Z1", duration:"~20 min", color:COLORS.endurance, note:"Scegli UNA opzione. Tutto nasale, RPE 5 max.",
          exercises: [
            { id:"a1", name: wd.sat_a1_name, detail: wd.sat_a1_detail },
            { id:"a2", name:"30 min AirBike @12-15 cal/min", detail:"Z1. RPM 50-55. Nasale." },
            { id:"a3", name:"20 min nuoto a mare", detail:"Crawl facile. Quando disponibile (più in là nella stagione)." },
          ]
        },
      ]
    },
  ];
};

// ============ COMPONENTS ============
function ExRow({ ex, week, dayId }) {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState({});
  const [saved, setSaved] = useState(false);
  const k = `log:w${week}:${dayId}:${ex.id}`;
  const hasLog = Object.values(log).some(v => v && v !== "");

  useEffect(() => { (async()=>{ try { const r = await window.storage.get(k); if(r?.value) setLog(JSON.parse(r.value)); } catch{} })(); }, [k]);
  const save = async()=>{ try { await window.storage.set(k, JSON.stringify(log)); setSaved(true); setTimeout(()=>setSaved(false),1500); } catch{} };

  return (
    <div style={{ borderBottom:"1px solid #1a1a2a", padding:"10px 0" }}>
      <div onClick={()=>ex.loggable && setOpen(!open)} style={{ display:"flex", gap:8, cursor:ex.loggable?"pointer":"default", alignItems:"flex-start" }}>
        <span style={{ minWidth:18, marginTop:2, fontSize:14, color: hasLog ? G : ex.loggable ? "#444" : "#2a2a3a" }}>
          {hasLog ? "✓" : ex.loggable ? "○" : "·"}
        </span>
        <div style={{ flex:1 }}>
          <div style={{ color:TEXT, fontSize:13, fontWeight:600, fontFamily:"'Fira Code',monospace", lineHeight:1.4 }}>{ex.name}</div>
          <div style={{ color:"#999", fontSize:11.5, marginTop:3, lineHeight:1.5, fontFamily:"system-ui,sans-serif" }}>{ex.detail}</div>
        </div>
        {ex.loggable && <span style={{ color:"#444", fontSize:11, marginTop:4 }}>{open?"▲":"▼"}</span>}
      </div>
      {open && ex.loggable && (
        <div style={{ marginTop:8, marginLeft:26, display:"flex", flexDirection:"column", gap:6 }}>
          {(ex.logFields||[]).map(f=>(
            <div key={f} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <label style={{ color:"#666", fontSize:11, minWidth:55, textTransform:"capitalize", fontFamily:"system-ui" }}>{f}</label>
              <input type="text" value={log[f]||""} onChange={e=>setLog(p=>({...p,[f]:e.target.value}))} placeholder="—"
                style={{ flex:1, background:"#0d0d1a", border:"1px solid #2a2a3a", borderRadius:6, color:TEXT, padding:"7px 10px", fontSize:13, fontFamily:"'Fira Code',monospace", outline:"none", maxWidth:150 }}
              />
            </div>
          ))}
          <button onClick={save} style={{ background:saved?G:"#1a1a2e", border:`1px solid ${saved?G:G}`, borderRadius:6, color:saved?"#fff":G, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer", alignSelf:"flex-start", transition:"all 0.2s", fontFamily:"system-ui" }}>
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
    <div style={{ background:CARD, borderRadius:10, marginBottom:8, border:`1px solid ${open ? block.color+"55" : BORDER}`, transition:"border-color 0.2s" }}>
      <div onClick={()=>setOpen(!open)} style={{ display:"flex", alignItems:"center", padding:"12px 14px", cursor:"pointer", gap:10 }}>
        <div style={{ width:3, height:32, borderRadius:2, background:block.color, flexShrink:0 }}/>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, fontWeight:800, letterSpacing:1.2, color:TEXT, fontFamily:"'Fira Code',monospace" }}>{block.name}</div>
          <div style={{ fontSize:11, color:"#888", marginTop:1, fontFamily:"system-ui" }}>{block.tag} — <span style={{color:G}}>{block.duration}</span></div>
        </div>
        <span style={{ color:"#444", fontSize:12, transition:"transform 0.2s", transform:open?"rotate(180deg)":"none" }}>▼</span>
      </div>
      {open && (
        <div style={{ padding:"0 14px 12px" }}>
          {block.note && <div style={{ fontSize:11, color:G, marginBottom:8, padding:"6px 8px", background:"#0d1a14", borderRadius:6, lineHeight:1.5, fontFamily:"system-ui" }}>{block.note}</div>}
          {block.exercises.map(ex => <ExRow key={ex.id} ex={ex} week={week} dayId={dayId} />)}
        </div>
      )}
    </div>
  );
}

// ============ MAIN ============
export default function App() {
  const todayDow = new Date().getDay();
  const dayMap = {0:5,1:0,2:1,3:2,4:3,5:4,6:5};
  const [sel, setSel] = useState(dayMap[todayDow]||0);
  const [week, setWeek] = useState(1);
  const days = getDays(week);
  const day = days[sel];
  const weekLabels = { 1:"FONDAMENTA", 2:"COSTRUZIONE", 3:"INTENSITÀ", 4:"CONSOLIDAMENTO", 5:"PEAK", 6:"DELOAD" };

  return (
    <div style={{ minHeight:"100vh", background:DARK, color:TEXT, fontFamily:"system-ui,-apple-system,sans-serif", maxWidth:480, margin:"0 auto" }}>
      {/* HEADER */}
      <div style={{ padding:"16px 14px 6px", borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ fontSize:10, color:G, fontWeight:700, letterSpacing:2.5, fontFamily:"'Fira Code',monospace" }}>FASE 1 — {weekLabels[week] || "FOUNDATION"}</div>
        {/* Week selector */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, padding:"10px 0" }}>
          <button onClick={()=>setWeek(w=>Math.max(1,w-1))} disabled={week===1} style={{ background:"none", border:`1px solid ${BORDER}`, borderRadius:6, color:week===1?"#333":"#888", padding:"5px 12px", cursor:week===1?"default":"pointer", fontSize:15 }}>←</button>
          <span style={{ color:TEXT, fontSize:14, fontWeight:700, fontFamily:"'Fira Code',monospace", minWidth:90, textAlign:"center" }}>WEEK {week}/6</span>
          <button onClick={()=>setWeek(w=>Math.min(6,w+1))} disabled={week===6} style={{ background:"none", border:`1px solid ${BORDER}`, borderRadius:6, color:week===6?"#333":"#888", padding:"5px 12px", cursor:week===6?"default":"pointer", fontSize:15 }}>→</button>
        </div>
        {/* Day picker */}
        <div style={{ display:"flex", gap:3, justifyContent:"center", paddingBottom:8 }}>
          {days.map((d,i)=>(
            <button key={d.id} onClick={()=>setSel(i)} style={{
              background:i===sel?G:"#111120", border:i===sel?`1px solid ${G}`:`1px solid #1e1e30`,
              borderRadius:8, padding:"7px 0", width:46, color:i===sel?"#fff":"#777",
              fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Fira Code',monospace", transition:"all 0.15s"
            }}>{d.label}</button>
          ))}
        </div>
      </div>
      {/* DAY HEADER */}
      <div style={{ padding:"14px 14px 6px", display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <div style={{ fontSize:18, fontWeight:800, fontFamily:"'Fira Code',monospace" }}>{day.title}</div>
          <div style={{ fontSize:12, color:"#777", marginTop:2 }}>{day.subtitle}</div>
        </div>
        <div style={{ background:"#0d1a14", borderRadius:6, padding:"4px 10px", fontSize:11, color:G, fontWeight:700, fontFamily:"'Fira Code',monospace" }}>{day.totalTime}</div>
      </div>
      {day.note && <div style={{ margin:"4px 14px 0", fontSize:11, color:"#D4A017", fontStyle:"italic" }}>{day.note}</div>}
      {/* BLOCKS */}
      <div style={{ padding:"8px 10px 80px" }}>
        {day.blocks.map(b => <Block key={b.id} block={b} week={week} dayId={day.id} />)}
      </div>
    </div>
  );
}
