<template>
  <div style="background:#0a0a0a">
    <AppNav />

    <!-- HERO -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-left">
          <div class="hero-tag">🇳🇬 Nigeria's #1 Digital Asset Exchange</div>
          <h1 class="hero-h1">
            Trade Deriv, Crypto<br />
            & Gift Cards at<br />
            <span class="red">Live Market Rates</span>
          </h1>
          <p class="hero-p">Buy and sell Deriv USD, Bitcoin, USDT, iCash, Valchar and more. Instant NGN payouts to any Nigerian bank.</p>
          <div class="hero-btns">
            <NuxtLink to="/register" class="btn-red" style="padding:15px 32px;font-size:15px">Start Trading Free</NuxtLink>
            <NuxtLink to="/rates" class="btn-ghost" style="padding:15px 32px;font-size:15px">Check Rates →</NuxtLink>
          </div>
          <div class="hero-trust">
            <span>✓ No hidden fees</span>
            <span>✓ Instant bank payout</span>
            <span>✓ 50,000+ traders</span>
          </div>
        </div>
        <div class="hero-right">
          <RateCalculator />
        </div>
      </div>
    </section>

    <!-- TICKER -->
    <div class="ticker">
      <div class="ticker-label">LIVE</div>
      <div class="ticker-scroll">
        <div class="ticker-track">
          <span class="t-item" v-for="(c,i) in [...CARDS,...CARDS]" :key="i">
            {{ c.logo }} {{ c.name }}
            <span class="t-rate">₦{{ Math.round(c.sellRate * liveRate) }}/$</span>
            <span class="t-sep">|</span>
          </span>
        </div>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-bar">
      <div class="container stats-inner">
        <div class="stat" v-for="s in stats" :key="s.label">
          <p class="stat-val">{{ s.val }}</p>
          <p class="stat-lbl">{{ s.label }}</p>
        </div>
      </div>
    </div>

    <!-- WHAT WE TRADE -->
    <section class="section">
      <div class="container">
        <div class="sec-top">
          <div>
            <p class="eyebrow">WHAT WE TRADE</p>
            <h2 class="sec-h2">Deriv · Crypto · Vouchers · Gift Cards</h2>
          </div>
          <NuxtLink to="/rates" class="btn-ghost" style="padding:10px 20px;font-size:13px">All Rates →</NuxtLink>
        </div>

        <!-- Deriv Highlight -->
        <div class="deriv-banner">
          <div class="deriv-left">
            <span class="tag-live">🟢 LIVE</span>
            <h3 class="deriv-title">Deriv USD</h3>
            <p class="deriv-sub">Nigeria's best Deriv USD exchange rate. Sell your Deriv balance directly to us — instant NGN payout.</p>
            <div class="deriv-rate" v-if="derivCard">
              <div class="dr-item">
                <p class="dr-lbl">We Buy At</p>
                <p class="dr-val green">₦{{ Math.round(derivCard.sellRate * liveRate) }} <span class="dr-unit">per $1</span></p>
              </div>
              <div class="dr-divider" />
              <div class="dr-item">
                <p class="dr-lbl">We Sell At</p>
                <p class="dr-val yellow">₦{{ Math.round(derivCard.buyRate * liveRate) }} <span class="dr-unit">per $1</span></p>
              </div>
              <div class="dr-divider" />
              <div class="dr-item">
                <p class="dr-lbl">Settlement</p>
                <p class="dr-val white">5–10 min</p>
              </div>
            </div>
            <NuxtLink to="/sell" class="btn-red" style="margin-top:24px;padding:13px 28px">Sell Deriv USD Now</NuxtLink>
          </div>
          <div class="deriv-right">
            <div class="deriv-logo">📈</div>
          </div>
        </div>


      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="section dark-section">
      <div class="container">
        <div style="text-align:center;margin-bottom:56px">
          <p class="eyebrow">HOW IT WORKS</p>
          <h2 class="sec-h2">Trade in 3 Simple Steps</h2>
        </div>
        <div class="steps-grid">
          <div class="step" v-for="s in steps" :key="s.num">
            <div class="step-n">{{ s.num }}</div>
            <div class="step-icon">{{ s.icon }}</div>
            <h3 class="step-title">{{ s.title }}</h3>
            <p class="step-desc">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="section">
      <div class="container">
        <div style="text-align:center;margin-bottom:56px">
          <p class="eyebrow">WHY PLERO</p>
          <h2 class="sec-h2">Built for Serious Traders</h2>
        </div>
        <div class="feat-grid">
          <div class="feat" v-for="f in features" :key="f.title">
            <div class="feat-icon">{{ f.icon }}</div>
            <h3 class="feat-title">{{ f.title }}</h3>
            <p class="feat-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-sec">
      <div class="container" style="text-align:center;position:relative;z-index:1">
        <p class="eyebrow" style="color:rgba(255,255,255,0.4)">GET STARTED</p>
        <h2 style="font-size:clamp(28px,5vw,52px);font-weight:900;margin-bottom:16px;line-height:1.1">
          Ready to Trade?<br /><span class="red">Create Your Free Account</span>
        </h2>
        <p style="color:#555;font-size:16px;margin-bottom:40px">Join 50,000+ traders on Nigeria's most trusted platform.</p>
        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
          <NuxtLink to="/register" class="btn-red" style="padding:16px 40px;font-size:15px">Create Free Account</NuxtLink>
          <NuxtLink to="/login" class="btn-ghost" style="padding:16px 40px;font-size:15px">Sign In</NuxtLink>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { CARDS } from '~/data/cards'

