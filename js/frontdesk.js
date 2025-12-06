function randomString(length){
    let chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result="";
    for(let i=0;i<length;i++){
        result+=chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return result;
}

function createPackage(){
    const name=document.getElementById('customerName').value;
    const email=document.getElementById('customerEmail').value;
    const phone=document.getElementById('customerPhone').value;
    const location=document.getElementById('location').value;
    const priority=document.getElementById('priority').value;
    const flagged=document.getElementById('flagged').value;

    const packageNumber="PKG-"+randomString(4);
    const trackingNumber="TRK-EM"+randomString(4);
    const barcode="BAR-"+randomString(6);
    const qrcode=`https://e-move-nsmd.onrender.com/tracking.html?tracking=${trackingNumber}`;

    let packages=JSON.parse(localStorage.getItem('packages')||'[]');

    // Assign shelf automatically (O1-O5) in round-robin
    const shelves=['O1','O2','O3','O4','O5'];
    let counts=shelves.map(s=>packages.filter(p=>p.shelf===s).length);
    let minCount=Math.min(...counts);
    let shelf=shelves[counts.indexOf(minCount)];

    packages.push({
        packageNumber,
        trackingNumber,
        barcode,
        customerName:name,
        customerEmail:email,
        customerPhone:phone,
        location,
        priority,
        flagged,
        status:flagged==='yes'?'Flagged':'Pending Confirmation',
        shelf
    });
    localStorage.setItem('packages',JSON.stringify(packages));

    // Display info
    document.getElementById('package-number').innerText=packageNumber;
    document.getElementById('tracking-number').innerText=trackingNumber;
    document.getElementById('barcode').innerText=barcode;
    document.getElementById('qrcode').innerText=qrcode;

    alert('Package created and assigned to shelf '+shelf);
}
