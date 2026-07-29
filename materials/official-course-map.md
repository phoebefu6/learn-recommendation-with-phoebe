# Official course map - learn-recommendation-with-phoebe

**Course:** Recommendation systems - how the "recommended for you" engine works, end to end
**Scope:** The full picture of recommender systems: the concepts (customer-to-customer / user-user CF, item-to-item CF, content-based, matrix factorization, modern/deep), how they differ across **e-commerce vs fintech**, the **team + pipeline / R&R** (analyst basket analysis -> data scientist trains -> devops/ML eng productionizes -> engineering revamps the UI to surface recs -> algo performance monitoring), the **tech implementation** (real Python), and how it is **measured**. Explained for the layman with a visual per concept, and for the practitioner with real code.
**Arc:** Topic-session, two-track, with a running sample store **"Kirana"** (a marketplace app) threaded through the builder demos so the R&R pipeline is one continuous story. Leader track (a1-a6, PM/biz/product leaders) + builder track (b1-b10, analysts / data scientists / engineers).
**Bucket:** `ds` (Data Science). Palette: electric blue + magenta.
**Coverage bar:** ~80% of the mapped sources' working content per session; papers/courses stay official (cited).
**Build mode:** course-taking loop PAUSED (built direct from verified sources, no learner-notes step).

## Source universe (verified public sources, with citations)

