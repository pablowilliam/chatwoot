import {
  startOfDay,
  subDays,
  endOfDay,
  subMonths,
  addMonths,
  subYears,
  addYears,
  startOfMonth,
  isSameMonth,
  format,
  startOfWeek,
  addDays,
  eachDayOfInterval,
  endOfMonth,
  isSameDay,
  isWithinInterval,
} from 'date-fns';
import { enUS, es, fr, ptBR } from 'date-fns/locale';

// Lista de locales disponibles en date-fns
const availableLocales = {
  'en-US': enUS,
  'es': es,
  'es-419': es, // Asignamos `es-419` al mismo `es`
  'fr': fr,
  'pt': ptBR, // Si solo se detecta "pt", usamos `pt-BR`
  'pt-BR': ptBR
};

// Obtener el idioma del navegador o establecer un idioma por defecto
const getLocale = () => {
  const browserLanguages = navigator.languages || [navigator.language];
  console.log('Idiomas detectados:', browserLanguages);

  // Priorizar coincidencias exactas (ej: "pt-BR", "es-419")
  for (let lang of browserLanguages) {
    if (availableLocales[lang]) {
      console.log('Idioma exacto seleccionado:', lang);
      return availableLocales[lang];
    }
  }

  // Si no se encuentra una coincidencia exacta, intentar con el idioma base (ej: "pt" de "pt-BR")
  for (let lang of browserLanguages) {
    const baseLang = lang.split('-')[0];
    if (availableLocales[baseLang]) {
      console.log('Idioma base seleccionado:', baseLang);
      return availableLocales[baseLang];
    }
  }

  // Si no se encuentra ninguna coincidencia, usar inglés como fallback
  console.log('No se encontró idioma compatible, usando inglés por defecto.');
  return enUS;
};

const locale = getLocale();

// Prueba de formato de fecha en el idioma seleccionado
console.log('Formato de fecha en este idioma:', format(new Date(), 'PPPP', { locale }));

export const calendarWeeks = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  label: format(new Date(2023, 0, i + 1), 'EEEEEE', { locale }),
}));

export const dateRanges = [
  { label: 'DATE_PICKER.DATE_RANGE_OPTIONS.LAST_7_DAYS', value: 'last7days' },
  { label: 'DATE_PICKER.DATE_RANGE_OPTIONS.LAST_30_DAYS', value: 'last30days' },
  { label: 'DATE_PICKER.DATE_RANGE_OPTIONS.LAST_3_MONTHS', value: 'last3months' },
  { label: 'DATE_PICKER.DATE_RANGE_OPTIONS.LAST_6_MONTHS', value: 'last6months' },
  { label: 'DATE_PICKER.DATE_RANGE_OPTIONS.LAST_YEAR', value: 'lastYear' },
  { label: 'DATE_PICKER.DATE_RANGE_OPTIONS.CUSTOM_RANGE', value: 'custom' },
];

export const DATE_RANGE_TYPES = {
  LAST_7_DAYS: 'last7days',
  LAST_30_DAYS: 'last30days',
  LAST_3_MONTHS: 'last3months',
  LAST_6_MONTHS: 'last6months',
  LAST_YEAR: 'lastYear',
  CUSTOM_RANGE: 'custom',
};

export const CALENDAR_TYPES = {
  START_CALENDAR: 'start',
  END_CALENDAR: 'end',
};

export const CALENDAR_PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

// Utility functions for date operations
export const monthName = currentDate => format(currentDate, 'MMMM', { locale });
export const yearName = currentDate => format(currentDate, 'yyyy', { locale });

export const getIntlDateFormatForLocale = () => {
  const year = 2222;
  const month = 12;
  const day = 15;
  const date = new Date(year, month - 1, day);
  const formattedDate = new Intl.DateTimeFormat(navigator.language).format(date);
  return formattedDate.replace(`${year}`, 'yyyy').replace(`${month}`, 'MM').replace(`${day}`, 'dd');
};

// Utility functions for calendar operations
export const chunk = (array, size) =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );

export const getWeeksForMonth = (date, weekStartsOn = 1) => {
  const startOfTheMonth = startOfMonth(date);
  const startOfTheFirstWeek = startOfWeek(startOfTheMonth, { weekStartsOn });
  const endOfTheLastWeek = addDays(startOfTheFirstWeek, 41); // Covering six weeks to fill the calendar
  return chunk(
    eachDayOfInterval({ start: startOfTheFirstWeek, end: endOfTheLastWeek }),
    7
  );
};

export const moveCalendarDate = (
  calendar,
  startCurrentDate,
  endCurrentDate,
  direction,
  period
) => {
  const adjustFunctions = {
    month: { prev: subMonths, next: addMonths },
    year: { prev: subYears, next: addYears },
  };

  const adjust = adjustFunctions[period][direction];

  if (calendar === 'start') {
    const newStart = adjust(startCurrentDate, 1);
    return { start: newStart, end: endCurrentDate };
  }
  const newEnd = adjust(endCurrentDate, 1);
  return { start: startCurrentDate, end: newEnd };
};

export const isToday = (currentDate, date) =>
  isSameDay(currentDate, date);

export const isCurrentMonth = (day, referenceDate) =>
  isSameMonth(day, referenceDate);

export const isLastDayOfMonth = day => {
  const lastDay = endOfMonth(day);
  return isSameDay(day, lastDay);
};

export const dayIsInRange = (date, startDate, endDate) => {
  if (!startDate || !endDate) return false;
  return isWithinInterval(date, {
    start: startOfDay(startDate),
    end: startOfDay(endDate),
  });
};

export const isHoveringDayInRange = (day, startDate, endDate, hoveredEndDate) => {
  if (endDate && hoveredEndDate && startDate <= hoveredEndDate) {
    return isWithinInterval(day, { start: startDate, end: hoveredEndDate });
  }
  return false;
};

export const isHoveringNextDayInRange = (day, startDate, endDate, hoveredEndDate) => {
  if (startDate && !endDate && hoveredEndDate) {
    return isWithinInterval(addDays(day, 1), { start: startDate, end: hoveredEndDate });
  }
  if (startDate && endDate) {
    return isWithinInterval(addDays(day, 1), { start: startDate, end: endDate });
  }
  return false;
};

export const getActiveDateRange = (range, currentDate) => {
  const ranges = {
    last7days: () => ({ start: startOfDay(subDays(currentDate, 6)), end: endOfDay(currentDate) }),
    last30days: () => ({ start: startOfDay(subDays(currentDate, 29)), end: endOfDay(currentDate) }),
    last3months: () => ({ start: startOfDay(subMonths(currentDate, 3)), end: endOfDay(currentDate) }),
    last6months: () => ({ start: startOfDay(subMonths(currentDate, 6)), end: endOfDay(currentDate) }),
    lastYear: () => ({ start: startOfDay(subMonths(currentDate, 12)), end: endOfDay(currentDate) }),
    custom: () => ({ start: currentDate, end: currentDate }),
  };

  return (ranges[range] || (() => ({ start: currentDate, end: currentDate })))();
};
