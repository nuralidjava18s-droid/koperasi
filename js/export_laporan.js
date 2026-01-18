function exportPDFGabungan(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");

  const db = getDB();
  const kas = db.kasDetail || [];

  let masuk = 0, keluar = 0;
  kas.forEach(k=>{
    if(k.jenis==="MASUK") masuk+=Number(k.jumlah||0);
    if(k.jenis==="KELUAR") keluar+=Number(k.jumlah||0);
  });

  doc.setFontSize(14);
  doc.text("LAPORAN KAS KOPERASI", 14, 15);

  doc.setFontSize(10);
  doc.text(`Kas Masuk  : Rp ${masuk.toLocaleString("id-ID")}`, 14, 25);
  doc.text(`Kas Keluar : Rp ${keluar.toLocaleString("id-ID")}`, 14, 31);
  doc.text(`Saldo Kas  : Rp ${(masuk-keluar).toLocaleString("id-ID")}`, 14, 37);

  const body=[];
  kas.forEach(k=>{
    body.push([
      k.tanggal || "-",
      k.keterangan || "-",
      k.jenis==="MASUK"
        ? "Rp "+Number(k.jumlah).toLocaleString("id-ID")
        : "-",
      k.jenis==="KELUAR"
        ? "Rp "+Number(k.jumlah).toLocaleString("id-ID")
        : "-"
    ]);
  });

  doc.autoTable({
    startY:45,
    head:[["Tanggal","Keterangan","Masuk","Keluar"]],
    body:body,
    styles:{fontSize:9}
  });

  // PREVIEW (AMAN DI GITHUB & APK)
  const blobUrl = doc.output("bloburl");
  document.getElementById("pdfFrame").src = blobUrl;
  document.getElementById("pdfPreview").style.display="block";
}

/* ================= KAS ================= */
function exportKasPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const db = getDB();
  const kas = db.kasDetail || [];

  let masuk=0, keluar=0;
  kas.forEach(k=>{
    if(k.jenis==="MASUK") masuk+=Number(k.jumlah||0);
    if(k.jenis==="KELUAR") keluar+=Number(k.jumlah||0);
  });

  doc.setFontSize(16);
  doc.text("LAPORAN KAS", 14, 15);

  doc.text(`Kas Masuk  : Rp ${masuk.toLocaleString("id-ID")}`,14,25);
  doc.text(`Kas Keluar : Rp ${keluar.toLocaleString("id-ID")}`,14,32);
  doc.text(`Saldo Kas  : Rp ${(masuk-keluar).toLocaleString("id-ID")}`,14,39);

  doc.autoTable({
    startY:45,
    head:[["Tanggal","Keterangan","Masuk","Keluar"]],
    body:kas.map(k=>[
      k.tanggal||"-",
      k.keterangan||"-",
      k.jenis==="MASUK" ? rupiah(k.jumlah) : "-",
      k.jenis==="KELUAR" ? rupiah(k.jumlah) : "-"
    ])
  });

  previewPDF(doc);
}

function exportPinjamanPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const db = getDB();

  doc.setFontSize(16);
  doc.text("LAPORAN PINJAMAN",14,15);

  doc.autoTable({
    startY:25,
    head:[["Anggota","Pinjaman","Bunga","Tenor","Sisa"]],
    body:db.pinjaman.map(p=>[
      p.nama,
      rupiah(p.jumlah),
      p.bunga+"%",
      p.tenor+" bln",
      rupiah(p.sisa)
    ])
  });

  previewPDF(doc);
}

function previewPDF(doc){
  const blobUrl = doc.output("bloburl");
  document.getElementById("pdfFrame").src = blobUrl;
  document.getElementById("pdfPreview").style.display="block";
}

function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}