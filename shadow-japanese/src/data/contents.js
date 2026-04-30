// 日语内容数据 - 5篇示例文章
export const contents = [
  {
    id: 'content-1',
    title: '東京の桜が見頃に',
    titleCn: '东京樱花盛开',
    body: `今日は穏やかな晴天続き東京地方では、桜が見頃を迎えています。

上野公園では、朝早くから花見客が訪れ、美しい桜の下で楽しんでいます。

例年よりも少し早い開花の報告があり、许多人々が春の訪れを感じています。

天気予報によると、今週中は晴れ続きそうで、お花見日和が続きます。`,
    bodyCn: `今天东京都地区天气晴朗温和，樱花正值最佳观赏时期。

在上野公园，一大早就有赏花游客前来，在美丽的樱花树下尽情享受。

据报告，今年开花比往年稍早，许多人感受到了春天的到来。

根据天气预报，本周将持续晴天，非常适合赏花。`,
    audioUrl: '/audio/news-sakura.mp3',
    duration: 120,
    difficulty: 'N3',
    category: 'news',
    grammars: [
      {
        pattern: '〜が見頃を迎えている',
        meaning: '迎来最佳观赏时期',
        formation: 'N + が見頃を迎えている',
        examples: [
          '桜が見頃を迎えている。',
          '紅葉が見頃を迎えた。'
        ]
      },
      {
        pattern: '〜を通じて',
        meaning: '通过〜；整个〜',
        formation: 'N + を通じて',
        examples: [
          '今週を通じて晴れ続きそうだ。',
          '一年を通じて忙しい。'
        ]
      },
      {
        pattern: '〜によると',
        meaning: '根据〜',
        formation: 'N + によると',
        examples: [
          '天気予報によると、明日は雨だ。',
          '新聞によると、経済は回復している。'
        ]
      }
    ]
  },
  {
    id: 'content-2',
    title: 'スパイファミリー',
    titleCn: '间谍过家家',
    body: `アーニャ：お父さん、学校に行こう！
ロイド：そうだな。今日はアーニャの学校行事がある来着。
アーニャ：うん！お楽しみ会！
アーニャ：お父さんも来てくれるんだよね？
ロイド：ああ、絶対にに行く。約束する。
アーニャ：やったー！`,
    bodyCn: `阿尼亚：爸爸，我们去学校吧！
洛伊德：是啊。今天有阿尼亚的学校的活动来着。
阿尼亚：嗯！是欢乐会！
阿尼亚：爸爸也会来吧？
洛伊德：嗯，一定会去的。我保证。
阿尼亚：太好了！`,
    audioUrl: '/audio/spy-family-clip.mp3',
    duration: 90,
    difficulty: 'N4',
    category: 'anime',
    grammars: [
      {
        pattern: '〜を〇〇にいく',
        meaning: '去做什么',
        formation: 'Vます + に行く',
        examples: [
          '学校に行こう。',
          '映画を見に行く。'
        ]
      },
      {
        pattern: '〜来着',
        meaning: '表示回忆、确认',
        formation: '普通形 +来着',
        examples: [
          '今日は会議がある来着。',
          '彼女は留学生来着。'
        ]
      },
      {
        pattern: '〜んだよね？',
        meaning: '确认、寻求认同',
        formation: 'N/普通形 + んだよね？',
        examples: [
          '今日が誕生日なんだよね？',
          '日本語が上手なんだよね。'
        ]
      },
      {
        pattern: '〜絶対（に）',
        meaning: '绝对、一定',
        formation: '絶対（に）+ V',
        examples: [
          '絶対に行く。',
          '絶対に大丈夫だ。'
        ]
      }
    ]
  },
  {
    id: 'content-3',
    title: 'ディズに行く約束',
    titleCn: '去迪士尼的约定',
    body: `太郎：ねえ、花子ちゃん、今度の休み有何する？
花子：特に予定がないけど。
太郎：じゃあ、ディズに行かない？ずっと行きたかったんだ。
花子：本当？私も行きたい！いつにしよう？
太郎：来週の土曜日はどうかな？
花子：いいね！朝早く行こうよ。
太郎：もちろん！9時に駅で会おう。`,
    bodyCn: `太郎：诶，花子，这下次休息有什么安排吗？
花子：没有什么特别的计划。
太郎：那，去迪士尼吗？我一直很想去。
花子：真的吗？我也想去！什么时候去呢？
太郎：下周六怎么样？
花子：好啊！我们早点去吧。
太郎：当然！9点在车站见面吧。`,
    audioUrl: '/audio/disney-dialogue.mp3',
    duration: 100,
    difficulty: 'N5',
    category: 'drama',
    grammars: [
      {
        pattern: '〜にしよう？',
        meaning: '决定做某事（商量）',
        formation: 'N/普通形 + にしよう？',
        examples: [
          '映画にしよう？',
          '何色にしようか？'
        ]
      },
      {
        pattern: '〜ようよ',
        meaning: '劝诱、提议',
        formation: 'Vよう + よ',
        examples: [
          '早く行こうよ。',
          '食べようよ、肚子空いた。'
        ]
      },
      {
        pattern: '〜лан',
        meaning: '请求、约定',
        formation: '普通形 + лан',
        examples: [
          '9時に会おう。',
          '明日また来よう。'
        ]
      },
      {
        pattern: '〜たい',
        meaning: '想做〜',
        formation: 'Vます + たい',
        examples: [
          'ディズに行きたい。',
          '日本語を勉強したい。'
        ]
      }
    ]
  },
  {
    id: 'content-4',
    title: '新しい同僚',
    titleCn: '新同事',
    body: `田中：この方田中さんと言いますが、日本から来た留学生です。
スミス：はじめまして、スミスです。どうぞよろしくお願いいたします。
田中：スミスさんは、日本語学科の研究生です。
スミス：はい、今は日本語と日本文化を勉強しています。
田中：何か質問があれば、気軽に聞いてください。
スミス：ありがとうございます。よろしくお願いします。`,
    bodyCn: `田中：这位是史密斯，是从日本来的留学生。
史密斯：您好，我是史密斯。请多关照。
田中：史密斯同学是日语系的研究生。
史密斯：是的，我现在在学习日语和日本文化。
田中：如果有什么问题，请随时问我。
史密斯：谢谢。请多关照。`,
    audioUrl: '/audio/new-colleague.mp3',
    duration: 85,
    difficulty: 'N5',
    category: 'drama',
    grammars: [
      {
        pattern: '〜という',
        meaning: '叫做〜',
        formation: 'N + という + N',
        examples: [
          '田中さんという方。',
          'ラーメンという食べ物。'
        ]
      },
      {
        pattern: '〜から来た',
        meaning: '从〜来的',
        formation: 'N + から来た',
        examples: [
          '日本から来た留学生。',
          '中国から来た友達。'
        ]
      },
      {
        pattern: '〜ということです',
        meaning: '意思是〜',
        formation: '普通形 + ということです',
        examples: [
          '今は勉強していますということです。',
          '明日来られないということです。'
        ]
      },
      {
        pattern: '〜があれば',
        meaning: '如果有〜的话',
        formation: 'N/V普通形 + があれば',
        examples: [
          '質問があれば、聞いてください。',
          '時間があれば、手伝います。'
        ]
      }
    ]
  },
  {
    id: 'content-5',
    title: 'コンビニでの会話',
    titleCn: '便利店里的对话',
    body: `店員：いらっしゃいませ！
客：すみません、おにぎりはどこですか？
店員：あちらの棚にあります。
客：ありがとうございます。いくつか我要ります。
店員：税込みで480円になります。
客：カードで払えますか？
店員：はい、可以的ですよ。`,
    bodyCn: `店员：欢迎光临！
顾客：请问，饭团在哪里？
店员：在那边的架子上。
顾客：谢谢。我要买几个。
店员：含税480日元。
顾客：可以刷卡吗？
店员：可以的。`,
    audioUrl: '/audio/convenience-store.mp3',
    duration: 75,
    difficulty: 'N5',
    category: 'drama',
    grammars: [
      {
        pattern: '〜はどこですか？',
        meaning: '〜在哪里？',
        formation: 'N + はどこですか？',
        examples: [
          'トイレはどこですか？',
          '出口はどこですか？'
        ]
      },
      {
        pattern: '〜を他要る',
        meaning: '想要〜',
        formation: 'N + ，他要る',
        examples: [
          'おにぎりを他要る。',
          'コーヒーを他要る。'
        ]
      },
      {
        pattern: '〜で払える',
        meaning: '可以用〜支付',
        formation: 'N + で払える',
        examples: [
          'カードで払える。',
          '現金で払ってください。'
        ]
      }
    ]
  }
];

// 获取今日内容（简单模拟每日随机）
export function getDailyContents() {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffled = [...contents].sort((a, b) => {
    const aScore = (seed * a.id.charCodeAt(a.id.length - 1)) % 100;
    const bScore = (seed * b.id.charCodeAt(b.id.length - 1)) % 100;
    return aScore - bScore;
  });
  return shuffled.slice(0, Math.min(5, shuffled.length));
}

export default contents;
