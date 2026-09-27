const $=id=>document.getElementById(id);
function parseReport(text){const lines=Object.fromEntries(text.split(/\r?\n/).map(line=>{const match=line.match(/^([^:]+):\s*(.*)$/);return match?[match[1].trim(),match[2].trim()]:['','']}));
if(!text.startsWith("OMEN | TODAY'S FINISHED FRAMES: EXACT RESULT"))throw Error('Not an OMEN settled-results report.');
const count=name=>{const value=lines[name];if(!/^\d+$/.test(value||''))throw Error('Missing or invalid '+name);return Number(value)};
const finished=count('Finished frames'),wins=count('Exact correct'),losses=count('Exact incorrect'),missing=count('No exact result');
if(!Number.isSafeInteger(finished)||![wins,losses,missing].every(Number.isSafeInteger)||finished!==wins+losses+missing)throw Error('Report counts do not match.');
const match=text.match(/^Local date:\s*(\d{4}-\d{2}-\d{2})\s*\|\s*Updated:\s*(.+)$/m);if(!match)throw Error('Missing date and update time.');
return {finished,wins,losses,missing,date:match[1],updated:match[2],accuracy:wins+losses?(100*wins/(wins+losses)).toFixed(2)+'%':'N/A (no scored frames)'};}
$('report').addEventListener('change',async event=>{const file=event.target.files?.[0];$('results').hidden=true;if(!file)return;try{if(file.size>20000)throw Error('Report file is unexpectedly large.');const d=parseReport(await file.text());$('date').textContent='PC local date: '+d.date;$('accuracy').textContent=d.accuracy;$('ratio').textContent=d.wins+' / '+(d.wins+d.losses);$('losses').textContent=d.losses;$('finished').textContent=d.finished;$('noresult').textContent=d.missing;$('updated').textContent='Report updated: '+d.updated;$('results').hidden=false;$('status').textContent='Report opened locally in this browser. Nothing was uploaded.';}catch(e){$('status').textContent=e.message;}});
