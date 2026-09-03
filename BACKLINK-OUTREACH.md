# External authority & backlink action plan

**Status: plan only.** Nothing in this file has been executed. No profile has been edited,
no message sent, no repository outside this one modified. Every item below needs Sajid to
act, because every one of them requires an account only he can log into.

**What this can and cannot do.** Links and consistent profiles help search engines and AI
assistants *find* and *connect* the entity "Sajid Islam" to sajiddev.systems. They do not
guarantee indexing, ranking, or citation by any AI assistant. Treat the priorities below as
"most likely to help per unit of effort", not as promises.

**Excluded on principle** — these damage a site and are not recommended under any priority:
buying links, paid guest-post networks, mass directory submissions, comment/forum link drops,
automated outreach, and reciprocal-link schemes.

---

## Tier 1 — Entity consistency (do this first)

The cheapest and most reliable work. The goal is that every profile states the *same* name,
role, location and site, so search engines and LLMs resolve them to one person rather than
several. These are `sameAs` targets already declared in the homepage JSON-LD, which means the
site already claims them — the claim just needs to be reciprocated from each profile.

The canonical facts to use verbatim:

| Field | Value |
|---|---|
| Name | Sajid Islam |
| Site | https://sajiddev.systems |
| Location | Peshawar, Pakistan |
| Education | BS Computer Science, FAST NUCES — Aug 2024 to expected May 2028 |
| Email | sajidislam0875@gmail.com |

> **Decide the role string once.** The site currently says *Agentic AI & Python Engineer*; the
> résumé says *AI Engineering Undergraduate — Generative AI, Agentic Systems & LLM
> Applications*. Pick one and use it everywhere. See the positioning options in
> `SEO-AEO-IMPLEMENTATION.md` — this is Sajid's call, not one to be made by default.

| # | Target | Destination | Suggested anchor / field | Evidence needed | Owner action | Priority | Risk / limitation |
|---|---|---|---|---|---|---|---|
| 1.1 | GitHub profile (`Sajid0875`) | `https://sajiddev.systems` | Website field (bare URL) + bio line | none | Edit profile; set the website field and bio | **High** | `nofollow`, so no ranking value — but it is a strong entity signal and is widely scraped |
| 1.2 | GitHub profile README | `/projects/whatsapp-commerce-copilot/`, `/projects/entropy-aware-data-preservation/` | "WhatsApp Commerce Copilot — case study", "Entropy-aware retention in PostgreSQL" | none | Create `Sajid0875/Sajid0875` repo with a README | **High** | Needs upkeep; stale profile READMEs read worse than none |
| 1.3 | LinkedIn | `https://sajiddev.systems` | Featured section + Contact info website | none | Add site to Contact info; add both case studies to Featured | **High** | `nofollow`; highest human-traffic item on this list |
| 1.4 | Kaggle (`sajid75`) | `https://sajiddev.systems` | Bio website field | none | Edit profile | Medium | Thin profile; consider publishing one notebook first so it is not an empty shell |
| 1.5 | Medium (`@sajidislam0875`) | `https://sajiddev.systems` | Bio + "About" | none | Edit profile | Medium | Only worth it alongside item 3.1 |
| 1.6 | Hashnode (`@sajid0875`) | `https://sajiddev.systems` | Profile website + custom domain option | none | Edit profile | Medium | Hashnode allows canonical-URL cross-posting — see 3.1 |
| 1.7 | DEV (`@sajid0875`) | `https://sajiddev.systems` | Profile website | none | Edit profile | Medium | Supports `canonical_url` on posts — use it |
| 1.8 | FAST NUCES student/society profile | `https://sajiddev.systems` | Name + site | Confirm such a directory exists and accepts student entries | Ask the CS department / FAST CSS society | Low | May not exist; do not fabricate a listing |

---

## Tier 2 — Project attribution (highest editorial value available today)

These links are *earned* — they exist because Sajid genuinely built the thing being linked.
That makes them both legitimate and durable.

