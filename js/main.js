// Role detection
const urlParams = new URLSearchParams(window.location.search);
const role = urlParams.get('role') || 'unknown';
document.getElementById('role-display').innerText = `Role: ${role}`;

// Load packages from localStorage
let packages = JSON.parse(localStorage.getItem('packages') || '[]');

// Show relevant section
document.getElementById('frontdesk-section').style.display = role==='frontdesk'?'block':'none';
document.getElementById('warehouse-section').style.display = role==='warehouse'?'block':'none';
document.getElementById('admin-section').style.display = role==='admin'?'block':'none';

// Helper functions
function updateWarehouseList(){
    const list = document.getElementById('warehouse-list');
    if(!list) return;
    list.innerHTML = '';
    packages.filter(p => p.status==='Stored').forEach(p=>{
        const li = document.createElement('li');
        li.textContent = `${p.packageNumber} | ${p.trackingNumber} | Shelf: ${p.shelf}`;
        list.appendChild(li);
    });
}

function updateAdminList(){
    const list = document.getElementById('admin-list');
    if(!list) return;
    list.innerHTML = '';
    packages.forEach(p=>{
        const li = document.createElement('li');
        li.textContent = `${p.packageNumber} | ${p.trackingNumber} | Shelf: ${p.shelf} | Status: ${p.status} | ${p.customerName}`;
        list.appendChild(li);
    });
}

function generatePackageNumber(){
    return 'PKG-' + String(packages.length + 1).padStart(3,'0');
}

function generateTrackingNumber(){
    const random = Math.floor(Math.random()*9000)+1000;
    return 'TRK-EM' + random;
}

function assignShelf(){
    const shelves = ['O1','O2','O3','O4','O5'];
    const counts = shelves.map(shelf => packages.filter(p=>p.shelf===shelf).length);
    let minIndex = counts.indexOf(Math.min(...counts));
    return shelves[minIndex];
}

// Front Desk: Intake Form
const intakeForm = document.getElementById('intake-form');
if(intakeForm){
    intakeForm.addEventListener('submit', e=>{
        e.preventDefault();
        const form = e.target;

        const customerName = form.customerName.value;
        const contact = form.contact.value;
        const recipient = form.recipient.value;
        const room = form.room.value;
        const priority = form.priority.value;
        const restrictedItems = [];
        if(form.money.checked) restrictedItems.push('money');
        if(form.animals.checked) restrictedItems.push('animals');

        const packageNumber = generatePackageNumber();
        const trackingNumber = generateTrackingNumber();
        const shelf = assignShelf();

        const pkg = {
            packageNumber,
            trackingNumber,
            customerName,
            contact,
            recipient,
            room,
            priority,
            restrictedItems,
            shelf,
            status: 'Pending Confirmation',
            timestamp: new Date().toISOString()
        };

        packages.push(pkg);
        localStorage.setItem('packages', JSON.stringify(packages));

        // Show package info
        document.getElementById('package-number').innerText = packageNumber;
        document.getElementById('tracking-number').innerText = trackingNumber;
        document.getElementById('shelf').innerText = shelf;

        document.getElementById('package-info').style.display = 'block';

        JsBarcode("#barcode", trackingNumber, {format:"CODE128", width:2, height:40});
        document.getElementById("qrcode").innerHTML="";
        new QRCode(document.getElementById("qrcode"), trackingNumber);
    });
}

// Front Desk: Confirm scanned / typed tracking number
const confirmBtn = document.getElementById('confirm-btn');
if(confirmBtn){
    confirmBtn.addEventListener('click', ()=>{
        const input = document.getElementById('confirm-tracking').value.trim();
        const pkg = packages.find(p=>p.trackingNumber===input);
        if(pkg){
            pkg.status = 'Stored';
            localStorage.setItem('packages', JSON.stringify(packages));
            alert(`Package ${pkg.packageNumber} confirmed and stored in ${pkg.shelf}`);
            updateWarehouseList();
            updateAdminList();
        } else {
            alert('Tracking number not recognized!');
        }
    });
}

// Initial updates
updateWarehouseList();
updateAdminList();
