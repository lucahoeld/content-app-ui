
const businesses={ringana:{name:"RINGANA",icon:"🌿"},ownBusiness:{name:"Mein Business",icon:"👤"},mentor:{name:"Mentor",icon:"👥"}};
const types={reel:"Reel",story:"Story",post:"Post",advertising:"Werbung"};
const state={
 tab:"home",
 business:localStorage.getItem("business")||"ringana",
 favorites:new Set(JSON.parse(localStorage.getItem("favorites")||"[]")),
 custom:JSON.parse(localStorage.getItem("customIdeas")||"[]"),
 current:null,
 filter:null,
 search:""
};
const allIdeas=()=>[...IDEAS,...state.custom];
const bizIdeas=()=>allIdeas().filter(i=>i.business===state.business);
function save(){localStorage.setItem("business",state.business);localStorage.setItem("favorites",JSON.stringify([...state.favorites]));localStorage.setItem("customIdeas",JSON.stringify(state.custom))}
function randomIdea(type=null){let a=bizIdeas().filter(i=>!type||i.type===type);if(!a.length)a=bizIdeas();state.current=a[Math.floor(Math.random()*a.length)]||null;render()}
function ideaCard(i){
 if(!i)return `<div class="card empty">Für dieses Business sind noch keine Ideen hinterlegt.</div>`;
 return `<article class="card">
 <div class="idea-head"><div class="idea-type">${types[i.type]}</div><button class="heart" onclick="toggleFav('${i.id}')">${state.favorites.has(i.id)?"♥":"♡"}</button></div>
 <div class="idea-title">${esc(i.title)}</div><div class="idea-text">${esc(i.text)}</div>
 ${i.hook?`<div class="meta"><b>HOOK</b><strong>„${esc(i.hook)}“</strong></div>`:""}
 ${i.cta?`<div class="meta"><b>CTA</b>${esc(i.cta)}</div>`:""}
 ${i.custom?`<div class="small" style="margin-top:12px">👤 Eigener Impuls</div>`:""}
 </article>`
}
function esc(s=""){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function toggleFav(id){state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);save();render()}
function openInstagram(){location.href="instagram://app";setTimeout(()=>{if(!document.hidden)location.href="https://www.instagram.com/"},900)}
function businessPicker(){let b=businesses[state.business];return `<div class="card business-picker" onclick="state.tab='business';render()"><div class="biz-icon">${b.icon}</div><div class="grow"><div class="eyebrow">AKTIVES BUSINESS</div><strong>${b.name}</strong></div><span>⌄</span></div>`}
function home(){
 if(!state.current||state.current.business!==state.business){let a=bizIdeas();state.current=a[Math.floor(Math.random()*a.length)]||null}
 return `<h1>Guten Morgen 👋</h1><p class="subtitle">Deine Content-Inspiration für heute</p>
 ${businessPicker()}
 <div class="section-title">TAGESIMPULS</div>${ideaCard(state.current)}
 <div class="row"><button class="primary" onclick="randomIdea()">↝ Neue Idee</button><button class="secondary" onclick="openModal()">＋ Eigene Idee</button></div>
 <div class="section-title">WAS WILLST DU POSTEN?</div>
 <div class="row"><button class="quick" onclick="randomIdea('reel')"><b>▶</b>Reel</button><button class="quick" onclick="randomIdea('post')"><b>▧</b>Post</button><button class="quick" onclick="randomIdea('story')"><b>◯</b>Story</button></div>
 <button class="instagram" onclick="openInstagram()">Instagram öffnen ↗</button>`
}
function ideasView(){
 let a=bizIdeas().filter(i=>(!state.filter||i.type===state.filter)&&(!state.search||(`${i.title} ${i.text} ${i.hook||""} ${i.cta||""}`).toLowerCase().includes(state.search.toLowerCase())));
 return `<h1>Ideen</h1>${businessPicker()}<input class="search" placeholder="Ideen durchsuchen" value="${esc(state.search)}" oninput="state.search=this.value;renderIdeasOnly()">
 <div class="filters">${[["","Alle"],...Object.entries(types)].map(([k,v])=>`<button class="pill ${state.filter===(k||null)?"active":""}" onclick="state.filter=${k?`'${k}'`:"null"};render()">${v}</button>`).join("")}</div>
 <p class="small">${a.length} Ideen</p><div id="ideasList">${a.length?a.map(ideaCard).join(""):`<div class="empty">Keine Ideen gefunden.</div>`}</div><button class="floating-add" onclick="openModal()">+</button>`
}
function renderIdeasOnly(){render()}
function businessView(){return `<h1>Business</h1><p class="subtitle">Wähle deine aktive Content-Library.</p>${Object.entries(businesses).map(([k,b])=>`<div class="card business-row" onclick="selectBusiness('${k}')"><div class="biz-icon">${b.icon}</div><strong class="grow">${b.name}</strong>${state.business===k?'<span class="check">✓</span>':''}</div>`).join("")}`}
function favoritesView(){let a=allIdeas().filter(i=>state.favorites.has(i.id));return `<h1>Favoriten</h1><p class="subtitle">Deine gespeicherten Content-Ideen.</p>${a.length?a.map(ideaCard).join(""):`<div class="empty">♡<br><br>Noch keine Favoriten</div>`}`}
function profileView(){return `<h1>Profil</h1><p class="subtitle">Deine Content Library</p><div class="card"><div class="stat"><span>✦ Impulse insgesamt</span><b>${allIdeas().length}</b></div><div class="stat"><span>＋ Eigene Impulse</span><b>${state.custom.length}</b></div><div class="stat"><span>♥ Favoriten</span><b>${state.favorites.size}</b></div></div><div class="section-title">INSTAGRAM</div><button class="instagram" onclick="openInstagram()">Instagram öffnen ↗</button><div class="card"><b>💡 Content Inspiration</b><p class="small">Deine Ideen bleiben lokal auf diesem Gerät gespeichert.</p><b>▣ Offline Library</b><p class="small">Nach dem ersten Laden funktioniert die App auch offline.</p></div>`}
function selectBusiness(k){state.business=k;state.current=null;save();render()}
function render(){
 document.querySelectorAll(".tabbar button").forEach(b=>b.classList.toggle("active",b.dataset.tab===state.tab));
 const map={home,ideas:ideasView,business:businessView,favorites:favoritesView,profile:profileView};
 document.getElementById("screen").innerHTML=map[state.tab]();
}
document.querySelectorAll(".tabbar button").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;render()});
function openModal(){
 document.getElementById("modal").classList.remove("hidden");
 document.getElementById("newBusiness").innerHTML=Object.entries(businesses).map(([k,v])=>`<option value="${k}" ${k===state.business?"selected":""}>${v.name}</option>`).join("");
 document.getElementById("newType").innerHTML=Object.entries(types).map(([k,v])=>`<option value="${k}">${v}</option>`).join("");
}
document.getElementById("closeModal").onclick=()=>document.getElementById("modal").classList.add("hidden");
document.getElementById("saveIdea").onclick=()=>{
 let title=document.getElementById("newTitle").value.trim(),text=document.getElementById("newText").value.trim();
 if(!title||!text)return alert("Bitte Titel und Idee ausfüllen.");
 state.custom.push({id:"custom-"+Date.now(),business:document.getElementById("newBusiness").value,type:document.getElementById("newType").value,title,text,hook:document.getElementById("newHook").value.trim(),cta:document.getElementById("newCTA").value.trim(),custom:true});
 ["newTitle","newText","newHook","newCTA"].forEach(x=>document.getElementById(x).value="");
 save();document.getElementById("modal").classList.add("hidden");render()
};
if("serviceWorker" in navigator)navigator.serviceWorker.register("service-worker.js");
render();