| # | Target | Destination | Suggested anchor | Evidence needed | Owner action | Priority | Risk / limitation |
|---|---|---|---|---|---|---|---|
| 2.1 | `Sajid0875/adaptive-data-preservation` README | `/projects/entropy-aware-data-preservation/` | "Read the full case study" | none — Sajid owns this repo | Apply the patch in the appendix below | **High** | None. This is the single easiest real link available |
| 2.2 | `Comebck-Pakistan/cohort-1-squad-margalla` README | `/projects/whatsapp-commerce-copilot/` | "Case study: WhatsApp Commerce Copilot" | Squad/org agreement — this repo is **not** Sajid's to edit unilaterally | Open a PR; ask squadmates and the org to review | Medium | Org-owned. A PR may be declined; that is a legitimate outcome, not a problem to route around |
| 2.3 | Case studies → repositories | already done | "View project source on GitHub" | none | none — already live | Done | — |
| 2.4 | Comebck cohort project listing / leaderboard | `/projects/whatsapp-commerce-copilot/` | "WhatsApp Commerce Copilot" | **Need to confirm a public cohort listing exists.** None was found | Ask the Comebck organisers whether a public project page exists and can link out | Medium | **Do not create or imply a cohort results page that does not exist.** The "Top 5" claim currently has no public source |
| 2.5 | Squadmates' profiles (Khansa Maryam, Muhammad Ullah Baig, Manahil Shah) | `/projects/whatsapp-commerce-copilot/` | "WhatsApp Commerce Copilot" | Their consent | Ask; do not assume | Low | Never edit or request edits on someone's behalf without asking them directly |
| 2.6 | Demo video description (if one is ever recorded) | `/projects/whatsapp-commerce-copilot/` | "Full write-up and architecture" | A demo video — none exists today | Record a screen demo of the local Docker setup | Low | Blocked on an asset that does not exist |

---

## Tier 3 — Editorial authority (slowest, most durable)

| # | Target | Destination | Suggested anchor | Evidence needed | Owner action | Priority | Risk / limitation |
|---|---|---|---|---|---|---|---|
| 3.1 | Cross-post the three drafts to DEV / Hashnode / Medium | the article on sajiddev.systems | "Originally published on sajiddev.systems" | **Sajid must review and approve the drafts first** | Approve drafts → remove `noindex` → publish here → cross-post with `canonical_url` pointing back | **High** (after approval) | Always set the canonical to your own domain, or the copy outranks the original |
| 3.2 | FAST NUCES CS society / university engineering blog | `/writing/` or a specific article | "How I grounded an LLM in a product catalogue" | An approved article | Pitch to FAST CSS | Medium | Student publications are inconsistent; may not have a site |
| 3.3 | Relevant developer communities (r/PostgreSQL, Lobsters, HN) | the specific article | the article's own title | An approved article that stands on its own | Post it, and be present to answer questions | Medium | **Self-promotion rules vary and are enforced.** Only post where genuinely on-topic; a thin post gets removed and costs reputation |
| 3.4 | LangChain / Evolution API community showcases | `/projects/whatsapp-commerce-copilot/` | "WhatsApp commerce copilot built with LangChain" | none | Submit to the project's showcase channel if one exists | Low | Check each project's rules first |
| 3.5 | Awesome-lists (e.g. awesome-postgres) | `/writing/entropy-aware-data-preservation-postgresql-triggers/` | descriptive title | An approved article | PR to the list | Low | Most lists reject self-submissions; read CONTRIBUTING first |

---

## Sequencing

1. **Now:** Tier 1 items 1.1–1.3, and Tier 2 item 2.1. All are free, unambiguous, and entirely
   within Sajid's control.
2. **Next:** Review the three drafts. Everything in Tier 3 is blocked until they are approved
   and the `noindex` is removed.
3. **Then:** Tier 2 item 2.2 as a PR, and item 2.4 as a question to the organisers.
4. **Ongoing:** one article at a time. Three good articles beat ten thin ones, and thin
   articles actively hurt a small site.

---

## Appendix — suggested README patch for `Sajid0875/adaptive-data-preservation`

Sajid owns this repository, so this patch is safe to apply — but **it has not been applied**,
because it is outside this repository. Add near the top, after the project title:

```markdown
## Case study

A full write-up of this project — the schema, the scoring function, the trigger pipeline and
an honest account of its limitations — is at
**[sajiddev.systems/projects/entropy-aware-data-preservation](https://sajiddev.systems/projects/entropy-aware-data-preservation/)**.

> **Note on the name.** The score this system computes is *not* Shannon entropy and uses no
> logarithm. `calculate_entropy()` computes
> `(SUM(change_weight) * COUNT(state_changes)) / snapshot_size_mb` — a weighted change-density
> ratio. The case study explains the distinction.
```

That second paragraph matters as much as the link: the repository currently carries the same
overstated name the portfolio just corrected, and leaving them inconsistent is worse than
having no link at all.

## Appendix — suggested README patch for `Comebck-Pakistan/cohort-1-squad-margalla`

**Do not apply without the squad's and the organisation's agreement** — this repository
belongs to the Comebck Pakistan org, not to Sajid. Offer it as a PR:

```markdown
### Case study

[WhatsApp Commerce Copilot — architecture and write-up](https://sajiddev.systems/projects/whatsapp-commerce-copilot/)
by [Sajid Islam](https://sajiddev.systems), covering the grounding pipeline, the Human Mode
handoff, and the project's limitations.
```

Keep it factual and short. A squad repository is shared credit, so a PR that reads as one
member marketing themselves is likely — and reasonably — to be declined.
