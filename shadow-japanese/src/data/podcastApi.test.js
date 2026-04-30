import test from 'node:test';
import assert from 'node:assert/strict';
import { PODCAST_SOURCES, fetchPodcastFeed, parsePodcastXml } from './podcastApi.js';

const sampleRss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>NHKラジオニュース</title>
    <item>
      <title><![CDATA[正午のニュース]]></title>
      <description><![CDATA[最新のニュースをお伝えします。]]></description>
      <pubDate>Thu, 30 Apr 2026 12:00:00 +0900</pubDate>
      <enclosure url="https://example.com/news.mp3?token=abc" type="audio/mpeg" length="12345" />
      <link>https://example.com/news</link>
    </item>
  </channel>
</rss>`;

test('parsePodcastXml converts RSS items into shadowing content', () => {
  const items = parsePodcastXml(sampleRss, {
    sourceId: 'nhk-radio',
    sourceName: 'NHKラジオニュース',
    difficulty: 'N1',
  });

  assert.equal(items.length, 1);
  assert.equal(items[0].id, 'podcast-nhk-radio-0');
  assert.equal(items[0].title, '正午のニュース');
  assert.equal(items[0].category, 'podcast');
  assert.equal(items[0].difficulty, 'N1');
  assert.equal(items[0].audioUrl, 'https://example.com/news.mp3?token=abc');
  assert.equal(items[0].body, '最新のニュースをお伝えします。');
  assert.equal(items[0].hasAudio, true);
  assert.equal(items[0].needsTranscript, true);
});

test('fetchPodcastFeed returns built-in fallback audio when RSS fetch fails', async () => {
  const failingFetcher = async () => {
    throw new Error('network unavailable');
  };

  const items = await fetchPodcastFeed(PODCAST_SOURCES[0], 3, { fetcher: failingFetcher });

  assert.ok(items.length > 0);
  assert.equal(items[0].category, 'podcast');
  assert.equal(items[0].hasAudio, true);
  assert.match(items[0].audioUrl, /^https:\/\/.+\.mp3/);
  assert.equal(items[0].isFallback, true);
});

