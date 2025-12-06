let currentTask=null;
let newTaskFlags={};

function showTab(tab){
  document.getElementById('shelvesTab').style.display = tab==='shelves'?'block':'none';
  document.getElementById('tasksTab').style.display = tab==='tasks'?'block':'none';
}

if(!localStorage.getItem('packages')){
  localStorage.setItem('packages',JSON.stringify([]));
}

function renderShelves(){
  const packages = JSON.parse(localStorage.getItem('packages')||'[]');
  const shelfGrid = document.getElementById('shelf-grid');
  shelfGrid.innerHTML='';
  const shelves = ['O1','O2','O3','Delivery Bay'];

  shelves.forEach(s=>{
    const shelfCard=document.createElement('div');
    shelfCard.className='shelf-card';
    shelfCard.innerHTML=`<h3>${s}</h3>`;
    const items=packages.filter(p=>p.shelf===s);
    if(items.length===0) shelfCard.innerHTML+="<p>Empty</p>";
    items.forEach(p=>{
      const div=document.createElement('div');
      div.className='package-card';
      if(p.priority==='high') div.classList.add('package-priority');
      if(p.flagged) div.classList.add('package-flagged');
      div.innerText=`${p.packageNumber} - ${p.status}`;
      shelfCard.appendChild(div);
    });
    shelfGrid.appendChild(shelfCard);
  });
}

function renderTasks(){
  const packages = JSON.parse(localStorage.getItem('packages')||'[]');
  const taskList=document.getElementById('task-list');
  taskList.innerHTML='';
  let tasks=[];

  packages.forEach(p=>{
    if(p.status==='Pending Confirmation'){
      tasks.push({type:'confirm',package:p,priority:true,description:`Confirm ${p.packageNumber}`});
    }
    if(p.status==='Stored' && Math.random()<0.1){
      tasks.push({type:'check',package:p,priority:false,description:`Check ${p.packageNumber} at ${p.shelf}`});
    }
    if(p.status==='Stored'){
      tasks.push({type:'delivery',package:p,priority:true,description:`Move ${p.packageNumber} to Delivery Bay`});
    }
  });

  tasks.sort((a,b)=>b.priority-a.priority);

  tasks.forEach(t=>{
    const div=document.createElement('div');
    div.className='task-card';
    if(t.priority) div.classList.add('priority');
    div.innerHTML=`<span>${t.description}</span>${!newTaskFlags[t.package.packageNumber]?'<span class="notification"></span>':''}`;
    div.onclick=()=>openTaskModal(t);
    taskList.appendChild(div);
    newTaskFlags[t.package.packageNumber]=true;
  });
}

function openTaskModal(task){
  currentTask=task;
  document.getElementById('taskModal').style.display='flex';
  document.getElementById('modal-title').innerText=task.package.packageNumber;
  document.getElementById('modal-description').innerText=task.description;
  document.getElementById('modal-scan').value='';
  document.getElementById('reviewCheckbox').checked=false;
  document.getElementById('damageCheckbox').checked=false;
  document.getElementById('atBayCheckbox').checked=false;
}

function closeModal(){
  document.getElementById('taskModal').style.display='none';
  currentTask=null;
}

function completeModalTask(){
  if(!currentTask) return alert('No task open');
  const scan=document.getElementById('modal-scan').value.trim();
  const pkg=currentTask.package;
  if(scan!==pkg.packageNumber) return alert('Barcode mismatch!');
  if(!document.getElementById('reviewCheckbox').checked || !document.getElementById('atBayCheckbox').checked){
    return alert('Complete all steps');
  }
  pkg.shelf='Delivery Bay';
  pkg.status='Delivery';

  let packages=JSON.parse(localStorage.getItem('packages')||'[]');
  const index=packages.findIndex(p=>p.packageNumber===pkg.packageNumber);
  packages[index]=pkg;
  localStorage.setItem('packages',JSON.stringify(packages));

  closeModal();
  renderShelves();
  renderTasks();
}

renderShelves();
renderTasks();
setInterval(()=>{
  renderShelves();
  renderTasks();
},5000);
