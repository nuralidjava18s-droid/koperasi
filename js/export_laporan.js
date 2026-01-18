
function exportPDFGabungan(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();

  const kas = db.kasDetail || [];
  const simpanan = db.simpanan || [];
  const pinjaman = db.pinjaman || [];
  const angsuran = db.transaksi || [];

  let y = 15;

  /* ================= HEADER ================= */
  doc.setFontSize(16);
  doc.text("LAPORAN KOPERASI DRIVER ARFA", 105, y, {align:"center"});
  y += 7;

  doc.setFontSize(10);
  doc.text("Tanggal Cetak : " + new Date().toLocaleDateString("id-ID"), 105, y, {align:"center"});
  y += 10;

  /* ================= RINGKASAN KAS ================= */
  let masuk = 0, keluar = 0;
  kas.forEach(k=>{
    if(k.jenis==="MASUK") masuk += Number(k.jumlah);
    if(k.jenis==="KELUAR") keluar += Number(k.jumlah);
  });
  const saldo = masuk - keluar;

  doc.setFontSize(12);
  doc.text("RINGKASAN KAS", 14, y); y+=6;

  doc.setFontSize(10);
  doc.text(`Kas Masuk  : Rp ${masuk.toLocaleString("id-ID")}`, 14, y); y+=5;
  doc.text(`Kas Keluar : Rp ${keluar.toLocaleString("id-ID")}`, 14, y); y+=5;
  doc.text(`Saldo Kas  : Rp ${saldo.toLocaleString("id-ID")}`, 14, y);

  /* ================= HALAMAN BARU ================= */
  doc.addPage();
  y = 15;

  /* ================= A. KAS ================= */
  doc.setFontSize(13);
  doc.text("A. LAPORAN KAS",14,y); y+=5;

  doc.autoTable({
    startY:y,
    head:[["Tanggal","Keterangan","Masuk","Keluar"]],
    body:kas.map(k=>[
      k.tanggal,
      k.keterangan,
      k.jenis==="MASUK" ? "Rp "+Number(k.jumlah).toLocaleString("id-ID") : "-",
      k.jenis==="KELUAR" ? "Rp "+Number(k.jumlah).toLocaleString("id-ID") : "-"
    ]),
    styles:{fontSize:9}
  });

  /* ================= B. SIMPANAN ================= */
  doc.addPage();
  y = 15;
  doc.setFontSize(13);
  doc.text("B. SIMPANAN ANGGOTA",14,y); y+=5;

  doc.autoTable({
    startY:y,
    head:[["Tanggal","Anggota","Jenis","Jumlah"]],
    body:simpanan.map(s=>[
      s.tanggal,
      s.nama || s.anggota,
      s.jenis,
      "Rp "+Number(s.jumlah).toLocaleString("id-ID")
    ]),
    styles:{fontSize:9}
  });

  /* ================= C. PINJAMAN ================= */
  doc.addPage();
  y = 15;
  doc.setFontSize(13);
  doc.text("C. DATA PINJAMAN",14,y); y+=5;

  doc.autoTable({
    startY:y,
    head:[["Tanggal","Anggota","Jumlah","Tenor"]],
    body:pinjaman.map(p=>[
      p.tanggal,
      p.nama || p.anggota,
      "Rp "+Number(p.jumlah).toLocaleString("id-ID"),
      p.tenor + " x"
    ]),
    styles:{fontSize:9}
  });

  /* ================= D. ANGSURAN ================= */
  doc.addPage();
  y = 15;
  doc.setFontSize(13);
  doc.text("D. ANGSURAN PINJAMAN",14,y); y+=5;

  doc.autoTable({
    startY:y,
    head:[["Tanggal","Anggota","Jumlah"]],
    body:angsuran.map(a=>[
      a.tanggal,
      a.nama || a.anggota,
      "Rp "+Number(a.jumlah).toLocaleString("id-ID")
    ]),
    styles:{fontSize:9}
  });

  /* ================= PREVIEW (AMAN APK) ================= */
  window.open(doc.output("bloburl"));
}
