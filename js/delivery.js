let packages = JSON.parse(localStorage.getItem("packages") || "[]");

document.getElementById("scan-btn").addEventListener("click", ()=>{
    const input = document.getElementById("scan-input").value.trim();
    const pkg = packages.find(p=>p.trackingNumber===input);

    if(pkg){
        // Update status to With Delivery Driver
        pkg.status = 'With Delivery Driver';
        localStorage.setItem('packages', JSON.stringify(packages));

        document.getElementById("package-number").innerText = pkg.packageNumber;
        document.getElementById("tracking-number").innerText = pkg.trackingNumber;
        document.getElementById("shelf").innerText = pkg.shelf;
        document.getElementById("status").innerText = pkg.status;

        document.getElementById("package-info").style.display = "block";

        JsBarcode("#barcode", pkg.trackingNumber, {format:"CODE128", width:2, height:40});
        document.getElementById("qrcode").innerHTML="";
        new QRCode(document.getElementById("qrcode"), pkg.trackingNumber);
    }else{
        alert("Package not found!");
    }
});

document.getElementById("go-back").addEventListener("click", ()=>{
    window.location.href = "UX_Test.html?role=delivery";
});
