# Graph Report - zyro  (2026-10-17)

## Corpus Check
- Corpus is ~2,235 words - fits in a single context window. You may not need a graph.

## Summary
- 54 nodes · 81 edges · 7 communities
- Extraction: 57% EXTRACTED · 43% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.89)
- Token cost: 68,220 input · 0 output

## Community Hubs (Navigation)
- Brand Philosophy & Homepage
- Skinny Pop & Zero Claims
- Indie Pop Desi Sodas
- Hydrate+ Electrolytes
- Company & Manufacturing
- Energy Pop Line
- Founder, Music & Campaigns

## God Nodes (most connected - your core abstractions)
1. `Zyro (Zyro By Karan Aujla)` - 14 edges
2. `VRB Consumer Products Pvt. Ltd. (legal entity)` - 9 edges
3. `Zero Sugar · Zero Calories · Zero Harmful Chemicals` - 8 edges
4. `Zyro Homepage` - 8 edges
5. `Nothing Unnecessary (tagline)` - 5 edges
6. `Energy Pop (product line catalogue)` - 5 edges
7. `Hydrate+ (product line catalogue)` - 5 edges
8. `Skinny Pop (product line catalogue)` - 5 edges
9. `Karan Aujla` - 4 edges
10. `Indie Pop (product line)` - 4 edges

## Surprising Connections (you probably didn't know these)
- `VRB Consumer Products Pvt. Ltd. (legal entity)` --semantically_similar_to--> `VRB Consumer Products Pvt. Ltd.`  [INFERRED] [semantically similar]
  company-and-campaigns.md → brand.md
- `Hydrate+ (product line catalogue)` --semantically_similar_to--> `Hydrate+ (product line)`  [INFERRED] [semantically similar]
  products.md → brand.md
- `Indie Pop (product line catalogue)` --semantically_similar_to--> `Indie Pop (product line)`  [INFERRED] [semantically similar]
  products.md → brand.md
- `Energy Pop (product line catalogue)` --semantically_similar_to--> `Energy Pop (product line)`  [INFERRED] [semantically similar]
  products.md → brand.md
- `Skinny Pop (product line catalogue)` --semantically_similar_to--> `Skinny Pop (product line)`  [INFERRED] [semantically similar]
  products.md → brand.md

## Hyperedges (group relationships)
- **Zyro four product lines** — content_zyro_brand_hydrate, content_zyro_brand_indie_pop, content_zyro_brand_energy_pop, content_zyro_brand_skinny_pop [EXTRACTED 1.00]
- **Zyro contract manufacturers identified by batch code** — content_zyro_company_and_campaigns_batch_number_manufacturer_code, content_zyro_company_and_campaigns_axiom_foods_and_beverages, content_zyro_company_and_campaigns_tethys_foods_beverages, content_zyro_company_and_campaigns_pisbi_enterprises, content_zyro_company_and_campaigns_mahodar_beverages [EXTRACTED 1.00]
- **Nothing Unnecessary subtraction philosophy** — content_zyro_brand_nothing_unnecessary, content_zyro_brand_subtraction_minimalism, content_zyro_brand_zero_sugar_zero_calories_zero_harmful_chemicals, content_zyro_brand_guilt_free_taste, content_zyro_brand_zyro_philosophy [INFERRED 0.85]

## Communities (7 total, 0 thin omitted)

### Community 0 - "Brand Philosophy & Homepage"
Cohesion: 0.33
Nodes (9): Clarity, Discipline, Purpose, Everything starts at Zyro (brand story), Zyro Homepage, Nothing Unnecessary (tagline), Shopify Dawn-style Theme, Subtraction / Minimalism, Zyro (Zyro By Karan Aujla), ZYRO COMMUNITY (social/UGC section) (+1 more)

### Community 1 - "Skinny Pop & Zero Claims"
Cohesion: 0.22
Nodes (9): Guilt-free Taste, Skinny Pop (product line), WE'VE GOT IT RIGHT (shop-all banner), Zero Sugar · Zero Calories · Zero Harmful Chemicals, Ginger Ale Flavoured listing images (250 ml), Tonic Water listing images (250 ml), Ginger Ale Flavoured, Skinny Pop (product line catalogue) (+1 more)

