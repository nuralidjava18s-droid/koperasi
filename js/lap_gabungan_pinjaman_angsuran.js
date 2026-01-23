const { jsPDF } = window.jspdf;

function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

function loadAnggota(){
  const db = getDB();
  const sel = document.getElementById("pilihAnggota");

  if(!sel){
    console.error("Select pilihAnggota tidak ditemukan");
    return;
  }

  sel.innerHTML = `<option value="">-- Pilih Nama --</option>`;

  if(!db.anggota || db.anggota.length === 0){
    console.warn("Data anggota kosong");
    return;
  }

  db.anggota.forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

function exportGabunganPDF(){
  const db = getDB();
  const doc = new jsPDF("p","mm","a4");

  /* =====================
     KOP
  ===================== */
  doc.setFontSize(14);
  doc.text("KOPERASI DRIVER ARFA",105,15,{align:"center"});
  doc.setFontSize(10);
  doc.text("Laporan Gabungan Pinjaman & Angsuran",105,22,{align:"center"});
  doc.line(15,26,195,26);

  let y = 30;

  /* =====================
     LOOP PINJAMAN
  ===================== */
  db.pinjaman.forEach((p,idx)=>{
    const anggota = db.anggota.find(a=>a.id === p.anggota_id);

    if(y > 240){
      doc.addPage();
      y = 20;
    }

    /* HEADER PINJAMAN */
    doc.setFontSize(11);
    doc.text(
      `${idx+1}. ${anggota?.nama || "-"} | Pinjaman: ${rupiah(p.jumlah)} | Sisa: ${rupiah(p.sisa)}`,
      15,y
    );
    y += 5;

    /* DATA ANGSURAN */
    const angsuran = db.transaksi.filter(t=>t.pinjamanId === p.id);

    if(angsuran.length === 0){
      doc.setFontSize(9);
      doc.text("Belum ada angsuran",20,y);
      y += 6;
      return;
    }

    const body = [];
    let totalBayar = 0;

    angsuran.forEach((t,i)=>{
      body.push([
        i+1,
        t.tanggal,
        rupiah(t.jumlah)
      ]);
      totalBayar += Number(t.jumlah);
    });

    doc.autoTable({
      startY:y,
      head:[["No","Tanggal","Jumlah Bayar"]],
      body:body,
      styles:{fontSize:9},
      theme:"grid",
      margin:{left:20}
    });

    y = doc.lastAutoTable.finalY + 4;

    doc.setFontSize(9);
    doc.text("Total Dibayar: " + rupiah(totalBayar),20,y);
    y += 8;
  });

  /* =====================
     FOOTER
  ===================== */
  const tgl = new Date().toLocaleDateString("id-ID");
  doc.setFontSize(9);
  doc.text("Dicetak : " + tgl,150,285);

  doc.save("laporan_pinjaman_dan_angsuran.pdf");
}
