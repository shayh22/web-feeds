import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ANON_NAME, LOCALES, anonName, normalizeLocale } from '../shared/locales.js';

const embed = readFileSync(new URL('../public/embed.js', import.meta.url), 'utf8');

function embedTable(name) {
    const source = embed.match(new RegExp(`var ${name} = (\\{[\\s\\S]*?\\n {4}\\});`));
    assert.ok(source, `${name} not found in embed.js`);
    return new Function(`return ${source[1]}`)();
}

test('a language tag resolves to a locale we have strings for', () => {
    assert.equal(normalizeLocale('zh-CN'), 'zh');
    assert.equal(normalizeLocale('en_GB'), 'en');
    assert.equal(normalizeLocale('  RU  '), 'ru');
    assert.equal(normalizeLocale('fr'), 'he');
    assert.equal(normalizeLocale(''), 'he');
    assert.equal(normalizeLocale(undefined), 'he');
    assert.equal(normalizeLocale('fr', 'en'), 'en');
});

test('every locale has an anonymous name', () => {
    for (const locale of LOCALES) {
        assert.ok(ANON_NAME[locale], `no anonymous name for ${locale}`);
    }
    assert.equal(anonName('es'), 'Anónimo');
    assert.equal(anonName('tlh'), ANON_NAME.he);
});

test('the widget speaks every locale the server accepts, with no missing strings', () => {
    const strings = embedTable('STRINGS');
    const keys = Object.keys(strings.he).sort();

    assert.deepEqual(Object.keys(strings).sort(), [...LOCALES].sort(),
        'embed.js and shared/locales.js disagree about which languages exist');

    for (const locale of LOCALES) {
        assert.deepEqual(Object.keys(strings[locale]).sort(), keys,
            `the ${locale} strings do not match the Hebrew set`);
        for (const key of keys) {
            assert.ok(String(strings[locale][key]).trim(), `${locale}.${key} is empty`);
        }
    }
});

test('the widget has its own wording for the errors the API can return', () => {
    const errors = embedTable('ERRORS');
    assert.deepEqual(Object.keys(errors).sort(), [...LOCALES].sort());

    /* Hebrew reads the server's own messages, so its table is deliberately
       empty; every other language must cover the same set of codes. */
    const codes = Object.keys(errors.en).sort();
    assert.ok(codes.length > 10, 'the English error table looks too small');
    assert.deepEqual(Object.keys(errors.he), []);

    for (const locale of LOCALES.filter((l) => l !== 'he')) {
        assert.deepEqual(Object.keys(errors[locale]).sort(), codes,
            `the ${locale} error table does not match the English one`);
    }
});

test('every visitor-facing error code the routes throw has widget wording', () => {
    const routes = ['../worker/src/routes/public.js', '../shared/validation.js']
        .map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'))
        .join('\n');
    const thrown = new Set();
    for (const match of routes.matchAll(/(?:HttpError\(\d+|code):\s*,?\s*'([a-z_]+)'/g)) thrown.add(match[1]);
    for (const match of routes.matchAll(/HttpError\(\d+,\s*'([a-z_]+)'/g)) thrown.add(match[1]);
    for (const match of routes.matchAll(/code:\s*'([a-z_]+)'/g)) thrown.add(match[1]);

    const known = new Set(Object.keys(embedTable('ERRORS').en));
    const missing = [...thrown].filter((code) => !known.has(code));
    assert.deepEqual(missing, [], `no translated wording for: ${missing.join(', ')}`);
});