### Community 2 - "Indie Pop Desi Sodas"
Cohesion: 0.28
Nodes (9): Indie Pop (product line), Roots / Desi Nostalgia, Jeera Soda listing images (250 ml), Masala Cola listing images (250 ml), Vita Cola listing images (250 ml), Indie Pop (product line catalogue), Jeera Soda, Masala Cola (+1 more)

### Community 3 - "Hydrate+ Electrolytes"
Cohesion: 0.25
Nodes (8): Hydrate+ (product line), Green Apple listing images (400 ml), Lime & Lemon listing images (400 ml), Strawberry & Watermelon listing images (400 ml), Green Apple, Hydrate+ (product line catalogue), Lime & Lemon, Strawberry & Watermelon

### Community 4 - "Company & Manufacturing"
Cohesion: 0.36
Nodes (8): VRB Consumer Products Pvt. Ltd., Axiom Foods and Beverages Pvt. Ltd. (AF), Batch Number Manufacturer Code, Mahodar Beverages Pvt. Ltd. (MB), Pisbi Enterprises (PE), Tethys Foods & Beverages (P) Ltd (TF), Payments: Google Pay, PhonePe, UPI, VRB Consumer Products Pvt. Ltd. (legal entity)

### Community 5 - "Energy Pop Line"
Cohesion: 0.40
Nodes (6): Energy Pop (product line), Berry Blast listing images (250 ml), Blue Bolt listing images (250 ml), Berry Blast, Blue Bolt, Energy Pop (product line catalogue)

### Community 6 - "Founder, Music & Campaigns"
Cohesion: 0.50
Nodes (5): Instagram @zyroindia, Karan Aujla, Music / Culture, Zyro Concert Contest (Karan Aujla tour 2026), Zyro Corporate Bingo Challenge

## Knowledge Gaps
- **13 isolated node(s):** `WE'VE GOT IT RIGHT (shop-all banner)`, `Shopify Dawn-style Theme`, `Payments: Google Pay, PhonePe, UPI`, `Berry Blast listing images (250 ml)`, `Blue Bolt listing images (250 ml)` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Zyro (Zyro By Karan Aujla)` connect `Brand Philosophy & Homepage` to `Skinny Pop & Zero Claims`, `Indie Pop Desi Sodas`, `Hydrate+ Electrolytes`, `Company & Manufacturing`, `Energy Pop Line`, `Founder, Music & Campaigns`?**
  _High betweenness centrality (0.468) - this node is a cross-community bridge._
- **Why does `Zero Sugar · Zero Calories · Zero Harmful Chemicals` connect `Skinny Pop & Zero Claims` to `Brand Philosophy & Homepage`, `Indie Pop Desi Sodas`, `Hydrate+ Electrolytes`, `Energy Pop Line`?**
  _High betweenness centrality (0.423) - this node is a cross-community bridge._
- **Why does `VRB Consumer Products Pvt. Ltd. (legal entity)` connect `Company & Manufacturing` to `Brand Philosophy & Homepage`, `Founder, Music & Campaigns`?**
  _High betweenness centrality (0.237) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `VRB Consumer Products Pvt. Ltd. (legal entity)` (e.g. with `VRB Consumer Products Pvt. Ltd.` and `Zyro (Zyro By Karan Aujla)`) actually correct?**
  _`VRB Consumer Products Pvt. Ltd. (legal entity)` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `Zero Sugar · Zero Calories · Zero Harmful Chemicals` (e.g. with `Energy Pop (product line catalogue)` and `Hydrate+ (product line catalogue)`) actually correct?**
  _`Zero Sugar · Zero Calories · Zero Harmful Chemicals` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `WE'VE GOT IT RIGHT (shop-all banner)`, `Shopify Dawn-style Theme`, `Payments: Google Pay, PhonePe, UPI` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._