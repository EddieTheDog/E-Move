const shelves=['O1','O2','O3'];

function renderWarehouse(){
  const packages=JSON.parse(localStorage.getItem('packages')||'[]');
  const shelfGrid=document.getElementById('shelf-grid');
  const taskList=document.getElementById('taskList');
  shelfGrid.innerHTML='';
  taskList.innerHTML='';

  shelves.forEach(shelf=>{
    const shelfDiv=document.createElement('div');
    shelfDiv.className='shelf-card';
    shelfDiv.innerHTML=`<h3>${shelf}</h3>`;
    const shelfPackages=packages.filter(p=>p.shelf===shelf && p.status!=='Delivered' && p.status!=='With Delivery Driver');

    shelfPackages.forEach(p=>{
      const card=document.createElement('div');
      card.className='package-card';
      if(p.priority==='high') card.classList.add('package-priority');
      if(p.flagged) card.classList.add('package-flagged');
      card.textContent=`${p.packageNumber} - ${p.status}`;
      shelfDiv.appendChild(card);

      // Add tasks for packages needing attention
      if(p.status==='Pending Confirmation' || p.status==='Check Location'){
        const task=document.createElement('div');
        task.className='task-card';
        if(p.priority==='high') task.classList.add('priority');
        task.innerHTML=`<span>${p.packageNumber} - ${p.status}</span><span class="notification"></span>`;
        taskList.appendChild(task);
      }
    });

    shelfGrid.appendChild(shelfDiv);
  });
}

// Auto-refresh every 5 seconds
setInterval(renderWarehouse,5000);
renderWarehouse();
