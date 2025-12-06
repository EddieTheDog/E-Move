// frontdesk.js
let lastPackage = null;

function createPackage(){
  const name=document.getElementById('customerName').value.trim();
  const email=document.getElementById('customerEmail').value.trim();
  const room=document.getElementById('room').value.trim();
  const priority=document.getElementById('priority').value;
  const illegal=[document.getElementById('illegal-money').checked,document.getElementById('illegal-animals').checked,document.getElementById('illegal-drugs').checked,document.getElementById('illegal-weapons').checked].some(x=>x);

  if(!name || !room) return alert('Name and Room required');

  const initials=name.split(' ').map(n=>n[0]).join('').toUpperCase();
  const timestamp=Date.now();
  const packageNumber=`E-MOVE-${initials}-${timestamp}`;
  const trackingNumber=`TRACK-${timestamp}`;

  lastPackage = {packageNumber, trackingNumber};

  JsBarcode(document.getElementById('barcode'), packageNumber, {format:"CODE128", displayValue:true, width:2, height:50});
  QRCode.toCanvas(document.getElementById('qrcode'), `tracking.html?number=${trackingNumber}`, function (error) {
    if(error) console.error(error);
    alert('Package created! Please confirm the barcode.');
  });

  // Save in localStorage but status Pending Confirmation
  let packages=JSON.parse(localStorage.getItem('packages')||'[]');
  packages.push({
    packageNumber,
    trackingNumber,
    name,
    email,
    room,
    status:'Pending Confirmation',
    priority,
    flagged:illegal,
    shelf:'O1'
  });
  localStorage.setItem('packages',JSON.stringify(packages));
}

function confirmPackage(){
  if(!lastPackage) return alert('No package to confirm');
  let packages=JSON.parse(localStorage.getItem('packages')||'[]');
  packages=packages.map(p=>{
    if(p.packageNumber===lastPackage.packageNumber){
      p.status='Confirmed';
    }
    return p;
  });
  localStorage.setItem('packages',JSON.stringify(packages));
  alert('Package confirmed!');
}
