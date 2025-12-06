let packages = JSON.parse(localStorage.getItem('packages') || '[]');

function savePackages(){ localStorage.setItem('packages', JSON.stringify(packages)); }

function updateAdmin(){
    const tbody=document.getElementById('admin-list');
    tbody.innerHTML='';
    packages.forEach(p=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${p.packageNumber}</td><td>${p.trackingNumber}</td>
        <td>${p.customerName}</td><td>${p.shelf}</td><td>${p.status}</td>
        <td>${p.priority}</td><td>${p.location}</td>`;
        tbody.appendChild(tr);
    });
}

document.getElementById('remove-btn').addEventListener('click', ()=>{
    const val=document.getElementById('remove-input').value.trim();
    packages=packages.filter(p=>p.trackingNumber!==val);
    savePackages();
    updateAdmin();
});

document.getElementById('clear-btn').addEventListener('click', ()=>{
    if(confirm('Are you sure you want to remove all packages?')){
        packages=[];
        savePackages();
        updateAdmin();
    }
});

updateAdmin();
