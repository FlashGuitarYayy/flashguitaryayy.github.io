/* =====================================================================
 *  站点内容都在这个文件里 —— 改标题、歌词、链接、工具，只需要改这里。
 *
 *  多语言写法：任何文字字段都可以是
 *    - 一个字符串（所有语言通用），或者
 *    - 按语言写的对象：{ "zh-Hans": "简体", "zh-Hant": "繁體", en: "English", sv: "Svenska" }
 *  缺少的语言会自动回退：简体 ↔ 繁体互相补，瑞典语用英文版，最后才用任意一个有内容的。
 *
 *  每首歌的字段：
 *    id              文件夹名 / 页面锚点，只用英文、数字和连字符
 *    title / artist  歌名、原唱
 *    album / arranged  专辑、改编年份（可选，留空即不显示）
 *    cover           封面图路径；留空则自动用 assets/covers/<id>.jpg
 *    coverFull       写 true 时完整显示封面图，框的比例跟着图片走，不裁成正方形（可选）
 *    coverRatio      封面框的宽高比，如 "4 / 3"；翻转卡片想要非正方形时用这个（可选）
 *    coverBack       背面图片路径：鼠标悬浮时封面翻到背面显示这张图，点击行为不变（可选）
 *    difficulty      难度，1–5 星，可以写半颗（如 3.5）；留空显示「待添加」
 *    quote           最打动你的歌词（留空则不显示这一块）；多行写成数组，一行一个
 *    quoteMarks      写 false 时不加「」，只保留左边竖线（引的不是歌词时用，可选）
 *    quoteBy         歌词出处 / 备注（可选）
 *    notes           补充说明，比如调弦、变调夹（可选）
 *    referenceVideo  编曲参考的视频：直接写网址，或 { url, label }；留空显示「待添加」
 *                    有多个链接时写成数组，每个链接一个按钮；没写 label 时按平台显示 YouTube / Bilibili
 *    demoVideo       自己弹的演示视频，同上
 *    pdf / mscz      下载列表 [{ label, file, name }]
 *                    file 是仓库里的路径；name 是下载时保存的文件名（可以是中文）
 *    extraLinks      其他链接 [{ label, url }]（可选）
 *    onRequest       写 true 时不提供下载，显示 Upon request，点了跳到留言表单（可选）
 *
 *  每个工具的字段：
 *    id / icon       锚点；icon 可以放一个 emoji，留空用默认图标
 *    name / description / tags
 *    github          仓库地址，留空显示「待添加」
 *    preview         演示动图路径，显示在卡片顶部，点开看原尺寸（可选）
 *    demo            演示视频地址，留空显示「演示录制中」；有 preview 时留空就不显示
 *    wip             写 true 时标成「开发中 / In progress」（可选）
 * ===================================================================== */

window.SITE = {
  title: "Flash Guitar",  // 侧边栏、手机顶栏、浏览器标签页上的站名
  /* 首页的大标题和上面的小标题；中文界面带上中文名。
   * 大标题里「 / 」后面的部分会排成浅色、不拆行。瑞典语没写，自动用英文的。 */
  heroTitle: { "zh-Hans": "Flash Guitar / 闪电吉他", "zh-Hant": "Flash Guitar / 閃電吉他", en: "Flash Guitar" },
  eyebrow: { "zh-Hans": "Fingerstyle Guitar - 指弹吉他", "zh-Hant": "Fingerstyle Guitar - 指彈吉他", en: "Fingerstyle Guitar" },
  /* 首页标题下面的 quote，一行一句；最后一句颜色深一点。
   * 用 *星号* 包住的词显示成斜体强调。也可以写成按语言的对象。
   * 想在某一行末尾放一张小圆图，把这一行写成 { text: "...", image: "图片路径" }。 */
  tagline: [
    { text: "*Flash* means as \"fast\" and talkative as Flash the Sloth in Zootopia. ", image: "assets/flash-sloth.jpg" },
    "Carry the vibe to guitar.",
  ],
  footer: {
    "zh-Hans": "曲谱为个人学习改编，仅供交流，原曲版权归原作者所有。",
    "zh-Hant": "曲譜為個人學習改編，僅供交流，原曲版權歸原作者所有。",
    en: "These arrangements are personal study transcriptions, shared for learning only. All rights to the original songs belong to their owners.",
    sv: "Arrangemangen är privata studietranskriptioner som delas enbart i lärosyfte. Alla rättigheter till originallåtarna tillhör rättighetsinnehavarna.",
  },
  links: [
    // { label: "GitHub", url: "https://github.com/你的用户名" },
    // { label: "Bilibili", url: "" },
    // { label: "YouTube", url: "" },
  ],

  /* 留言表单怎么把消息发给你（三选一，按顺序生效；都留空时表单会提示未配置）
   *   endpoint   推荐。去 https://formspree.io 免费注册一个表单，把它给你的地址填在这里，
   *              形如 "https://formspree.io/f/xxxxxxxx"。消息会发到你注册时用的邮箱。
   *   accessKey  只有 Web3Forms（https://web3forms.com）这类需要 access_key 的服务才填。
   *   email      没有 endpoint 时的退路：点「发送」会打开访客自己的邮件客户端，收件人是这个地址。
   *              注意这个地址会出现在网页源码里，是公开的。
   * 不想要留言功能：把整个 contact 改成 false。 */
  contact: {
    endpoint: "https://formspree.io/f/mgaodqqy",
    accessKey: "",
    email: "",
  },
};

