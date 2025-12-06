// Tab control
function showTab(tab){
  document.getElementById('shelvesTab').style.display = tab==='shelves'?'block':'none';
  document.getElementById('tasksTab').style.display = tab==='tasks'?'block':'none';
  document.getElementById('deliveryTab').style.display = tab==='delivery'?'block':'none';
}

// Render shelf overview
function renderShelves(){
  const packages = JSON.parse(localStorage.getItem('packages')||'[]');
  const shelfGrid = document.getElementById('shelf-grid');
  shelfGrid.innerHTML='';
  const shelves = ['O1','O2','O3','O4','O5'];

  shelves.forEach(s=>{
    const shelfDiv = document.createElement('div');
    shelfDiv.style.border="1px solid #ccc";
    shelfDiv.style.padding="5px";
    shelfDiv.style.margin="5px";
    shelfDiv.innerHTML = `<h3>${s}</h3>`;
    const items = packages.filter(p=>p.shelf===s);
    if(items.length===0){ shelfDiv.innerHTML += "<p>Empty</p>"; }
    items.forEach(p=>{
      shelfDiv.innerHTML += `<div style="padding:5px; border:1px solid #ccc; margin:3px; ${p.priority==='high'?'background-color:#ffcccc;':''}${p.flagged?'border:2px solid red;':''}">
        ${p.packageNumber} - ${p.status} ${p.flagged?'⚠':''}
      </div>`;
    });
    shelfGrid.appendChild(shelfDiv);
  });
}

// Render tasks
function renderTasks(){
  const packages = JSON.parse(localStorage.getItem('packages')||'[]');
  const taskList = document.getElementById('task-list');
  taskList.innerHTML='';

  // Pending confirmation tasks
  packages.filter(p=>p.status==='Pending Confirmation').forEach(p=>{
    taskList.innerHTML += `<div style="border:1px solid #ccc; padding:5px; margin:3px;">
      Confirm tracking number for ${p.packageNumber} 
      <input type="text" placeholder="Scan tracking number" id="scan-${p.packageNumber}">
      <button onclick="completeTask('${p.packageNumber}')">Confirm</button>
    </div>`;
  });

  // Random check/relocate tasks
  packages.filter(p=>p.status==='Stored').forEach(p=>{
    if(Math.random()<0.1){
      taskList.innerHTML += `<div style="border:1px solid orange; padding:5px; margin:3px;">
        Check/Relocate package ${p.packageNumber} at shelf ${p.shelf} 
        <input type="text" placeholder="Scan barcode" id="scan-${p.packageNumber}">
        <button onclick="completeTask('${p.packageNumber}')">Complete</button>
      </div>`;
    }
  });

  // Move to delivery bay
  packages.filter(p=>p.status==='Stored').forEach(p=>{
    if(Math.random()<0.1){
      taskList.innerHTML += `<div style="border:1px solid green; padding:5px; margin:3px;">
        Move package ${p.packageNumber} to Delivery Bay 
        <input type="text" placeholder="Scan barcode" id="scan-${p.packageNumber}">
        <button onclick="completeTask('${p.packageNumber}','Delivery')">Move</button>
      </div>`;
    }
  });
}

// Render delivery bay
function renderDeliveryBay(){
  const packages = JSON.parse(localStorage.getItem('packages')||'[]');
  const deliveryList = document.getElementById('delivery-list');
  deliveryList.innerHTML='';
  const deliveryPackages = packages.filter(p=>p.status==='Delivery');
  if(deliveryPackages.length===0){ deliveryList.innerHTML="<p>No packages in delivery bay</p>"; }
  deliveryPackages.forEach(p=>{
    deliveryList.innerHTML += `<div style="border:1px solid #00aa00; padding:5px; margin:3px;">
      ${p.packageNumber} - Ready for delivery to ${p.location} 
      <input type="text" placeholder="Scan barcode" id="scan-${p.packageNumber}">
      <button onclick="completeTask('${p.packageNumber}','Out for Delivery')">Pick Up</button>
    </div>`;
  });
}

// Complete task
function completeTask(packageNumber,newStatus){
  const input = document.getElementById(`scan-${packageNumber}`).value.trim();
  let packages = JSON.parse(localStorage.getItem('packages')||'[]');
  let pkg = packages.find(p=>p.packageNumber===packageNumber);
  if(!pkg){ alert('Package not found'); return; }
  if(input!==pkg.packageNumber){ alert('Barcode mismatch'); return; }
  pkg.status = newStatus || 'Checked';
  localStorage.setItem('packages', JSON.stringify(packages));
  renderTasks();
  renderShelves();
  renderDeliveryBay();
}

// Initial render
renderShelves();
renderTasks();
renderDeliveryBay();

// Auto update every 5 seconds
setInterval(()=>{
  renderShelves();
  renderTasks();
  renderDeliveryBay();
},5000);
