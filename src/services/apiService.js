/**
 * Direct Client-Side API Integration & Mock Simulation Service
 * Supports direct browser requests (CORS-enabled) with fallback to instant Mock Mode.
 */

// 1. YouTube Video ID Extractor
export function extractYouTubeId(url) {
  if (!url) return null;
  // Support standard watch, share youtu.be, shorts, embed, v
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  if (match && match[1]) return match[1];

  // If user pasted bare 11-char ID
  if (/^[\w-]{11}$/.test(url.trim())) {
    return url.trim();
  }
  return null;
}

// 2. Extract generic identifier from URL
export function extractContentId(platform, url) {
  if (!url) return 'ID-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  
  if (platform === 'youtube') {
    return extractYouTubeId(url) || 'yt_' + Math.random().toString(36).substring(2, 8);
  }
  
  if (platform === 'tiktok') {
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : 'tt_' + Math.random().toString(36).substring(2, 8);
  }
  
  if (platform === 'instagram') {
    const match = url.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : 'ig_' + Math.random().toString(36).substring(2, 8);
  }

  if (platform === 'x') {
    const match = url.match(/\/status\/(\d+)/);
    return match ? match[1] : 'x_' + Math.random().toString(36).substring(2, 8);
  }

  return 'id_' + Math.random().toString(36).substring(2, 8);
}

