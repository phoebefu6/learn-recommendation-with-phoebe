/* recsys-live.js - a REAL in-browser recommender (learn-recommendation-with-phoebe).
   Not a scripted sim: this computes actual recommendations on a tiny "Kirana" catalog with
   real cosine similarity, co-occurrence, content scoring, and precision@k against a held-out
   relevant set. Switch the algorithm and watch the recommendations - and the precision@3 -
   genuinely change. Popularity ignores you (0%); collaborative + content personalize and climb.
   Honesty rail: real math on a teaching catalog, not a production engine. Deterministic. */
(function () {
  var host = document.getElementById("recsys-live");
  if (!host) return;

  /* ---- the catalog (id, name, emoji, content tags) ---- */
  var ITEMS = [
    { id: "i1", name: "Yoga Mat",      emoji: "🧘", tags: ["fitness", "wellness"] },
    { id: "i2", name: "Dumbbells",     emoji: "🏋️", tags: ["fitness", "strength"] },
    { id: "i3", name: "Protein Powder",emoji: "🥤", tags: ["fitness", "nutrition"] },
    { id: "i4", name: "Blender",       emoji: "🍹", tags: ["kitchen", "nutrition"] },
    { id: "i5", name: "Water Bottle",  emoji: "💧", tags: ["fitness", "kitchen"] },
    { id: "i6", name: "Running Shoes", emoji: "👟", tags: ["fitness", "outdoor"] },
    { id: "i7", name: "Cookbook",      emoji: "📗", tags: ["kitchen", "nutrition"] },
    { id: "i8", name: "Coffee Maker",  emoji: "☕", tags: ["kitchen"] }
  ];
  var IDS = ITEMS.map(function (x) { return x.id; });
  var itemById = {}; ITEMS.forEach(function (x) { itemById[x.id] = x; });

  /* ---- other shoppers' purchase histories (the interactions matrix) ---- */
  var USERS = {
    u1: ["i1", "i2", "i6"],       // fitness
    u2: ["i1", "i3", "i5"],       // fitness + nutrition
    u3: ["i4", "i7", "i8"],       // kitchen
    u4: ["i4", "i7", "i8"],       // kitchen
    u5: ["i4", "i7", "i3"],       // kitchen + nutrition
    u6: ["i7", "i8", "i4"]        // kitchen
  };
  var UKEYS = Object.keys(USERS);

  /* ---- "You": what you have bought, and the held-out set you actually like ---- */
  var YOU = ["i1", "i3"];                 // Yoga Mat + Protein Powder (fitness leaning)
  var RELEVANT = ["i2", "i5", "i6"];      // ground truth: Dumbbells, Water Bottle, Running Shoes
  var K = 3;

  var candidates = IDS.filter(function (id) { return YOU.indexOf(id) < 0; });

  /* ---- helpers ---- */
  function dot(a, b) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
  function norm(a) { return Math.sqrt(dot(a, a)); }
  function cosine(a, b) { var n = norm(a) * norm(b); return n === 0 ? 0 : dot(a, b) / n; }

  // item vector = over users (who bought this item)
  function itemVec(id) { return UKEYS.map(function (u) { return USERS[u].indexOf(id) >= 0 ? 1 : 0; }); }
  // user vector = over items
  function userVec(basket) { return IDS.map(function (id) { return basket.indexOf(id) >= 0 ? 1 : 0; }); }

  /* ---- the algorithms (each returns [{id, score, why}] over candidates) ---- */
  function popularity() {
    return candidates.map(function (id) {
      var count = UKEYS.reduce(function (a, u) { return a + (USERS[u].indexOf(id) >= 0 ? 1 : 0); }, 0);
      return { id: id, score: count, why: count + " shoppers bought it" };
    });
  }

  function itemItem() {
    var vecs = {}; IDS.forEach(function (id) { vecs[id] = itemVec(id); });
    return candidates.map(function (id) {
      var score = 0, best = null, bestSim = 0;
      YOU.forEach(function (b) {
        var sim = cosine(vecs[id], vecs[b]);
        score += sim;
        if (sim > bestSim) { bestSim = sim; best = b; }
      });
      return { id: id, score: score, why: best ? "similar to your " + itemById[best].name : "no overlap" };
    });
  }

  function userUser() {
    var you = userVec(YOU);
    var sims = UKEYS.map(function (u) { return { u: u, s: cosine(you, userVec(USERS[u])) }; });
    return candidates.map(function (id) {
      var score = 0, top = null, topS = 0;
      sims.forEach(function (o) {
        if (USERS[o.u].indexOf(id) >= 0) { score += o.s; if (o.s > topS) { topS = o.s; top = o.u; } }
      });
      return { id: id, score: score, why: top ? "shoppers like you bought it" : "no similar shopper bought it" };
    });
  }

  function contentBased() {
    var profile = {};
    YOU.forEach(function (b) { itemById[b].tags.forEach(function (t) { profile[t] = (profile[t] || 0) + 1; }); });
    return candidates.map(function (id) {
      var score = 0, hit = [];
      itemById[id].tags.forEach(function (t) { if (profile[t]) { score += profile[t]; hit.push(t); } });
      return { id: id, score: score, why: hit.length ? "matches your " + hit.join(" + ") : "no tag match" };
    });
  }

  function hybrid() {
    function normed(list) {
      var mx = Math.max.apply(null, list.map(function (x) { return x.score; })) || 1;
      var m = {}; list.forEach(function (x) { m[x.id] = x.score / mx; }); return m;
    }
    var ii = normed(itemItem()), cb = normed(contentBased());
    return candidates.map(function (id) {
      return { id: id, score: ii[id] + cb[id], why: "item-item + content blended" };
    });
  }

  var ALGOS = [
    { id: "pop",  label: "Popularity",     fn: popularity,   note: "Recommends what is popular overall - and ignores you entirely." },
    { id: "uu",   label: "User-user CF",   fn: userUser,     note: "Finds shoppers like you and recommends what they bought." },
    { id: "ii",   label: "Item-item CF",   fn: itemItem,     note: "For each item you bought, finds items bought alongside it. Amazon's classic." },
    { id: "cb",   label: "Content-based",  fn: contentBased, note: "Scores items by how well their tags match what you already like." },
    { id: "hy",   label: "Hybrid",         fn: hybrid,       note: "Blends item-item and content scores - often the most robust." }
  ];
  var current = "pop";

  function rank(list) {
    // stable sort by score desc, then original candidate order
    var order = {}; candidates.forEach(function (id, i) { order[id] = i; });
    return list.slice().sort(function (a, b) { return b.score - a.score || order[a.id] - order[b.id]; });
  }
  function precisionAtK(ranked) {
    var top = ranked.slice(0, K);
    var hits = top.filter(function (r) { return RELEVANT.indexOf(r.id) >= 0; }).length;
    return { hits: hits, pct: Math.round((hits / K) * 100) };
  }

  /* ---- render ---- */
  host.innerHTML =
    '<div class="rl-shell">' +
      '<div class="rl-top">' +
        '<div class="rl-you"><span class="rl-youlabel">Your basket</span>' +
          YOU.map(function (id) { return '<span class="rl-chip">' + itemById[id].emoji + ' ' + itemById[id].name + '</span>'; }).join("") +
          '<span class="rl-youhint">Fitness leaning. Which items should Kirana recommend next?</span>' +
        '</div>' +
        '<div class="rl-algos"></div>' +
      '</div>' +
      '<div class="rl-meters">' +
        '<div class="rl-meter"><span class="rl-mlabel">Precision@3</span><span class="rl-mval" id="rl-score">0%</span><div class="rl-bar"><i id="rl-bar"></i></div></div>' +
        '<div class="rl-meter rl-note" id="rl-note"></div>' +
      '</div>' +
      '<div class="rl-recslabel">Top recommendations <span>green = a genuinely relevant pick</span></div>' +
      '<div class="rl-recs" id="rl-recs"></div>' +
      '<p class="rl-rail">This is real recommender math (cosine similarity, co-occurrence, content scoring, and precision@k) computed live on a tiny teaching catalog - not a production engine. The same maths, on millions of items, is what powers Amazon, Netflix, and Lazada.</p>' +
    '</div>';

  var algoWrap = host.querySelector(".rl-algos");
  ALGOS.forEach(function (a) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "rl-algo"; b.setAttribute("data-algo", a.id); b.textContent = a.label;
    b.addEventListener("click", function () { current = a.id; render(); });
    algoWrap.appendChild(b);
  });

  function render() {
    var algo = ALGOS.filter(function (a) { return a.id === current; })[0];
    host.querySelectorAll(".rl-algo").forEach(function (b) { b.classList.toggle("rl-on", b.getAttribute("data-algo") === current); });
    var ranked = rank(algo.fn());
    var p = precisionAtK(ranked);
    var scoreEl = host.querySelector("#rl-score");
    scoreEl.textContent = p.pct + "%";
    scoreEl.className = "rl-mval" + (p.pct === 100 ? " rl-good" : (p.pct === 0 ? " rl-bad" : ""));
    host.querySelector("#rl-bar").style.width = p.pct + "%";
    host.querySelector("#rl-note").innerHTML = "<b>" + algo.label + "</b> " + algo.note + " <span class=\"rl-hits\">" + p.hits + " of " + K + " top picks are relevant.</span>";
    host.querySelector("#rl-recs").innerHTML = ranked.slice(0, 5).map(function (r, i) {
      var it = itemById[r.id];
      var rel = RELEVANT.indexOf(r.id) >= 0;
      var inTop = i < K;
      return '<div class="rl-rec' + (rel && inTop ? " rl-rel" : "") + '">' +
        '<span class="rl-rank">' + (i + 1) + '</span>' +
        '<span class="rl-item">' + it.emoji + ' ' + it.name + '</span>' +
        '<span class="rl-why">' + r.why + '</span>' +
        (rel && inTop ? '<span class="rl-tick">✓</span>' : '') +
        '</div>';
    }).join("");
  }

  render();
})();
