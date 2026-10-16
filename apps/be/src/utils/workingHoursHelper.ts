export interface CompanyWorkingHourConfig {
  workingHourStart: Date;
  workingHourEnd: Date;
  workDays: string;
  timezone?: string | null;
}

export interface WorkingHoursEvaluation {
  isWorking: boolean;
  statusLabel: string;
  nextWorkingStart: Date | null;
  timezone: string;
}

const DAY_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
const DAY_INDONESIAN = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;

/**
 * Parses workDays string into Set of day indices (0 = sun, 1 = mon, ..., 6 = sat).
 */
export function parseWorkDays(workDaysStr: string): Set<number> {
  const normalized = workDaysStr
    .toLowerCase()
    .split(',')
    .map((s) => s.trim());
  const set = new Set<number>();

  for (const item of normalized) {
    const idx = DAY_NAMES.indexOf(item as (typeof DAY_NAMES)[number]);
    if (idx !== -1) {
      set.add(idx);
    } else {
      const num = parseInt(item, 10);
      if (!Number.isNaN(num) && num >= 0 && num <= 6) {
        set.add(num);
      }
    }
  }

  // Fallback to Mon-Fri if empty
  if (set.size === 0) {
    return new Set([1, 2, 3, 4, 5]);
  }

  return set;
}

/**
 * Extracts local components (year, month, day, dayOfWeek, hour, minute)
 * for a specific Date in a given timezone.
 */
export function getZonedParts(date: Date, timezone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) {
    map[p.type] = p.value;
  }

  const weekdayShort = (map.weekday ?? '').toLowerCase();
  let dayOfWeek = 0;
  if (weekdayShort.startsWith('sun')) dayOfWeek = 0;
  else if (weekdayShort.startsWith('mon')) dayOfWeek = 1;
  else if (weekdayShort.startsWith('tue')) dayOfWeek = 2;
  else if (weekdayShort.startsWith('wed')) dayOfWeek = 3;
  else if (weekdayShort.startsWith('thu')) dayOfWeek = 4;
  else if (weekdayShort.startsWith('fri')) dayOfWeek = 5;
  else if (weekdayShort.startsWith('sat')) dayOfWeek = 6;

  return {
    year: parseInt(map.year, 10),
    month: parseInt(map.month, 10),
    day: parseInt(map.day, 10),
    dayOfWeek,
    hour: parseInt(map.hour, 10),
    minute: parseInt(map.minute, 10),
  };
}

/**
 * Evaluates whether a given time is within company working hours,
 * and calculates the next upcoming working start time and human-readable label.
 */
export function evaluateWorkingHours(
  config: CompanyWorkingHourConfig,
  currentTime = new Date(),
): WorkingHoursEvaluation {
  const tz = config.timezone || 'Asia/Jakarta';
  const workDaySet = parseWorkDays(config.workDays);

  // Prisma time fields are stored as Date objects (e.g. 1970-01-01T09:00:00Z)
  const startHour = config.workingHourStart.getUTCHours();
  const startMinute = config.workingHourStart.getUTCMinutes();
  const endHour = config.workingHourEnd.getUTCHours();
  const endMinute = config.workingHourEnd.getUTCMinutes();

  const startMinutesVal = startHour * 60 + startMinute;
  const endMinutesVal = endHour * 60 + endMinute;

  const currentZoned = getZonedParts(currentTime, tz);
  const currentMinutesVal = currentZoned.hour * 60 + currentZoned.minute;

  const isTodayWorkDay = workDaySet.has(currentZoned.dayOfWeek);

  // Check if currently within working hours
  if (isTodayWorkDay && currentMinutesVal >= startMinutesVal && currentMinutesVal < endMinutesVal) {
    return {
      isWorking: true,
      statusLabel: 'Sedang kerja',
      nextWorkingStart: null,
      timezone: tz,
    };
  }

  // Calculate next working start time
  let daysToAdd = 0;
  let targetDayOfWeek = currentZoned.dayOfWeek;

  if (isTodayWorkDay && currentMinutesVal < startMinutesVal) {
    // Later today
    daysToAdd = 0;
  } else {
    // Tomorrow or subsequent work day
    for (let i = 1; i <= 7; i++) {
      const candidateDayOfWeek = (currentZoned.dayOfWeek + i) % 7;
      if (workDaySet.has(candidateDayOfWeek)) {
        daysToAdd = i;
        targetDayOfWeek = candidateDayOfWeek;
        break;
      }
    }
  }

  const timeStr = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
  let relativeLabel = '';

  if (daysToAdd === 0) {
    relativeLabel = `Hari ini ${timeStr}`;
  } else if (daysToAdd === 1) {
    relativeLabel = `Besok ${timeStr}`;
  } else {
    relativeLabel = `${DAY_INDONESIAN[targetDayOfWeek]} ${timeStr}`;
  }

  // Estimate next timestamp
  const nextTarget = new Date(currentTime.getTime() + daysToAdd * 86400 * 1000);
  nextTarget.setHours(startHour, startMinute, 0, 0);

  return {
    isWorking: false,
    statusLabel: `Kembali ${relativeLabel}`,
    nextWorkingStart: nextTarget,
    timezone: tz,
  };
}
