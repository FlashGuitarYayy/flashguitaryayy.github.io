/* 渲染逻辑。内容在 data.js，界面文字在 i18n.js，一般不需要改这里。 */
(function () {
  "use strict";

  var LANGS = window.LANGS || [];
  var I18N = window.I18N || {};
  var SITE = window.SITE || {};
  var SONGS = Array.isArray(window.SONGS) ? window.SONGS : [];
  var TOOLS = Array.isArray(window.TOOLS) ? window.TOOLS : [];
  var COVERS = Array.isArray(window.COVERS) ? window.COVERS : [];
  var DEFAULT_LANG = "en";
  var root = document.documentElement;
  var mobileMQ = window.matchMedia("(max-width: 899px)");
  var lang = detectLang();

  /* ---------- 小工具函数 ---------- */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* 找不到元素就什么也不做。浏览器缓存可能让新脚本配上旧页面（或反过来），
   * 这时缺一个元素只会少显示一块，而不是整页空白。 */
  function setHTML(sel, html) { var el = $(sel); if (el) el.innerHTML = html; return el; }
  function setText(sel, s) { var el = $(sel); if (el) el.textContent = s; return el; }
  function setHidden(sel, on) { var el = $(sel); if (el) el.hidden = on; return el; }
  function setLabel(el, label) { if (!el) return; el.setAttribute("aria-label", label); el.title = label; }
  function hasLang(code) { return Object.prototype.hasOwnProperty.call(I18N, code); }

  function detectLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && hasLang(q)) return q;
    try {
      var saved = localStorage.getItem("lang");
      if (saved && hasLang(saved)) return saved;
    } catch (e) { /* 隐私模式等情况下读不到，忽略 */ }
    var prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || DEFAULT_LANG];
    for (var i = 0; i < prefs.length; i++) {
      var n = String(prefs[i]).toLowerCase();
      if (n.indexOf("zh") === 0) return /hant|tw|hk|mo/.test(n) ? "zh-Hant" : "zh-Hans";
      if (/^sv(-|$)/.test(n)) return "sv";
      if (n.indexOf("en") === 0) return "en";
    }
    return DEFAULT_LANG;
  }

  /* 界面文字 */
  function t(key) {
    var d = I18N[lang] || {};
    if (d[key] != null) return d[key];
    var e = I18N[DEFAULT_LANG] || {};
    return e[key] != null ? e[key] : key;
  }

  /* 内容字段：字符串直接用；对象按语言取，缺了就回退 */
  function L(v) {
    if (v == null) return "";
    if (typeof v !== "object") return String(v);
    /* 简体、繁体互相补；其他语言（瑞典语等）缺内容时用英文版 */
    var order = [lang];
    if (lang === "zh-Hans") order.push("zh-Hant");
    else if (lang === "zh-Hant") order.push("zh-Hans");
    order.push("en");
    for (var i = 0; i < order.length; i++) if (v[order[i]]) return String(v[order[i]]);
    for (var k in v) if (Object.prototype.hasOwnProperty.call(v, k) && v[k]) return String(v[k]);
    return "";
  }

  /* 链接字段：支持直接写网址，或 { url, label } */
  function linkOf(v) {
    if (!v) return { url: "", label: "" };
    if (typeof v === "string") return { url: v, label: "" };
    return { url: v.url || "", label: L(v.label) };
  }

  var ICON = {
    play: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z" fill="currentColor"/></svg>',
    ext: '<svg class="ic ic--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    down: '<svg class="ic ic--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M4 19h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    file: '<svg class="ic ic--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l5 5v13H6zM14 3v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    link: '<svg class="ic ic--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    note: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.5" fill="currentColor"/><circle cx="16.5" cy="15" r="2.5" fill="currentColor"/></svg>',
    tool: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5a4 4 0 0 0 5 5L9 21l-3-3L16.5 7.5a4 4 0 0 0-2-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    mail: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m3 7 9 6 9-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    github: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.8c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" fill="currentColor"/></svg>',
    video: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m16 10 5-3v10l-5-3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    menu: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    close: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    chevL: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 6l-6 6 6 6M19 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevR: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6l6 6-6 6M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  /* ---------- 通用组件 ---------- */

  /* 一句一行：在英文句号/问号/叹号（后面跟空格）和中文。！？后面换行 */
  function sentenceLines(text) {
    return esc(text)
      .replace(/([.!?])\s+(?=\S)/g, "$1<br>")
      .replace(/([。！？])(?=\S)/g, "$1<br>");
  }

  function emptyBtn(label) {
    return '<span class="btn btn--empty">' + esc(label) + "</span>";
  }

  /* 难度星级：浅色的 5 颗星打底，上面叠一层强调色的星，按分数截取宽度（支持 3.5 这种半颗） */
  var MAX_STARS = 5;
  function starsHTML(value) {
    var n = Number(value);
    if (!(n > 0)) return emptyBtn(t("coming_soon"));
    n = Math.min(MAX_STARS, n);
    var row = new Array(MAX_STARS + 1).join("★");
    var label = t("difficulty") + " " + n + "/" + MAX_STARS;
    return (
      '<span class="stars" role="img" aria-label="' + esc(label) + '" title="' + esc(n + "/" + MAX_STARS) + '">' +
      '<span class="stars__base" aria-hidden="true">' + row + "</span>" +
      '<span class="stars__fill" aria-hidden="true" style="width:' + (n / MAX_STARS * 100) + '%">' + row + "</span>" +
      "</span>"
    );
  }

  /* 按网址认出视频平台，用作按钮文字 */
  function platformName(url) {
    if (/(^|\.)(youtube\.com|youtu\.be)\//i.test(String(url).replace(/^https?:\/\//, ""))) return "YouTube";
    if (/(^|\.)(bilibili\.com|b23\.tv)\//i.test(String(url).replace(/^https?:\/\//, ""))) return "Bilibili";
    return "";
  }

  /* 视频字段可以是一个链接，也可以是多个链接组成的数组；每个链接一个按钮 */
  function videoButton(v, fallbackLabel) {
    var list = (Array.isArray(v) ? v : [v]).map(linkOf).filter(function (l) { return l.url; });
    if (!list.length) return emptyBtn(t("coming_soon"));
    return '<div class="chips">' + list.map(function (l) {
      return (
        '<a class="btn" href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
        ICON.play + "<span>" + esc(l.label || platformName(l.url) || fallbackLabel) + "</span>" + ICON.ext +
        "</a>"
      );
    }).join("") + "</div>";
  }

  function fileName(f) { return f.name || String(f.file).split("/").pop(); }

  function pdfChip(f) {
    var name = fileName(f);
    return (
      '<span class="chip chip--pdf">' +
      '<a class="chip__main" href="' + esc(f.file) + '" target="_blank" rel="noopener" title="' + esc(t("open_pdf")) + '">' +
      '<span class="chip__kind">PDF</span><span class="chip__label">' + esc(L(f.label) || name) + "</span></a>" +
      '<a class="chip__dl" href="' + esc(f.file) + '" download="' + esc(name) + '" title="' + esc(t("download") + " " + name) + '" aria-label="' + esc(t("download")) + '">' +
      ICON.down + "</a>" +
      "</span>"
    );
  }

  function msczChip(f) {
    var name = fileName(f);
    return (
      '<span class="chip chip--mscz">' +
      '<a class="chip__main" href="' + esc(f.file) + '" download="' + esc(name) + '" title="' + esc(t("download") + " " + name) + '">' +
      '<span class="chip__kind">MSCZ</span><span class="chip__label">' + esc(L(f.label) || name) + "</span>" + ICON.down + "</a>" +
      "</span>"
    );
  }

  function extraLink(l) {
    if (!l || !l.url) return "";
    return (
      '<a class="btn btn--quiet" href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
      ICON.link + "<span>" + esc(L(l.label) || l.url) + "</span>" + ICON.ext + "</a>"
    );
  }

  /* ---------- 一首歌 ---------- */

  function renderSong(s, i) {
    var cover = s.cover || "assets/covers/" + s.id + ".jpg";
    var pdfs = Array.isArray(s.pdf) ? s.pdf : [];
    var mscz = Array.isArray(s.mscz) ? s.mscz : [];
    var extras = (Array.isArray(s.extraLinks) ? s.extraLinks : []).map(extraLink).join("");
    var firstPdf = pdfs[0];
    var title = L(s.title);

    var img =
      '<img src="' + esc(cover) + '" alt="' + esc(title + " " + t("cover_alt")) + '" loading="lazy" ' +
      "onerror=\"this.closest('.song__cover').classList.add('is-missing')\">";

    /* 封面的几种形态：
     *   cover 自定义图片     居中裁切（PDF 第一页渲染的封面则从顶部开始显示）
     *   coverFull: true      完整显示图片，框的比例跟着图片走，不裁成正方形
     *   coverBack: 图片路径   悬浮时翻到背面显示这张图；点击行为不变 */
    var coverCls = "song__cover" +
      (s.cover ? " song__cover--custom" : "") +
      (s.coverFull ? " song__cover--full" : "") +
      (s.coverBack ? " song__cover--flip" : "");
    var face = s.coverBack
      ? '<span class="flip"><span class="flip__face flip__front">' + img + "</span>" +
        '<span class="flip__face flip__back"><img src="' + esc(s.coverBack) + '" alt="" loading="lazy"></span></span>'
      : img;
    /* coverRatio：指定封面框的宽高比，比如 "4 / 3"（翻转卡片想要非正方形时用这个） */
    var coverStyle = s.coverRatio ? ' style="aspect-ratio:' + esc(String(s.coverRatio)) + '"' : "";
    var coverEl = firstPdf
      ? '<a class="' + coverCls + '"' + coverStyle + ' data-title="' + esc(title) + '" href="' + esc(firstPdf.file) +
        '" target="_blank" rel="noopener" title="' + esc(t("open_pdf")) + '">' + face +
        '<span class="song__cover-hint">' + ICON.file + "<span>" + esc(t("preview_pdf")) + "</span></span></a>"
      : '<div class="' + coverCls + '"' + coverStyle + ' data-title="' + esc(title) + '">' + face + "</div>";

    var album = L(s.album);
    var meta = [L(s.artist), album ? "《" + album + "》" : "", s.arranged ? t("arranged") + " " + s.arranged : ""]
      .filter(Boolean)
      .join(" · ");

    /* quote 可以是一句，也可以是数组（多行）；字符串里的换行也算分行 */
    var quoteLines = (Array.isArray(s.quote) ? s.quote.map(L) : L(s.quote).split("\n"))
      .map(function (x) { return x.trim(); })
      .filter(Boolean);
    var quoteEl = quoteLines.length
      ? '<blockquote class="song__quote' + (s.quoteMarks === false ? " song__quote--plain" : "") + '"><p>' + quoteLines.map(esc).join("<br>") + "</p>" +
        (L(s.quoteBy) ? "<footer>" + esc(L(s.quoteBy)) + "</footer>" : "") + "</blockquote>"
      : "";

    /* onRequest：不公开下载，按钮跳到留言表单，并把歌名填进留言 */
    var downloads = s.onRequest
      ? '<a class="btn" href="#contact" data-request="' + esc(title) + '">' + ICON.mail + "<span>" + esc(t("upon_request")) + "</span></a>"
      : pdfs.length || mscz.length
        ? '<div class="chips">' + pdfs.map(pdfChip).join("") + mscz.map(msczChip).join("") + "</div>"
        : emptyBtn(t("coming_soon"));

    var notes = L(s.notes);

    return (
      '<article class="song" id="' + esc(s.id) + '">' +
      coverEl +
      '<div class="song__body">' +
      '<div class="song__head"><span class="song__index">' + pad(i + 1) + '</span><h3 class="song__title">' + esc(title) + "</h3></div>" +
      (meta ? '<p class="song__meta">' + esc(meta) + "</p>" : "") +
      quoteEl +
      (notes ? '<p class="song__notes">' + esc(notes) + "</p>" : "") +
      '<dl class="links">' +
      '<div class="links__row"><dt>' + esc(t("difficulty")) + "</dt><dd>" + starsHTML(s.difficulty) + "</dd></div>" +
      '<div class="links__row"><dt>' + esc(t("downloads")) + "</dt><dd>" + downloads + "</dd></div>" +
      '<div class="links__row"><dt>' + esc(t("demo_video")) + "</dt><dd>" + videoButton(s.demoVideo, t("demo_video")) + "</dd></div>" +
      '<div class="links__row"><dt>' + esc(t("ref_video")) + "</dt><dd>" + videoButton(s.referenceVideo, t("ref_video")) + "</dd></div>" +
      (extras ? '<div class="links__row"><dt>' + esc(t("more")) + '</dt><dd><div class="chips">' + extras + "</div></dd></div>" : "") +
      "</dl>" +
      "</div>" +
      "</article>"
    );
  }

  /* ---------- 一条翻弹视频 ---------- */

  /* 从视频链接里认出平台和 id，给出嵌入地址、封面图和原页面地址 */
  function parseVideo(url) {
    var u = String(url || "").trim();
    if (!u) return null;
    var yt = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (yt) {
      return {
        kind: "youtube",
        embed: "https://www.youtube-nocookie.com/embed/" + yt[1] + "?autoplay=1&rel=0",
        thumb: "https://i.ytimg.com/vi/" + yt[1] + "/hqdefault.jpg",
        watch: "https://www.youtube.com/watch?v=" + yt[1],
      };
    }
    var bili = u.match(/bilibili\.com\/video\/(BV[0-9A-Za-z]+)/);
    if (bili) {
      return {
        kind: "bilibili",
        embed: "https://player.bilibili.com/player.html?bvid=" + bili[1] + "&autoplay=1&high_quality=1&danmaku=0",
        thumb: "",
        watch: "https://www.bilibili.com/video/" + bili[1],
      };
    }
    return { kind: "other", embed: "", thumb: "", watch: u };
  }

  function renderCover(c) {
    var title = L(c.title);
    var v = parseVideo(c.video);
    var thumb = c.thumb || (v && v.thumb) || "";
    var ref = linkOf(c.reference);

    var inner = thumb
      ? '<img src="' + esc(thumb) + '" alt="" loading="lazy" onerror="this.remove()">'
      : "";
    var placeholder = thumb ? "" : '<span class="cover__placeholder">' + esc(title) + "</span>";

    var media;
    if (v && v.embed) {
      media =
        '<div class="cover__media" data-embed="' + esc(v.embed) + '">' +
        '<button class="cover__play" type="button" aria-label="' + esc(t("play") + " · " + title) + '">' +
        placeholder + inner + '<span class="cover__btn">' + ICON.play + "</span></button></div>";
    } else if (v) {
      media =
        '<a class="cover__media" href="' + esc(v.watch) + '" target="_blank" rel="noopener">' +
        placeholder + inner + '<span class="cover__btn">' + ICON.ext + "</span></a>";
    } else {
      media = '<div class="cover__media cover__media--empty">' + placeholder + inner +
        '<span class="cover__tag">' + esc(t("coming_soon")) + "</span></div>";
    }

    var meta = [L(c.artist), c.date].filter(Boolean).join(" · ");
    var notes = L(c.notes);
    var refBtn = ref.url
      ? '<a class="btn" href="' + esc(ref.url) + '" target="_blank" rel="noopener">' + ICON.link + "<span>" + esc(ref.label || t("reference")) + "</span>" + ICON.ext + "</a>"
      : emptyBtn(t("reference") + " · " + t("coming_soon"));
    var openBtn = v
      ? '<a class="btn btn--quiet" href="' + esc(v.watch) + '" target="_blank" rel="noopener">' + ICON.video + "<span>" + esc(platformName(v.watch) || t("open_video")) + "</span>" + ICON.ext + "</a>"
      : "";

    return (
      '<article class="cover" id="cover-' + esc(c.id) + '">' +
      media +
      '<div class="cover__body">' +
      '<h3 class="cover__title">' + esc(title) + "</h3>" +
      (meta ? '<p class="cover__meta">' + esc(meta) + "</p>" : "") +
      (notes ? '<p class="cover__notes">' + esc(notes) + "</p>" : "") +
      '<div class="cover__links">' + refBtn + openBtn + "</div>" +
      "</div>" +
      "</article>"
    );
  }

  /* 点了封面才真正加载播放器 */
  function playCover(media) {
    var src = media.getAttribute("data-embed");
    if (!src) return;
    media.classList.add("is-playing");
    media.innerHTML =
      '<iframe src="' + esc(src) + '" title="video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen scrolling="no"></iframe>';
  }

  /* ---------- 一个工具 ---------- */

  function renderTool(tool) {
    var tags = (Array.isArray(tool.tags) ? tool.tags : []).map(function (x) {
      return "<li>" + esc(x) + "</li>";
    }).join("");
    var icon = tool.icon ? '<span class="tool__icon">' + esc(tool.icon) + "</span>" : '<span class="tool__icon tool__icon--svg">' + ICON.tool + "</span>";
    var gh = tool.github
      ? '<a class="btn" href="' + esc(tool.github) + '" target="_blank" rel="noopener">' + ICON.github + "<span>" + esc(t("github")) + "</span>" + ICON.ext + "</a>"
      : emptyBtn(t("coming_soon"));
    /* 有 preview 动图时它就是演示，不再显示「演示录制中」 */
    var demo = tool.demo
      ? '<a class="btn" href="' + esc(tool.demo) + '" target="_blank" rel="noopener">' + ICON.play + "<span>" + esc(t("demo")) + "</span>" + ICON.ext + "</a>"
      : tool.preview ? "" : emptyBtn(t("demo_soon"));
    var preview = tool.preview
      ? '<div class="tool__media"><img src="' + esc(tool.preview) + '" alt="' + esc(L(tool.name) + " · " + t("demo")) + '" loading="lazy"></div>'
      : "";
    /* 标题的链接撑满整张卡片：点卡片任何地方都打开 GitHub */
    var name = tool.github
      ? '<a class="tool__link" href="' + esc(tool.github) + '" target="_blank" rel="noopener">' + esc(L(tool.name)) + "</a>"
      : esc(L(tool.name));

    return (
      '<article class="tool' + (tool.wip ? " tool--wip" : "") + '" id="tool-' + esc(tool.id) + '">' +
      preview +
      '<div class="tool__head">' + icon + '<h3 class="tool__name">' + name + "</h3>" +
      (tool.wip ? '<span class="tool__status">' + esc(t("wip")) + "</span>" : "") + "</div>" +
      (L(tool.description) ? '<p class="tool__desc">' + sentenceLines(L(tool.description)) + "</p>" : "") +
      (tags ? '<ul class="tags">' + tags + "</ul>" : "") +
      '<div class="tool__actions">' + gh + demo + "</div>" +
      "</article>"
    );
  }

  /* ---------- 留言表单 ---------- */

  function renderContactForm() {
    var cfg = SITE.contact || {};
    var types = ["request", "collab", "feedback", "other"];
    var options = types.map(function (k) {
      return '<option value="' + k + '">' + esc(t("t_" + k)) + "</option>";
    }).join("");
    var hint = !cfg.endpoint && cfg.email ? '<p class="form__hint">' + esc(t("mailto_hint")) + "</p>" : "";

    return (
      '<form class="form" id="contact-form" novalidate>' +
      '<div class="form__grid">' +
      '<label class="field"><span class="field__label">' + esc(t("f_name")) + '</span><input name="name" type="text" autocomplete="name"></label>' +
      '<label class="field"><span class="field__label">' + esc(t("f_contact")) + '</span><input name="contact" type="text" autocomplete="email" placeholder="' + esc(t("f_contact_ph")) + '"></label>' +
      "</div>" +
      '<label class="field"><span class="field__label">' + esc(t("f_type")) + '</span><select name="type">' + options + "</select></label>" +
      '<label class="field"><span class="field__label">' + esc(t("f_message")) + '</span><textarea name="message" rows="5" required placeholder="' + esc(t("f_message_ph")) + '"></textarea></label>' +
      '<input class="hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<div class="form__foot">' +
      '<button class="btn btn--primary" type="submit">' + ICON.mail + "<span>" + esc(t("send")) + "</span></button>" +
      '<p class="form__status" role="status" aria-live="polite"></p>' +
      "</div>" +
      hint +
      "</form>"
    );
  }

  function setStatus(form, text, kind) {
    var el = form.querySelector(".form__status");
    if (!el) return;
    el.textContent = text;
    el.className = "form__status" + (kind ? " is-" + kind : "");
  }

  function sendMessage(form) {
    var cfg = SITE.contact || {};
    var f = form.elements;
    if (f._gotcha && f._gotcha.value) return; // 机器人填了隐藏字段，直接忽略

    var message = (f.message.value || "").trim();
    if (!message) {
      setStatus(form, t("required"), "error");
      f.message.focus();
      return;
    }

    var typeLabel = f.type.options[f.type.selectedIndex].text;
    var name = (f.name.value || "").trim();
    var contact = (f.contact.value || "").trim();
    var payload = {
      name: name,
      contact: contact,
      type: f.type.value,
      type_label: typeLabel,
      message: message,
      lang: lang,
      page: location.href,
      _subject: "[" + L(SITE.title) + "] " + typeLabel + (name ? " · " + name : ""),
    };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      payload.email = contact;
      payload._replyto = contact;
    }
    if (cfg.accessKey) payload.access_key = cfg.accessKey;

    if (cfg.endpoint) {
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      setStatus(form, t("sending"), "");
      fetch(cfg.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json().catch(function () { return {}; });
        })
        .then(function (data) {
          if (data && data.success === false) throw new Error("rejected");
          form.reset();
          setStatus(form, t("sent"), "ok");
        })
        .catch(function () { setStatus(form, t("send_error"), "error"); })
        .then(function () { btn.disabled = false; });
      return;
    }

    if (cfg.email) {
      var body = [typeLabel, "", message, "", "— " + name + (contact ? " <" + contact + ">" : "")].join("\n");
      location.href = "mailto:" + cfg.email + "?subject=" + encodeURIComponent(payload._subject) + "&body=" + encodeURIComponent(body);
      setStatus(form, t("mailto_hint"), "ok");
      return;
    }

    setStatus(form, t("unconfigured"), "error");
  }

  /* ---------- 侧边栏 ---------- */

  function isCollapsed() { return root.getAttribute("data-sidebar") === "collapsed"; }

  function setCollapsed(on) {
    if (on) root.setAttribute("data-sidebar", "collapsed");
    else root.removeAttribute("data-sidebar");
    try { localStorage.setItem("sidebar", on ? "collapsed" : "expanded"); } catch (e) { /* 忽略 */ }
    labelToggle();
  }

  function labelToggle() {
    setLabel($("#sb-toggle"), isCollapsed() ? t("expand_sidebar") : t("collapse_sidebar"));
  }

  function setDrawer(open) {
    if (open) root.setAttribute("data-drawer", "open");
    else root.removeAttribute("data-drawer");
    var btn = $("#sb-open");
    if (btn) btn.setAttribute("aria-expanded", String(open));
  }

  function sbLink(id, icon, label) {
    return (
      '<a class="sb__link" href="#' + id + '" data-section="' + id + '" title="' + esc(label) + '">' +
      icon + '<span class="sb__label">' + esc(label) + "</span></a>"
    );
  }

  function sbSub(items) {
    if (!items.length) return "";
    return '<ul class="sb__sub">' + items.map(function (it) {
      return (
        '<li><a href="#' + esc(it.id) + '">' +
        (it.num ? '<span class="sb__num">' + it.num + "</span>" : "") +
        '<span class="sb__label">' + esc(it.label) + "</span></a></li>"
      );
    }).join("") + "</ul>";
  }

  function renderSidebar() {
    var showTools = TOOLS.length > 0;
    var showContact = SITE.contact !== false;
    var title = L(SITE.title);

    var html =
      '<div class="sb__group">' + sbLink("songs", ICON.note, t("nav_songs")) +
      sbSub(SONGS.map(function (s, i) { return { id: s.id, num: pad(i + 1), label: L(s.title) }; })) +
      "</div>";
    if (COVERS.length) {
      html +=
        '<div class="sb__group">' + sbLink("covers", ICON.video, t("nav_covers")) +
        sbSub(COVERS.map(function (c) { return { id: "cover-" + c.id, label: L(c.title) }; })) +
        "</div>";
    }
    if (showTools) {
      html +=
        '<div class="sb__group">' + sbLink("tools", ICON.tool, t("nav_tools")) +
        sbSub(TOOLS.map(function (x) { return { id: "tool-" + x.id, label: L(x.name) }; })) +
        "</div>";
    }
    if (showContact) {
      html += '<div class="sb__group">' + sbLink("contact", ICON.mail, t("nav_contact")) + "</div>";
    }
    setHTML("#sb-nav", html);

    setText("#brand", title);
    setText("#brand-m", title);

    setHTML("#sb-toggle", '<span class="when-expanded">' + ICON.chevL + '</span><span class="when-collapsed">' + ICON.chevR + "</span>");
    labelToggle();

    setLabel(setHTML("#sb-close", ICON.close), t("close"));
    setLabel(setHTML("#sb-open", ICON.menu), t("menu"));

    /* 侧边栏底部：站点的社交链接（data.js 里的 SITE.links），没有就隐藏 */
    var siteLinks = (SITE.links || []).filter(function (l) { return l && l.url; });
    setHidden("#sb-foot", siteLinks.length === 0);
    setHTML("#sb-foot", siteLinks.map(function (l) {
      return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(L(l.label) || l.url) + "</a>";
    }).join(""));

    var langEl = $("#lang");
    if (!langEl) return;
    langEl.setAttribute("aria-label", t("lang_label"));
    langEl.innerHTML = LANGS.map(function (l) {
      return (
        '<button type="button" data-lang="' + esc(l.code) + '" aria-pressed="' + (l.code === lang) + '" title="' + esc(l.name) + '" lang="' + esc(l.code) + '">' +
        '<span class="lang__full">' + esc(l.label) + '</span><span class="lang__short">' + esc(l.short || l.label) + "</span>" +
        "</button>"
      );
    }).join("");
  }

  /* 滚动时高亮侧边栏里当前所在的区块 / 歌曲 */
  var spyEls = [];
  var spyPending = false;

  function cacheSpy() {
    spyEls = $$(".section[id], .song[id], .cover[id], .tool[id]").filter(function (el) { return !el.closest("[hidden]"); });
  }

  function updateSpy() {
    spyPending = false;
    var limit = mobileMQ.matches ? 110 : 140;
    var current = null;
    for (var i = 0; i < spyEls.length; i++) {
      if (spyEls[i].getBoundingClientRect().top <= limit) current = spyEls[i];
      else break;
    }
    var atBottom = window.innerHeight + window.pageYOffset >= root.scrollHeight - 2;
    if (atBottom && spyEls.length) current = spyEls[spyEls.length - 1];

    var curId = current ? current.id : null;
    var secEl = current ? (current.classList.contains("section") ? current : current.closest(".section")) : null;
    var secId = secEl ? secEl.id : null;

    $$("#sb-nav a").forEach(function (a) {
      var target = a.getAttribute("href").slice(1);
      var active = a.classList.contains("sb__link") ? target === secId : target === curId;
      a.classList.toggle("is-active", active);
    });
  }

  function requestSpy() {
    if (spyPending) return;
    spyPending = true;
    requestAnimationFrame(updateSpy);
  }

  /* ---------- 整页 ---------- */

  function renderHero() {
    setText("#site-eyebrow", L(SITE.eyebrow));
    /* 大标题：「 / 」后面的部分（比如中文名）排成浅色、整体不拆行 */
    var heroTitle = L(SITE.heroTitle) || L(SITE.title);
    var cut = heroTitle.indexOf(" / ");
    setHTML("#site-title", cut < 0
      ? esc(heroTitle)
      : esc(heroTitle.slice(0, cut)) + ' <span class="hero__alt">/ ' + esc(heroTitle.slice(cut + 3)) + "</span>");
    /* 每行可以是文字，也可以是 { text, image }：image 是行末的小圆图 */
    var lines = (Array.isArray(SITE.tagline) ? SITE.tagline : [SITE.tagline]).map(function (x) {
      return x && x.text !== undefined ? { text: L(x.text), image: x.image || "" } : { text: L(x), image: "" };
    }).filter(function (x) { return x.text; });
    var tagline = $("#site-tagline");
    if (tagline) {
      tagline.hidden = lines.length === 0;
      var fmt = function (s) { return esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>"); };
      tagline.innerHTML = lines.map(function (x) {
        if (!x.image) return "<p>" + fmt(x.text) + "</p>";
        /* 小图和这一行的最后一个词绑在一起，换行时不会单独掉到下一行 */
        var text = x.text.replace(/\s+$/, "");
        var cut = text.lastIndexOf(" ") + 1;
        var tail = text.slice(cut);
        if (tail.indexOf("*") >= 0) { cut = text.length; tail = ""; }
        return "<p>" + fmt(text.slice(0, cut)) + '<span class="nowrap">' + fmt(tail) +
          '<img class="hero__pic" src="' + esc(x.image) + '" alt="" loading="lazy" onerror="this.remove()"></span></p>';
      }).join("");
    } else {
      setText("#site-intro", lines.map(function (x) { return x.text; }).join(" ").replace(/\*/g, "")); // 旧版页面的位置
    }
    setHTML("#hero-actions",
      '<a class="btn btn--primary" href="#songs">' + ICON.note + "<span>" + esc(t("nav_songs")) + "</span></a>" +
      (COVERS.length ? '<a class="btn" href="#covers">' + ICON.video + "<span>" + esc(t("nav_covers")) + "</span></a>" : "") +
      (TOOLS.length ? '<a class="btn" href="#tools">' + ICON.tool + "<span>" + esc(t("nav_tools")) + "</span></a>" : "") +
      (SITE.contact !== false ? '<a class="btn" href="#contact">' + ICON.mail + "<span>" + esc(t("nav_contact")) + "</span></a>" : ""));
  }

  function renderSections() {
    $$("[data-t]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-t"));
      if (el.classList.contains("section__desc")) el.hidden = !el.textContent;  // 说明留空就整段隐藏
    });

    setHTML("#song-list", SONGS.length
      ? SONGS.map(renderSong).join("")
      : '<p class="empty">' + esc(t("no_songs")) + "</p>");

    setHidden("#covers", COVERS.length === 0);
    var coverList = setHTML("#cover-list", COVERS.map(renderCover).join(""));
    if (coverList) coverList.style.setProperty("--n", COVERS.length);  // 卡片数，CSS 用它把整组居中

    setHidden("#tools", TOOLS.length === 0);
    var toolList = setHTML("#tool-list", TOOLS.map(renderTool).join(""));
    if (toolList) toolList.style.setProperty("--n", TOOLS.length);  // 同翻弹：卡片不够一行时整组居中

    setHidden("#contact", SITE.contact === false);
    setHTML("#contact-form-wrap", SITE.contact === false ? "" : renderContactForm());
  }

  function renderFooter() {
    var links = (SITE.links || []).filter(function (l) { return l && l.url; });
    setHTML("#foot",
      '<p class="foot__text">' + esc(L(SITE.footer)) + "</p>" +
      '<p class="foot__links">' +
      links.map(function (l) {
        return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(L(l.label) || l.url) + "</a>";
      }).join("") +
      '<span class="foot__made">' + esc(t("footer_made")) + "</span>" +
      "</p>");
  }

  function render() {
    root.lang = lang;
    document.title = L(SITE.title);
    /* 每块单独渲染：某一块出错只会让那一块缺失，其余照常显示 */
    [renderSidebar, renderHero, renderSections, renderFooter, cacheSpy, updateSpy].forEach(function (step) {
      try { step(); } catch (e) { if (window.console) console.error(e); }
    });
  }

  function setLang(code) {
    if (!hasLang(code) || code === lang) return;
    lang = code;
    try { localStorage.setItem("lang", code); } catch (e) { /* 忽略 */ }
    try {
      var u = new URL(location.href);
      if (u.searchParams.has("lang")) { u.searchParams.set("lang", code); history.replaceState(null, "", u); }
    } catch (e) { /* 忽略 */ }
    render();
  }

  /* ---------- 事件 ---------- */

  /* 点了 Upon request：留言类型选「点歌 · 求谱」，留言框是空的就先填上歌名 */
  function prefillRequest(title) {
    var form = $("#contact-form");
    if (!form) return;
    if (form.elements.type) form.elements.type.value = "request";
    var msg = form.elements.message;
    if (msg && !msg.value.trim()) msg.value = title + " · PDF / MSCZ\n";
    if (msg) setTimeout(function () { msg.focus({ preventScroll: true }); }, 450);
  }

  document.addEventListener("click", function (e) {
    var req = e.target.closest("[data-request]");
    if (req) prefillRequest(req.getAttribute("data-request")); // 不 return：链接照常跳到 #contact
    var langBtn = e.target.closest("#lang button[data-lang]");
    if (langBtn) { setLang(langBtn.getAttribute("data-lang")); return; }
    var play = e.target.closest(".cover__play");
    if (play) { playCover(play.closest(".cover__media")); return; }
    if (e.target.closest("#sb-toggle")) { setCollapsed(!isCollapsed()); return; }
    if (e.target.closest("#sb-open")) { setDrawer(true); return; }
    if (e.target.closest("#sb-close") || e.target.closest("#scrim")) { setDrawer(false); return; }
    if (e.target.closest("#sb-nav a") && mobileMQ.matches) setDrawer(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setDrawer(false);
  });

  document.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "contact-form") {
      e.preventDefault();
      sendMessage(e.target);
    }
  });

  window.addEventListener("scroll", requestSpy, { passive: true });
  window.addEventListener("resize", requestSpy);

  render();
})();
