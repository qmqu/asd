"use strict";
// Snapshot de los tiers originales de MCTiers del 17/11/2026.
// Solo los nombres de los tres primeros puestos están personalizados.
const modes = [
  {id:"overall", name:"Overall", icon:"🏆"},
  {id:"vanilla", name:"Vanilla", icon:"💎"},
  {id:"uhc", name:"UHC", icon:"🍎"},
  {id:"pot", name:"Pot", icon:"🧪"},
  {id:"nethop", name:"NethOP", icon:"🛡️"},
  {id:"smp", name:"SMP", icon:"🌲"},
  {id:"sword", name:"Sword", icon:"⚔️"},
  {id:"axe", name:"Axe", icon:"🪓"},
  {id:"mace", name:"Mace", icon:"🔨"}
];
// Las parejas de tiers conservan el orden y valor mostrado por MCTiers.
const players = [
 {rank:1, name:"zR1ckXDefender", title:"Combat Grandmaster", points:450, region:"NA", tiers:{nethop:"HT1",mace:"HT1",smp:"HT1",vanilla:"HT1",sword:"HT1",pot:"HT1",uhc:"LT1",axe:"LT1"}},
 {rank:2, name:"iMythixz", title:"Combat Master", points:330, region:"NA", tiers:{sword:"HT3",vanilla:"HT1",pot:"HT1",nethop:"HT1",smp:"HT1",axe:"LT2",uhc:"LT2",mace:"LT2"}},
 {rank:3, name:"LarryCap0lla", title:"Combat Master", points:326, region:"EU", tiers:{pot:"LT1",vanilla:"LT3",uhc:"HT1",smp:"HT1",sword:"LT1",mace:"LT1",axe:"LT1",nethop:"LT2"}},
 {rank:4, name:"Swight", title:"Combat Master", points:290, region:"NA", tiers:{vanilla:"LT3",axe:"HT1",smp:"HT1",uhc:"HT1",nethop:"HT2",mace:"LT2",sword:"LT2",pot:"LT2"}},
 {rank:5, name:"janekv", title:"Combat Master", points:260, region:"EU", tiers:{mace:"LT3",vanilla:"HT4",nethop:"HT1",smp:"HT1",pot:"HT1",sword:"HT2",uhc:"LT2",axe:"LT2"}},
 {rank:6, name:"BlvckWlf", title:"Combat Ace", points:226, region:"EU", tiers:{sword:"HT3",nethop:"LT3",vanilla:"LT3",uhc:"HT1",smp:"HT1",mace:"HT2",axe:"HT2",pot:"LT2"}},
 {rank:6, name:"Kylaz", title:"Combat Ace", points:226, region:"NA", tiers:{smp:"HT3",uhc:"LT3",vanilla:"LT3",pot:"HT1",sword:"HT1",nethop:"HT1",axe:"LT2"}},
 {rank:8, name:"ninorc15", title:"Combat Ace", points:196, region:"EU", tiers:{smp:"HT3",uhc:"HT3",axe:"HT3",vanilla:"LT3",sword:"LT2",pot:"LT2",mace:"LT2",nethop:"LT2"}},
 {rank:9, name:"Lurrn", title:"Combat Ace", points:186, region:"EU", tiers:{uhc:"LT3",axe:"LT4",pot:"HT1",nethop:"HT1",vanilla:"HT2",sword:"LT2"}},
 {rank:10, name:"Arsakha", title:"Combat Ace", points:177, region:"ME", tiers:{uhc:"HT3",axe:"HT3",pot:"HT3",sword:"LT3",nethop:"LT3",vanilla:"LT3",mace:"LT3",smp:"HT1"}}
];
const table = document.getElementById("leaderboard");
const tabs = document.getElementById("mode-tabs");
const search = document.getElementById("search");
const empty = document.getElementById("no-results");
let activeMode = "overall";
function tag(tagName, className, content) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (content !== undefined) element.textContent = content;
  return element;
}
function makeTier(modeId, value) {
  const mode = modes.find(m => m.id === modeId);
  const box = tag("span", "tier " + (value || "").toLowerCase());
  box.title = `${mode.name}: ${value}`;
  box.append(tag("span", "mode-icon", mode.icon), tag("b", "", value), tag("small", "", mode.name));
  return box;
}
function render() {
  table.replaceChildren();
  const query = search.value.toLocaleLowerCase().trim();
  const visible = players.filter(p => p.name.toLowerCase().includes(query) && (activeMode === "overall" || p.tiers[activeMode]));
  // Orden fijo del ranking general: cambiar el filtro no modifica el ranking original.
  for (const player of visible) {
    const tr = tag("tr", player.rank <= 3 ? "top3" : "");
    const rank = tag("td");rank.append(tag("span","rank",`#${player.rank}`));
    const playerCell = tag("td");
    const person = tag("div","player");
    const avatar = tag("div","avatar",player.name[0].toUpperCase());
    const identity = tag("div");identity.append(tag("div","username",player.name),tag("div","rank-title",player.title));
    person.append(avatar,identity);playerCell.append(person);
    const region = tag("td");region.append(tag("span","region",player.region));
    const score = tag("td");const points = tag("span","points",String(player.points));points.append(tag("small",""," pts"));score.append(points);
    const tierCell = tag("td");const tiersBox = tag("div","tiers");
    const order = activeMode === "overall" ? Object.keys(player.tiers) : [activeMode];
    for (const id of order) tiersBox.append(makeTier(id,player.tiers[id]));
    tierCell.append(tiersBox);
    tr.append(rank,playerCell,region,score,tierCell);table.append(tr);
  }
  empty.hidden = visible.length > 0;
}
function renderTabs() {
  tabs.replaceChildren();
  for (const mode of modes) {
    const button = tag("button", "tab" + (activeMode === mode.id ? " active" : ""));
    button.type = "button";
    button.append(tag("span","mini",mode.icon),document.createTextNode(mode.name));
    button.addEventListener("click",()=>{
      activeMode=mode.id;
      document.getElementById("ranking-title").textContent=(activeMode === "overall" ? "Overall" : mode.name) + " Minecraft PvP Rankings";
      renderTabs();render();
    });
    tabs.append(button);
  }
}
search.addEventListener("input", render);
document.getElementById("copy-ip").addEventListener("click",async()=>{
  try {await navigator.clipboard.writeText("playmctiers.com");document.getElementById("copy-ip").textContent="¡Copiado!";}
  catch {document.getElementById("copy-ip").textContent="playmctiers.com";}
});
renderTabs();render();
