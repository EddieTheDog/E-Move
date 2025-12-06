function createPackage(){
  const name=document.getElementById('customerName').value.trim();
  const email=document.getElementById('customerEmail').value.trim();
  const room=document.getElementById('room').value.trim();
  const priority=document.getElementById('priority').value;
  const flagged=document.getElementById('flagged').value==='true';

  if(!name || !room) return alert('Name and Room required');

  // Universal barcode: combine initials + timestamp
  const initials=name.split(' ').map(n=>n[0]).join('').toUpperCase();
  const timestamp=Date.now();
  const packageNumber=`E-MOVE-${initials}-${timestamp}`;

  const trackingNumber=`TRACK-${timestamp}`;

  let packages=JSON.parse(localStorage.getItem('packages')||'[]');
  packages.push({
    packageNumber,
    trackingNumber,
    name,
    email,
    room,
    status:'Pending Confirmation',
    priority,
    flagged,
    shelf:'O1' // initial shelf
  });
  localStorage.setItem('packages',JSON.stringify(packages));

  // Generate barcode
  const barcodeCanvas=document.getElementById('barcode');
  JsBarcode(barcodeCanvas, packageNumber, {format:"CODE128", displayValue:true, width:2, height:50});

  // Generate QR code linking to tracking page
  const qrCanvas=document.getElementById('qrcode');
  QRCode.toCanvas(qrCanvas, `https://e-move-nsmd.onrender.com/tracking.html?number=${trackingNumber}`, function (error) {
    if(error) console.error(error);
  });

  alert('Package created! Barcode and QR code generated.');
}
