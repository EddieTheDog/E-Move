const urlParams=new URLSearchParams(window.location.search);
const tracking=urlParams.get('tracking')||'';

document.getElementById('tracking-number').innerText=tracking;

function updateStatus(){
const packages=JSON.parse(localStorage.getItem('packages')||'[]');
const pkg=packages.find(p=>p.trackingNumber===tracking);
if(pkg){
let statusText=pkg.status;
let eta=5;if(pkg.floor==='upstairs')eta+=10;if(pkg.priority==='high')eta-=2;
document.getElementById('eta').innerText=eta;

const statusEl=document.getElementById('status');
statusEl.innerText=statusText;
statusEl.className='';
switch(statusText){
case 'Pending Confirmation': statusEl.classList.add('status-pending'); break;
case 'Stored': statusEl.classList.add('status-stored'); break;
case 'With Delivery Driver': statusEl.classList.add('status-delivery'); break;
case 'Delivered': statusEl.classList.add('status-delivered'); break;
default: statusEl.classList.add('status-flagged'); break;
}
document.getElementById('message').innerText='Thank you for choosing E-Move!';
}else{
document.getElementById('status').innerText='Not found';
document.getElementById('eta').innerText='-';
document.getElementById('message').innerText='';
}
}

updateStatus();
setInterval(updateStatus,2000);
