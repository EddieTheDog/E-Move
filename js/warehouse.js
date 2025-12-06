let packages = JSON.parse(localStorage.getItem('packages') || '[]');

function savePackages(){ localStorage.setItem('packages', JSON.stringify(packages)); }

function updateWarehouse(){
    const tbody = document.getElementById('warehouse-list');
    tbody.innerHTML='';
    packages.forEach(p=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${p.packageNumber}</td><td>${p.trackingNumber}</td>
            <td>${p.customerName}</td><td>${p.shelf}</td><td>${p.status}</td>
            <td>${p.priority}</td><td>${p.location}</td>`;
        tbody.appendChild(tr);
    });

    const shelfGrid=document.getElementById('shelf-grid');
    shelfGrid.innerHTML='';
    const shelves=['O1','O2','O3','O4','O5'];
    shelves.forEach(s=>{
        const items=packages.filter(p=>p.shelf===s).map(p=>p.packageNumber).join(', ') || 'Empty';
        const div=document.createElement('div');
        div.innerHTML=`<strong>${s}:</strong> ${items}`;
        shelfGrid.appendChild(div);
    });
}

updateWarehouse();
