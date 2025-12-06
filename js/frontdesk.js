function createPackage() {
  let packages = JSON.parse(localStorage.getItem('packages') || '[]');

  const packageNumber = 'PKG' + (packages.length + 1).toString().padStart(4,'0');
  const trackingNumber = 'TRK-EM' + (packages.length + 1).toString().padStart(4,'0');

  const customerName = document.getElementById('customerName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const location = document.getElementById('location').value;
  const floor = document.getElementById('floor').value;
  const priority = document.getElementById('priority').value;
  const flagged = document.getElementById('money').checked ||
                  document.getElementById('animals').checked ||
                  document.getElementById('other').checked;

  const pkg = {
    packageNumber,
    trackingNumber,
    customerName,
    email,
    phone,
    location: floor + ' ' + location,
    floor,
    priority,
    flagged,
    status: 'Pending Confirmation',
    shelf: null,
    createdAt: Date.now()
  };

  packages.push(pkg);
  localStorage.setItem('packages', JSON.stringify(packages));

  // Generate Barcode and QR code
  showCodes(pkg);

  document.getElementById('package-info').innerHTML = `
    <p>Package #: ${packageNumber}</p>
    <p>Tracking #: ${trackingNumber}</p>
    <p>QR Code links to: <a href="tracking.html?tracking=${trackingNumber}" target="_blank">tracking page</a></p>
    ${flagged ? '<strong>Flagged for review!</strong>' : ''}
    <p>Scan tracking number to confirm before storing.</p>
  `;
}

function showCodes(pkg) {
  // Barcode (package number)
  const svg = document.createElement('svg');
  JsBarcode(svg, pkg.packageNumber, {format:"CODE128", displayValue:true, width:2, height:40});
  const barcodeDiv = document.getElementById('barcode');
  barcodeDiv.innerHTML=''; barcodeDiv.appendChild(svg);

  // QR Code (tracking page)
  const qrDiv = document.getElementById('qrcode');
  qrDiv.innerHTML='';
  QRCode.toCanvas(qrDiv, `tracking.html?tracking=${pkg.trackingNumber}`, function(err) {
    if(err) console.error(err);
  });
}

function confirmTracking() {
  const input = document.getElementById('trackingInput').value.trim();
  let packages = JSON.parse(localStorage.getItem('packages') || '[]');
  let pkg = packages.find(p => p.status === 'Pending Confirmation');

  if(!pkg) { alert('No package to confirm.'); return; }
  if(input !== pkg.trackingNumber) { alert('Tracking number does not match!'); return; }

  // Assign shelf
  const shelves = ['O1','O2','O3','O4','O5'];
  let shelfCounts = shelves.map(s => packages.filter(p => p.shelf===s).length);
  pkg.shelf = shelves[shelfCounts.indexOf(Math.min(...shelfCounts))];
  pkg.status = 'Stored';

  localStorage.setItem('packages', JSON.stringify(packages));
  alert(`Package confirmed! Stored in shelf ${pkg.shelf}.`);

  // Clear display/input
  document.getElementById('barcode').innerHTML='';
  document.getElementById('qrcode').innerHTML='';
  document.getElementById('package-info').innerHTML='';
  document.getElementById('trackingInput').value='';
  document.getElementById('customerName').value='';
  document.getElementById('email').value='';
  document.getElementById('phone').value='';
  document.getElementById('location').value='';
  document.getElementById('money').checked=false;
  document.getElementById('animals').checked=false;
  document.getElementById('other').checked=false;
}
