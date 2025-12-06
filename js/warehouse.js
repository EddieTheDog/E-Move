// Tab control
function showTab(tab){
  document.getElementById('shelvesTab').style.display = tab==='shelves'?'block':'none';
  document.getElementById('tasksTab').style.display = tab==='tasks'?'block':'none';
}

// Render shelf overview
function renderShelves(){
  const packages = JSON.parse(localStorage.getItem('packages')||'[]');
  const shelfGrid = document.getElementById('shelf-grid');
  shelfGrid.innerHTML='';
  const shelves = ['O1','O2','O3','O4','O5'];
  
  shelves.forEach(s=>{
    const shelfDiv = document.createElement('div');
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

// Generate tasks
function renderTasks(){
  const packages = JSON.parse(localStorage.getItem('packages')||'[]');
  const taskList = document.getElementById('task-list');
  taskList.innerHTML='';
  
  // Add pending confirmation tasks
  packages.filter(p=>p.status==='Pending Confirmation').forEach(p=>{
    taskList.innerHTML += `<div style="border:1px solid #ccc; padding:5px; margin:3px;">
      Confirm tracking number for ${p.packageNumber} 
      <input type="text" placeholder="Scan tracking number" id="scan-${p.packageNumber}">
      <button onclick="completeTask('${p.packageNumber}')">Confirm</button>
    </div>`;
  });

  // Add relocation/check tasks randomly (simulate)
  packages.filter(p=>p.status==='Stored').forEach(p=>{
    // Randomly some items need check
    if(Math.random()<0.1){
      taskList.innerHTML += `<div style="border:1px solid orange; padding:5px; margin:3px;">
        Check package ${p.packageNumber} at shelf ${p.shelf} 
        <input type="text" placeholder="Scan barcode" id="scan-${p.packageNumber}">
        <button onclick="completeTask('${p.packageNumber}')">Complete</button>
      </div>`;
    }
  });

  // Add move to delivery bay tasks
  packages.filter(p=>p.status==='Stored').forEach(p=>{
    if(Math.random()<0.1){
      taskList.innerHTML += `<div style="border:1px solid green; padding:5px; margin:3px;">
        Move package ${p.packageNumber} to Delivery Bay 
        <input type="text" placeholder="Scan barcode" id="scan-${p.packageNumber}">
        <button onclick="completeTask('${p.packageNumber}','delivery')">Move</button>
      </div>`;
    }
  });
}

// Complete task
function completeTask(packageNumber, newStatus){
  const input = document.getElementById(`scan-${packageNumber}`).value.trim();
  let packages = JSON.parse(localStorage.getItem('packages')||'[]');
  let pkg = packages.find(p=>p.packageNumber===packageNumber);
  if(!pkg){ alert('Package not found'); return; }
  if(input!==pkg.packageNumber){ alert('Barcode mismatch'); return; }
  pkg.status = newStatus || 'Checked';
  localStorage.setItem('packages', JSON.stringify(packages));
  renderTasks();
  renderShelves();
}

// Initial render
renderShelves();
renderTasks();

// Update every 5 seconds to simulate tasks appearing
setInterval(()=>{
  renderShelves();
  renderTasks();
},5000);
