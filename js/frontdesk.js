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
  const flagged = document.getElementById('money').checked || document.getElementById('animals').checked || document.getElementById('other').checked;

  if(!customerName || !location){
    alert("Customer name and location required!");
    return;
  }

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

  showCodes(pkg);

  document.getElementById('package-info').innerHTML = `
    <p>Package #: ${packageNumber}</p>
    <p>Tracking #: ${trackingNumber}</p>
    <p>QR Code links to: <a href="tracking.html?tracking=${trackingNumber}" target="_blank">tracking page</a></p>
    ${flagged?'<strong>Flagged for review!</strong>':''}
    <p>Scan tracking number to confirm.</p>
  `;
}

function showCodes(pkg){
  // Barcode
  const svg = document.createElement('svg');
  JsBarcode(svg, pkg.packageNumber, {format:"CODE128", displayValue:true, width:2, height:40});
  document.getElementById('barcode').innerHTML=''; 
  document.getElementById('barcode').appendChild(svg);

  // QR code
  const url = `${window.location.origin}/tracking.html?tracking=${pkg.trackingNumber}`;
  const qrDiv = document.getElementById('qrcode');
  qrDiv.innerHTML='';
  QRCode.toCanvas(qrDiv, url, function(err){
    if(err) console.error("QR Error:", err);
  });
}

function confirmTracking(){
  const input = document.getElementById('trackingInput').value.trim();
  let packages = JSON.parse(localStorage.getItem('packages') || '[]');
  let pkg = packages.find(p=>p.status==='Pending Confirmation');
  if(!pkg){ alert('No package to confirm'); return; }
  if(input !== pkg.trackingNumber){ alert('Tracking number mismatch!'); return; }

  // Assign shelf automatically
  const shelves = ['O1','O2','O3','O4','O5'];
  let counts = shelves.map(s=>packages.filter(p=>p.shelf===s).length);
  pkg.shelf = shelves[counts.indexOf(Math.min(...counts))];
  pkg.status = 'Stored';
  localStorage.setItem('packages', JSON.stringify(packages));
  alert(`Confirmed! Package stored in ${pkg.shelf}`);

  // Clear
  ['barcode','qrcode','package-info','trackingInput','customerName','email','phone','location'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.value=''; 
    if(el) el.innerHTML='';
  });
  ['money','animals','other'].forEach(id=>document.getElementById(id).checked=false);
}
