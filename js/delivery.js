function loadDelivery(){
  const packages=JSON.parse(localStorage.getItem('packages')||'[]');
  const deliveryDiv=document.getElementById('delivery-list');
  deliveryDiv.innerHTML='';
  packages.filter(p=>p.shelf==='Delivery Bay').forEach(p=>{
    const pkg=document.createElement('div');
    pkg.className='package-card';
    pkg.textContent=p.packageNumber+' ('+p.status+')';
    const btnScan=document.createElement('button');
    btnScan.textContent='Scan & Start Delivery';
    btnScan.onclick=()=>startDelivery(p.packageNumber);
    deliveryDiv.appendChild(pkg);
    deliveryDiv.appendChild(btnScan);
  });
}

function startDelivery(packageNumber){
  let packages=JSON.parse(localStorage.getItem('packages')||'[]');
  const pkg=packages.find(p=>p.packageNumber===packageNumber);
  if(!pkg) return alert('Package not found');
  if(pkg.shelf!=='Delivery Bay') return alert('Package not in Delivery Bay');

  if(confirm('Confirm you have scanned the package?')){
    pkg.status='With Delivery Driver';
    localStorage.setItem('packages',JSON.stringify(packages));
    alert(`Deliver to Room: ${pkg.room}`);
    loadDelivery();
  }
}

// auto-refresh
loadDelivery();
setInterval(loadDelivery,2000);