| Source | What it covers | Maps to |
|---|---|---|
| **Amazon** - Linden, Smith & York (2003), "Amazon.com Recommendations: Item-to-Item Collaborative Filtering," IEEE Internet Computing 7(1):76-80, DOI 10.1109/MIC.2003.1167344 (IEEE "Test of Time" 2017). https://www.cs.umd.edu/~samir/498/Amazon-Recommendations.pdf | the founding item-to-item CF algorithm; why item-item scales | a2, b3 |
| **Netflix** - "Netflix Recommendations: Beyond the 5 Stars (Part 1)," Netflix TechBlog. https://netflixtechblog.com/netflix-recommendations-beyond-the-5-stars-part-1-55838468f429 | personalized homepage, ranking, beyond star-rating prediction | a1, a5, a6 |
| **Netflix Prize** - Koren, Bell & Volinsky (2009), "Matrix Factorization Techniques for Recommender Systems," IEEE Computer; Funk (2006) SVD blog post | matrix factorization / latent factors; SVD + RBM ensemble | b6, a6 |
| **Alibaba (AliExpress/Lazada)** - Zhou et al. (2018), "Deep Interest Network for Click-Through Rate Prediction" (DIN), KDD 2018, arXiv:1706.06978. https://arxiv.org/abs/1706.06978 | deep recsys / CTR prediction; user-interest modeling at scale; deployed across Alibaba incl. AliExpress/Lazada | a3, a6, b7 |
| **Alibaba** - Li et al. (2019), "Multi-Interest Network with Dynamic Routing for Recommendation at Tmall" (MIND), arXiv:1904.08030 | multi-interest modeling; industrial retrieval | b7 |
| **Association-rule / basket-analysis canon** - Agrawal & Srikant (1994), Apriori; support / confidence / lift | market basket analysis (the analyst's job) | b2 |
| **Recsys textbook canon** - Aggarwal, "Recommender Systems: The Textbook" (2016); Ricci et al. handbook | CF, content-based, evaluation, hybrid taxonomy | b1, b4, b5, b8 |

## Layman anchors (verified, cite on landing / a1)

- Netflix has publicly stated recommendations drive a large majority of what members watch (the homepage is almost entirely personalized) - use as the "why it matters" hook (cite the TechBlog).
- Amazon's item-to-item CF (2003) is the algorithm behind "customers who bought this also bought" and won IEEE's Test-of-Time award in 2017 - the canonical e-commerce example.
- Alibaba's DIN (2018) is a real, published production algorithm used across its e-commerce platforms (AliExpress/Lazada family) - the modern deep-recsys example.

## Per-session coverage

### Leader track (a1-a6) - PM / biz / product leaders, no code
| # | Session | Primary sources | Coverage |
|---|---|---|---|
| a1 | Why recommendations matter | Netflix TechBlog, industry | ✓ business value, where recs pay off |
| a2 | The types, in plain English | Amazon 2003, textbook | ✓ user-user, item-item, content-based, popularity - visual-heavy |
| a3 | E-commerce vs fintech rec logic | DIN, fintech NBP canon | ✓ discovery/cross-sell vs next-best-product + suitability/cold-start |
| a4 | The team + the pipeline (R&R) | industry practice | ✓ analyst -> DS -> devops -> eng -> monitoring |
| a5 | Measuring recommendations | Netflix, eval canon | ✓ CTR/conversion, A/B, feedback loop, filter bubbles |
| a6 | Strategy, ethics & roadmap | Netflix, DIN, ethics canon | ◐ cold-start, diversity, ethics; Netflix + Lazada/Alibaba case studies cited |

### Builder track (b1-b10) - analysts / DS / engineers (real Python)
| # | Session | Primary sources | Coverage |
|---|---|---|---|
| b1 | Recsys foundations | textbook | ✓ interactions matrix, types map, tools (pandas, implicit, surprise) |
| b2 | Basket analysis & association rules | Apriori canon | ✓ support/confidence/lift, mlxtend/Apriori in pandas |
| b3 | Item-to-item collaborative filtering | Amazon 2003 | ✓ co-occurrence, cosine sim + `recsys-live.js` real demo |
| b4 | Customer-to-customer (user-user) CF | textbook | ✓ neighbourhoods, similarity, predictions, sklearn/surprise |
| b5 | Content-based filtering | textbook | ✓ TF-IDF / embeddings, item profiles, cold-start |
| b6 | Matrix factorization & latent factors | Koren 2009, Funk SVD, Netflix Prize | ✓ SVD/ALS, implicit feedback (implicit lib) |
| b7 | Modern & deep recsys | DIN, MIND | ◐ two-tower, embeddings, session/interest models (re-verify) |
| b8 | Evaluation | eval canon | ✓ precision@k, recall, NDCG, MAP; offline vs online, A/B |
| b9 | Productionizing | industry practice | ✓ batch vs real-time serving, DS->devops handoff, feature store, latency, the eng UI revamp |
| b10 | Monitoring & iteration | industry practice | ✓ performance monitoring, drift, feedback loops, retraining, guardrails |

## Hard rails / honesty

- **Cite the real algorithms honestly.** Netflix/Amazon/Alibaba use far more complex production stacks than any 45-minute session teaches; the course teaches the PUBLISHED, named core (Amazon item-item 2003, matrix factorization / Netflix Prize, Alibaba DIN) and says so - it does not claim to reproduce their live systems.
- **The feedback-loop + bias caution:** recommenders shape behaviour (filter bubbles, popularity bias, over-personalization); teach diversity/guardrails, not just accuracy.
- **Data + privacy:** recommendation runs on behavioural data - respect consent + privacy (GDPR/PDPA); fintech recs carry suitability/regulatory duties (not financial advice).
- **The simulator is real math on a tiny catalog** (a teaching dataset), not a production engine - state it.

## Not covered by design (say so honestly)

- Reproducing Netflix/Amazon/Alibaba production systems (proprietary + far larger).
- Deep-learning recsys implementation from scratch (b7 is a survey with citations; deep-model coding -> a dedicated ML course).
- Reinforcement-learning / bandit recommenders beyond a mention.
- Vendor rec-engine products (AWS Personalize, etc.) beyond the buy-vs-build discussion.

**Re-verify before delivery:** b7/a6 (deep + industrial recsys move fast); the Netflix "% of viewing from recs" stat (quote the TechBlog framing, avoid a hard outdated number).
