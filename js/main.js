// Get role from URL
const urlParams = new URLSearchParams(window.location.search);
const role = urlParams.get('role') || 'unknown';
document.getElementById('role-display').innerText = `Role: ${role}`;

// Load packages from localStorage
let packages = JSON.parse(localStorage.getItem('packages') || '[]');

// Update recent scans list
function updateScanList() {
    const list = document.getElementById('scan-list');
    list.innerHTML = '';
    packages.slice(-10).reverse().forEach(pkg => {
        const li = document.createElement('li');
        li.textContent = `${pkg.packageNumber} | ${pkg.trackingNumber} | Shelf: ${pkg.shelf} | Status: ${pkg.status}`;
        list.appendChild(li);
    });
}

// Generate unique package number
function generatePackageNumber() {
    return 'PKG-' + String(packages.length + 1).padStart(3, '0');
}

// Generate tracking number
function generateTrackingNumber() {
    const random = Math.floor(Math.random() * 9000) + 1000;
    return 'TRK-EM' + random;
}

// Assign shelf automatically (O1-O5)
function assignShelf() {
    const shelves = ['O1','O2','O3','O4','O5'];
    const counts = shelves.map(shelf => packages.filter(p => p.shelf === shelf).length);
    let minIndex = counts.indexOf(Math.min(...counts));
    return shelves[minIndex];
}

// Handle form submission
document.getElementById('intake-form').addEventListener('submit', function(e){
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
        status: 'Stored',
        timestamp: new Date().toISOString()
    };

    packages.push(pkg);
    localStorage.setItem('packages', JSON.stringify(packages));

    // Update display
    document.getElementById('package-number').innerText = packageNumber;
    document.getElementById('tracking-number').innerText = trackingNumber;
    document.getElementById('shelf').innerText = shelf;

    document.getElementById("package-info").style.display = "block";

    // Generate barcode
    JsBarcode("#barcode", trackingNumber, {format:"CODE128", width:2, height:40});
    // Generate QR code
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), trackingNumber);

    updateScanList();
    form.reset();
});

// Initial update
updateScanList();
