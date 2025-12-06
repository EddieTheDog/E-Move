function createPackage(){
  let packages = JSON.parse(localStorage.getItem('packages') || '[]');
  const packageNumber = 'PKG'+(packages.length+1).toString().padStart(4,'0');
  const trackingNumber = 'TRK-EM'+(packages.length+1).toString().padStart(4,'0');

  const customerName = document.getElementById('customerName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const location = document.getElementById('location').value;
  const floor = document.getElementById('floor').value;
  const priority = document.getElementById('priority').value;
  const flagged = (document.getElementById('money').checked || document.getElementById('animals').checked || document.getElementById('other').checked);

  // Do not assign shelf yet; assign after confirmation
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
    barcode: packageNumber,
    createdAt: Date.now()
  };

  packages.push(pkg);
  localStorage.setItem('packages', JSON.stringify(packages));

  // Display barcode and QR code
  showCodes(pkg);

  // Show confirmation button
  document.getElementById('confirm-btn').style.display='inline-block';

  // Show info
  document.getElementById('package-info').innerHTML=`
    <p>Package Created!</p>
    <p>Package #: ${packageNumber}</p>
    <p>Tracking #: ${trackingNumber}</p>
    ${flagged?'<strong>Flagged for review!</strong>':''}
  `;
}

// Generate barcode and QR code
function showCodes(pkg){
  // Barcode
  const svg = document.createElement('svg');
  JsBarcode(svg, pkg.packageNumber, {format:"CODE128", displayValue:true, width:2, height:40});
  const barcodeDiv = document.getElementById('barcode');
  barcodeDiv.innerHTML=''; barcodeDiv.appendChild(svg);

  // QR Code
  const qrDiv = document.getElementById('qrcode');
  qrDiv.innerHTML='';
  QRCode.toCanvas(qrDiv, `tracking.html?tracking=${pkg.trackingNumber}`, function (error) {
    if(error) console.error(error);
  });
}

// Confirm & assign shelf
function confirmPackage(){
  let packages = JSON.parse(localStorage.getItem('packages') || '[]');
  const pkg = packages.find(p => p.status === 'Pending Confirmation');

  // Assign shelf automatically
  const shelfList=['O1','O2','O3','O4','O5'];
  let shelfCounts = shelfList.map(s => packages.filter(p => p.shelf === s).length);
  let minIndex = shelfCounts.indexOf(Math.min(...shelfCounts));
  pkg.shelf = shelfList[minIndex];
  pkg.status = 'Stored';

  localStorage.setItem('packages', JSON.stringify(packages));
  alert(`Package confirmed and stored in shelf ${pkg.shelf}.`);
  
  // Hide confirm button
  document.getElementById('confirm-btn').style.display='none';

  // Clear inputs
  document.getElementById('customerName').value='';
  document.getElementById('email').value='';
  document.getElementById('phone').value='';
  document.getElementById('location').value='';
  document.getElementById('money').checked=false;
  document.getElementById('animals').checked=false;
  document.getElementById('other').checked=false;
  document.getElementById('barcode').innerHTML='';
  document.getElementById('qrcode').innerHTML='';
  document.getElementById('package-info').innerHTML='';
}
