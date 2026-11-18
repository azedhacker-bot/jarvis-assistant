(()=>{
const $=id=>document.getElementById(id);let recognition=null,voiceOn=false,listening=false,wake='Hey Jarvis';
const chat=$('chat');
function message(text,who='JARVIS'){const el=document.createElement('div');el.className='message '+(who==='YOU'?'user':'bot');const b=document.createElement('b');b.textContent=who;const p=document.createElement('p');p.textContent=text;el.append(b,p);chat.append(el);chat.scrollTop=chat.scrollHeight;if(who==='JARVIS'&&voiceOn&&'speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.96;u.pitch=.9;speechSynthesis.speak(u)}}
function answer(raw){const s=raw.toLowerCase();let out;if(/\b(hello|hi|hey)\b/.test(s))out='Hello. JARVIS is online and ready.';else if(s.includes('time'))out='The current time is '+new Date().toLocaleTimeString()+'.';else if(s.includes('date'))out='Today is '+new Date().toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'})+'.';else if(s.includes('joke'))out='Why did the computer go to the doctor? It had a virus.';else if(s.includes('fact'))out='A day on Venus is longer than its year. Space is wonderfully strange.';else if(s.includes('help'))out='Try asking for the time, date, a joke or a fact. You can also add missions and save notes.';else if(s.includes('who are you'))out='I am JARVIS, your personal assistant prototype.';else out='Command received. My interface is active, but the full AI brain has not been connected yet.';message(out)}
function submit(text){if(!text.trim())return;message(text,'YOU');answer(text)}
$('chatForm').addEventListener('submit',e=>{e.preventDefault();const v=$('messageInput').value;$('messageInput').value='';submit(v)});
document.querySelectorAll('[data-command]').forEach(b=>b.addEventListener('click',()=>submit(b.dataset.command)));
$('saveWake').onclick=()=>{const v=$('wakePhrase').value.trim();if(!v){$('statusText').textContent='Please enter a wake phrase first.';return}wake=v;localStorage.setItem('jarvisWake',wake);$('statusText').textContent='Wake phrase saved: “'+wake+'”. Start voice listening to use it.'};
wake=localStorage.getItem('jarvisWake')||wake;$('wakePhrase').value=wake;
$('speakBtn').onclick=()=>{voiceOn=!voiceOn;$('speakBtn').textContent='♪ VOICE: '+(voiceOn?'ON':'OFF');if(!voiceOn&&'speechSynthesis'in window)speechSynthesis.cancel();else if(voiceOn)message('Voice responses enabled.')};
function stopListening(){if(recognition){recognition.stop();recognition=null}listening=false;$('listenBtn').textContent='◉ START VOICE';$('coreState').textContent='STANDBY';$('systemStatus').textContent='SYSTEM ONLINE';$('statusText').textContent='Voice listening stopped.'}
$('stopBtn').onclick=stopListening;
$('listenBtn').onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){message('Speech recognition is not available in this browser. Try an up-to-date Chrome browser.');return}if(listening){stopListening();return}recognition=new SR();recognition.lang='en-US';recognition.continuous=true;recognition.interimResults=false;recognition.onstart=()=>{listening=true;$('listenBtn').textContent='◉ LISTENING…';$('coreState').textContent='VOICE ACTIVE';$('systemStatus').textContent='LISTENING FOR WAKE PHRASE'};recognition.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){if(!e.results[i].isFinal)continue;const said=e.results[i][0].transcript.trim();if(said.toLowerCase().includes(wake.toLowerCase())){const command=said.replace(new RegExp(wake.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),'').trim();message('Wake phrase detected. I am listening, Sir.');if(command)submit(command);else $('statusText').textContent='Wake phrase detected. Now say your command.';}else if(said.length<100){$('statusText').textContent='Heard: “'+said+'” — say “'+wake+'” to activate.'}}};recognition.onerror=e=>{$('statusText').textContent='Voice recognition issue: '+e.error+'. Check microphone permission and connection.'};recognition.onend=()=>{recognition=null;listening=false;$('listenBtn').textContent='◉ START VOICE';$('coreState').textContent='STANDBY';$('systemStatus').textContent='SYSTEM ONLINE'};try{recognition.start()}catch(err){message('Could not start voice recognition. Please try again.')}};
$('taskForm').onsubmit=e=>{e.preventDefault();const v=$('taskInput').value.trim();if(!v)return;const li=document.createElement('li');const label=document.createElement('label');label.style.display='inline';const cb=document.createElement('input');cb.type='checkbox';cb.style.width='auto';cb.style.marginRight='8px';const span=document.createElement('span');span.textContent=v;cb.onchange=()=>{span.style.textDecoration=cb.checked?'line-through':'none';span.style.opacity=cb.checked?'.5':'1'};label.append(cb,span);li.append(label);$('tasks').append(li);$('taskInput').value=''};
$('saveNotes').onclick=()=>{localStorage.setItem('jarvisNotes',$('notes').value);$('noteStatus').textContent='Saved on this device.'};$('notes').value=localStorage.getItem('jarvisNotes')||'';

// Safe, user-initiated device features. No shell, remote control, or background file access.
const deviceStatus = $('deviceStatus');
$('pickFile').addEventListener('click', () => $('filePicker').click());
$('filePicker').addEventListener('change', async e => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  try {
    if (file.size > 1024 * 1024) throw new Error('Please choose a text file smaller than 1 MB.');
    const text = await file.text();
    message('Opened "' + file.name + '" in read-only preview:\\n\\n' + text.slice(0, 1800) + (text.length > 1800 ? '\\n…preview shortened.' : ''));
    deviceStatus.textContent = 'Read "' + file.name + '". The file was not changed or uploaded.';
  } catch (err) {
    deviceStatus.textContent = err.message || 'Could not read that file.';
  } finally {
    e.target.value = '';
  }
});
$('exportNotes').addEventListener('click', () => {
  try {
    const blob = new Blob([$('notes').value], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'jarvis-notes.txt';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    deviceStatus.textContent = 'Notes export requested. Check your Downloads folder.';
  } catch (err) { deviceStatus.textContent = 'Export failed. ' + err.message; }
});
$('copyNotes').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('notes').value);
    deviceStatus.textContent = 'Notes copied to clipboard.';
  } catch (err) { deviceStatus.textContent = 'Clipboard unavailable. Use Export Notes instead.'; }
});
$('notifyMe').addEventListener('click', async () => {
  if (!('Notification' in window)) { deviceStatus.textContent = 'This browser does not support notifications.'; return; }
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('J.A.R.V.I.S.', {body:'Notification test successful.'});
      deviceStatus.textContent = 'Notification permission granted.';
    } else deviceStatus.textContent = 'Notification permission not granted.';
  } catch (err) { deviceStatus.textContent = 'Notifications unavailable in this context.'; }
});

function tick(){$('clock').textContent=new Date().toLocaleTimeString();const c=20+Math.floor(Math.random()*24),r=35+Math.floor(Math.random()*20);$('cpu').textContent=c+'%';$('ram').textContent=r+'%';$('cpuBar').style.width=c+'%';$('ramBar').style.width=r+'%'}tick();setInterval(tick,3500);
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();