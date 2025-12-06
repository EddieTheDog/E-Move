const urlParams = new URLSearchParams(window.location.search);
const trackingNumberParam = urlParams.get('tracking') || '';

document.getElementById('tracking-number').innerText = trackingNumberParam;

const packages = JSON.parse(localStorage.getItem('packages') || '[]');
const pkg = packages.find(p=>p.trackingNumber===trackingNumberParam);

if(pkg){
    document.getElementById('status').innerText = pkg.status;
    document.getElementById('shelf').innerText = pkg.shelf;

    JsBarcode("#barcode", pkg.trackingNumber, {format:"CODE128", width:2, height:40});
    document.getElementById("qrcode").innerHTML="";
    new QRCode(document.getElementById("qrcode"), pkg.trackingNumber);
}else{
    document.getElementById('status').innerText = 'Not found';
    document.getElementById('shelf').innerText = '---';
}
