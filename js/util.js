function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

function today(){
  return new Date().toISOString().slice(0,10);
}