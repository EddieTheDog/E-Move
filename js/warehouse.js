// Current task being handled in modal
let currentTask = null;

// Tab switching
function showTab(tab){
  document.getElementById('shelvesTab').style.display = tab==='shelves'?'block':'none';
  document.getElementById('tasksTab').style.display = tab==='tasks'?'block':'none';
  document.getElementById('deliveryTab').style.display = tab==='delivery'?'block':'none';
}

// Render shelf overview with cards
function renderShelves(){
  const packages = JSON.parse(localStorage.getItem('packages')||'[]');
  const shelfGrid = document.getElementById('shelf-grid');
  shelfGrid.innerHTML='';
  const shelves = ['O1','O2','O3','O4','O5'];

  shelves.forEach(s=>{
    const shelfCard = document.createElement('div');
    shelfCard.className = 'shelf-card';
    shelfCard.innerHTML = `<h3>${s}</h3>`;
    const items = packages.filter(p=>p.shelf===s);
    if(items.length===0){ shelfCard.innerHTML += "<p>Empty</p>"; }
    items.forEach(p=>{
      const packageDiv = document.createElement('div');
      packageDiv.className = 'package-card';
      if(p.priority==='high') packageDiv.classList.add('package-priority');
      if(p.flagged) packageDiv.classList.add('package-flagged');
      packageDiv.innerHTML = `${p.packageNumber} - ${p.status}`;
      shelfCard.appendChild(packageDiv);
    });
    shelfGrid.appendChild(shelfCard);
  });
}

// Render tasks list with priority sorting
function renderTasks(){
  const packages = JSON.parse(localStorage.getItem('packages')||'[]');
  const taskList = document.getElementById('task-list');
  taskList.innerHTML='';

  let tasks = [];

  // Pending confirmation
  packages.filter(p=>p.status==='Pending Confirmation').forEach(p=>{
    tasks.push({
      type:'confirm',
      package:p,
      priority:true,
      description:`Confirm tracking number for ${p.packageNumber}`
    });
  });

  // Check/relocate tasks
  packages.filter(p=>p.status==='Stored').forEach(p=>{
    if(Math.random()<0.1){
      tasks.push({
        type:'check',
        package:p,
        priority:false,
        description:`Check/Relocate package ${p.packageNumber} at shelf ${p.shelf}`
      });
    }
  });

  // Move to delivery bay (priority)
  packages.filter(p=>p.status==='Stored').forEach(p=>{
    if(Math.random()<0.1){
      tasks.push({
        type:'delivery',
        package:p,
        priority:true,
        description:`Move package ${p.packageNumber} to Delivery Bay`
      });
    }
  });

  // Sort priority first
  tasks.sort((a,b)=>b.priority-a.priority);

  tasks.forEach(t=>{
    const div = document.createElement('div');
    div.className = 'task-card';
    if(t.priority) div.classList.add('priority');
    div.innerHTML = t.description;
    div.onclick = ()=>openTaskModal(t);
    taskList.appendChild(div);
  });
}

// Open task modal
function openTaskModal(task){
  currentTask = task;
  document.getElementById('taskModal').style.display='flex';
  document.getElementById('modal-title').innerText = task.package.packageNumber;
  document.getElementById('modal-description').innerText = task.description;
  document.getElementById('modal-scan').value='';
}

// Close modal
function closeModal(){
  document.getElementById('taskModal').style.display='none';
  currentTask = null;
}

// Complete task from modal
function completeModalTask(){
  const scan = document.getElementById('modal-scan').value.trim();
  if(!currentTask) return alert('No task open');
  const pkg = currentTask.package;
  if(scan !== pkg.packageNumber) return alert('Barcode mismatch!');
  
  // Update status based on task type
  if(currentTask.type==='confirm') pkg.status='Stored';
  if(currentTask.type==='check') pkg.status='Checked';
  if(currentTask.type==='delivery') pkg.status='Delivery';
  
  let packages = JSON.parse(localStorage.getItem('packages')||'[]');
  const index = packages.findIndex(p=>p.packageNumber===pkg.packageNumber);
  packages[index] = pkg;
  localStorage.setItem('packages', JSON.stringify(packages));
  
  closeModal();
  renderTasks();
  renderShelves();
  renderDeliveryBay();
}

// Render delivery bay
function renderDeliveryBay(){
  const packages = JSON.parse(localStorage.getItem('packages')||'[]');
  const deliveryList = document.getElementById('delivery-list');
  deliveryList.innerHTML='';
  const deliveryPackages = packages.filter(p=>p.status==='Delivery');
  if(deliveryPackages.length===0){ deliveryList.innerHTML="<p>No packages in delivery bay</p>"; }
  deliveryPackages.forEach(p=>{
    const div = document.createElement('div');
    div.className='package-card';
    div.innerHTML = `${p.packageNumber} → ${p.location} <br>Status: ${p.status}`;
    div.onclick = ()=>{
      openTaskModal({type:'out',package:p,priority:true, description:`Deliver package ${p.packageNumber} to ${p.location}`});
    }
    deliveryList.appendChild(div);
  });
}

// Initial render
renderShelves();
renderTasks();
renderDeliveryBay();

// Auto-refresh every 5s for live updates
setInterval(()=>{
  renderShelves();
  renderTasks();
  renderDeliveryBay();
},5000);
