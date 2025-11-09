# CrisisCore Go-To-Market Playbook

This playbook packages the launch and early growth strategy for the CrisisCore Neural Entrainment platform. It covers revenue streams, pricing, research tasks, marketing execution, and week-by-week action plans for the first month, plus scaling guidance for months two and three.

## Executive Summary
- **Business Model:** Subscription-based access to focus, meditation, and brain-training sessions delivered through the CrisisCore web application.
- **Core Offer:** Unlimited guided sessions, AI-personalised guidance, and analytics that help individuals and teams reduce stress and improve concentration.
- **Primary Revenue:** Monthly recurring revenue driven by individual plans, corporate wellness packages, and professional licenses.

## Revenue Streams & Pricing
### 1. Individual Monthly Subscriptions (Primary)
| Plan | Price | Key Inclusions |
| --- | --- | --- |
| **Basic** | $9.99/month | Unlimited sessions, core features |
| **Premium** | $24.99/month | Includes AI personalisation and detailed progress tracking |
| **Pro** | $49.99/month | Adds advanced analytics, data exports, and beta access |

**Implementation (3–4 hrs):**
1. Create a Stripe account and verify the business profile.
2. Link a bank account to enable payouts.
3. Retrieve publishable/secret keys from the Stripe dashboard.
4. Embed hosted Stripe Checkout buttons into the pricing page and test transactions.

### 2. Corporate Wellness Packages
| Tier | Price | Target |
| --- | --- | --- |
| **Small Business** | $299/month | 10–50 employees |
| **Medium Business** | $799/month | 51–200 employees |
| **Large Business** | $1,999/month | 200+ employees |

**Implementation (2–3 hrs):**
1. Draft a one-page overview highlighting employee benefits and ROI.
2. Assemble a pricing sheet with the tiers above.
3. Compile 20 local business prospects (Google Maps/LinkedIn).
4. Email HR leaders with a free 30-day pilot invite.

### 3. Wellness Professional Licenses
| Tier | Price | Capacity |
| --- | --- | --- |
| **Individual Practitioner** | $99/month | Up to 25 clients |
| **Small Clinic** | $199/month | Up to 100 clients |
| **Large Practice** | $399/month | Unlimited clients |

**Implementation (≈2 hrs):**
1. Enable multi-client dashboards and progress reports.
2. Publish a dedicated practitioner landing page.
3. Emphasise value props such as “Help 3× more clients in the same time.”

## Market Research Checklist (Day 1–2)
- **Search queries:** “meditation app pricing 2024,” “brain training software cost,” “corporate wellness program pricing,” “binaural beats app reviews,” “focus app subscription rates.”
- **Competitors to review:** Brain.fm, Focus@Will, Headspace for Business, Calm, Muse.
- **Social listening:** Follow @Headspace (X), join meditation and productivity Facebook/LinkedIn groups, track TikTok hashtags #meditation and #focus.
- **Survey prompts:** Monthly wellness spend, biggest focus challenge, past meditation app experience, employer willingness to sponsor tools.
- **Tools:** Google Trends, AnswerThePublic, Facebook Audience Insights.

## 4-Week Launch Roadmap
### Week 1: Foundation
- **Day 1:** Stripe setup, test $1 payment, secure API keys.
- **Day 2:** Publish `/pricing` page with the three tiers and free-trial CTAs.
- **Day 3:** Configure Mailchimp signup form, welcome email, and day-3 follow-up.
- **Day 4:** Trial competitor apps for 15 minutes; log features, strengths, and pricing.
- **Day 5:** Launch social profiles (X, LinkedIn, Facebook) and share initial post.
- **Day 6:** Prospect early adopters via LinkedIn and Facebook groups (relationship-building focus).
- **Day 7:** QA the signup-to-payment funnel, document wins and improvements.

### Weeks 2–4: Traction
- **Week 2:**
  - Launch beta page with 50% discount for first three months.
  - Produce educational content (blog, infographic, 2-minute demo video) and distribute.
  - Build a five-email onboarding/welcome flow in Mailchimp.
- **Week 3:**
  - Conduct local business outreach (20 targets, free 30-day corporate trial).
  - DM 10 micro-influencers (5k–20k followers) with premium access for reviews.
  - Collect in-app/session feedback via quick-star ratings and surveys.
- **Week 4:**
  - A/B test Basic plan at $7.99 for half of visitors; highlight Premium as “Most Popular.”
  - Offer 20% annual prepay discount and money-back guarantee messaging.
  - Research partnership prospects (yoga studios, therapists) and pitch 30% rev-share deals.
  - Implement Google Analytics conversions and weekly automated reporting.

## Marketing Operations
### Social Media Content Templates
1. **Educational:** Explain brainwave entrainment benefits and invite trials.
2. **User Outcome:** Showcase productivity gains and solicit engagement.
3. **Social Proof:** Share beta testimonials emphasising focus improvements.