const { liveRate } = useDerivRate()
const derivCard = computed(() => CARDS.find(c => c.id === 'deriv'))

const stats = [
  { val: '50,000+', label: 'Active Traders' },
  { val: '₦2B+', label: 'Total Volume' },
  { val: '12+', label: 'Assets Supported' },
  { val: '< 15 min', label: 'Avg Payout' },
]
const steps = [
  { num: '01', icon: '📝', title: 'Create Account', desc: 'Sign up free in under 2 minutes. Add your bank account for instant NGN payouts.' },
  { num: '02', icon: '🎴', title: 'Select Asset', desc: 'Choose Deriv USD, crypto, voucher or gift card. Enter amount and details.' },
  { num: '03', icon: '💸', title: 'Get Paid', desc: 'We verify and send NGN directly to your bank within 5–15 minutes.' },
]
const features = [
  { icon: '⚡', title: 'Instant Payouts', desc: 'Get paid within 5–15 minutes after verification. No delays.' },
  { icon: '📈', title: 'Live Deriv Rates', desc: 'Real-time USD/NGN rates via Deriv WebSocket API.' },
  { icon: '₿', title: 'Crypto Support', desc: 'Trade BTC, ETH, USDT at competitive NGN rates.' },
  { icon: '🔒', title: 'Bank-Level Security', desc: '256-bit encryption and 2FA on every account.' },
  { icon: '🎧', title: '24/7 Support', desc: 'Live chat, WhatsApp and email support always available.' },
  { icon: '✅', title: 'Verified Platform', desc: 'Fully registered and compliant Nigerian exchange.' },
]
</script>

