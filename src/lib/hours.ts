import type { OpeningPeriod } from "@/types";
import { store } from "@/data/store";

const DAY_NAMES = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const TIME_ZONE = "Europe/Paris";

/** "09:30" → "9h30", "19:00" → "19h" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":");
  return `${Number(h)}h${m === "00" ? "" : m}`;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function periodForDay(day: number, hours: readonly OpeningPeriod[] = store.openingHours): OpeningPeriod | undefined {
  return hours.find((p) => p.days.includes(day));
}

/**
 * Horaires regroupés pour l'affichage, du lundi au dimanche.
 * Ex. : [{ label: "Lundi – samedi", value: "9h30 – 19h30" }, …]
 */
export function groupedHours(hours: readonly OpeningPeriod[] = store.openingHours) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const groups: { days: number[]; value: string }[] = [];
  for (const day of order) {
    const p = periodForDay(day, hours);
    const value = p ? `${formatTime(p.opens)} – ${formatTime(p.closes)}` : "Fermé";
    const last = groups.at(-1);
    if (last && last.value === value) last.days.push(day);
    else groups.push({ days: [day], value });
  }
  return groups.map(({ days, value }) => {
    const first = capitalize(DAY_NAMES[days[0]]);
    const label = days.length === 1 ? first : `${first} – ${DAY_NAMES[days.at(-1)!]}`;
    return { label, value, days };
  });
}

/** Horaires jour par jour (lundi → dimanche), pour un tableau détaillé. */
export function dailyHours(hours: readonly OpeningPeriod[] = store.openingHours) {
  return [1, 2, 3, 4, 5, 6, 0].map((day) => {
    const p = periodForDay(day, hours);
    return {
      day,
      label: capitalize(DAY_NAMES[day]),
      value: p ? `${formatTime(p.opens)} – ${formatTime(p.closes)}` : "Fermé",
    };
  });
}

/** Jour et heure actuels à Paris, quel que soit le fuseau du visiteur. */
export function nowInParis(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type OpenStatus = { isOpen: boolean; label: string };

/** « Ouvert · jusqu'à 19h30 » / « Fermé · ouvre demain à 9h30 » */
export function getOpenStatus(date = new Date(), hours: readonly OpeningPeriod[] = store.openingHours): OpenStatus {
  const { day, minutes } = nowInParis(date);
  const today = periodForDay(day, hours);

  if (today) {
    const opens = toMinutes(today.opens);
    const closes = toMinutes(today.closes);
    if (minutes >= opens && minutes < closes) {
      return { isOpen: true, label: `Ouvert · jusqu'à ${formatTime(today.closes)}` };
    }
    if (minutes < opens) {
      return { isOpen: false, label: `Fermé · ouvre aujourd'hui à ${formatTime(today.opens)}` };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const next = (day + i) % 7;
    const p = periodForDay(next, hours);
    if (p) {
      const when = i === 1 ? "demain" : DAY_NAMES[next];
      return { isOpen: false, label: `Fermé · ouvre ${when} à ${formatTime(p.opens)}` };
    }
  }
  return { isOpen: false, label: "Fermé" };
}

const shortDate = new Intl.DateTimeFormat("fr-FR", { timeZone: TIME_ZONE, weekday: "short", day: "2-digit", month: "2-digit" });

/** « dim. 27/09 » — date du jour à Paris, format étiquette. */
export function labelDate(date = new Date()): string {
  return shortDate.format(date).replace(".", "");
}

/** Prochain arrivage : « aujourd'hui », « demain » ou « jeu 01/10 ». */
export function nextRestock(date = new Date(), weekday: number = store.restockWeekday) {
  const { day } = nowInParis(date);
  const ahead = (weekday - day + 7) % 7;
  if (ahead === 0) return { ahead, label: "aujourd'hui" };
  if (ahead === 1) return { ahead, label: "demain" };
  return { ahead, label: labelDate(new Date(date.getTime() + ahead * 86_400_000)) };
}

/** Horaires du jour à Paris, ex. « 10h30 – 14h30 », ou « Fermé ». */
export function todayHours(date = new Date()): string {
  const p = periodForDay(nowInParis(date).day);
  return p ? `${formatTime(p.opens)} – ${formatTime(p.closes)}` : "Fermé";
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
