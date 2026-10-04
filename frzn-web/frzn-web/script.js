const $ = (s) => document.querySelector(s),
  money = (n) => "$" + n.toLocaleString("en-US");
const CL = {
  White: "#F5F7F8",
  Blue: "#7894A6",
  Silver: "#C8D3DA",
  Black: "#11171B",
  Navy: "#182B38",
  Grey: "#8A99A3",
  Gloss: "#AFC4D1",
};
const P = [
  {
    n: "Aurora Silver",
    t: "Reflective puffer jacket",
    c: ["White", "Blue"],
    k: "Puffers",
    p: 899.99,
    x: "#DCE7EC",
  },
  {
    n: "Orbit Silver",
    t: "High-gloss puffer",
    c: ["Silver"],
    k: "Puffers",
    p: 1199,
    x: "#C8D3DA",
  },
  {
    n: "Stealth Black",
    t: "Heavy shield puffer",
    c: ["Black", "White"],
    k: "Puffers",
    p: 1199,
    x: "#2b3f4e",
  },
  {
    n: "Glacier White",
    t: "Insulated puffer jacket",
    c: ["Grey"],
    k: "Jackets",
    p: 1299,
    x: "#F5F7F8",
  },
  {
    n: "Polar Gloss",
    t: "Blue puffer jacket",
    c: ["Blue", "Gloss"],
    k: "Puffers",
    p: 899,
    x: "#7894A6",
  },
  {
    n: "Stealth Navy",
    t: "Heavy puffer parka",
    c: ["Navy", "Black"],
    k: "Parkas",
    p: 1199,
    x: "#182B38",
  },
  {
    n: "Icefield Blue",
    t: "Tech puffer jacket",
    c: ["Blue"],
    k: "Jackets",
    p: 999,
    x: "#536E80",
  },
  {
    n: "Polar White",
    t: "Smell puffer jacket",
    c: ["White"],
    k: "Parkas",
    p: 1499,
    x: "#E6EDF1",
  },
];
const cur = { i: 0 },
  fig = $("#fig"),
  th = $("#th");
const svg = (c) =>
  `<svg viewBox="0 0 120 220" aria-hidden="true"><use href="#j"/></svg>`;
P.slice(0, 7).forEach((o, i) => {
  const b = document.createElement("button");
  b.style.setProperty("--c", o.x);
  b.setAttribute("aria-label", "Show " + o.n);
  b.innerHTML = svg();
  b.onclick = () => show(i);
  th.append(b);
});
function show(n) {
  n = (n + 7) % 7;
  fig.classList.add("out");
  setTimeout(() => {
    const o = P[n];
    fig.style.setProperty("--c", o.x);
    $("#hn").textContent = o.n;
    $("#hp").textContent = money(o.p);
    $("#hcol").innerHTML = o.c.map((c) => `<span>${c}</span>`).join("");
    $("#ix").textContent = "0" + (n + 1);
    fig.classList.remove("out");
  }, 300);
  [...th.children].forEach((b, i) => b.classList.toggle("on", i === n));
  th.style.transform = `translateX(${-Math.min(n, 5) * (th.children[0].offsetWidth + 14)}px)`;
  cur.i = n;
}
$("#pv").onclick = () => show(cur.i - 1);
$("#nx").onclick = () => show(cur.i + 1);
fig.style.setProperty("--c", P[0].x);
th.children[0].classList.add("on");

const grid = $("#grid");
P.forEach((o, i) => {
  const a = document.createElement("article");
  a.className = "card";
  a.dataset.i = i;
  a.innerHTML = `<a href="#new" aria-label="View ${o.n}"><div class="pn grain" style="--k:${o.x}">${svg()}<span class="qa m">Quick add</span></div></a>
<div class="info m"><h3 class="nm">${o.n}</h3><p>${o.t}</p><div class="dots" aria-label="Available colours">${o.c.map((c) => `<span><i style="background:${CL[c]}"></i>${c}</span>`).join("")}</div><data value="${o.p}">${money(o.p)}</data></div>`;
  a.querySelector(".qa").onclick = (e) => {
    e.preventDefault();
    add();
  };
  grid.append(a);
});
let n = 0;
const add = () => ($("#cnt").textContent = ++n);
document.querySelector("[data-q]").onclick = add;

const cats = [...new Set(P.map((o) => o.k))],
  cols = [...new Set(P.flatMap((o) => o.c))].filter((c) => c !== "Gloss");
const box = (id, arr, g) =>
  ($(id).innerHTML = arr
    .map(
      (v) =>
        `<label class="m"><input type="checkbox" name="${g}" value="${v}">${v}</label>`,
    )
    .join(""));
box("#fcat", cats, "k");
box("#fcol", cols, "c");
const dr = $("#dr"),
  sh = $("#sh");
let last;
const tog = (o) => {
  dr.classList.toggle("open", o);
  sh.classList.toggle("open", o);
  if (o) {
    last = document.activeElement;
    $("#fc").focus();
  } else last && last.focus();
};
$("#fo").onclick = () => tog(true);
$("#fc").onclick = $("#fa").onclick = () => {
  filter();
  tog(false);
};
sh.onclick = () => tog(false);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && dr.classList.contains("open")) tog(false);
});
$("#rg").oninput = (e) => ($("#pv2").textContent = money(+e.target.value));
$("#fx").onclick = () => {
  dr.querySelectorAll("input[type=checkbox]").forEach(
    (i) => (i.checked = false),
  );
  $("#rg").value = 2000;
  $("#pv2").textContent = "$2,000";
  filter();
};
function filter() {
  const k = [...dr.querySelectorAll("[name=k]:checked")].map((i) => i.value),
    c = [...dr.querySelectorAll("[name=c]:checked")].map((i) => i.value),
    m = +$("#rg").value;
  let v = 0;
  grid.querySelectorAll(".card").forEach((a) => {
    const o = P[a.dataset.i],
      ok =
        (!k.length || k.includes(o.k)) &&
        (!c.length || o.c.some((x) => c.includes(x))) &&
        o.p <= m;
    a.hidden = !ok;
    v += ok;
  });
  $("#none").hidden = v > 0;
}

new IntersectionObserver(([e]) =>
  $("#hd").classList.toggle("s", !e.isIntersecting),
).observe(
  Object.assign(document.body.appendChild(document.createElement("div")), {
    style: "position:absolute;top:0;height:48px;width:1px",
  }),
);

$("#hadd").onclick = () => add();
