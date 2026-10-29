const seedGroups = [
  {id:"green",name:"Green Neighbors",category:"Environment",emoji:"🌱",members:42,description:"Small clean-ups, greener streets, tree care, and sustainable habits.",place:"Community-wide"},
  {id:"book",name:"Pages & People",category:"Learning",emoji:"📚",members:28,description:"A relaxed book circle to share ideas, stories, and recommendations.",place:"Local library"},
  {id:"makers",name:"Weekend Makers",category:"Creativity",emoji:"🎨",members:31,description:"Meet creative people for sketching, crafts, photography, and DIY.",place:"Arts corner"},
  {id:"walk",name:"Walk & Wellbeing",category:"Wellbeing",emoji:"🚶",members:36,description:"Friendly walks and simple routines to feel healthier together.",place:"Nearby parks"},
  {id:"help",name:"Neighbors Who Help",category:"Volunteering",emoji:"🤝",members:53,description:"Share skills, lend a hand, and organize practical local volunteering.",place:"Community-wide"},
  {id:"tech",name:"Curious Tech Club",category:"Learning",emoji:"💡",members:24,description:"Learn digital skills together, exchange tips, and help beginners.",place:"Community hub"}
];
const seedEvents = [
  {id:"e1",title:"Sunday park clean-up",category:"Environment",date:nextDate(3),place:"Main park entrance",description:"A friendly one-hour clean-up. Gloves and bags will be provided in this demo.",attendees:12},
  {id:"e2",title:"Bring-a-book circle",category:"Learning",date:nextDate(5),place:"Community library",description:"Bring a book you love and leave with a new recommendation.",attendees:8},
  {id:"e3",title:"Sketch & chai",category:"Creativity",date:nextDate(7),place:"Riverside garden",description:"Casual outdoor sketching. All skill levels are welcome.",attendees:10},
  {id:"e4",title:"Friendly morning walk",category:"Wellbeing",date:nextDate(2),place:"Clock tower square",description:"Meet neighbors, take a gentle walk, and start the day together.",attendees:15}
];
function nextDate(days){const d=new Date();d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key));return v??fallback}catch{return fallback}};
const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
let groups=read("fmc-connect-groups",seedGroups);
let events=read("fmc-connect-events",seedEvents);
let joined=new Set(read("fmc-connect-joined",[]));
let attending=new Set(read("fmc-connect-attending",[]));
let activeCategory="All";
const $=id=>document.getElementById(id);
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function dateParts(date){const d=new Date(date+"T12:00:00");return {day:d.getDate(),month:d.toLocaleDateString("en",{month:"short"})}}
function renderGroups(){
 const q=$("groupSearch").value.trim().toLowerCase();
 const list=groups.filter(g=>(activeCategory==="All"||g.category===activeCategory)&&`${g.name} ${g.category} ${g.description}`.toLowerCase().includes(q));
 $("groupGrid").innerHTML=list.map(g=>`<article class="group-card"><div class="group-top"><span class="group-emoji">${g.emoji}</span><span class="group-category">${escapeHtml(g.category)}</span></div><h3>${escapeHtml(g.name)}</h3><p>${escapeHtml(g.description)}</p><div class="group-meta"><span>👥 ${g.members+(joined.has(g.id)?1:0)} members</span><button class="join-btn ${joined.has(g.id)?"joined":""}" data-join="${escapeHtml(g.id)}">${joined.has(g.id)?"✓ Joined":"Join group +"}</button></div></article>`).join("");
 $("noGroups").hidden=list.length>0;
 $("groupCount").textContent=groups.length;
 $("joinedCount").textContent=128+joined.size;
 $("memberCount").textContent=(240+joined.size)+"+";
 $("joinedGrid").innerHTML=groups.filter(g=>joined.has(g.id)).map(g=>`<article class="joined-item"><span class="group-emoji">${g.emoji}</span><div><b>${escapeHtml(g.name)}</b><span>${escapeHtml(g.category)} · ${g.members+1} members</span></div></article>`).join("");
 $("noJoined").hidden=joined.size>0;
}
function renderEvents(){
 $("eventGrid").innerHTML=events.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(e=>{const d=dateParts(e.date);return `<article class="event-card"><div class="date-block"><b>${d.day}</b><span>${d.month}</span></div><div><h3>${escapeHtml(e.title)}</h3><p>${escapeHtml(e.description)}</p><div class="event-meta"><span>📍 ${escapeHtml(e.place)}</span><span>✦ ${escapeHtml(e.category)}</span></div><div class="event-footer"><span>👥 ${e.attendees+(attending.has(e.id)?1:0)} interested</span><button class="small-btn" data-attend="${escapeHtml(e.id)}">${attending.has(e.id)?"You're going ✓":"I'm interested"}</button></div></div></article>`}).join("");
 $("eventCount").textContent=events.length;
}
$("categoryChips").addEventListener("click",e=>{const btn=e.target.closest("[data-category]");if(!btn)return;activeCategory=btn.dataset.category;document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c===btn));renderGroups()});
$("groupSearch").addEventListener("input",renderGroups);
$("groupGrid").addEventListener("click",e=>{const btn=e.target.closest("[data-join]");if(!btn)return;const id=btn.dataset.join;if(joined.has(id))joined.delete(id);else joined.add(id);save("fmc-connect-joined",[...joined]);renderGroups()});
$("eventGrid").addEventListener("click",e=>{const btn=e.target.closest("[data-attend]");if(!btn)return;const id=btn.dataset.attend;if(attending.has(id))attending.delete(id);else attending.add(id);save("fmc-connect-attending",[...attending]);renderEvents()});
$("eventForm").addEventListener("submit",e=>{e.preventDefault();const form=new FormData(e.currentTarget);const event={id:"custom-"+Date.now(),title:form.get("title").trim(),category:form.get("category"),date:form.get("date"),place:form.get("place").trim(),description:form.get("description").trim(),attendees:1};events.push(event);save("fmc-connect-events",events);e.currentTarget.reset();$("formMessage").textContent="Meetup added! It now appears in the meetup list on this browser.";renderEvents();$("events").scrollIntoView({behavior:"smooth",block:"start"})});
const today=new Date();$("eventDate").min=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
renderGroups();renderEvents();
