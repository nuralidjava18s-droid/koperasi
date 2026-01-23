const { jsPDF } = window.jspdf;

function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

/* =====================
   LOAD ANGGOTA
===================== */
function loadAnggota(){
  const db = getDB();
  const sel = document.getElementById("pilihAnggota");
  if(!sel) return;

  sel.innerHTML = `<option value="">-- Pilih Nama --</option>`;
  db.anggota.forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   LOAD LAPORAN
===================== */
function loadLaporan(){
  const anggotaId = pilihAnggota.value;
  if(!anggotaId) return;

  const db = getDB();
  listLaporan.innerHTML = "";

  let totalPinjam = 0;
  let totalBayar  = 0;
  let sisa        = 0;

  db.pinjaman
    .filter(p => p.anggota_id == anggotaId)
    .forEach(p=>{
      totalPinjam += p.jumlah;
      sisa        += p.sisa;

      listLaporan.innerHTML += `
        <tr>
          <td>${p.tanggal}</td>
          <td>Pinjaman</td>
          <td class="out">${rupiah(p.jumlah)}</td>
          <td>-</td>
        </tr>`;
    });

  db.transaksi
    .filter(t => t.anggota_id == anggotaId)
    .forEach(t=>{
      totalBayar += t.jumlah;

      listLaporan.innerHTML += `
        <tr>
          <td>${t.tanggal}</td>
          <td>Angsuran</td>
          <td>-</td>
          <td class="in">${rupiah(t.jumlah)}</td>
        </tr>`;
    });

  totalPinjaman.innerText = rupiah(totalPinjam);
  totalBayarEl.innerText  = rupiah(totalBayar);
  sisaPinjaman.innerText = rupiah(sisa);
  statusPinjaman.innerText = sisa <= 0 ? "LUNAS" : "BELUM LUNAS";
  statusPinjaman.className = sisa <= 0 ? "status-lunas" : "status-belum";
}

/* =====================
   EXPORT PDF
===================== */
function exportPDF(){
  if(!pilihAnggota.value) return alert("Pilih anggota dulu");

  const db = getDB();
  const anggota = db.anggota.find(a=>a.id==pilihAnggota.value);

  const doc = new jsPDF("p","mm","a4");

  doc.setFontSize(14);
  doc.text("KOPERASI DRIVER ARFA",105,15,{align:"center"});
  doc.setFontSize(11);
  doc.text("Laporan Pinjaman & Angsuran",105,22,{align:"center"});
  doc.line(15,26,195,26);

  doc.text("Nama: "+anggota.nama,15,34);

  const body = [];

  db.pinjaman.filter(p=>p.anggota_id==anggota.id).forEach(p=>{
    body.push([p.tanggal,"Pinjaman",rupiah(p.jumlah),"-"]);
  });

  db.transaksi.filter(t=>t.anggota_id==anggota.id).forEach(t=>{
    body.push([t.tanggal,"Angsuran","-",rupiah(t.jumlah)]);
  });

  doc.autoTable({
    startY:40,
    head:[["Tanggal","Keterangan","Pinjaman","Bayar"]],
    body:body
  });

  doc.save("laporan_"+anggota.nama+".pdf");
}
function exportWAtoNumber(noWA){
  const anggotaId = pilihAnggota.value;
  if(!anggotaId){
    alert("Pilih anggota dulu");
    return;
  }

  const db = getDB();
  const anggota = db.anggota.find(a => a.id == anggotaId);

  let text =
`📄 *LAPORAN PINJAMAN & ANGSURAN*
*Koperasi Driver ARFA*

👤 Nama : ${anggota.nama}

💰 Total Pinjaman : ${totalPinjaman.innerText}
💵 Total Bayar     : ${totalBayarEl.innerText}
📉 Sisa Pinjaman   : ${sisaPinjaman.innerText}
📌 Status          : ${statusPinjaman.innerText}

📅 Dicetak : ${new Date().toLocaleDateString("id-ID")}
`;

  window.open(
    `https://wa.me/${noWA}?text=${encodeURIComponent(text)}`,
    "_blank"
  );
}
