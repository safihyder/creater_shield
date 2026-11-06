# CreatorShield | Creator Analytics & Fraud Detection Suite

A single-page, 100% client-side Proof of Concept (PoC) in **React (Vite + Tailwind CSS + Lucide Icons + Recharts)** for creator performance verification, real-time engagement bot fraud detection, and automated CPM payout management.

---

## 🚀 Quick Start

```bash
# Navigate to project folder
cd creator-fraud-suite

# Install dependencies (already pre-installed)
pnpm install

# Start Vite development server
pnpm run dev
```

Open your browser at `http://localhost:3000`.

---

## 🔑 1. API Configuration (.env) & Zero-Backend Architecture

- **Environment Variables**: Copy `.env.example` to `.env` and set your API keys (masked in UI):
  ```env
  VITE_APIFY_API_TOKEN=your_apify_api_token_here
  VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
  ```
- **Client-Side Storage**: Configuration and video records persist locally in browser `localStorage` (`cs_api_keys`, `cs_use_live_api`, `cs_live_videos`, `cs_mock_videos`). No separate backend server is needed.
- **Engine Modes**:
  - **⚡ Mock Mode (Instant Demo)**: Generates realistic mock responses instantly with zero API quotas or network delays.
  - **🌐 Live Direct API Mode**: Dispatches direct cross-origin browser requests (`CORS`) to:
    - **YouTube Data API v3**: `GET https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${key}`
    - **TikTok Scraper (Apify)**: `POST https://api.apify.com/v2/actors/clockworks~tiktok-scraper/run-sync-get-dataset-items`
    - **Instagram Scraper (Apify)**: `POST https://api.apify.com/v2/actors/apify~instagram-scraper/run-sync-get-dataset-items`
    - **X / Twitter Scraper (Apify)**: `POST https://api.apify.com/v2/actors/apidojo~tweet-scraper/run-sync-get-dataset-items`

---

## 🛡️ 2. Synchronous Fraud & Engagement Engine

Before any post is stored in state, it evaluates the exact fraud detection rules:

### 1. Engagement Rate (ER%)
$$\text{ER\%} = \frac{\text{Likes} + \text{Comments} + \text{Shares}}{\text{Views}} \times 100$$

### 2. Fraud Signal Rules
| Rule | Condition | Risk Score Added | Reason Triggered |
|---|---|---|---|
| **Impossible / Bot Ratio** | `views > 500 && er > 35` | `+40 pts` | "Engagement ratio is suspiciously high (>35% vs standard 3–10% baseline)" |
| **Likes without Views** | `views > 0 && (likes / views) > 0.40` | `+40 pts` | "Likes-to-views ratio is over 40% (characteristic of cheap bot packages)" |
| **Comment Pod / Spam** | `likes > 0 && (comments / likes) > 0.50` | `+25 pts` | "Disproportionately high comments-to-likes ratio (possible engagement pod)" |
| **Ghost Views / View Botting** | `views > 10000 && er < 0.2` | `+30 pts` | "High view count with almost zero interactions (potential view inflation)" |

### 3. Classification & Payout Thresholds
- **Score $\ge 70$**: Status = `Fake / Flagged`, Risk = `Critical`, Payment = `Rejected`, Payout = `$0.00`
- **Score $\ge 35$**: Status = `Suspicious`, Risk = `High`, Payment = `On Hold`, Payout = `$0.00`
- **Score $< 35$**: Status = `Verified`, Risk = `Low`, Payment = `Pending`, Payout = `(Views / 1000) * CPM`

---

## 🖥️ 3. Core Features & Views

1. **Role Switcher & Navigation**:
   - Dark navy sidebar (`#0b1b2e`).
   - Switch between **Admin View** and **Creator View (Ayesha Khan)**.
   - Global status banner displaying current Live/Mock mode with direct shortcut to API Settings modal.
   - Reset sample records button.

2. **Creator View**:
   - **Submit Video Form**: Select platform, load 1-click test presets (Organic Reel, Bot Spike, Fake Bot Package, Verified YouTube, Ghost Views), enter CPM, and submit with active loader.
   - **Creator Analytics**: 5 KPI cards (Total Submitted, Total Views, Verified Videos, Flagged Videos, Total Earnings).
   - **My Videos Table**: Real-time verification status, payment status, audit logs.

3. **Admin View**:
   - **Overview Dashboard**: Aggregate volume metrics, 7-day Organic vs Bot Views Recharts area chart, and platform risk breakdown.
   - **Verification Center**: Search, platform tabs, status filters, comprehensive data table with ER% and risk score meters.
   - **Inspect Modal**: Deep breakdown of metrics, exact detected fraud rules triggered, audit logs, and admin override actions (`Mark Verified`, `Flag Suspicious`, `Mark Fake`, `Reject`).
   - **Payment Management**: Clear status breakdown (Paid, Pending, On Hold, Rejected savings), batch approval action, and individual clearinghouse controls.

