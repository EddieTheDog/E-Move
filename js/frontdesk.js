function createPackage(){
let packages = JSON.parse(localStorage.getItem('packages')||'[]');
const packageNumber = 'PKG'+(packages.length+1).toString().padStart(4,'0');
const trackingNumber = 'TRK-EM'+(packages.length+1).toString().padStart(4,'0');
const customerName=document.getElementById('customerName').value;
const email=document.getElementById('email').value;
const phone=document.getElementById('phone').value;
const location=document.getElementById('location').value;
const floor=document.getElementById('floor').value;
const priority=document.getElementById('priority').value;
const flagged=(document.getElementById('money').checked || document.getElementById('animals').checked || document.getElementById('other').checked);

let shelfList=['O1','O2','O3','O4','O5'];
let shelfCounts=shelfList.map(s=>packages.filter(p=>p.shelf===s).length);
let minIndex=shelfCounts.indexOf(Math.min(...shelfCounts));
let assignedShelf=shelfList[minIndex];

const pkg={
packageNumber,
trackingNumber,
customerName,
email,
phone,
location:floor+' '+location,
floor,
priority,
flagged,
status:'Pending Confirmation',
shelf:assignedShelf,
barcode:packageNumber,
createdAt:Date.now()
};

packages.push(pkg);
localStorage.setItem('packages',JSON.stringify(packages));

document.getElementById('package-info').innerHTML=`
<p>Package Created!</p>
<p>Package #: ${packageNumber}</p>
<p>Tracking #: ${trackingNumber}</p>
<p>Shelf: ${assignedShelf}</p>
<p>${flagged?'<strong>Flagged!</strong>':''}</p>
<p>QR Code URL: tracking.html?tracking=${trackingNumber}</p>
`;
}
