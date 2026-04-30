import { useMemo, useState } from 'react';
import { useApp, ActionTypes } from '../../context/AppContext';
import { getDailyContents } from '../../data/contents';
import { PODCAST_SOURCES, createCustomPodcastSource, fetchPodcastFeed } from '../../data/podcastApi';
import ContentCard from '../../components/ContentCard';
import styles from './Home.module.css';

const CATEGORY_FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'news', label: '新闻' },
  { id: 'anime', label: '动漫' },
  { id: 'drama', label: '影视' },
  { id: 'podcast', label: '真人音频' },
];

function Home() {
  const { state, dispatch } = useApp();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customTitle, setCustomTitle] = useState('自定义跟读素材');
  const [customBody, setCustomBody] = useState('');
  const [customTranslation, setCustomTranslation] = useState('');
  const [podcastItems, setPodcastItems] = useState([]);
  const [podcastLoading, setPodcastLoading] = useState(false);
  const [podcastError, setPodcastError] = useState('');
  const [customRssUrl, setCustomRssUrl] = useState('');

  const contents = useMemo(() => getDailyContents(), []);
  const allContents = useMemo(() => [...podcastItems, ...contents], [podcastItems, contents]);

  const filteredContents = useMemo(() => {
    return allContents.filter(content => {
      const matchesCategory = categoryFilter === 'all' || content.category === categoryFilter;
      const keyword = searchTerm.trim().toLowerCase();
      const matchesSearch = !keyword ||
        content.title.toLowerCase().includes(keyword) ||
        content.body.toLowerCase().includes(keyword) ||
        content.titleCn?.toLowerCase().includes(keyword);
      return matchesCategory && matchesSearch;
    });
  }, [allContents, categoryFilter, searchTerm]);

  const today = new Date().toISOString().split('T')[0];
  const completedToday = allContents.filter(c => state.completedContents[c.id]?.date === today).length;

  const formatDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Date().toLocaleDateString('zh-CN', options);
  };

  const startPractice = (content) => {
    dispatch({ type: ActionTypes.SET_CURRENT_CONTENT, payload: content });
    dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: 'practice' });
  };

  const loadPodcastSource = async (source) => {
    setPodcastLoading(true);
    setPodcastError('');
    try {
      const items = await fetchPodcastFeed(source, 8);
      setPodcastItems(items);
      setCategoryFilter('podcast');
      if (items.length === 0) {
        setPodcastError('该RSS暂时没有可播放的音频条目。');
      }
    } catch (error) {
      console.error('Failed to load podcast RSS:', error);
      setPodcastError('RSS读取失败。可能是CORS限制、RSS地址不可用，或该源暂时无法访问。');
    }
    setPodcastLoading(false);
  };

  const loadCustomPodcast = () => {
    const url = customRssUrl.trim();
    if (!url) {
      alert('请输入播客RSS地址');
      return;
    }
    loadPodcastSource(createCustomPodcastSource(url));
  };

  const handleCreateCustom = () => {
    const body = customBody.trim();
    if (!body) {
      alert('请先输入日文跟读文本');
      return;
    }

    const customContent = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim() || '自定义跟读素材',
      titleCn: '自定义内容',
      body,
      bodyCn: customTranslation.trim(),
      audioUrl: 'tts',
      duration: Math.max(30, Math.ceil(body.length / 4)),
      difficulty: '自定义',
      category: 'custom',
      hasAudio: true,
      grammars: [
        {
          pattern: '自定义素材',
          meaning: '该内容由你手动输入，可直接使用浏览器日语TTS进行影子跟读。',
          formation: '输入日文文本 → 播放TTS → 跟读录音 → 回听复盘',
          examples: ['短い台詞やニュース段落を貼り付けると、すぐに練習できます。']
        }
      ]
    };

    startPractice(customContent);
  };

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <p className={styles.date}>{formatDate()}</p>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>🌸</span>
          影子跟读素材库
        </h1>
        <p className={styles.goal}>
          今日进度：<span className={styles.goalHighlight}>{completedToday}/{allContents.length}</span> 篇
        </p>
        <p className={styles.sourceHint}>
          选择新闻、动漫、影视短文，或加载真人播客音频，进入练习页播放日语音频并录音跟读。
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.sourceSwitch}>
          {CATEGORY_FILTERS.map(filter => (
            <button
              key={filter.id}
              className={`${styles.sourceButton} ${categoryFilter === filter.id ? styles.active : ''}`}
              onClick={() => setCategoryFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="搜索标题或原文..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <section className={styles.podcastSection}>
        <div className={styles.podcastHeader}>
          <div>
            <h2 className={styles.podcastTitle}>真人音频 RSS</h2>
            <p className={styles.podcastSubtitle}>加载播客后可用真人语音做影子跟读；没有全文稿时可在练习页粘贴日文文本。</p>
          </div>
        </div>

        <div className={styles.podcastActions}>
          {PODCAST_SOURCES.map(source => (
            <button
              key={source.id}
              className={styles.podcastButton}
              onClick={() => loadPodcastSource(source)}
              disabled={podcastLoading}
            >
              {podcastLoading ? '加载中...' : `加载 ${source.nameCn}`}
            </button>
          ))}
        </div>

        <div className={styles.rssInputRow}>
          <input
            className={styles.rssInput}
            value={customRssUrl}
            onChange={(e) => setCustomRssUrl(e.target.value)}
            placeholder="粘贴自定义Podcast RSS地址"
          />
          <button className={styles.rssButton} onClick={loadCustomPodcast} disabled={podcastLoading}>
            读取RSS
          </button>
        </div>

        {podcastError && <p className={styles.podcastError}>{podcastError}</p>}
      </section>

      <div className={styles.customSection}>
        <button
          className={styles.customToggle}
          onClick={() => setShowCustomForm(!showCustomForm)}
        >
          {showCustomForm ? '收起自定义文本' : '＋ 粘贴文本生成TTS跟读素材'}
        </button>

        {showCustomForm && (
          <div className={styles.customForm}>
            <input
              className={styles.customInput}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="素材标题"
            />
            <textarea
              className={styles.customTextarea}
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              placeholder="粘贴日文文本，例如新闻段落、动漫台词、影视对白..."
              rows={6}
            />
            <textarea
              className={styles.customTextarea}
              value={customTranslation}
              onChange={(e) => setCustomTranslation(e.target.value)}
              placeholder="可选：粘贴中文翻译"
              rows={3}
            />
            <button className={styles.createButton} onClick={handleCreateCustom}>
              开始自定义跟读
            </button>
          </div>
        )}
      </div>

      <section className={styles.extensionNote}>
        <strong>说明：</strong>
        真人播客RSS通常只提供音频、标题和简介，不一定有逐字稿。网页会优先播放真人音频，文本可在练习页补充。
      </section>

      <h2 className={styles.sectionTitle}>跟读素材</h2>

      {filteredContents.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <p>没有找到匹配的跟读素材</p>
        </div>
      ) : (
        <div className={styles.contentList}>
          {filteredContents.map(content => (
            <ContentCard
              key={content.id}
              content={content}
              onClick={startPractice}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
