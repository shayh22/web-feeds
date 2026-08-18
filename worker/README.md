# הפעלה על Cloudflare (חינם)

אותה אפליקציה בדיוק — אותו דשבורד, אותם רכיבי הטמעה, אותו API — רצה כ־Cloudflare Worker
עם מסד נתונים D1. הכול נכנס לתוכנית החינמית של Cloudflare, ואין שרת לתחזק.

| מה | איפה זה רץ |
| --- | --- |
| ה־API והדשבורד | Cloudflare Workers |
| הנתונים | D1 (SQLite מנוהל) |
| `embed.js`, הדשבורד, דף ההדגמה | Workers Static Assets |

---

## פריסה משורת הפקודה

(מהטלפון אפשר לעשות את הכול מהדשבורד של Cloudflare — ראו את הסעיף הבא.)

```bash
cd worker
npm install

# 1. חיבור לחשבון Cloudflare (נפתח דפדפן)
npx wrangler login

# 2. יצירת מסד הנתונים
npx wrangler d1 create web-feeds
```

הפקודה מדפיסה `database_id`. העתיקו אותו אל `wrangler.toml`, במקום `REPLACE_WITH_YOUR_DATABASE_ID`.

```bash
# 3. קביעת סיסמת הדשבורד (נשמרת כסוד, לא בקוד)
npx wrangler secret put ADMIN_PASSWORD

# 4. פריסה
npm run deploy
```

הטבלאות נוצרות מאליהן בבקשה הראשונה, כך שאין שלב נפרד של הקמת סכימה. `npm run db:init`
קיים כאופציה למי שמעדיף ליצור אותן מראש.

בסוף הפריסה מודפסת הכתובת, למשל `https://web-feeds.<שם-החשבון>.workers.dev`.

```bash
# 6. בדיקה שהכול עובד מקצה לקצה מול הכתובת האמיתית
node ../test/contract.mjs https://web-feeds.<שם-החשבון>.workers.dev 'הסיסמה שלכם'
```

7. היכנסו ל־`https://.../admin/`, הוסיפו אתר, והעתיקו את קוד ההטמעה. הוא כבר יצביע לכתובת
   הנכונה:

```html
<script src="https://web-feeds.<שם-החשבון>.workers.dev/embed.js" data-site="st_xxxx" defer></script>
<div data-tells="likes"></div>
<div data-tells="comments"></div>
```

בכרטיס האתר בדשבורד כדאי למלא את הדומיינים המורשים (למשל `https://shayh22.github.io`) — כך
רק האתרים שלכם יוכלו לכתוב לשרת.

---

## פיתוח מקומי

```bash
cd worker
npm install
printf 'ADMIN_PASSWORD=local-dev-pass\n' > .dev.vars
npm run dev                                 # http://127.0.0.1:8787
```

`.dev.vars` לא נכנס ל־git. אפשר להוסיף בו גם משתני הגדרה, למשל `RATE_REGISTER=500`, כדי
שהגבלות הקצב לא יפריעו בזמן פיתוח.

---

## הגדרות

ב־`wrangler.toml`, תחת `[vars]`:

| משתנה | ברירת מחדל | תיאור |
| --- | --- | --- |
| `EMAIL_DNS_CHECK` | `true` | בדיקה שלדומיין של האימייל יש שרת דואר, דרך DNS-over-HTTPS |
| `BLOCK_DISPOSABLE_EMAIL` | `true` | חסימת ספקי אימייל זמניים |
| `MAX_COMMENT_LENGTH` | `2000` | אורך תגובה מרבי |
| `COMMENT_COOLDOWN_MS` | `20000` | השהיה בין שתי תגובות של אותו מבקר |
| `COMMENTS_PER_HOUR` | `12` | מכסת תגובות לשעה לכל מבקר |
| `SESSION_TTL_HOURS` | `12` | תוקף חיבור לדשבורד |
| `RATE_WRITE` / `RATE_REGISTER` / `RATE_LOGIN` | `20` / `10` / `10` | הגבלות קצב לפי כתובת IP |

הסיסמה היא היחידה שנשמרת כ־secret: `npx wrangler secret put ADMIN_PASSWORD`.
בפעם הראשונה שמתחברים איתה, נגזר ממנה hash שנשמר בבסיס הנתונים — מאותו רגע אפשר לשנות
סיסמה גם מתוך הדשבורד.

---

## מה שונה מגרסת ה־Node

שתי הגרסאות חולקות את אותה לוגיקה טהורה (`shared/`) ואת אותם קבצים סטטיים
(`public/`), ועוברות את אותה בדיקת חוזה. ההבדלים הם רק במה שהריצה מכתיבה:

| | Node | Cloudflare |
| --- | --- | --- |
| בסיס נתונים | קובץ SQLite מקומי (`node:sqlite`) | D1 |
| בדיקת דומיין האימייל | `node:dns` | DNS-over-HTTPS |
| סיסמת ניהול | scrypt | PBKDF2‑SHA256 (מה ש‑WebCrypto מציע) |
| הגבלת קצב | מונה בזיכרון התהליך | טבלה ב־D1, כי Worker לא זוכר בין בקשות |
| כתובת המבקר | `X-Forwarded-For` (אם הוגדר proxy) | `CF-Connecting-IP` |
| עוגיית הדשבורד | `Secure` לפי הגדרה | תמיד `Secure` |

בדיקת ה־DNS בשתי הגרסאות נכשלת לטובת המבקר: רק תשובה חד־משמעית שהדומיין לא קיים חוסמת
הרשמה, כדי שתקלת DNS לא תנעל אנשים אמיתיים בחוץ.

---

## תפעול שוטף

```bash
npx wrangler tail                              # לוגים חיים
npx wrangler d1 execute web-feeds --remote --command "SELECT COUNT(*) FROM comments"
npx wrangler d1 export web-feeds --remote --output backup.sql   # גיבוי
```

בתוכנית החינמית של D1 יש 5GB אחסון, 5 מיליון שורות קריאה ו־100 אלף שורות כתיבה ביום —
הרבה מעבר לאתר תוכן רגיל. קריאה של תגובות ולייקים לא כותבת כלום; רק הרשמה, תגובה, לייק
ופעולות ניהול כותבות.


---

## פריסה מהדפדפן, בלי שורת פקודה

מתאים לטלפון. כל השלבים בדשבורד של Cloudflare ובאתר GitHub:

1. **[dash.cloudflare.com](https://dash.cloudflare.com)** → Storage & Databases → D1 → **Create** → שם: `web-feeds`.
   מעתיקים את ה־**Database ID** מעמוד המסד.
2. ב־GitHub פותחים את `worker/wrangler.toml`, לוחצים על העיפרון, ומחליפים את
   `REPLACE_WITH_YOUR_DATABASE_ID` ב־ID שהעתקתם → Commit.
3. בדשבורד → **Workers & Pages** → Create → **Import a repository** → בוחרים את `web-feeds`,
   ומגדירים **Root directory** = `worker` → Deploy.
4. אחרי הפריסה: Worker → Settings → **Variables and Secrets** → Add → Secret בשם
   `ADMIN_PASSWORD` → שומרים ומפעילים Deploy מחדש.
5. נכנסים ל־`https://web-feeds.<החשבון>.workers.dev/admin/`. הטבלאות נוצרות בבקשה הראשונה.
