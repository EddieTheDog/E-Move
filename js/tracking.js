function renderTracking(){
  const urlParams=new URLSearchParams(window.location.search);
  const trackingNum=urlParams.get('number');
  const packages=JSON.parse(localStorage.getItem('packages')||'[]');
  const pkg=packages.find(p=>p.trackingNumber===trackingNum);
  const infoDiv=document.getElementById('trackingInfo');
  if(!pkg){
    infoDiv.innerHTML='<p>Package not found.</p>';
    return;
  }

  infoDiv.innerHTML=`
    <p><strong>Package Number:</strong> ${pkg.packageNumber}</p>
    <p><strong>Status:</strong> ${pkg.status}</p>
    <p><strong>Room:</strong> ${pkg.room}</p>
    <p><strong>Priority:</strong> ${pkg.priority}</p>
    <p><strong>Estimated Delivery:</strong> ${pkg.priority==='high'?'5 min':'15 min'}</p>
  `;
}

setInterval(renderTracking,3000);
renderTracking();
