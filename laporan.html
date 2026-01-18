/* ================= PREVIEW PDF ================= */
function previewPDF(doc){
  const pdfData = doc.output("datauristring"); // AMAN APK
  document.getElementById("pdfFrame").src = pdfData;
  document.getElementById("pdfPreview").style.display = "block";
}

function rupiah(n){
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

/* ================= LAPORAN KAS ================= */
function exportKasPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();
  const kas = db.kas || [];

  doc.setFontSize(14);
  doc.text("LAPORAN KAS KOPERASI", 14, 15);

  const body = kas.map(k=>[
    k.tanggal || "-",
    k.keterangan || "-",
    k.jenis==="MASUK" ? rupiah(k.jumlah) : "-",
    k.jenis==="KELUAR" ? rupiah(k.jumlah) : "-"
  ]);

  doc.autoTable({
    startY:25,
    head:[["Tanggal","Keterangan","Masuk","Keluar"]],
    body:body,
    styles:{fontSize:9}
  });

  previewPDF(doc);
}

/* ================= LAPORAN PINJAMAN ================= */
function exportPinjamanPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();

  doc.setFontSize(14);
  doc.text("LAPORAN PINJAMAN",14,15);

  doc.autoTable({
    startY:25,
    head:[["Anggota","Jumlah","Bunga","Tenor"]],
    body:(db.pinjaman || []).map(p=>[
      p.nama || "-",
      rupiah(p.jumlah),
      (p.bunga || 0) + "%",
      (p.tenor || 0) + " bln"
    ])
  });

  previewPDF(doc);
}

/* ================= LAPORAN GABUNGAN ================= */
function exportGabunganPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();

  /* === HALAMAN 1 : KAS === */
  doc.setFontSize(14);
  doc.text("LAPORAN KAS",14,15);

  doc.autoTable({
    startY:25,
    head:[["Tanggal","Keterangan","Masuk","Keluar"]],
    body:(db.kas || []).map(k=>[
      k.tanggal || "-",
      k.keterangan || "-",
      k.jenis==="MASUK" ? rupiah(k.jumlah) : "-",
      k.jenis==="KELUAR" ? rupiah(k.jumlah) : "-"
    ])
  });

  /* === HALAMAN 2 : PINJAMAN === */
  doc.addPage();
  doc.text("LAPORAN PINJAMAN",14,15);

  doc.autoTable({
    startY:25,
    head:[["Anggota","Jumlah","Bunga","Tenor"]],
    body:(db.pinjaman || []).map(p=>[
      p.nama || "-",
      rupiah(p.jumlah),
      (p.bunga || 0) + "%",
      (p.tenor || 0) + " bln"
    ])
  });

  previewPDF(doc);
}
