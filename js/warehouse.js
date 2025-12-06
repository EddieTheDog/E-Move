function loadWarehouse(){
  const packages=JSON.parse(localStorage.getItem('packages')||'[]');

  // Tasks: packages not confirmed yet or flagged
  const tasksDiv=document.getElementById('tasks-panel');
  tasksDiv.innerHTML='';
  packages.forEach(p=>{
    if(p.status==='Confirmed' && p.shelf!=='Delivered'){
      const task=document.createElement('div');
      task.className='task-card'+(p.priority==='high'?' priority':'');
      task.innerHTML=`<span>${p.packageNumber} - Shelf: ${p.shelf}</span>
      <button onclick="moveToDelivery('${p.packageNumber}')">Move to Delivery Bay</button>`;
      if(p.flagged) task.innerHTML+=`<span class="notification" title="Flagged Item"></span>`;
      tasksDiv.appendChild(task);
    }
  });

  // Shelves Overview
  const shelfDiv=document.getElementById('shelf-grid');
  shelfDiv.innerHTML='';
  const shelfNames=['O1','O2','O3'];
  shelfNames.forEach(shelf=>{
    const shelfCard=document.createElement('div');
    shelfCard.className='shelf-card';
    shelfCard.innerHTML=`<h3>${shelf}</h3>`;
    packages.filter(p=>p.shelf===shelf && p.status!=='Delivered').forEach(p=>{
      const pkg=document.createElement('div');
      pkg.className='package-card';
      if(p.priority==='high') pkg.classList.add('package-priority');
      if(p.flagged) pkg.classList.add('package-flagged');
      pkg.textContent=p.packageNumber+' ('+p.status+')';
      shelfCard.appendChild(pkg);
    });
    shelfDiv.appendChild(shelfCard);
  });
}

// Move package to delivery bay
function moveToDelivery(packageNumber){
  let packages=JSON.parse(localStorage.getItem('packages')||'[]');
  packages=packages.map(p=>{
    if(p.packageNumber===packageNumber){
      p.shelf='Delivery Bay';
      p.status='At Delivery Bay';
    }
    return p;
  });
  localStorage.setItem('packages',JSON.stringify(packages));
  loadWarehouse();
}

loadWarehouse();
setInterval(loadWarehouse,2000); // auto-refresh
