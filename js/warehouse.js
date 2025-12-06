let packages=JSON.parse(localStorage.getItem('packages')||'[]');

function savePackages(){localStorage.setItem('packages',JSON.stringify(packages));}

function updateWarehouse(){
const tbody=document.getElementById('warehouse-list');
tbody.innerHTML='';

packages.forEach(p=>{
let tr=document.createElement('tr');
tr.innerHTML=`<td>${p.packageNumber}</td><td>${p.trackingNumber}</td>
<td>${p.customerName}</td><td>${p.shelf}</td><td>${p.status}</td><td>${p.priority}</td><td>${p.location}</td>`;
tbody.appendChild(tr);
});

const shelfGrid=document.getElementById('shelf-grid');
shelfGrid.innerHTML='';
['O1','O2','O3','O4','O5'].forEach(s=>{
let div=document.createElement('div');
div.innerHTML=`<strong>${s}</strong><br>`;
let items=packages.filter(p=>p.shelf===s);
items.forEach(item=>{
let span=document.createElement('span');
span.innerText=`${item.packageNumber} (${item.status}) `;
span.style.color=item.status==='Pending Confirmation'||item.status==='Stored'?'red':item.status==='With Delivery Driver'?'orange':'green';
span.style.marginRight='10px';
div.appendChild(span);
});
if(items.length===0) div.innerHTML+='<em>Empty</em>';
div.style.border='1px solid #ccc';
div.style.padding='10px';
div.style.marginBottom='10px';
div.style.borderRadius='4px';
shelfGrid.appendChild(div);
});

// Delivery bay
const deliveryBay=document.getElementById('delivery-bay');
deliveryBay.innerHTML='<h3>Packages Ready for Delivery</h3>';
packages.filter(p=>p.status==='Stored').forEach(p=>{
let pEl=document.createElement('div');
pEl.innerText=`${p.packageNumber} → ${p.location} [${p.priority}]`;
pEl.style.padding='5px';
pEl.style.border='1px solid #0077cc';
pEl.style.borderRadius='4px';
pEl.style.marginBottom='5px';
deliveryBay.appendChild(pEl);
});

// Random audit task every 10s
if(Math.random()<0.1 && packages.length>0){
let auditPkg=packages[Math.floor(Math.random()*packages.length)];
auditPkg.status='Pending Confirmation';
savePackages();
}
}

setInterval(updateWarehouse,2000);

function deleteAllData(){
if(confirm('Are you sure? This will delete all packages.')){
packages=[];
savePackages();
updateWarehouse();
}
}