### Platform Playbooks
- **Reddit:** Engage helpfully in r/productivity, r/meditation, r/getmotivated before mentioning the product.
- **LinkedIn:** Connect with wellness/HR professionals, post weekly insights, leave thoughtful comments.
- **TikTok:** Publish short demos with trending audio; hashtags #focus, #productivity, #studytok.

### Tools & Scheduling
- **Canva:** Create graphics and infographics.
- **Buffer:** Schedule posts across three channels (free tier).
- **Unsplash:** Source imagery for blogs and social posts.
- **Content cadence:** Monday education, Wednesday tips, Friday behind-the-scenes, Sunday motivation.

## Technical Enablement
### Payments
1. Install Stripe SDK (`npm install stripe`).
2. Integrate hosted checkout with test card `4242 4242 4242 4242`.
3. Configure subscription products (Basic, Premium, Pro) and webhooks for lifecycle events.

### Landing Page
- Clear headline (“Train Your Brain to Focus Better”), benefit bullets, demo video, and “Start Free Trial” CTA.
- Lightweight React/Vite implementation with responsive layout.
- Minimal signup form (email + password) and Mailchimp embed.

### Analytics & Email
- Mailchimp audience with automated welcome + day-3 feedback prompt.
- Google Analytics installed site-wide with signup/payment goals.

## Early Customer Acquisition
### Channels
- **Facebook Groups:** Productivity, study, meditation, and local wellness communities.
- **LinkedIn:** Wellness coordinators, HR managers at startups, productivity coaches.
- **Reddit:** r/productivity, r/GetStudying, r/meditation, r/ADHD.

### Outreach Templates
- **Facebook post:** Invite 10 beta testers for a free month in exchange for feedback.
- **LinkedIn DM:** Offer free workplace trial focused on stress reduction.
- **Cold email:** “Reduce team stress in 5 minutes/day” with CTA for 15-minute call.

### Objection Handling
- Price concerns → propose 30-day free trial.
- Time concerns → emphasise browser-based simplicity.
- Efficacy doubts → highlight money-back guarantee.
- Existing programs → position as complementary micro-sessions.

### Early Pricing Incentives
- First 20 customers receive 50% lifetime discount (Basic $4.99, Premium $12.99, Pro $24.99).
- Next 50 customers get 30% off for six months, then standard pricing.

### Follow-Up Sequence
Day 1 welcome → Day 3 check-in → Day 7 call → Day 14 testimonial ask → Day 21 trial-ending reminder → Day 28 20% discount conversion email.

## Daily, Weekly, Monthly Operations
### Daily (AM & PM)
- Track key metrics (visitors, signups, revenue).
- Respond to support requests and nurture community posts.
- Post daily content and plan next-day messaging.

### Weekly
- **Monday:** Goal setting, schedule posts, define outreach list.
- **Wednesday:** Produce long-form content, update site, research trends.
- **Friday:** Conversion follow-up, business outreach, refine email flows.
- **Sunday:** Analyse weekly metrics, plan upcoming initiatives, back up data.

### Monthly (First Sunday)
- Assess acquisition cost, channel performance, customer feedback, and pricing.
- Set goals, budget, and roadmap for the next month.
- Refresh website messaging, publish case studies, and plan partnerships.

## Quick Revenue Boosters (Week 1–2)
1. **Founder’s Special:** 50% lifetime discount landing page + social/email blast (goal: 5–15 new MRR customers).
2. **Beta Assessments:** Free 30-minute focus consults leading to premium trials.
3. **Local Partnerships:** Coffee-shop demos collecting emails and converting 3–5 customers.
4. **Referral Program:** 1 free month per referral, promoted via dashboard and email.
5. **Focus Coaching:** $97 coaching sessions bundled with subscriptions (target 3–5 sales).

## Month 2–3 Scaling Plan
### Optimisation & Automation (Month 2)
- Build 10-email onboarding, abandoned-cart, and monthly newsletter flows.
- Launch exit-intent discount popups and downloadable “Focus Assessment” lead magnet.
- Expand content engine: four blog posts, weekly YouTube “Focus Friday,” podcast guesting.
- Upgrade tooling: ConvertKit, Calendly, Canva Pro, Hotjar.

### Acquisition Scale (Month 3)
- Hire virtual assistant (10 hrs/week) for support, social scheduling, prospect research.
- Engage content creator for blogs, graphics, and videos.
- Revenue targets: $2k MRR (Month 2), $5k MRR (Month 3).
- Initiatives: affiliate program (30% commission), wellness partnerships, podcast sponsorship, webinars, corporate outreach sprints.

---

**Success Tracking:** Maintain a Google Sheet logging daily visitors, signups, trials, subscriptions, active users, revenue, and sessions. Use Google Analytics, Stripe, and Mailchimp for automated reporting and review metrics daily, weekly, and monthly.
