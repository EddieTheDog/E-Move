function loadWarehouse(){
  const packages=JSON.parse(localStorage.getItem('packages')||'[]');
  const shelfDiv=document.getElementById('shelf-grid');
  shelfDiv.innerHTML='';
  const shelfNames=['O1','O2','O3'];
  shelfNames.forEach(shelf=>{
    const shelfCard=document.createElement('div');
    shelfCard.className='shelf-card';
    shelfCard.innerHTML=`<h3>${shelf}</h3>`;
    packages.filter(p=>p.shelf===shelf).forEach(p=>{
      const pkg=document.createElement('div');
      pkg.className='package-card';
      if(p.flagged) pkg.style.border='2px solid red';
      pkg.textContent=p.packageNumber+' ('+p.status+')';
      shelfCard.appendChild(pkg);
    });
    shelfDiv.appendChild(shelfCard);
  });
}
loadWarehouse();
setInterval(loadWarehouse,2000);
