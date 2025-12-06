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

  // Show barcode and QR code
  showCodes(pkg);

  // Show package info
  document.getElementById('package-info').innerHTML = `
    <p>Package #: ${packageNumber}</p>
    <p>Tracking #: ${trackingNumber}</p>
    ${flagged?'<strong>Flagged for review!</strong>':''}
    <p>Please scan the barcode to confirm before storing.</p>
  `;
}

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

function confirmBarcode(){
  let input = document.getElementById('barcodeInput').value.trim();
  let packages = JSON.parse(localStorage.getItem('packages') || '[]');
  let pkg = packages.find(p => p.status==='Pending Confirmation');

  if(!pkg){
    alert('No package to confirm.');
    return;
  }

  if(input !== pkg.packageNumber){
    alert('Barcode does not match. Please scan the correct barcode.');
    return;
  }

  // Assign shelf automatically
  const shelfList=['O1','O2','O3','O4','O5'];
  let shelfCounts = shelfList.map(s => packages.filter(p => p.shelf === s).length);
  let minIndex = shelfCounts.indexOf(Math.min(...shelfCounts));
  pkg.shelf = shelfList[minIndex];
  pkg.status = 'Stored';

  localStorage.setItem('packages', JSON.stringify(packages));
  alert(`Package confirmed and stored in shelf ${pkg.shelf}.`);

  // Clear inputs and display
  document.getElementById('barcodeInput').value='';
  document.getElementById('barcode').innerHTML='';
  document.getElementById('qrcode').innerHTML='';
  document.getElementById('package-info').innerHTML='';
}
