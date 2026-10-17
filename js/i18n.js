/* =====================================================================
 *  界面文字的多语言字典（按钮、标签、提示语）。
 *  站点内容（歌名、简介、歌词、工具说明）在 data.js 里按语言填写。
 *
 *  想加一种语言：在 LANGS 里加一行，在 I18N 里加一个同名的对象即可。
 * ===================================================================== */

/* label 是展开时按钮上的字，short 是侧边栏收起后用的更短版本 */
window.LANGS = [
  { code: "zh-Hant", label: "繁體", short: "繁", name: "繁體中文" },
  { code: "zh-Hans", label: "简体", short: "简", name: "简体中文" },
  { code: "en", label: "EN", short: "EN", name: "English" },
  { code: "sv", label: "SV", short: "SV", name: "Svenska" },
];

window.I18N = {
  "zh-Hans": {
    lang_label: "语言",
    menu: "菜单",
    close: "关闭",
    collapse_sidebar: "收起侧边栏",
    expand_sidebar: "展开侧边栏",
    nav_songs: "编曲",
    nav_tools: "工具",
    nav_contact: "留言",


    nav_covers: "翻弹",
    covers_eyebrow: "Covers",
    covers_title: "翻弹视频",
    reference: "原版演示",
    open_video: "打开视频",
    play: "播放",
    no_covers: "还没有视频。",

    songs_eyebrow: "Arrangements",
    songs_title: "改编曲谱",

    tools_eyebrow: "Tools",
    tools_title: "编曲工具",

    contact_eyebrow: "Say hi",
    contact_title: "留言",

    difficulty: "难度",
    ref_video: "改编自",
    downloads: "曲谱下载",
    demo_video: "演示视频",
    more: "其他",
    coming_soon: "待添加",
    preview_pdf: "预览 PDF",
    open_pdf: "在新标签页打开 PDF",
    download: "下载",
    arranged: "改编于",
    cover_alt: "封面",

    github: "GitHub",
    demo: "演示",
    demo_soon: "演示录制中",
    wip: "开发中",

    f_name: "称呼",
    f_contact: "联系方式",
    f_contact_ph: "邮箱，或其他能联系到你的方式",
    f_type: "类型",
    f_message: "留言",
    f_message_ph: "想听哪首歌的改编？或者任何想说的话。",
    t_request: "点歌 · 求谱",
    t_collab: "合作",
    t_feedback: "反馈 · 纠错",
    t_other: "其他",
    send: "发送",
    sending: "发送中…",
    sent: "已收到，谢谢！",
    send_error: "发送失败，请稍后再试。",
    mailto_hint: "会打开你的邮件客户端来发送。",
    unconfigured: "留言功能还没配置好。",
    required: "请先写点留言内容。",

    footer_made: "用 MuseScore 制谱 · GitHub Pages 托管",
    no_songs: "还没有曲目。",
    no_tools: "还没有工具。",
  },

  "zh-Hant": {
    lang_label: "語言",
    menu: "選單",
    close: "關閉",
    collapse_sidebar: "收起側邊欄",
    expand_sidebar: "展開側邊欄",
    nav_songs: "編曲",
    nav_tools: "工具",
    nav_contact: "留言",


    nav_covers: "翻彈",
    covers_eyebrow: "Covers",
    covers_title: "翻彈影片",
    reference: "原版演示",
    open_video: "開啟影片",
    play: "播放",
    no_covers: "還沒有影片。",

    songs_eyebrow: "Arrangements",
    songs_title: "改編曲譜",

    tools_eyebrow: "Tools",
    tools_title: "編曲工具",

    contact_eyebrow: "Say hi",
    contact_title: "留言",

    difficulty: "難度",
    ref_video: "改編自",
    downloads: "曲譜下載",
    demo_video: "示範影片",
    more: "其他",
    coming_soon: "待新增",
    preview_pdf: "預覽 PDF",
    open_pdf: "在新分頁開啟 PDF",
    download: "下載",
    arranged: "改編於",
    cover_alt: "封面",

    github: "GitHub",
    demo: "示範",
    demo_soon: "示範錄製中",
    wip: "開發中",

    f_name: "稱呼",
    f_contact: "聯絡方式",
    f_contact_ph: "電郵，或其他能聯絡到你的方式",
    f_type: "類型",
    f_message: "留言",
    f_message_ph: "想聽哪首歌的改編？或者任何想說的話。",
    t_request: "點歌 · 求譜",
    t_collab: "合作",
    t_feedback: "回饋 · 糾錯",
    t_other: "其他",
    send: "送出",
    sending: "送出中…",
    sent: "已收到，謝謝！",
    send_error: "送出失敗，請稍後再試。",
    mailto_hint: "會開啟你的郵件程式來寄送。",
    unconfigured: "留言功能還沒設定好。",
    required: "請先寫點留言內容。",

    footer_made: "用 MuseScore 製譜 · GitHub Pages 託管",
    no_songs: "還沒有曲目。",
    no_tools: "還沒有工具。",
  },

  en: {
    lang_label: "Language",
    menu: "Menu",
    close: "Close",
    collapse_sidebar: "Collapse sidebar",
    expand_sidebar: "Expand sidebar",
    nav_songs: "Scores",
    nav_tools: "Tools",
    nav_contact: "Contact",


    nav_covers: "Covers",
    covers_eyebrow: "Covers",
    covers_title: "Cover Videos",
    covers_desc: "A tribute to the arrangements that bring the most fascinating voicings.", // 所有语言共用
    reference: "Original performance",
    open_video: "Open video",
    play: "Play",
    no_covers: "No videos yet.",

    songs_eyebrow: "Arrangements",
    songs_title: "Guitar Arrangements",
    songs_desc: "From ear to fretboard.", // 所有语言共用：其他语言不写这个键，会自动用这里的

    tools_eyebrow: "Tools",
    tools_title: "Arrangement tools",
    tools_desc: "Squeeze more music out of a busy week.", // 所有语言共用

    contact_eyebrow: "Say hi",
    contact_title: "Leave a message",
    contact_desc: "", // 留空 = 不显示；所有语言共用

    difficulty: "Difficulty",
    ref_video: "Arranged from",
    downloads: "Downloads",
    upon_request: "Upon request", // 所有语言共用：其他语言不写这个键，会自动用这里的
    demo_video: "Demo video",
    more: "More",
    coming_soon: "Coming soon",
    preview_pdf: "Preview PDF",
    open_pdf: "Open PDF in a new tab",
    download: "Download",
    arranged: "Arranged",
    cover_alt: "cover",

    github: "GitHub",
    demo: "Demo",
    demo_soon: "Demo coming soon",
    wip: "In progress",

    f_name: "Name",
    f_contact: "Contact",
    f_contact_ph: "Email, or any other way to reach you",
    f_type: "Type",
    f_message: "Message",
    f_message_ph: "Which song would you like arranged? Or anything else on your mind.",
    t_request: "Song request",
    t_collab: "Collaboration",
    t_feedback: "Feedback / correction",
    t_other: "Other",
    send: "Send",
    sending: "Sending…",
    sent: "Got it, thank you!",
    send_error: "Something went wrong. Please try again later.",
    mailto_hint: "This opens your email app to send the message.",
    unconfigured: "The contact form is not set up yet.",
    required: "Please write a message first.",

    footer_made: "Made with MuseScore · Hosted on GitHub Pages",
    no_songs: "No songs yet.",
    no_tools: "No tools yet.",
  },

  sv: {
    lang_label: "Språk",
    menu: "Meny",
    close: "Stäng",
    collapse_sidebar: "Fäll ihop sidopanelen",
    expand_sidebar: "Visa sidopanelen",
    nav_songs: "Noter",
    nav_tools: "Verktyg",
    nav_contact: "Kontakt",


    nav_covers: "Covers",
    covers_eyebrow: "Covers",
    covers_title: "Covervideor",
    reference: "Originalframförande",
    open_video: "Öppna videon",
    play: "Spela upp",
    no_covers: "Inga videor ännu.",

    songs_eyebrow: "Arrangemang",
    songs_title: "Gitarrarrangemang",

    tools_eyebrow: "Verktyg",
    tools_title: "Arrangeringsverktyg",

    contact_eyebrow: "Säg hej",
    contact_title: "Lämna ett meddelande",

    difficulty: "Svårighetsgrad",
    ref_video: "Arrangerad från",
    downloads: "Nedladdningar",
    demo_video: "Demovideo",
    more: "Mer",
    coming_soon: "Kommer snart",
    preview_pdf: "Förhandsgranska PDF",
    open_pdf: "Öppna PDF i ny flik",
    download: "Ladda ner",
    arranged: "Arrangerad",
    cover_alt: "omslag",

    github: "GitHub",
    demo: "Demo",
    demo_soon: "Demo kommer snart",
    wip: "Under utveckling",

    f_name: "Namn",
    f_contact: "Kontakt",
    f_contact_ph: "E-post, eller något annat sätt att nå dig",
    f_type: "Typ",
    f_message: "Meddelande",
    f_message_ph: "Vilken låt vill du ha ett arrangemang av? Eller vad som helst annat.",
    t_request: "Låtönskemål",
    t_collab: "Samarbete",
    t_feedback: "Feedback / rättelse",
    t_other: "Annat",
    send: "Skicka",
    sending: "Skickar…",
    sent: "Mottaget, tack!",
    send_error: "Något gick fel. Försök igen senare.",
    mailto_hint: "Det här öppnar ditt e-postprogram för att skicka meddelandet.",
    unconfigured: "Kontaktformuläret är inte konfigurerat ännu.",
    required: "Skriv ett meddelande först.",

    footer_made: "Gjord med MuseScore · Hostad på GitHub Pages",
    no_songs: "Inga låtar ännu.",
    no_tools: "Inga verktyg ännu.",
  },
};