<style scoped>
.hero {
  min-height: 100vh; display: flex; align-items: center;
  padding: 120px 0 80px;
  background: radial-gradient(ellipse 80% 50% at 50% -5%, rgba(255,68,79,0.07) 0%, transparent 60%);
  border-bottom: 1px solid #1a1a1a;
}
.hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.hero-tag { display: inline-block; background: rgba(255,68,79,0.08); border: 1px solid rgba(255,68,79,0.2); border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: #ff444f; margin-bottom: 24px; }
.hero-h1 { font-size: clamp(32px,4.5vw,58px); font-weight: 900; line-height: 1.1; margin-bottom: 20px; letter-spacing: -1px; }
.red { color: #ff444f; }
.hero-p { font-size: 16px; color: #777; line-height: 1.7; margin-bottom: 32px; }
.hero-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
.hero-trust { display: flex; gap: 20px; flex-wrap: wrap; }
.hero-trust span { font-size: 13px; color: #444; font-weight: 500; }

.ticker { display: flex; background: #111; border-top: 1px solid #1a1a1a; border-bottom: 1px solid #1a1a1a; overflow: hidden; }
.ticker-label { background: #ff444f; color: #fff; font-size: 10px; font-weight: 800; letter-spacing: 1px; padding: 12px 16px; flex-shrink: 0; display: flex; align-items: center; }
.ticker-scroll { flex: 1; overflow: hidden; }
.ticker-track { display: flex; white-space: nowrap; animation: ticker 40s linear infinite; padding: 12px 0; }
.t-item { font-size: 13px; color: #666; font-weight: 500; }
.t-rate { color: #00a79e; font-weight: 700; margin-left: 6px; }
.t-sep { color: #222; margin: 0 16px; }

.stats-bar { background: #0e0e0e; border-bottom: 1px solid #1a1a1a; }
.stats-inner { display: grid; grid-template-columns: repeat(4,1fr); }
.stat { padding: 36px 24px; border-right: 1px solid #1a1a1a; text-align: center; }
.stat:last-child { border-right: none; }
.stat-val { font-size: 32px; font-weight: 900; color: #fff; margin-bottom: 4px; }
.stat-lbl { font-size: 12px; color: #444; font-weight: 500; }

.section { padding: 88px 0; background: #0a0a0a; }
.dark-section { background: #0e0e0e; }
.eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #ff444f; text-transform: uppercase; margin-bottom: 10px; }
.sec-h2 { font-size: clamp(22px,3.5vw,38px); font-weight: 800; color: #fff; }
.sec-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; flex-wrap: wrap; gap: 16px; }

/* Deriv Banner */
.deriv-banner {
  display: flex; justify-content: space-between; align-items: center;
  background: linear-gradient(135deg, #1a0a0a, #110808);
  border: 1px solid rgba(255,68,79,0.2); border-radius: 12px;
  padding: 40px; margin-bottom: 40px; overflow: hidden; position: relative;
}
.deriv-banner::before { content:''; position:absolute; right:-60px; top:-60px; width:240px; height:240px; border-radius:50%; background:radial-gradient(circle,rgba(255,68,79,0.08),transparent 70%); }
.tag-live { display:inline-flex; align-items:center; gap:6px; background:rgba(0,167,158,0.1); border:1px solid rgba(0,167,158,0.2); border-radius:20px; padding:4px 12px; font-size:11px; font-weight:700; color:#00a79e; margin-bottom:12px; }
.deriv-title { font-size: 32px; font-weight: 900; color: #fff; margin-bottom: 8px; }
.deriv-sub { color: #666; font-size: 14px; line-height: 1.6; max-width: 420px; margin-bottom: 24px; }
.deriv-rate { display: flex; align-items: center; gap: 0; background: rgba(0,0,0,0.3); border: 1px solid #1e1e1e; border-radius: 8px; overflow: hidden; width: fit-content; }
.dr-item { padding: 14px 24px; text-align: center; }
.dr-divider { width: 1px; background: #1e1e1e; align-self: stretch; }
.dr-lbl { font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.dr-val { font-size: 20px; font-weight: 800; }
.dr-unit { font-size: 12px; font-weight: 400; color: #555; }
.green { color: #00a79e; }
.yellow { color: #f59e0b; }
.white { color: #fff; }
.deriv-right { flex-shrink: 0; }
.deriv-logo { font-size: 80px; opacity: 0.15; }

/* Category Tabs */
.cat-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 24px; }
.cat-tab { padding: 8px 18px; border-radius: 4px; background: #111; border: 1px solid #1e1e1e; color: #555; font-size: 13px; font-weight: 500; transition: all 0.2s; }
.cat-tab.active { background: #ff444f; border-color: #ff444f; color: #fff; }
.cat-tab:hover:not(.active) { border-color: #333; color: #fff; }

/* Cards Grid */
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 1px; background: #1a1a1a; border: 1px solid #1a1a1a; border-radius: 8px; overflow: hidden; }
.card-tile { background: #0e0e0e; padding: 22px; display: block; text-decoration: none; transition: background 0.2s; }
.card-tile:hover { background: #141414; }
.ct-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.ct-logo { width: 46px; height: 46px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
.ct-instant { font-size: 10px; font-weight: 700; color: #f59e0b; background: rgba(245,158,11,0.1); padding: 3px 8px; border-radius: 3px; }
.ct-name { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.ct-cat { color: #444; font-size: 12px; margin-bottom: 14px; }
.ct-rates { display: flex; justify-content: space-between; background: #0a0a0a; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; }
.ct-rl { font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
.ct-rv { font-size: 15px; font-weight: 700; }
.ct-footer { display: flex; justify-content: space-between; align-items: center; }
.ct-min { color: #333; font-size: 12px; }
.ct-trade { color: #ff444f; font-size: 13px; font-weight: 600; }

/* Steps */
.steps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: #1a1a1a; border: 1px solid #1a1a1a; border-radius: 8px; overflow: hidden; }
.step { background: #0e0e0e; padding: 36px 28px; position: relative; }
.step-n { font-size: 56px; font-weight: 900; color: #1a1a1a; position: absolute; top: 20px; right: 20px; line-height: 1; }
.step-icon { font-size: 32px; margin-bottom: 16px; }
.step-title { font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.step-desc { color: #555; font-size: 14px; line-height: 1.7; }

/* Features */
.feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: #1a1a1a; border: 1px solid #1a1a1a; border-radius: 8px; overflow: hidden; }
.feat { background: #0a0a0a; padding: 28px; transition: background 0.2s; }
.feat:hover { background: #0e0e0e; }
.feat-icon { font-size: 26px; margin-bottom: 14px; }
.feat-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.feat-desc { color: #555; font-size: 13px; line-height: 1.7; }

/* CTA */
.cta-sec { padding: 88px 0; background: #0e0e0e; border-top: 1px solid #1a1a1a; position: relative; overflow: hidden; }
.cta-sec::before { content:''; position:absolute; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(255,68,79,0.05),transparent 70%); top:50%; left:50%; transform:translate(-50%,-50%); }

@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; }
  .hero-right { display: none; }
  .stats-inner { grid-template-columns: repeat(2,1fr); }
  .stat:nth-child(2) { border-right: none; }
  .steps-grid, .feat-grid { grid-template-columns: 1fr; }
  .deriv-banner { flex-direction: column; }
  .deriv-right { display: none; }
}
@media (max-width: 480px) {
  .cards-grid { grid-template-columns: 1fr; }
}
@keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
</style>
