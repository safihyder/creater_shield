/**
 * Client-Side Fraud & Engagement Engine
 * Runs synchronously on raw post statistics before state commits.
 */

export function analyzeVideoMetrics({ views = 0, likes = 0, comments = 0, shares = 0, ratePer1k = 2.50 }) {
  // Normalize numerical inputs
  const numViews = Math.max(0, parseInt(views) || 0);
  const numLikes = Math.max(0, parseInt(likes) || 0);
  const numComments = Math.max(0, parseInt(comments) || 0);
  const numShares = Math.max(0, parseInt(shares) || 0);
  const cpm = Math.max(0, parseFloat(ratePer1k) || 0);

  // 1. Calculate Engagement Rate (ER%)
  const er = numViews > 0 
    ? Number((((numLikes + numComments + numShares) / numViews) * 100).toFixed(2)) 
    : 0;

  // 2. Fraud Signal Rules
  let riskScore = 0;
  const reasons = [];
  const signals = [];

  const likesToViews = numViews > 0 ? numLikes / numViews : 0;
  const commentsToLikes = numLikes > 0 ? numComments / numLikes : 0;

  // Rule 1: Impossible / Bot Ratio
  const rule1Triggered = numViews > 500 && er > 35;
  if (rule1Triggered) {
    riskScore += 40;
    const msg = 'Engagement ratio is suspiciously high (>35% vs standard 3–10% baseline)';
    reasons.push(msg);
    signals.push({
      rule: 'Impossible / Bot Ratio',
      weight: 40,
      description: msg,
      severity: 'Critical',
      observed: `${er}% ER`,
      threshold: '< 35%',
    });
  }

  // Rule 2: Likes without Views
  const rule2Triggered = numViews > 0 && likesToViews > 0.40;
  if (rule2Triggered) {
    riskScore += 40;
    const msg = 'Likes-to-views ratio is over 40% (characteristic of cheap bot packages)';
    reasons.push(msg);
    signals.push({
      rule: 'Likes without Views',
      weight: 40,
      description: msg,
      severity: 'High',
      observed: `${(likesToViews * 100).toFixed(1)}% likes/views`,
      threshold: '< 40%',
    });
  }

  // Rule 3: Comment Pod / Spam
  const rule3Triggered = numLikes > 0 && commentsToLikes > 0.50;
  if (rule3Triggered) {
    riskScore += 25;
    const msg = 'Disproportionately high comments-to-likes ratio (possible engagement pod)';
    reasons.push(msg);
    signals.push({
      rule: 'Comment Pod / Spam Ring',
      weight: 25,
      description: msg,
      severity: 'Medium',
      observed: `${(commentsToLikes * 100).toFixed(1)}% comments/likes`,
      threshold: '< 50%',
    });
  }

  // Rule 4: Ghost Views / View Botting
  const rule4Triggered = numViews > 10000 && er < 0.2;
  if (rule4Triggered) {
    riskScore += 30;
    const msg = 'High view count with almost zero interactions (potential view inflation)';
    reasons.push(msg);
    signals.push({
      rule: 'Ghost Views / View Botting',
      weight: 30,
      description: msg,
      severity: 'High',
      observed: `${er}% ER on ${numViews.toLocaleString()} views`,
      threshold: '>= 0.20% ER',
    });
  }

  // Cap risk score between 0 and 100
  riskScore = Math.min(100, Math.max(0, riskScore));

  // 3. Classification & Payout Determination
  let status = 'Verified';
  let riskLevel = 'Low';
  let paymentStatus = 'Pending';
  let calculatedPay = 0;

  if (riskScore >= 70) {
    status = 'Fake / Flagged';
    riskLevel = 'Critical';
    paymentStatus = 'Rejected';
    calculatedPay = 0;
  } else if (riskScore >= 35) {
    status = 'Suspicious';
    riskLevel = 'High';
    paymentStatus = 'On Hold';
    calculatedPay = 0;
  } else {
    status = 'Verified';
    riskLevel = 'Low';
    paymentStatus = 'Pending';
    calculatedPay = Number(((numViews / 1000) * cpm).toFixed(2));
  }

  return {
    views: numViews,
    likes: numLikes,
    comments: numComments,
    shares: numShares,
    er,
    riskScore,
    riskLevel,
    reasons,
    signals,
    status,
    paymentStatus,
    calculatedPay,
    ratePer1k: cpm,
    metrics: {
      likesToViews: Number((likesToViews * 100).toFixed(2)),
      commentsToLikes: Number((commentsToLikes * 100).toFixed(2)),
      totalInteractions: numLikes + numComments + numShares,
    },
    ruleChecks: [
      { name: 'Bot Engagement Ratio (ER ≤ 35%)', triggered: rule1Triggered, points: 40 },
      { name: 'Likes-to-Views Ratio (≤ 40%)', triggered: rule2Triggered, points: 40 },
      { name: 'Comment Pod Ratio (≤ 50% of likes)', triggered: rule3Triggered, points: 25 },
      { name: 'Organic Traffic Floor (ER ≥ 0.2% on >10k)', triggered: rule4Triggered, points: 30 },
    ],
  };
}

