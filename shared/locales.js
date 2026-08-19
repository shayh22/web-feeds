/* The languages the widgets speak. One list, imported by both servers and by
   the admin API, so a locale can never be accepted in one place and rejected
   in another. embed.js carries its own copy of the same list, because it ships
   to the browser as a standalone file with no imports. */

export const LOCALES = ['he', 'en', 'ru', 'es', 'zh'];

export const DEFAULT_LOCALE = 'he';

/* The name a comment is stored under when its author stays anonymous. It is
   written into the row at submit time, so it has to be right in the language
   the visitor was reading — not in the site's own default. */
export const ANON_NAME = {
    he: 'אנונימי',
    en: 'Anonymous',
    ru: 'Аноним',
    es: 'Anónimo',
    zh: '匿名',
};

/* Accepts a full tag ("zh-CN", "en_GB", "  RU  ") and returns a locale we have
   strings for, or the fallback when the language is not one of them. */
export function normalizeLocale(value, fallback = DEFAULT_LOCALE) {
    const tag = String(value || '').trim().toLowerCase().split(/[-_]/)[0];
    return LOCALES.includes(tag) ? tag : fallback;
}

export function anonName(locale) {
    return ANON_NAME[normalizeLocale(locale)];
}
