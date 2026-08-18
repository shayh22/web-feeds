/* The dashboard is plain DOM code with no build step, so a element id that
   exists in the script but not in the markup fails only at the moment a user
   clicks — as happened when the site dialog gained a checkbox that was never
   added to the page. These tests read the two files against each other. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dashboardDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'dashboard');
const html = fs.readFileSync(path.join(dashboardDir, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(dashboardDir, 'dashboard.js'), 'utf8');

test('every element the dashboard script looks up exists in the markup', () => {
    const referenced = [...script.matchAll(/\$\('#([\w-]+)'\)/g)].map((match) => match[1]);
    assert.ok(referenced.length > 20, 'expected the script to address many elements');

    const missing = [...new Set(referenced)].filter((id) => !html.includes(`id="${id}"`));
    assert.deepEqual(missing, [], `these ids are used in dashboard.js but absent from index.html: ${missing}`);
});

test('every view the navigation offers has a matching section and loader', () => {
    const navigation = [...html.matchAll(/class="nav-item[^"]*" data-view="(\w+)"/g)].map((match) => match[1]);
    assert.ok(navigation.length >= 5);

    for (const view of navigation) {
        assert.ok(html.includes(`<section class="view" data-view="${view}"`)
            || html.includes(`<section class="view is-active" data-view="${view}"`),
        `no section for the "${view}" tab`);
        assert.ok(script.includes(`${view}:`), `no loader wired for the "${view}" tab`);
    }
});

test('the embed snippet offers each widget the site has switched on', () => {
    for (const widget of ['likes', 'views', 'comments']) {
        assert.ok(script.includes(`data-tells="${widget}"`), `the snippet never offers the ${widget} widget`);
    }
    /* The snippet is built from the site's own switches, not hardcoded. */
    assert.match(script, /if \(site\.viewsOn\)/);
    assert.match(script, /if \(site\.likesOn\)/);
    assert.match(script, /if \(site\.commentsOn\)/);
});