window.SONGS = [
  {
    id: "yueliang-baba",
    title: { "zh-Hans": "月亮粑粑", "zh-Hant": "月亮粑粑", en: "Yueliang Baba · 月亮粑粑" },
    artist: { "zh-Hans": "赵雷", "zh-Hant": "趙雷", en: "Zhao Lei" },
    album: "",
    arranged: "2024",
    difficulty: 3,  // 难度：1–5 星，可以写 3.5；留空显示「待添加」
    cover: "assets/covers/yueliang-baba-cover.jpg",
    coverRatio: "4 / 3",
    coverBack: "assets/covers/yueliang-baba-back.jpg",
    quote: "月亮粑粑，肚裏坐個嗲嗲，嗲嗲出去買菜，肚裏坐個奶奶",
    quoteBy: "",
    notes: "",
    referenceVideo: ["https://www.youtube.com/watch?v=pAS-N6Te6mU", "https://www.bilibili.com/video/BV1uvxMzQEJa"],
    demoVideo: ["https://youtu.be/yUoxvdKVcjo", "https://www.bilibili.com/video/BV1jhhVztE39"],
    pdf: [
      { label: "2024.06.01", file: "scores/yueliang-baba/yueliang-baba_2024.06.01.pdf", name: "月亮粑粑-趙雷_2024.06.01.pdf" },
    ],
    mscz: [
      { label: "2024.06.01", file: "scores/yueliang-baba/yueliang-baba_2024.06.01.mscz", name: "月亮粑粑-趙雷_2024.06.01.mscz" },
    ],
    extraLinks: [],
  },

  {
    id: "mali",
    title: { "zh-Hans": "玛丽", "zh-Hant": "瑪麗", en: "Mary · 玛丽" },
    artist: { "zh-Hans": "赵雷", "zh-Hant": "趙雷", en: "Zhao Lei" },
    album: { "zh-Hans": "无法长大", "zh-Hant": "無法長大", en: "无法长大" },
    arranged: "2024–2025",
    difficulty: 2.5,  // 难度：1–5 星，可以写 3.5；留空显示「待添加」
    cover: "assets/covers/mali-album.jpg",
    quote: "我多想和那些光阴永远住下来",
    quoteBy: "",
    notes: "",
    referenceVideo: ["https://www.youtube.com/watch?v=P-7mNOrnruM", "https://www.bilibili.com/video/BV16T42127Yd"],
    demoVideo: "",
    pdf: [
      { label: "2025.01.12", file: "scores/mali/mali_melody_0112.pdf", name: "瑪麗-melody_0112.pdf" },
    ],
    mscz: [
      { label: "2025.01.12", file: "scores/mali/mali_melody_0112.mscz", name: "瑪麗-melody_0112.mscz" },
    ],
    extraLinks: [],
  },

  {
    id: "bu-yaogun",
    title: { "zh-Hans": "不摇滚", "zh-Hant": "不搖滾", en: "Rock No More · 不摇滚" },
    artist: { "zh-Hans": "八三夭", "zh-Hant": "八三夭", en: "831 feat. The Landlord’s Cat" },
    album: "",
    arranged: "2025",
    difficulty: 4,  // 难度：1–5 星，可以写 3.5；留空显示「待添加」
    cover: "assets/covers/bu-yaogun-cover.jpg",
    coverFull: true,
    quote: ["长大是不知不觉不摇滚的过程", "却也是此生 独一无二 的成分"],
    quoteBy: "",
    notes: "",
    referenceVideo: ["https://www.youtube.com/watch?v=tPtNox-zK9M", "https://www.bilibili.com/video/BV1sE411Y7Z6"],
    demoVideo: "",
    pdf: [
      { label: "2025.03.09", file: "scores/bu-yaogun/bu-yaogun_0309.pdf", name: "不搖滾-0309.pdf" },
    ],
    mscz: [
      { label: "2025.03.09", file: "scores/bu-yaogun/bu-yaogun_0309.mscz", name: "不搖滾-0309.mscz" },
    ],
    extraLinks: [],
  },

  {
    id: "svag",
    title: "Svag",
    artist: "Victor Leksell",
    album: "",
    arranged: "2025",
    difficulty: 3,  // 难度：1–5 星，可以写 3.5；留空显示「待添加」
    cover: "assets/covers/svag-cover.jpg",
    coverFull: true,
    quote: "Hooked by the vibe of cello, guitar, and a soft duet.",
    quoteMarks: false,  // 不是歌词：保留左边竖线，不加「」
    quoteBy: "",
    notes: "",
    referenceVideo: ["https://www.youtube.com/watch?v=s_PkXvkFBY4", "https://www.bilibili.com/video/BV1ut4y1k7gc"],
    demoVideo: "",
    pdf: [],
    mscz: [],
    onRequest: true,  // 不公开下载：显示 Upon request，点了跳到留言表单并自动填好歌名
    extraLinks: [],
  },
];

