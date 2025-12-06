function renderDelivery(){
  const packages=JSON.parse(localStorage.getItem('packages')||'[]');
  const deliveryList=document.getElementById('deliveryList');
  deliveryList.innerHTML='';

  const readyPackages=packages.filter(p=>p.status==='With Delivery Driver');

  readyPackages.forEach(p=>{
    const card=document.createElement('div');
    card.className='task-card';
    card.innerHTML=`<span>${p.packageNumber} - ${p.room}</span>
    <button onclick="deliverPackage('${p.packageNumber}')">Deliver</button>`;
    deliveryList.appendChild(card);
  });
}

function deliverPackage(pkgNum){
  let packages=JSON.parse(localStorage.getItem('packages')||'[]');
  const pkg=packages.find(p=>p.packageNumber===pkgNum);
  if(!pkg || pkg.status!=='With Delivery Driver') return alert('Package not ready!');
  pkg.status='Delivered';
  localStorage.setItem('packages',JSON.stringify(packages));
  renderDelivery();
  alert(`Package ${pkgNum} marked as Delivered!`);
}

setInterval(renderDelivery,3000);
renderDelivery();
