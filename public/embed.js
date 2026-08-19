/* Tells Engage — embeddable comments and likes.
 *
 *   <script src="https://your-server/embed.js" data-site="st_xxx" defer></script>
 *   <div data-tells="likes"></div>
 *   <div data-tells="comments"></div>
 *   <div data-tells="views"></div>   <!-- optional: shows the count -->
 *
 * Page views are counted automatically on every visit, with or without a views
 * widget on the page. Add data-views="off" to the script tag to turn that off.
 *
 * No dependencies, no build step, one network request. The script finds its own
 * server from its src, so the same snippet works on every site.
 */
(function () {
    'use strict';

    var script = document.currentScript || (function () {
        var all = document.getElementsByTagName('script');
        return all[all.length - 1];
    })();

    var BASE = (function () {
        try {
            return new URL(script.src, window.location.href).origin;
        } catch (error) {
            return '';
        }
    })();

    var DEFAULT_SITE = script.getAttribute('data-site') || script.getAttribute('data-tells-site') || '';

    var STRINGS = {
        he: {
            comments: 'תגובות',
            noComments: 'עדיין אין תגובות. תהיו הראשונים.',
            writeComment: 'כתבו תגובה…',
            send: 'שליחה',
            sending: 'שולח…',
            reply: 'תגובה',
            replyTo: 'בתגובה ל־',
            cancel: 'ביטול',
            identityTitle: 'רגע לפני שכותבים',
            identityLead: 'רישום מהיר בשלב אחד — או תגובה אנונימית.',
            emailLabel: 'אימייל',
            nameLabel: 'שם לתצוגה (לא חובה)',
            registerEmail: 'הרשמה עם אימייל',
            continueAnonymous: 'המשך כאנונימי',
            registering: 'רושם…',
            signedInAs: 'מגיבים בתור',
            anonymous: 'אנונימי',
            switchIdentity: 'החלפת זהות',
            pendingNotice: 'התגובה נשלחה וממתינה לאישור.',
            publishedNotice: 'התגובה פורסמה.',
            moderationNote: 'התגובות עוברות אישור לפני פרסום.',
            likeAdd: 'אהבתי',
            likeRemove: 'ביטול לייק',
            likesCount: 'לייקים',
            loadError: 'לא הצלחנו לטעון את התגובות.',
            genericError: 'משהו השתבש. נסו שוב.',
            commentsClosed: 'התגובות סגורות.',
            charactersLeft: 'תווים שנותרו',
            justNow: 'הרגע',
            views: 'צפיות',
            viewsOne: 'צפייה',
            viewsToday: 'היום',
        },
        en: {
            comments: 'Comments',
            noComments: 'No comments yet. Be the first.',
            writeComment: 'Write a comment…',
            send: 'Send',
            sending: 'Sending…',
            reply: 'Reply',
            replyTo: 'Replying to ',
            cancel: 'Cancel',
            identityTitle: 'Before you write',
            identityLead: 'One-step signup — or comment anonymously.',
            emailLabel: 'Email',
            nameLabel: 'Display name (optional)',
            registerEmail: 'Sign up with email',
            continueAnonymous: 'Continue anonymously',
            registering: 'Signing up…',
            signedInAs: 'Commenting as',
            anonymous: 'Anonymous',
            switchIdentity: 'Switch identity',
            pendingNotice: 'Your comment was sent and is awaiting approval.',
            publishedNotice: 'Your comment was published.',
            moderationNote: 'Comments are reviewed before they appear.',
            likeAdd: 'Like',
            likeRemove: 'Unlike',
            likesCount: 'likes',
            loadError: 'We could not load the comments.',
            genericError: 'Something went wrong. Please try again.',
            commentsClosed: 'Comments are closed.',
            charactersLeft: 'characters left',
            justNow: 'just now',
            views: 'views',
            viewsOne: 'view',
            viewsToday: 'today',
        },
        ru: {
            comments: 'Комментарии',
            noComments: 'Пока нет комментариев. Будьте первым.',
            writeComment: 'Напишите комментарий…',
            send: 'Отправить',
            sending: 'Отправляем…',
            reply: 'Ответить',
            replyTo: 'В ответ ',
            cancel: 'Отмена',
            identityTitle: 'Прежде чем писать',
            identityLead: 'Регистрация в один шаг — или анонимный комментарий.',
            emailLabel: 'Электронная почта',
            nameLabel: 'Отображаемое имя (необязательно)',
            registerEmail: 'Зарегистрироваться по почте',
            continueAnonymous: 'Продолжить анонимно',
            registering: 'Регистрируем…',
            signedInAs: 'Вы пишете как',
            anonymous: 'Аноним',
            switchIdentity: 'Сменить пользователя',
            pendingNotice: 'Комментарий отправлен и ожидает одобрения.',
            publishedNotice: 'Комментарий опубликован.',
            moderationNote: 'Комментарии проходят проверку перед публикацией.',
            likeAdd: 'Нравится',
            likeRemove: 'Убрать отметку',
            likesCount: 'отметок «нравится»',
            loadError: 'Не удалось загрузить комментарии.',
            genericError: 'Что-то пошло не так. Попробуйте ещё раз.',
            commentsClosed: 'Комментарии закрыты.',
            charactersLeft: 'символов осталось',
            justNow: 'только что',
            views: 'просмотров',
            viewsOne: 'просмотр',
            viewsToday: 'сегодня',
        },
        es: {
            comments: 'Comentarios',
            noComments: 'Aún no hay comentarios. Sé el primero.',
            writeComment: 'Escribe un comentario…',
            send: 'Enviar',
            sending: 'Enviando…',
            reply: 'Responder',
            replyTo: 'En respuesta a ',
            cancel: 'Cancelar',
            identityTitle: 'Antes de escribir',
            identityLead: 'Registro en un solo paso — o comenta de forma anónima.',
            emailLabel: 'Correo electrónico',
            nameLabel: 'Nombre visible (opcional)',
            registerEmail: 'Registrarse con el correo',
            continueAnonymous: 'Continuar en anónimo',
            registering: 'Registrando…',
            signedInAs: 'Comentas como',
            anonymous: 'Anónimo',
            switchIdentity: 'Cambiar de identidad',
            pendingNotice: 'Tu comentario se envió y está pendiente de aprobación.',
            publishedNotice: 'Tu comentario se publicó.',
            moderationNote: 'Los comentarios se revisan antes de publicarse.',
            likeAdd: 'Me gusta',
            likeRemove: 'Ya no me gusta',
            likesCount: 'me gusta',
            loadError: 'No pudimos cargar los comentarios.',
            genericError: 'Algo salió mal. Inténtalo de nuevo.',
            commentsClosed: 'Los comentarios están cerrados.',
            charactersLeft: 'caracteres restantes',
            justNow: 'ahora mismo',
            views: 'visitas',
            viewsOne: 'visita',
            viewsToday: 'hoy',
        },
        zh: {
            comments: '评论',
            noComments: '还没有评论，来做第一个吧。',
            writeComment: '写下你的评论…',
            send: '发送',
            sending: '发送中…',
            reply: '回复',
            replyTo: '回复 ',
            cancel: '取消',
            identityTitle: '写之前',
            identityLead: '一步注册，或者匿名评论。',
            emailLabel: '电子邮箱',
            nameLabel: '显示名称（可选）',
            registerEmail: '用邮箱注册',
            continueAnonymous: '匿名继续',
            registering: '注册中…',
            signedInAs: '当前身份',
            anonymous: '匿名',
            switchIdentity: '切换身份',
            pendingNotice: '评论已发送，等待审核。',
            publishedNotice: '评论已发布。',
            moderationNote: '评论会经过审核后才显示。',
            likeAdd: '赞',
            likeRemove: '取消赞',
            likesCount: '个赞',
            loadError: '无法加载评论。',
            genericError: '出了点问题，请再试一次。',
            commentsClosed: '评论已关闭。',
            charactersLeft: '还可以输入',
            justNow: '刚刚',
            views: '次浏览',
            viewsOne: '次浏览',
            viewsToday: '今天',
        },
    };

    /* The API answers with a stable code and a Hebrew message. A widget reading
       in another language shows its own wording for every code it knows and
       falls back to the server's text for anything it does not. */
    var ERRORS = {
        he: {},
        en: {
            site_not_found: 'This site key is not recognised.',
            origin_not_allowed: 'This domain is not allowed for this site.',
            identity_required: 'Please sign up before sending.',
            anonymous_not_allowed: 'This site requires signing up with an email address.',
            visitor_blocked: 'This account is blocked.',
            comments_disabled: 'Comments are switched off on this site.',
            likes_disabled: 'Likes are switched off on this site.',
            rejected: 'The request was rejected.',
            too_fast: 'Just a moment before sending another comment.',
            duplicate: 'You have already sent this comment.',
            hourly_limit: 'You have reached the hourly comment limit.',
            parent_not_found: 'The comment you are replying to was not found.',
            body_required: 'A comment cannot be empty.',
            body_too_long: 'This comment is too long.',
            email_required: 'An email address is required.',
            email_invalid: 'That email address is not valid.',
            email_too_long: 'That email address is too long.',
            email_disposable: 'Disposable email addresses are not accepted.',
            email_domain_invalid: 'That email domain does not accept mail.',
            email_domain_unreachable: 'No mail server found for that domain — please check the address.',
            not_found: 'Not found.',
            server_error: 'The server had a problem.',
        },
        ru: {
            site_not_found: 'Ключ сайта не распознан.',
            origin_not_allowed: 'Этот домен не разрешён для данного сайта.',
            identity_required: 'Перед отправкой нужно зарегистрироваться.',
            anonymous_not_allowed: 'На этом сайте нужна регистрация по электронной почте.',
            visitor_blocked: 'Этот пользователь заблокирован.',
            comments_disabled: 'Комментарии на этом сайте отключены.',
            likes_disabled: 'Отметки «нравится» на этом сайте отключены.',
            rejected: 'Запрос отклонён.',
            too_fast: 'Подождите немного перед следующим комментарием.',
            duplicate: 'Вы уже отправили этот комментарий.',
            hourly_limit: 'Достигнут часовой лимит комментариев.',
            parent_not_found: 'Комментарий, на который вы отвечаете, не найден.',
            body_required: 'Комментарий не может быть пустым.',
            body_too_long: 'Комментарий слишком длинный.',
            email_required: 'Нужен адрес электронной почты.',
            email_invalid: 'Адрес электронной почты неверный.',
            email_too_long: 'Адрес электронной почты слишком длинный.',
            email_disposable: 'Временные адреса почты не принимаются.',
            email_domain_invalid: 'Этот почтовый домен не принимает письма.',
            email_domain_unreachable: 'Для этого домена не найден почтовый сервер — проверьте адрес.',
            not_found: 'Не найдено.',
            server_error: 'Ошибка на сервере.',
        },
        es: {
            site_not_found: 'Esta clave de sitio no se reconoce.',
            origin_not_allowed: 'Este dominio no está permitido para este sitio.',
            identity_required: 'Regístrate antes de enviar.',
            anonymous_not_allowed: 'Este sitio exige registrarse con un correo electrónico.',
            visitor_blocked: 'Esta cuenta está bloqueada.',
            comments_disabled: 'Los comentarios están desactivados en este sitio.',
            likes_disabled: 'Los me gusta están desactivados en este sitio.',
            rejected: 'La solicitud fue rechazada.',
            too_fast: 'Espera un momento antes de enviar otro comentario.',
            duplicate: 'Ya has enviado este comentario.',
            hourly_limit: 'Has alcanzado el límite de comentarios por hora.',
            parent_not_found: 'No se encontró el comentario al que respondes.',
            body_required: 'Un comentario no puede estar vacío.',
            body_too_long: 'Este comentario es demasiado largo.',
            email_required: 'Hace falta una dirección de correo.',
            email_invalid: 'Esa dirección de correo no es válida.',
            email_too_long: 'Esa dirección de correo es demasiado larga.',
            email_disposable: 'No se aceptan correos desechables.',
            email_domain_invalid: 'Ese dominio de correo no acepta mensajes.',
            email_domain_unreachable: 'No se encontró servidor de correo para ese dominio — revisa la dirección.',
            not_found: 'No encontrado.',
            server_error: 'Hubo un problema en el servidor.',
        },
        zh: {
            site_not_found: '无法识别该站点密钥。',
            origin_not_allowed: '该域名未获此站点授权。',
            identity_required: '发送前请先注册。',
            anonymous_not_allowed: '本站点需要用邮箱注册。',
            visitor_blocked: '该用户已被封禁。',
            comments_disabled: '本站点已关闭评论。',
            likes_disabled: '本站点已关闭点赞。',
            rejected: '请求被拒绝。',
            too_fast: '请稍等片刻再发下一条评论。',
            duplicate: '你已经发过这条评论了。',
            hourly_limit: '已达到每小时评论上限。',
            parent_not_found: '找不到你要回复的评论。',
            body_required: '评论不能为空。',
            body_too_long: '这条评论太长了。',
            email_required: '需要填写电子邮箱。',
            email_invalid: '电子邮箱地址无效。',
            email_too_long: '电子邮箱地址太长了。',
            email_disposable: '不接受临时邮箱地址。',
            email_domain_invalid: '该邮箱域名不接收邮件。',
            email_domain_unreachable: '找不到该域名的邮件服务器 — 请检查地址。',
            not_found: '未找到。',
            server_error: '服务器出错了。',
        },
    };

    /* Falls back through the base subtag, so "zh-CN" and "en-GB" both land on a
       language we have strings for. */
    function normalizeLocale(value, fallback) {
        var tag = String(value || '').trim().toLowerCase().split(/[-_]/)[0];
        return STRINGS[tag] ? tag : (fallback || '');
    }

    /* A page states its language on <html lang>, so a multilingual site gets
       widgets in the reader's language without repeating it on every widget. */
    var PAGE_LOCALE = normalizeLocale(document.documentElement.getAttribute('lang'), '')
        || normalizeLocale(script.getAttribute('data-locale'), '')
        || 'he';

    var CSS = [
        '.tlx{--tlx-fg:#1f2937;--tlx-muted:#6b7280;--tlx-bg:transparent;--tlx-card:#ffffff;',
        '--tlx-border:rgba(15,23,42,.12);--tlx-accent:#4f46e5;--tlx-accent-fg:#ffffff;--tlx-radius:14px;',
        'color:var(--tlx-fg);font:inherit;line-height:1.6;box-sizing:border-box;max-width:100%}',
        '.tlx *,.tlx *::before,.tlx *::after{box-sizing:inherit}',
        '@media (prefers-color-scheme:dark){.tlx{--tlx-fg:#e5e7eb;--tlx-muted:#9ca3af;--tlx-card:rgba(255,255,255,.04);',
        '--tlx-border:rgba(255,255,255,.14);--tlx-accent:#818cf8}}',
        '.tlx[data-theme="dark"]{--tlx-fg:#e5e7eb;--tlx-muted:#9ca3af;--tlx-card:rgba(255,255,255,.04);',
        '--tlx-border:rgba(255,255,255,.14);--tlx-accent:#818cf8}',
        '.tlx[data-theme="light"]{--tlx-fg:#1f2937;--tlx-muted:#6b7280;--tlx-card:#ffffff;',
        '--tlx-border:rgba(15,23,42,.12);--tlx-accent:#4f46e5}',
        '.tlx-h{display:flex;align-items:center;gap:.5rem;margin:0 0 1rem;font-size:1.15rem;font-weight:700}',
        '.tlx-count{font-size:.85rem;font-weight:600;color:var(--tlx-muted)}',
        '.tlx-list{display:flex;flex-direction:column;gap:.75rem;margin:0 0 1.25rem;padding:0;list-style:none}',
        '.tlx-item{background:var(--tlx-card);border:1px solid var(--tlx-border);border-radius:var(--tlx-radius);padding:.85rem 1rem}',
        '.tlx-item.tlx-reply{margin-inline-start:1.75rem}',
        '.tlx-item.tlx-pending{border-style:dashed;opacity:.75}',
        '.tlx-meta{display:flex;flex-wrap:wrap;align-items:baseline;gap:.5rem;margin-bottom:.35rem}',
        '.tlx-author{font-weight:700}',
        '.tlx-badge{font-size:.7rem;padding:.1rem .45rem;border-radius:999px;border:1px solid var(--tlx-border);color:var(--tlx-muted)}',
        '.tlx-time{font-size:.78rem;color:var(--tlx-muted)}',
        '.tlx-body{white-space:pre-wrap;overflow-wrap:anywhere;margin:0}',
        '.tlx-body a{color:var(--tlx-accent)}',
        '.tlx-actions{margin-top:.4rem}',
        '.tlx-link{background:none;border:0;padding:0;font:inherit;font-size:.8rem;color:var(--tlx-accent);cursor:pointer}',
        '.tlx-link:hover{text-decoration:underline}',
        '.tlx-empty,.tlx-note{color:var(--tlx-muted);font-size:.9rem;margin:0 0 1rem}',
        '.tlx-form{background:var(--tlx-card);border:1px solid var(--tlx-border);border-radius:var(--tlx-radius);padding:1rem;display:flex;flex-direction:column;gap:.6rem}',
        '.tlx-form textarea,.tlx-form input,.tlx-idcard input{width:100%;font:inherit;color:inherit;background:transparent;',
        'border:1px solid var(--tlx-border);border-radius:10px;padding:.6rem .75rem;resize:vertical}',
        '.tlx-form textarea{min-height:5.5rem}',
        '.tlx-form textarea:focus,.tlx-form input:focus,.tlx-idcard input:focus{outline:2px solid var(--tlx-accent);outline-offset:1px}',
        '.tlx-idcard form{display:flex;flex-direction:column;gap:.5rem}',
        '.tlx-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.6rem}',
        '.tlx-btn{font:inherit;font-weight:600;cursor:pointer;border-radius:999px;padding:.5rem 1.15rem;',
        'border:1px solid var(--tlx-accent);background:var(--tlx-accent);color:var(--tlx-accent-fg);transition:opacity .15s ease,transform .15s ease}',
        '.tlx-btn:hover:not(:disabled){opacity:.88}',
        '.tlx-btn:disabled{opacity:.55;cursor:default}',
        '.tlx-btn.tlx-ghost{background:transparent;color:var(--tlx-fg);border-color:var(--tlx-border)}',
        '.tlx-hp{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
        '.tlx-msg{font-size:.88rem;border-radius:10px;padding:.5rem .75rem;border:1px solid var(--tlx-border)}',
        '.tlx-msg.tlx-ok{color:#166534;background:rgba(22,163,74,.12);border-color:rgba(22,163,74,.35)}',
        '.tlx-msg.tlx-err{color:#b91c1c;background:rgba(220,38,38,.1);border-color:rgba(220,38,38,.35)}',
        '@media (prefers-color-scheme:dark){.tlx-msg.tlx-ok{color:#86efac}.tlx-msg.tlx-err{color:#fca5a5}}',
        '.tlx-id{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;font-size:.85rem;color:var(--tlx-muted)}',
        '.tlx-idcard{background:var(--tlx-card);border:1px solid var(--tlx-border);border-radius:var(--tlx-radius);padding:1rem;display:flex;flex-direction:column;gap:.6rem}',
        '.tlx-idcard h4{margin:0;font-size:1rem}',
        '.tlx-idcard p{margin:0;color:var(--tlx-muted);font-size:.88rem}',
        '.tlx-idrow{display:flex;flex-wrap:wrap;gap:.5rem}',
        '.tlx-idrow .tlx-btn{flex:1 1 auto}',
        '.tlx-like{display:inline-flex;align-items:center;gap:.5rem;font:inherit;font-weight:600;cursor:pointer;',
        'border:1px solid var(--tlx-border);background:var(--tlx-card);color:var(--tlx-fg);',
        'border-radius:999px;padding:.45rem 1rem;transition:transform .15s ease,border-color .15s ease}',
        '.tlx-like:hover:not(:disabled){transform:translateY(-1px);border-color:var(--tlx-accent)}',
        '.tlx-like:disabled{opacity:.6;cursor:default}',
        '.tlx-like[aria-pressed="true"]{border-color:var(--tlx-accent);color:var(--tlx-accent)}',
        '.tlx-heart{font-size:1.1em;line-height:1;transition:transform .2s ease}',
        '.tlx-like[aria-pressed="true"] .tlx-heart{transform:scale(1.15)}',
        '.tlx-views{display:inline-flex;align-items:center;gap:.4rem;color:var(--tlx-muted);font-size:.9rem}',
        '.tlx-eye{font-size:1em;line-height:1}',
        '.tlx-viewnum{font-weight:700;color:var(--tlx-fg);font-variant-numeric:tabular-nums}',
        '@media (prefers-reduced-motion:reduce){.tlx *{transition:none!important}}',
    ].join('');

    function injectStyles() {
        if (document.getElementById('tlx-styles')) return;
        var style = document.createElement('style');
        style.id = 'tlx-styles';
        style.textContent = CSS;
        document.head.appendChild(style);
    }

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined && text !== null) node.textContent = text;
        return node;
    }

    /* Comment bodies are inserted as text; only bare URLs become links, and
       those are built as elements so nothing in the string can become markup. */
    function renderBody(text) {
        var wrapper = el('p', 'tlx-body');
        var pattern = /(https?:\/\/[^\s<>"']+)/g;
        var lastIndex = 0;
        var match;
        while ((match = pattern.exec(text)) !== null) {
            if (match.index > lastIndex) {
                wrapper.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }
            var link = el('a', null, match[0]);
            link.href = match[0];
            link.target = '_blank';
            link.rel = 'nofollow ugc noopener noreferrer';
            wrapper.appendChild(link);
            lastIndex = match.index + match[0].length;
        }
        wrapper.appendChild(document.createTextNode(text.slice(lastIndex)));
        return wrapper;
    }

    function timeAgo(iso, locale, strings) {
        var then = new Date(iso).getTime();
        if (!then) return '';
        var seconds = Math.round((Date.now() - then) / 1000);
        if (seconds < 45) return strings.justNow;
        var units = [
            ['minute', 60], ['hour', 3600], ['day', 86400], ['week', 604800],
            ['month', 2592000], ['year', 31536000],
        ];
        var unit = 'minute';
        var value = seconds / 60;
        for (var i = units.length - 1; i >= 0; i -= 1) {
            if (seconds >= units[i][1]) {
                unit = units[i][0];
                value = seconds / units[i][1];
                break;
            }
        }
        try {
            var formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
            return formatter.format(-Math.round(value), unit);
        } catch (error) {
            return new Date(iso).toLocaleDateString(locale);
        }
    }

    function request(path, options) {
        options = options || {};
        var headers = { 'content-type': 'application/json' };
        if (options.token) headers.authorization = 'Bearer ' + options.token;
        return fetch(BASE + path, {
            method: options.method || 'GET',
            headers: headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
            credentials: 'omit',
            mode: 'cors',
        }).then(function (response) {
            return response.json().catch(function () { return {}; }).then(function (payload) {
                if (!response.ok) {
                    var error = new Error(payload.message || 'request failed');
                    error.code = payload.error || 'error';
                    error.status = response.status;
                    throw error;
                }
                return payload;
            });
        });
    }

    /* One identity per site, kept in localStorage so a visitor registers once
       and keeps commenting across pages. */
    function identityStore(siteKey) {
        var key = 'tells.engage.' + siteKey;
        return {
            read: function () {
                try {
                    var raw = window.localStorage.getItem(key);
                    return raw ? JSON.parse(raw) : null;
                } catch (error) {
                    return null;
                }
            },
            write: function (value) {
                try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* private mode */ }
            },
            clear: function () {
                try { window.localStorage.removeItem(key); } catch (error) { /* private mode */ }
            },
        };
    }

    /* One beacon per page load, at most one counted view per reader every half
       hour: a reload or a back-navigation should not inflate the number. The
       throttled call still asks for the current count so the widget stays
       accurate. */
    var VIEW_WINDOW_MS = 30 * 60 * 1000;
    var viewRequest = null;

    function countView(siteKey, page, title) {
        if (viewRequest) return viewRequest;

        var storageKey = 'tells.views.' + siteKey + ':' + page;
        var seenRecently = false;
        try {
            var last = Number(window.localStorage.getItem(storageKey) || 0);
            seenRecently = last && (Date.now() - last) < VIEW_WINDOW_MS;
        } catch (error) { /* private mode: count it */ }

        var query = '?' + new URLSearchParams({ site: siteKey, page: page }).toString();
        if (seenRecently) {
            viewRequest = request('/api/v1/views' + query);
        } else {
            viewRequest = request('/api/v1/views' + query, {
                method: 'POST',
                body: { site: siteKey, page: page, pageUrl: window.location.href, pageTitle: title },
            }).then(function (data) {
                try { window.localStorage.setItem(storageKey, String(Date.now())); } catch (error) { /* private mode */ }
                return data;
            });
        }
        return viewRequest;
    }

    function pagePathOf(node) {
        var explicit = node.getAttribute('data-page');
        if (explicit) return explicit;
        return window.location.pathname;
    }

    function Widget(node) {
        this.node = node;
        this.siteKey = node.getAttribute('data-site') || DEFAULT_SITE;
        this.kind = (node.getAttribute('data-tells') || 'comments').toLowerCase();
        this.page = pagePathOf(node);
        this.pageTitle = node.getAttribute('data-title') || document.title;
        this.locale = normalizeLocale(node.getAttribute('data-locale'), PAGE_LOCALE);
        this.strings = STRINGS[this.locale];
        this.errors = ERRORS[this.locale] || ERRORS.he;
        this.store = identityStore(this.siteKey);
        this.identity = this.store.read();
        this.site = null;
        this.replyTo = null;
        this.notice = null;
        node.classList.add('tlx');
        if (node.getAttribute('data-theme')) node.setAttribute('data-theme', node.getAttribute('data-theme'));
    }

    Widget.prototype.messageFor = function (error, fallback) {
        if (!error) return fallback || this.strings.genericError;
        return this.errors[error.code] || error.message || fallback || this.strings.genericError;
    };

    Widget.prototype.token = function () {
        return this.identity && this.identity.token ? this.identity.token : '';
    };

    Widget.prototype.query = function (extra) {
        var params = new URLSearchParams({ site: this.siteKey, page: this.page });
        if (extra) Object.keys(extra).forEach(function (key) { params.set(key, extra[key]); });
        return '?' + params.toString();
    };

    Widget.prototype.fail = function (message) {
        this.node.textContent = '';
        this.node.appendChild(el('p', 'tlx-msg tlx-err', message));
    };

    /* ---- identity ---- */

    Widget.prototype.renderIdentityGate = function (container, onReady) {
        var self = this;
        var strings = this.strings;
        var card = el('div', 'tlx-idcard');
        card.appendChild(el('h4', null, strings.identityTitle));
        card.appendChild(el('p', null, strings.identityLead));

        var form = el('form');
        form.setAttribute('novalidate', 'novalidate');
        var email = el('input');
        email.type = 'email';
        email.name = 'email';
        email.required = true;
        email.autocomplete = 'email';
        email.placeholder = strings.emailLabel;
        email.setAttribute('aria-label', strings.emailLabel);

        var name = el('input');
        name.type = 'text';
        name.name = 'name';
        name.autocomplete = 'nickname';
        name.maxLength = 60;
        name.placeholder = strings.nameLabel;
        name.setAttribute('aria-label', strings.nameLabel);

        var row = el('div', 'tlx-idrow');
        var submit = el('button', 'tlx-btn', strings.registerEmail);
        submit.type = 'submit';
        row.appendChild(submit);

        var anonButton = null;
        if (this.site && this.site.allowAnonymous) {
            anonButton = el('button', 'tlx-btn tlx-ghost', strings.continueAnonymous);
            anonButton.type = 'button';
            row.appendChild(anonButton);
        }

        var message = el('div', 'tlx-msg tlx-err');
        message.hidden = true;

        form.appendChild(email);
        form.appendChild(name);
        form.appendChild(row);
        card.appendChild(form);
        card.appendChild(message);
        container.appendChild(card);

        function register(payload, button) {
            message.hidden = true;
            var previous = button.textContent;
            button.disabled = true;
            button.textContent = strings.registering;
            if (anonButton) anonButton.disabled = true;
            submit.disabled = true;

            request('/api/v1/visitors' + self.query(), { method: 'POST', body: payload })
                .then(function (data) {
                    self.identity = { token: data.token, visitor: data.visitor };
                    self.store.write(self.identity);
                    onReady();
                })
                .catch(function (error) {
                    message.textContent = self.messageFor(error);
                    message.hidden = false;
                })
                .then(function () {
                    button.disabled = false;
                    button.textContent = previous;
                    if (anonButton) anonButton.disabled = false;
                    submit.disabled = false;
                });
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            register({
                site: self.siteKey, mode: 'email', locale: self.locale,
                email: email.value, name: name.value,
            }, submit);
        });
        if (anonButton) {
            anonButton.addEventListener('click', function () {
                register({
                    site: self.siteKey, mode: 'anonymous', locale: self.locale,
                    name: name.value,
                }, anonButton);
            });
        }
    };

    Widget.prototype.renderIdentityBar = function (container, onSwitch) {
        var strings = this.strings;
        var visitor = this.identity.visitor || {};
        var bar = el('div', 'tlx-id');
        var who = visitor.kind === 'anonymous' ? (visitor.name || strings.anonymous) : (visitor.name || visitor.email);
        bar.appendChild(el('span', null, strings.signedInAs + ' ' + who));
        var switcher = el('button', 'tlx-link', strings.switchIdentity);
        switcher.type = 'button';
        switcher.addEventListener('click', onSwitch);
        bar.appendChild(switcher);
        container.appendChild(bar);
    };

    /* ---- likes ---- */

    Widget.prototype.mountLikes = function () {
        var self = this;
        var strings = this.strings;
        this.node.textContent = '';

        var button = el('button', 'tlx-like');
        button.type = 'button';
        button.disabled = true;
        button.setAttribute('aria-pressed', 'false');
        var heart = el('span', 'tlx-heart', '♡');
        var count = el('span', 'tlx-likecount', '0');
        var label = el('span', 'tlx-likelabel', strings.likeAdd);
        button.appendChild(heart);
        button.appendChild(count);
        button.appendChild(label);
        this.node.appendChild(button);

        var error = el('p', 'tlx-msg tlx-err');
        error.hidden = true;
        this.node.appendChild(error);

        function paint(data) {
            count.textContent = String(data.count);
            button.setAttribute('aria-pressed', data.liked ? 'true' : 'false');
            heart.textContent = data.liked ? '♥' : '♡';
            label.textContent = data.liked ? strings.likeRemove : strings.likeAdd;
            button.setAttribute('aria-label', label.textContent + ' — ' + data.count + ' ' + strings.likesCount);
        }

        function ensureIdentity() {
            if (self.token()) return Promise.resolve();
            /* Likes never interrupt with a form: when the site allows anonymous
               visitors we mint one silently, otherwise we point at the comments
               widget where the email signup lives. */
            if (self.site && self.site.allowAnonymous) {
                return request('/api/v1/visitors' + self.query(), {
                    method: 'POST',
                    body: { site: self.siteKey, mode: 'anonymous', locale: self.locale },
                }).then(function (data) {
                    self.identity = { token: data.token, visitor: data.visitor };
                    self.store.write(self.identity);
                });
            }
            return Promise.reject(Object.assign(new Error(strings.identityLead), { code: 'identity_required' }));
        }

        button.addEventListener('click', function () {
            button.disabled = true;
            error.hidden = true;
            ensureIdentity()
                .then(function () {
                    return request('/api/v1/likes' + self.query(), {
                        method: 'POST',
                        token: self.token(),
                        body: {
                            site: self.siteKey,
                            page: self.page,
                            pageUrl: window.location.href,
                            pageTitle: self.pageTitle,
                        },
                    });
                })
                .then(paint)
                .catch(function (err) {
                    if (err.status === 401) self.store.clear();
                    error.textContent = self.messageFor(err);
                    error.hidden = false;
                })
                .then(function () { button.disabled = false; });
        });

        request('/api/v1/likes' + self.query(), { token: self.token() })
            .then(function (data) {
                self.site = data.site;
                paint(data);
                button.disabled = false;
            })
            .catch(function (err) {
                error.textContent = self.messageFor(err);
                error.hidden = false;
            });
    };

    /* ---- comments ---- */

    Widget.prototype.mountComments = function () {
        var self = this;
        this.node.textContent = '';
        var loading = el('p', 'tlx-note', '…');
        this.node.appendChild(loading);
        this.load();
    };

    Widget.prototype.load = function () {
        var self = this;
        request('/api/v1/comments' + this.query(), { token: this.token() })
            .then(function (data) {
                self.site = data.site;
                if (data.visitor) {
                    self.identity = { token: self.token(), visitor: data.visitor };
                    self.store.write(self.identity);
                } else if (self.identity && self.token()) {
                    /* The stored token no longer resolves (site key rotated, or
                       the visitor was removed): start over cleanly. */
                    self.store.clear();
                    self.identity = null;
                }
                self.render(data);
            })
            .catch(function (error) {
                self.fail(self.messageFor(error, self.strings.loadError));
            });
    };

    Widget.prototype.render = function (data) {
        var self = this;
        var strings = this.strings;
        var node = this.node;
        node.textContent = '';

        var heading = el('h3', 'tlx-h');
        heading.appendChild(document.createTextNode(strings.comments));
        heading.appendChild(el('span', 'tlx-count', '(' + data.total + ')'));
        node.appendChild(heading);

        var byParent = {};
        data.comments.forEach(function (comment) {
            if (!comment.parentId) return;
            (byParent[comment.parentId] = byParent[comment.parentId] || []).push(comment);
        });

        if (!data.comments.length && !data.pending.length) {
            node.appendChild(el('p', 'tlx-empty', strings.noComments));
        } else {
            var list = el('ul', 'tlx-list');
            data.comments.forEach(function (comment) {
                if (comment.parentId) return;
                list.appendChild(self.commentItem(comment, false));
                (byParent[comment.id] || []).forEach(function (reply) {
                    list.appendChild(self.commentItem(reply, true));
                });
            });
            data.pending.forEach(function (comment) {
                list.appendChild(self.commentItem(comment, !!comment.parentId, true));
            });
            node.appendChild(list);
        }

        if (!data.site.commentsEnabled) {
            node.appendChild(el('p', 'tlx-note', strings.commentsClosed));
            return;
        }

        var formArea = el('div', 'tlx-formarea');
        node.appendChild(formArea);
        this.renderComposer(formArea);
    };

    Widget.prototype.commentItem = function (comment, isReply, pending) {
        var strings = this.strings;
        var item = el('li', 'tlx-item' + (isReply ? ' tlx-reply' : '') + (pending ? ' tlx-pending' : ''));
        var meta = el('div', 'tlx-meta');
        meta.appendChild(el('span', 'tlx-author', comment.author));
        if (comment.isAnonymous) meta.appendChild(el('span', 'tlx-badge', strings.anonymous));
        if (pending) meta.appendChild(el('span', 'tlx-badge', strings.pendingNotice));
        meta.appendChild(el('span', 'tlx-time', timeAgo(comment.createdAt, this.locale, strings)));
        item.appendChild(meta);
        item.appendChild(renderBody(comment.body));

        if (!pending && !isReply) {
            var actions = el('div', 'tlx-actions');
            var reply = el('button', 'tlx-link', strings.reply);
            reply.type = 'button';
            var self = this;
            reply.addEventListener('click', function () {
                self.replyTo = { id: comment.id, author: comment.author };
                var textarea = self.node.querySelector('.tlx-form textarea');
                if (textarea) textarea.focus();
                self.refreshReplyBanner();
            });
            actions.appendChild(reply);
            item.appendChild(actions);
        }
        return item;
    };

    Widget.prototype.refreshReplyBanner = function () {
        var banner = this.node.querySelector('.tlx-replybanner');
        if (!banner) return;
        if (!this.replyTo) {
            banner.hidden = true;
            return;
        }
        banner.hidden = false;
        banner.textContent = '';
        banner.appendChild(document.createTextNode(this.strings.replyTo + this.replyTo.author + ' '));
        var cancel = el('button', 'tlx-link', this.strings.cancel);
        cancel.type = 'button';
        var self = this;
        cancel.addEventListener('click', function () {
            self.replyTo = null;
            self.refreshReplyBanner();
        });
        banner.appendChild(cancel);
    };

    Widget.prototype.renderComposer = function (container) {
        var self = this;
        var strings = this.strings;
        container.textContent = '';

        if (!this.token()) {
            this.renderIdentityGate(container, function () {
                self.load();
            });
            return;
        }

        this.renderIdentityBar(container, function () {
            self.store.clear();
            self.identity = null;
            self.renderComposer(container);
        });

        var form = el('form', 'tlx-form');
        var banner = el('div', 'tlx-replybanner tlx-note');
        banner.hidden = true;
        form.appendChild(banner);

        var textarea = el('textarea');
        textarea.placeholder = strings.writeComment;
        textarea.required = true;
        textarea.maxLength = 2000;
        textarea.setAttribute('aria-label', strings.writeComment);
        form.appendChild(textarea);

        /* Honeypot: a real visitor never sees it, a naive bot fills it in. */
        var honeypot = el('input', 'tlx-hp');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.tabIndex = -1;
        honeypot.setAttribute('autocomplete', 'off');
        honeypot.setAttribute('aria-hidden', 'true');
        form.appendChild(honeypot);

        var row = el('div', 'tlx-row');
        var counter = el('span', 'tlx-count', '2000 ' + strings.charactersLeft);
        var submit = el('button', 'tlx-btn', strings.send);
        submit.type = 'submit';
        row.appendChild(counter);
        row.appendChild(submit);
        form.appendChild(row);

        if (this.site && this.site.moderation === 'pre') {
            form.appendChild(el('p', 'tlx-note', strings.moderationNote));
        }

        var message = el('div', 'tlx-msg');
        message.hidden = true;
        if (this.notice) {
            message.className = 'tlx-msg tlx-ok';
            message.textContent = this.notice;
            message.hidden = false;
            this.notice = null;
        }
        form.appendChild(message);

        textarea.addEventListener('input', function () {
            counter.textContent = (2000 - textarea.value.length) + ' ' + strings.charactersLeft;
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!textarea.value.trim()) return;
            submit.disabled = true;
            submit.textContent = strings.sending;
            message.hidden = true;

            request('/api/v1/comments' + self.query(), {
                method: 'POST',
                token: self.token(),
                body: {
                    site: self.siteKey,
                    page: self.page,
                    pageUrl: window.location.href,
                    pageTitle: self.pageTitle,
                    locale: self.locale,
                    body: textarea.value,
                    parentId: self.replyTo ? self.replyTo.id : null,
                    hp: honeypot.value,
                },
            })
                .then(function (data) {
                    textarea.value = '';
                    self.replyTo = null;
                    counter.textContent = '2000 ' + strings.charactersLeft;
                    /* The list reloads right after, which rebuilds this form —
                       so the confirmation travels with the widget, not with the
                       element that is about to be replaced. */
                    self.notice = data.status === 'approved' ? strings.publishedNotice : strings.pendingNotice;
                    self.load();
                })
                .catch(function (error) {
                    if (error.status === 401) {
                        self.store.clear();
                        self.identity = null;
                        self.renderComposer(container);
                        return;
                    }
                    message.className = 'tlx-msg tlx-err';
                    message.textContent = self.messageFor(error);
                    message.hidden = false;
                })
                .then(function () {
                    submit.disabled = false;
                    submit.textContent = strings.send;
                });
        });

        container.appendChild(form);
        this.refreshReplyBanner();
    };

    Widget.prototype.mountViews = function () {
        var self = this;
        var strings = this.strings;
        this.node.textContent = '';

        var wrapper = el('span', 'tlx-views');
        wrapper.appendChild(el('span', 'tlx-eye', '👁'));
        var number = el('span', 'tlx-viewnum', '—');
        wrapper.appendChild(number);
        var label = el('span', 'tlx-viewlabel', strings.views);
        wrapper.appendChild(label);
        this.node.appendChild(wrapper);

        var scope = this.node.getAttribute('data-scope') === 'site' ? 'site' : 'page';

        function paint(data) {
            var count = data.count || 0;
            number.textContent = count.toLocaleString(self.locale);
            label.textContent = count === 1 ? strings.viewsOne : strings.views;
            if (data.today) {
                wrapper.title = data.today.toLocaleString(self.locale) + ' ' + strings.viewsToday;
            }
        }

        countView(this.siteKey, this.page, this.pageTitle)
            .then(function (data) {
                if (scope === 'page') return paint(data);
                /* A site-wide counter needs its own total, not this page's. */
                return request('/api/v1/views?' + new URLSearchParams({
                    site: self.siteKey, page: self.page, scope: 'site',
                }).toString()).then(paint);
            })
            .catch(function () {
                /* A counter that cannot load simply says nothing. */
                self.node.textContent = '';
            });
    };

    Widget.prototype.mount = function () {
        if (!this.siteKey) {
            this.fail('Tells Engage: missing data-site');
            return;
        }
        if (this.kind === 'likes') this.mountLikes();
        else if (this.kind === 'views') this.mountViews();
        else this.mountComments();
    };

    function mountAll(root) {
        injectStyles();
        var nodes = (root || document).querySelectorAll('[data-tells]:not([data-tells-mounted])');
        Array.prototype.forEach.call(nodes, function (node) {
            node.setAttribute('data-tells-mounted', '1');
            new Widget(node).mount();
        });

        /* Counting is automatic: a page with no widget at all still registers
           the visit, as long as the script knows which site it belongs to. */
        if (DEFAULT_SITE && script.getAttribute('data-views') !== 'off') {
            countView(DEFAULT_SITE, window.location.pathname, document.title)
                .catch(function () { /* a failed beacon is not the page's problem */ });
        }
    }

    window.TellsEngage = {
        base: BASE,
        mount: mountAll,
        /* Programmatic mount for apps that render their containers later. */
        mountElement: function (node, options) {
            injectStyles();
            options = options || {};
            Object.keys(options).forEach(function (key) {
                var attr = key === 'widget' ? 'data-tells' : 'data-' + key.toLowerCase();
                node.setAttribute(attr, options[key]);
            });
            if (!node.getAttribute('data-tells')) node.setAttribute('data-tells', 'comments');
            node.setAttribute('data-tells-mounted', '1');
            new Widget(node).mount();
        },
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { mountAll(); });
    } else {
        mountAll();
    }
})();
