const packages = JSON.parse(localStorage.getItem("packages") || "[]");

document.getElementById("scan-btn").addEventListener("click", () => {
    const trackingInput = document.getElementById("scan-input").value.trim();
    const pkg = packages.find(p => p.trackingNumber === trackingInput);

    if(pkg){
        document.getElementById("package-number").innerText = pkg.packageNumber;
        document.getElementById("tracking-number").innerText = pkg.trackingNumber;
        document.getElementById("shelf").innerText = pkg.shelf;
        document.getElementById("status").innerText = pkg.status;

        // Show package info
        document.getElementById("package-info").style.display = "block";

        // Generate barcode
        JsBarcode("#barcode", pkg.trackingNumber, {format:"CODE128", width:2, height:40});

        // Generate QR code
        document.getElementById("qrcode").innerHTML = "";
        new QRCode(document.getElementById("qrcode"), pkg.trackingNumber);
    } else {
        alert("Package not found!");
    }
});

// Go Back button
document.getElementById("go-back").addEventListener("click", () => {
    window.location.href = "UX_Test.html?role=delivery";
});
