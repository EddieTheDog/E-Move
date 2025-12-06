let packages = JSON.parse(localStorage.getItem('packages') || '[]');
let currentPackage=null;

function scanPackage(){
const code=document.getElementById('scan-input').value.trim();
const pkg=packages.find(p=>p.barcode===code||p.packageNumber===code);
if(pkg && pkg.status==='Stored'){
currentPackage=pkg;
pkg.status='With Delivery Driver';
localStorage.setItem('packages',JSON.stringify(packages));
showActivePackage();
}else alert('Package not found or already in delivery.');
}

function showActivePackage(){
if(currentPackage){
const container=document.getElementById('active-package');
container.innerHTML=`<p>Package #: ${currentPackage.packageNumber}</p>
<p>Tracking #: ${currentPackage.trackingNumber}</p>
<p>Deliver to: ${currentPackage.location}</p>
<p>Priority: ${currentPackage.priority}</p>`;
document.getElementById('delivery-buttons').style.display='block';
}
}

function pickedUp(){alert('Package picked up confirmed.');}
function delivered(){alert('Package delivered confirmed.');}
function finishDelivery(){
currentPackage.status='Delivered';
packages=packages.map(p=>p.packageNumber===currentPackage.packageNumber?currentPackage:p);
localStorage.setItem('packages',JSON.stringify(packages));
alert('Delivery confirmed. Package is now Delivered.');
currentPackage=null;
document.getElementById('active-package').innerHTML='';
document.getElementById('delivery-buttons').style.display='none';
}
