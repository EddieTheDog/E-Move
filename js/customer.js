const urlParams = new URLSearchParams(window.location.search);
const tracking = urlParams.get('tracking') || '';

document.getElementById('tracking-number').innerText = tracking;

const packages = JSON.parse(localStorage.getItem('packages') || '[]');
const pkg = packages.find(p=>p.trackingNumber===tracking);

if(pkg){
    document.getElementById('status').innerText = pkg.status;
}else{
    document.getElementById('status').innerText = 'Not found';
}
