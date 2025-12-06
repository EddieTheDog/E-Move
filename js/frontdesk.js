// Load packages
let packages = JSON.parse(localStorage.getItem('packages') || '[]');

function savePackages(){ localStorage.setItem('packages', JSON.stringify(packages)); }

function generatePackageNumber(){
    return 'PKG-' + String(packages.length + 1).padStart(3,'0');
}

function generateTrackingNumber(){
    const random = Math.floor(Math.random()*9000)+1000;
    return 'TRK-EM' + random;
}

function assignShelf(){
    const shelves = ['O1','O2','O3','O4','O5'];
    const counts = shelves.map(s => packages.filter(p => p.shelf===s).length);
    return shelves[counts.indexOf(Math.min(...counts))];
}

document.getElementById('intake-form').addEventListener('submit', e=>{
    e.preventDefault();
    const f = e.target;
    const customerName = f.customerName.value;
    const contact = f.contact.value;
    const recipient = f.recipient.value;
    const room = f.room.value;
    const priority = f.priority.value;
    const location = f.location.value;
    const restrictedItems = [];
    if(f.money.checked) restrictedItems.push('money');
    if(f.animals.checked) restrictedItems.push('animals');

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
        location,
        restrictedItems,
        shelf,
        status: 'Pending Confirmation',
        timestamp: new Date().toISOString()
    };
    packages.push(pkg);
    savePackages();

    // Show info
    document.getElementById('package-number').innerText = packageNumber;
    document.getElementById('tracking-number').innerText = trackingNumber;
    document.getElementById('shelf').innerText = shelf;

    // Delivery message
    let est = location==='upstairs'?15:5;
    document.getElementById('delivery-msg').innerText = 
        `Thank you for choosing E-Move. Estimated delivery time: ${est} minutes`;

    // Generate barcode
    JsBarcode("#barcode", trackingNumber, {format:"CODE128", width:2, height:40});

    // Generate QR code linking to customer page
    const qrUrl = `https://e-move-nsmd.onrender.com/customer.html?tracking=${trackingNumber}`;
    document.getElementById('qrcode').innerHTML="";
    new QRCode(document.getElementById('qrcode'), qrUrl);

    document.getElementById('package-info').style.display='block';
});

// Confirm scan/typed tracking number
document.getElementById('confirm-btn').addEventListener('click', ()=>{
    const input = document.getElementById('confirm-tracking').value.trim();
    const pkg = packages.find(p=>p.trackingNumber===input);
    if(pkg){
        pkg.status='Stored';
        savePackages();
        alert(`Package ${pkg.packageNumber} confirmed and stored in ${pkg.shelf}`);
    } else {
        alert('Tracking number not recognized!');
    }
});
