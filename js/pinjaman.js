document.addEventListener("DOMContentLoaded", () => {
  loadAnggota();
  loadPinjaman();
});

/* =====================
   UTIL
===================== */
function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

/* =====================
   LOAD ANGGOTA
===================== */
function loadAnggota(){
  const db = getDB();
  const sel = document.getElementById("anggotaPinjam");
  if(!sel) return;

  sel.innerHTML = `<option value="">-- Pilih Anggota --</option>`;
  db.anggota.forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   HITUNG ANGSURAN
===================== */
function hitungAngsuran(){
  const j = Number(jumlahPinjam.value||0);
  const t = Number(tenorPinjam.value||0);
  if(j && t){
    angsuranPinjam.value = rupiah(Math.ceil(j/t));
  }else{
    angsuranPinjam.value = "";
  }
}

jumlahPinjam.addEventListener("input", hitungAngsuran);
tenorPinjam.addEventListener("input", hitungAngsuran);

/* =====================
   SIMPAN PINJAMAN
===================== */
document.getElementById("formPinjaman").addEventListener("submit", e=>{
  e.preventDefault();
  const db = getDB();

  db.pinjaman.push({
    id: Date.now(),
    anggota_id: anggotaPinjam.value,
    jumlah: Number(jumlahPinjam.value),
    bunga: Number(bungaPinjam.value),
    tenor: Number(tenorPinjam.value),
    sisa: Number(jumlahPinjam.value),
    tanggal: new Date().toISOString().slice(0,10)
  });

  saveDB(db);
  e.target.reset();
  loadPinjaman();
});

/* =====================
   LOAD PINJAMAN
===================== */

function exportPinjamanPDF(){
  const db = getDB();
  const anggotaId = document.getElementById("filterAnggotaPinjaman").value;

  if(!anggotaId){
    alert("Pilih anggota dulu");
    return;
  }

  const anggota = db.anggota.find(a=>a.id===anggotaId);
  const data = db.pinjaman.filter(p=>p.anggota_id===anggotaId);

  if(data.length === 0){
    alert("Tidak ada data pinjaman");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("LAPORAN PINJAMAN",105,15,{align:"center"});
  doc.setFontSize(11);
  doc.text("Nama : " + anggota.nama,15,25);
  doc.line(15,28,195,28);

  let body = [];
  data.forEach((p,i)=>{
    body.push([
      i+1,
      p.tanggal,
      rupiah(p.jumlah),
      p.tenor + " bln",
      rupiah(p.sisa),
      p.sisa<=0 ? "LUNAS" : "AKTIF"
    ]);
  });

  doc.autoTable({
    startY:32,
    head:[["No","Tanggal","Jumlah","Tenor","Sisa","Status"]],
    body:body,
    styles:{fontSize:9}
  });

  doc.save("pinjaman_" + anggota.nama.replace(/\s/g,"_") + ".pdf");
}

function exportPinjamanWA(){
  const db = getDB();
  const anggotaId = document.getElementById("filterAnggotaPinjaman").value;

  if(!anggotaId){
    alert("Pilih anggota dulu");
    return;
  }

  const anggota = db.anggota.find(a=>a.id===anggotaId);
  const data = db.pinjaman.filter(p=>p.anggota_id===anggotaId);

  if(data.length === 0){
    alert("Tidak ada data pinjaman");
    return;
  }

  let text = `📄 *LAPORAN PINJAMAN*\n`;
  text += `Nama: ${anggota.nama}\n\n`;

  data.forEach((p,i)=>{
    text += `${i+1}. ${p.tanggal}\n`;
    text += `   Jumlah: ${rupiah(p.jumlah)}\n`;
    text += `   Sisa: ${rupiah(p.sisa)}\n`;
    text += `   Status: ${p.sisa<=0?'LUNAS':'AKTIF'}\n\n`;
  });

  window.open(
    "https://wa.me/?text=" + encodeURIComponent(text),
    "_blank"
  );
}