// 3. Main Fetch Function (Live or Mock)
export async function fetchVideoMetrics({
  platform,
  url,
  useLiveApi = false,
  apiKeys = {},
  presetData = null,
}) {
  const videoId = extractContentId(platform, url);

  // If in Mock Mode, return instant realistic mock data
  if (!useLiveApi) {
    // Artificial 400ms delay for natural UX feeling
    await new Promise((resolve) => setTimeout(resolve, 450));
    return generateMockMetrics(platform, url, videoId, presetData);
  }

  // Live Mode: Direct browser API calls
  try {
    switch (platform) {
      case 'youtube': {
        const apiKey = apiKeys.youtubeApiKey?.trim();
        if (!apiKey) {
          throw new Error('Missing YouTube Data API Key. Please configure your key in Settings or switch to Mock Mode.');
        }

        const ytId = extractYouTubeId(url);
        if (!ytId) {
          throw new Error('Could not parse a valid 11-character YouTube Video ID from the provided URL.');
        }

        const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${ytId}&key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(endpoint);

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.error?.message || `YouTube API responded with status ${res.status}`;
          throw new Error(`YouTube API Error: ${errMsg}. Check API key quotas or switch to Mock Mode.`);
        }

        const data = await res.json();
        if (!data.items || data.items.length === 0) {
          throw new Error(`No YouTube video found for ID "${ytId}". Please verify the URL or video privacy settings.`);
        }

        const item = data.items[0];
        const statistics = item.statistics || {};
        const snippet = item.snippet || {};

        return {
          platform: 'youtube',
          videoId: ytId,
          url,
          title: snippet.title || `YouTube Video (${ytId})`,
          thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || '',
          views: parseInt(statistics.viewCount) || 0,
          likes: parseInt(statistics.likeCount) || 0,
          comments: parseInt(statistics.commentCount) || 0,
          shares: 0, // YouTube statistics API does not expose public shareCount
          isLive: true,
          fetchedAt: new Date().toISOString(),
        };
      }

      case 'tiktok': {
        const token = apiKeys.apifyToken?.trim();
        if (!token) {
          throw new Error('Missing Apify API Token. Please configure your Apify token in Settings or switch to Mock Mode.');
        }

        const endpoint = `https://api.apify.com/v2/actors/clockworks~tiktok-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postURLs: [url],
            resultsPerPage: 1,
          }),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          throw new Error(`Apify TikTok Scraper Error (${res.status}): ${errText || res.statusText}. Consider switching to Mock Mode if Apify compute units are depleted.`);
        }

        const items = await res.json();
        if (!Array.isArray(items) || items.length === 0) {
          throw new Error('TikTok scraper returned 0 items for this URL. Ensure the video is public.');
        }

        const item = items[0];
        return {
          platform: 'tiktok',
          videoId,
          url,
          title: item.text || item.desc || `TikTok Video (${videoId})`,
          thumbnail: item.videoMeta?.coverUrl || item.covers?.default || '',
          views: parseInt(item.playCount) || 0,
          likes: parseInt(item.diggCount) || 0,
          comments: parseInt(item.commentCount) || 0,
          shares: parseInt(item.shareCount) || 0,
          isLive: true,
          fetchedAt: new Date().toISOString(),
        };
      }

      case 'instagram': {
        const token = apiKeys.apifyToken?.trim();
        if (!token) {
          throw new Error('Missing Apify API Token. Please configure your Apify token in Settings or switch to Mock Mode.');
        }

        const endpoint = `https://api.apify.com/v2/actors/apify~instagram-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            directUrls: [url],
            resultsType: 'posts',
            resultsLimit: 1,
          }),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          throw new Error(`Apify Instagram Scraper Error (${res.status}): ${errText || res.statusText}. Consider switching to Mock Mode if token has expired.`);
        }

        const items = await res.json();
        if (!Array.isArray(items) || items.length === 0) {
          throw new Error('Instagram scraper returned 0 items. Ensure post URL is publicly accessible.');
        }

        const item = items[0];
        return {
          platform: 'instagram',
          videoId,
          url,
          title: (item.caption || '').slice(0, 80) || `Instagram Reel (${videoId})`,
          thumbnail: item.displayUrl || item.thumbnailUrl || '',
          views: parseInt(item.videoPlayCount || item.videoViewCount || item.likesCount) || 0,
          likes: parseInt(item.likesCount) || 0,
          comments: parseInt(item.commentsCount) || 0,
          shares: parseInt(item.sharesCount) || 0,
          isLive: true,
          fetchedAt: new Date().toISOString(),
        };
      }

      case 'x': {
        const token = apiKeys.apifyToken?.trim();
        if (!token) {
          throw new Error('Missing Apify API Token. Please configure your Apify token in Settings or switch to Mock Mode.');
        }

        // Guarantee normalized x.com URL format instead of legacy twitter.com
        let xUrl = url.trim().replace(/^https?:\/\/(?:www\.)?twitter\.com/i, 'https://x.com');
        if (!xUrl.startsWith('http://') && !xUrl.startsWith('https://')) {
          xUrl = 'https://' + xUrl;
        }

        const endpoint = `https://api.apify.com/v2/actors/apidojo~tweet-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startUrls: [xUrl],
            maxItems: 1,
          }),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          throw new Error(`Apify X Scraper Error (${res.status}): ${errText || res.statusText}.`);
        }

        const items = await res.json();
        if (!Array.isArray(items) || items.length === 0) {
          throw new Error('X post scraper returned 0 items. Verify the post exists on x.com and is not private.');
        }

        // Detect if actor returned noResults (e.g. apidojo monthly free limit on actor)
        const validItem = items.find((i) => !i.noResults && (i.text || i.full_text || i.likeCount !== undefined || i.views !== undefined));
        if (!validItem && items.every((i) => i.noResults)) {
          throw new Error('Apify X Scraper returned "noResults: true". (The apidojo~tweet-scraper actor has hit its free monthly run limit for this token or the post is not indexed). Switch to Mock Mode for instant testing or upgrade your Apify account.');
        }

        const item = validItem || items[0];
        const likes = parseInt(item.likeCount || item.likes || item.favorite_count) || 0;
        const mappedViews = parseInt(item.views || item.viewCount || item.impressionCount || (likes * 8)) || 0;

        return {
          platform: 'x',
          videoId,
          url: xUrl,
          title: (item.text || item.full_text || '').slice(0, 90) || `X Post (${videoId})`,
          thumbnail: item.entities?.media?.[0]?.media_url_https || item.media?.[0]?.url || '',
          views: mappedViews,
          likes,
          comments: parseInt(item.replyCount || item.replies || item.commentsCount) || 0,
          shares: parseInt(item.retweetCount || item.repostCount || item.reposts) || 0,
          isLive: true,
          fetchedAt: new Date().toISOString(),
        };
      }

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (error) {
    // If CORS or Network failure, or API failure, enrich with friendly fallback instructions
    console.warn(`[Live API Call Failed for ${platform}]`, error);
    
    let userFriendlyMessage = error.message;
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      userFriendlyMessage = `Direct browser request blocked by CORS or network timeout. Apify/Google endpoints may be blocked by your network or ad-blocker. Switch to "Mock Mode (Instant Demo)" in the top header or Settings to test without live network restrictions.`;
    }
    
    const enrichedError = new Error(userFriendlyMessage);
    enrichedError.originalError = error;
    enrichedError.canFallbackToMock = true;
    throw enrichedError;
  }
}

// 4. Mock Generator for instant testing
function generateMockMetrics(platform, url, videoId, presetData = null) {
  // If user selected a preset sample, use its defined metrics
  if (presetData && presetData.mockMetrics) {
    return {
      platform,
      videoId,
      url,
      title: presetData.mockMetrics.title || presetData.name,
      views: presetData.mockMetrics.views,
      likes: presetData.mockMetrics.likes,
      comments: presetData.mockMetrics.comments,
      shares: presetData.mockMetrics.shares || 0,
      thumbnail: `https://images.unsplash.com/photo-${1618005182384 + Math.floor(Math.random() * 50)}?w=400&auto=format&fit=crop&q=60`,
      isLive: false,
      isMock: true,
      fetchedAt: new Date().toISOString(),
    };
  }

  // Dynamic realistic generation based on URL hints
  const isSuspiciousHint = /fake|bot|cheat|spike|farm|scam/i.test(url);
  const isGhostHint = /ghost|zero|empty|dead/i.test(url);
  const isPodHint = /pod|ring|spam/i.test(url);

  let views = 45000 + Math.floor(Math.random() * 35000);
  let likes = Math.floor(views * (0.04 + Math.random() * 0.05));
  let comments = Math.floor(likes * (0.05 + Math.random() * 0.06));
  let shares = Math.floor(comments * 0.4);

  if (isSuspiciousHint) {
    // 45% like ratio
    likes = Math.floor(views * 0.44);
    comments = 150;
    shares = 30;
  } else if (isGhostHint) {
    views = 72000;
    likes = 45;
    comments = 12;
    shares = 3;
  } else if (isPodHint) {
    views = 15000;
    likes = 1200;
    comments = 780; // comments/likes > 0.50
    shares = 45;
  }

  return {
    platform,
    videoId,
    url,
    title: `${platform.toUpperCase()} Submission: ${videoId}`,
    views,
    likes,
    comments,
    shares,
    thumbnail: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=60`,
    isLive: false,
    isMock: true,
    fetchedAt: new Date().toISOString(),
  };
}

