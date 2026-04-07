# Business Model Canvas -- Keep Coding

> **Date:** April 6, 2026
> **Company:** Keep Coding
> **Products:** KeepBiz (suite for SMBs) | Keep Solo (app for solopreneurs)
> **Sister company:** CODR Studio (solopreneurs)

---

## Core Hypothesis

> "Do more work without hiring more people."

Keep Coding enters Operational SMBs, maps their daily office workflows, and builds lightweight wrapper apps through an automated Workflow factory. Agents observe how personnel use these apps, learn to replicate the work, and eventually operate autonomously -- replacing repetitive human tasks without replacing the company's existing systems (ERPs, CRMs, etc.).

The first two pilot customers fund and validate a self-serve dashboard that will later allow any SMB worldwide to map their own workflows, eliminating the need for Keep Coding to do hands-on consulting.

---

## Product Architecture

```
                    +--------------------------+
                    |       PRODUCTS           |
                    |                          |
                    |  KeepBiz (SUITE) ------> |  Suite of apps + workflows
                    |      |                   |  for SMBs (decision +
                    |      v                   |  production automation)
                    |  Keep Solo (APP) ------> |  Lighter version for
                    |                          |  solopreneurs
                    +--------------------------+

                    +--------------------------+
                    |     INFRASTRUCTURE       |
                    +--------------------------+
                    |                          |
     +--------------+--+    +--+----------+----+---+
     |  Agency          |    |  GRZ         |  Workflows  |
     |  (Agents that    |    |  (Monitors   |  (Swarm of  |
     |   operate tools  |    |   leads,     |   agents    |
     |   via MCP, REST, |    |   funnel,    |   that      |
     |   Bash, APIs)    |    |   Google/    |   build     |
     |                  |    |   Meta Ads)  |   anything) |
     +------------------+    +-------------++-----------+
```

**Three pillars of the product:**

| Pillar | What it does |
|---|---|
| **Agents (Agency)** | Operate any tool the customer already uses -- via MCP, REST API, Bash, or other connectors. Tool-agnostic. |
| **GRZ (Monitor)** | Tracks business signals in real time -- Google Ads, Meta Business, leads, funnel health, conversion. |
| **Workflows (Factory)** | Swarm of agents that produce anything code can build: apps, creatives, videos, PDFs, marketing materials, campaigns. |

---

## The Agent Learning Loop

1. **Map** -- We observe the customer's daily office tasks (not their customer-facing product, but internal ops: HR, finance, scheduling, payments, recruitment, supply chain).
2. **Build** -- Our Workflow factory auto-generates wrapper apps (desktop + mobile) that mirror those tasks.
3. **Deploy** -- Personnel use our apps instead of touching the ERP/CRM directly. Our apps replicate actions into their existing systems.
4. **Observe** -- Agents silently watch every interaction: clicks, inputs, decisions, patterns.
5. **Learn** -- Agents internalize the workflow through observation.
6. **Activate** -- Once confident, the agent takes over. Customer flips the switch ("activate the heartbeat") and the agent runs the task autonomously.

> Key insight: We don't replace their ERP. Our app is the learning layer -- a Trojan horse that funnels work through us so agents can learn, then take over.

---

## Strategic Pivot: Agency to Product

| Phase | What we do | Revenue model |
|---|---|---|
| **Pilot (now)** | Hands-on: we map workflows, build apps, train agents for two customers | Service fees (pilot subscription + setup) |
| **Handover** | Deliver self-serve dashboard; customers map their own workflows | Platform subscription begins |
| **Scale** | Customers worldwide self-serve; we maintain the platform, not individual clients | SaaS subscription (global) |

**Goal:** Use pilot revenue to fund the self-mapping dashboard. Once ready, exit service mode entirely. Customers own their mapping; we own the platform.

**Go-to-market path:** Portugal --> Spanish-speaking markets --> English-speaking markets.

---

## The Nine Blocks

### 1. Customer Segments

**Operational SMBs** (PMEs Operacionais / PMEs com Retaguarda)

Small and medium businesses with real internal back-office operations -- HR, finance, scheduling, payments, recruitment, supply chain -- regardless of industry. Not defined by what they sell, but by the internal structure they maintain.

**Pilot customers:** Processa Sistemas (software/IT, Juiz de Fora) and Cia Cuidadores (home care services, Juiz de Fora).

---

### 2. Value Propositions

**"Scale operations without adding headcount."**

AI agents automate back-office workflows so the company does more work with the same team, cuts costs, and grows without hiring.

Delivered through:
- Agents that assume repetitive tasks from personnel
- GRZ that monitors leads, ads, and funnel in real time
- Workflows that auto-produce marketing, campaigns, and operational outputs

---

### 3. Channels

- **Pilot phase:** Direct contact -- email, demo calls with existing customers
- **Post-dashboard:** Self-signup on the dashboard platform

---

### 4. Customer Relationships

- **Pilot:** Personal onboarding + weekly check-ins (we do the heavy lifting)
- **Handover:** Self-service dashboard + chat support (they map alone)
- **Long-term:** Community/forum + automated updates

---

### 5. Revenue Streams

- **Pilot subscription** -- recurring fee while we map and automate
- **Setup fee** -- one-time charge for initial workflow mapping + app builds
- **Recurring access** -- ongoing platform subscription post-handover

---

### 6. Key Resources

- **Workflow factory** -- core engine that builds apps automatically
- **Internal interface** -- our own tools to do the daily work now
- **Observation logs** -- agent learning data from user interactions
- **Dashboard prototype** -- the self-serve builder (the real product)

---

### 7. Key Activities

- Map workflows and build wrapper apps (pilot phase)
- Develop the self-mapping dashboard (core product build)
- Train agents via observation
- Handover and exit service (after dashboard is ready)

---

### 8. Key Partners

- **API/tool providers** -- for integrations with existing ERPs, CRMs, and business tools (no custom builds)
- **Freelance UI developer** -- to speed up dashboard development

---

### 9. Cost Structure

- Development time (workflow mapping + dashboard construction)
- Cloud and API call costs (observation + builds)
- Pilot operations (team hours -- temporary, funded by pilot revenue)

---

## Open Questions for Validation

- Will personnel actually adopt wrapper apps over their familiar ERPs?
- How many observation cycles does an agent need before it can operate autonomously?
- At what point is the self-serve dashboard "good enough" to replace hands-on mapping?
- Can two pilot customers generate enough data + revenue to fund the full dashboard build?
- What is the minimum viable set of API connectors needed for launch?
