let packages = JSON.parse(localStorage.getItem('packages') || '[]');

document.getElementById('scan-btn').addEventListener('click', ()=>{
    const input = document.getElementById('scan-input').value.trim();
    const pkg = packages.find(p=>p.trackingNumber===input);
    if(pkg){
        pkg.status='With Delivery Driver';
        localStorage.setItem('packages', JSON.stringify(packages));

        document.getElementById('package-number').innerText=pkg.packageNumber;
        document.getElementById('tracking-number').innerText=pkg.trackingNumber;
        document.getElementById('shelf').innerText=pkg.shelf;
        document.getElementById('status').innerText=pkg.status;

        document.getElementById('package-info').style.display='block';
    } else alert('Package not found!');
});