/* 翻弹视频，按数组顺序显示；整个数组为空时「翻弹」区块会自动隐藏。
 *   video      视频链接。支持 YouTube（watch / youtu.be / shorts 链接）和 Bilibili（带 BV 号的链接）。
 *              YouTube 会自动取封面图；Bilibili 没有公开封面地址，想要封面就填 thumb。
 *   thumb      可选，自定义封面图路径，例如 "assets/covers/my-cover.jpg"
 *   reference  这个 cover 参考的原视频 / 原曲：直接写网址，或 { url, label }
 *   artist / date / notes  显示在标题下面的人名（原唱或原编曲）、录制日期、补充说明（可选） */
window.COVERS = [
  {
    id: "yujian",
    title: { "zh-Hans": "遇见", "zh-Hant": "遇見", en: "Encounter · 遇见" },
    artist: { "zh-Hans": "董运昌", "zh-Hant": "董運昌", en: "Dong Yun-Chang" },
    date: "2025",
    video: "https://youtu.be/T6gKEHNhbCQ",
    thumb: "",
    reference: "https://www.youtube.com/watch?v=RB4JWWVr0eY",
    notes: "",
  },
  {
    id: "naxienian",
    title: { "zh-Hans": "那些年", "zh-Hant": "那些年", en: "Those Years · 那些年" },
    artist: { "zh-Hans": "董运昌", "zh-Hant": "董運昌", en: "Dong Yun-Chang" },
    date: "2026",
    video: "https://youtu.be/rprPptIrC4I",
    thumb: "",
    reference: "https://www.youtube.com/watch?v=6y57Wm3lI84",
    notes: "",
  },
];

/* 吉他小工具。下面是一条示例，照着改成你自己的；整个数组为空时「工具」区块会自动隐藏。 */
window.TOOLS = [
  {
    id: "chord-assist",
    icon: "🎸",
    name: { "zh-Hans": "和弦助手", "zh-Hant": "和弦助手", en: "Chord Assistant" },
    description: "Visualize the chord, pick the notes you want. Free your hands from the keyboard.",
    tags: ["MuseScore", "QML", "JavaScript"],
    github: "https://github.com/FlashGuitarYayy/chord-assist",
    preview: "assets/tools/chord-assist.gif",
    demo: "",
  },
  {
    id: "musescore-ai-assistant",
    icon: "🤖",
    name: { "zh-Hans": "MuseScore AI 助手", "zh-Hant": "MuseScore AI 助手", en: "MuseScore AI Assistant" },
    description: "Links an AI API or local agent to MuseScore. Turns a rough idea into concrete edits on the score. Saves repeated edits as one-click skills.",
    tags: ["MuseScore 4.6+", "Any model via API", "JavaScript"],
    wip: true,  // 还在开发：卡片显示「开发中 / In progress」徽章和虚线边框
    github: "https://github.com/FlashGuitarYayy/MuseScore-AI-Assistant",
    preview: "assets/tools/musescore-ai-assistant.gif",
    demo: "",
  },
];
