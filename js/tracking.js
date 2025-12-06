function loadTracking(){
  const urlParams=new URLSearchParams(window.location.search);
  const number=urlParams.get('number');
  if(!number) return;
  const packages=JSON.parse(localStorage.getItem('packages')||'[]');
  const pkg=packages.find(p=>p.trackingNumber===number);
  const trackingDiv=document.getElementById('tracking-status');
  if(!pkg){ trackingDiv.textContent='Package not found'; return;}
  trackingDiv.innerHTML=`<h3>Package: ${pkg.packageNumber}</h3>
  <p>Status: ${pkg.status}</p>
  <p>Expected Delivery: ${pkg.priority==='high'?'Sooner':'Normal'}</p>`;
}

// auto-refresh
loadTracking();
setInterval(loadTracking,2000);
