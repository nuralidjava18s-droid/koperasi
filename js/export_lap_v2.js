/* =====================
   UTILITY & STORAGE
===================== */
let lastPDF = null;
let lastPDFUrl = null;

function getDB(){
  let db = localStorage.getItem("koperasi_db");
  if(!db){
    db = {
      user:{ username:"Ali", password:"1234" },
      anggota:[],
      simpanan:[],
      pinjaman:[],
      transaksi:[],
      kas:[]
    };
    localStorage.setItem("koperasi_db", JSON.stringify(db));
  }
  return JSON.parse(db);
}

function saveDB(db){
  localStorage.setItem("koperasi_db", JSON.stringify(db));
}

function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

function previewPDF(doc){
  lastPDF = doc;
  if(lastPDFUrl) URL.revokeObjectURL(lastPDFUrl);
  lastPDFUrl = doc.output("bloburl");
  document.getElementById("pdfFrame").src = lastPDFUrl;
  document.getElementById("pdfPreview").style.display = "block";
}

function downloadPDF(){
  if(!lastPDF){
    alert("PDF belum tersedia");
    return;
  }
  const blob = lastPDF.output("blob");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "laporan_koperasi.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =====================
   TEMPLATE HEADER & FOOTER
===================== */
function addHeader(doc, title, subtitle){
  doc.setFontSize(16);
  doc.setFont("helvetica","bold");
  doc.text(title, 14, 20);

  if(subtitle){
    doc.setFontSize(11);
    doc.setFont("helvetica","normal");
    doc.text(subtitle, 14, 28);
  }
}

function addFooter(doc){
  const pageCount = doc.internal.getNumberOfPages();
  for(let i=1; i<=pageCount; i++){
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text("Halaman " + i, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
  }
}

/* =====================
   LAPORAN KAS
===================== */
function exportKasPDF(bulanTahun="Semua Bulan"){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");

  const kas = getKasReal();

  const masuk = kas
    .filter(k=>k.jenis==="MASUK")
    .reduce((a,b)=>a+b.jumlah,0);

  const keluar = kas
    .filter(k=>k.jenis==="KELUAR")
    .reduce((a,b)=>a+b.jumlah,0);

  const saldo = masuk - keluar;

  addHeader(doc,"LAPORAN KAS KOPERASI",`Bulan: ${bulanTahun}`);

  doc.setFontSize(11);
  doc.text(`Kas Masuk   : ${rupiah(masuk)}`,14,36);
  doc.text(`Kas Keluar  : ${rupiah(keluar)}`,14,42);
  doc.text(`Saldo Akhir : ${rupiah(saldo)}`,14,48);

  doc.autoTable({
    startY:55,
    head:[["Tanggal","Keterangan","Masuk","Keluar"]],
    body:kas.map(k=>[
      k.tanggal || "-",
      k.keterangan,
      k.jenis==="MASUK"?rupiah(k.jumlah):"-",
      k.jenis==="KELUAR"?rupiah(k.jumlah):"-"
    ]),
    styles:{fontSize:10,cellPadding:3},
    headStyles:{fillColor:[41,128,185],textColor:255},
    alternateRowStyles:{fillColor:[245,245,245]},
    margin:{left:14,right:14}
  });

  addFooter(doc);
  previewPDF(doc);
}
/* =====================
   LAPORAN PINJAMAN SEMUA
===================== */
function exportPinjamanPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();

  addHeader(doc,"LAPORAN PINJAMAN");

  doc.autoTable({
    startY:30,
    head:[["Anggota","Pinjaman","Bunga","Tenor","Sisa","Status"]],
    body:(db.pinjaman||[]).map(p=>[
      p.nama,
      rupiah(p.jumlah),
      p.bunga+"%",
      p.tenor+" bln",
      rupiah(p.sisa),
      Number(p.sisa)===0?"LUNAS":"AKTIF"
    ]),
    styles:{fontSize:10, cellPadding:3},
    headStyles:{fillColor:[41,128,185],textColor:255,fontStyle:"bold"},
    alternateRowStyles:{fillColor:[245,245,245]},
    margin:{left:14,right:14}
  });

  addFooter(doc);
  previewPDF(doc);
}

/* =====================
   LAPORAN PINJAMAN PER ANGGOTA
===================== */
function exportPinjamanPerAnggotaPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();
  const pinjaman = db.pinjaman || [];

  if(pinjaman.length===0){
    alert("Data pinjaman kosong");
    return;
  }

  const group = {};
  pinjaman.forEach(p=>{
    if(!group[p.nama]) group[p.nama]=[];
    group[p.nama].push(p);
  });

  let first = true;
  for(const nama in group){
    if(!first) doc.addPage();
    first=false;

    addHeader(doc,"LAPORAN PINJAMAN ANGGOTA",`Nama: ${nama}`);

    doc.autoTable({
      startY:35,
      head:[["Tanggal","Pinjaman","Bunga","Tenor","Sisa"]],
      body:group[nama].map(p=>[
        p.tanggal||"-",
        rupiah(p.jumlah),
        p.bunga+"%",
        p.tenor+" bln",
        rupiah(p.sisa)
      ]),
      styles:{fontSize:10, cellPadding:3},
      headStyles:{fillColor:[41,128,185],textColor:255,fontStyle:"bold"},
      alternateRowStyles:{fillColor:[245,245,245]},
      margin:{left:14,right:14}
    });
  }

  addFooter(doc);
  previewPDF(doc);
}

/* =====================
   LAPORAN PINJAMAN FILTER
===================== */
function exportPinjamanFilterPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();

  const anggota = document.getElementById("filterAnggota").value;
  const status  = document.getElementById("filterStatus").value;

  let data = db.pinjaman || [];
  if(anggota) data = data.filter(p=>p.nama===anggota);
  if(status==="LUNAS") data = data.filter(p=>Number(p.sisa)===0);
  if(status==="AKTIF") data = data.filter(p=>Number(p.sisa)>0);

  if(data.length===0){
    alert("Data tidak ditemukan");
    return;
  }

  addHeader(doc,"LAPORAN PINJAMAN", `Filter: ${anggota||"Semua Anggota"} | ${status||"Semua Status"}`);

  doc.autoTable({
    startY:35,
    head:[["Anggota","Pinjaman","Bunga","Tenor","Sisa","Status"]],
    body:data.map(p=>[
      p.nama,
      rupiah(p.jumlah),
      p.bunga+"%",
      p.tenor+" bln",
      rupiah(p.sisa),
      Number(p.sisa)===0?"LUNAS":"AKTIF"
    ]),
    styles:{fontSize:10, cellPadding:3},
    headStyles:{fillColor:[41,128,185],textColor:255,fontStyle:"bold"},
    alternateRowStyles:{fillColor:[245,245,245]},
    margin:{left:14,right:14}
  });

  addFooter(doc);
  previewPDF(doc);
}
function getKasReal(){
  const db = getDB();
  let kas = [];

  /* =====================
     KAS MANUAL
  ===================== */
  (db.kas || []).forEach(k=>{
    kas.push({
      tanggal: k.tanggal,
      keterangan: k.keterangan || "Kas Manual",
      jenis: k.jenis,
      jumlah: Number(k.jumlah) || 0
    });
  });

  /* =====================
     PINJAMAN CAIR (KELUAR)
  ===================== */
  (db.pinjaman || []).forEach(p=>{
    kas.push({
      tanggal: p.tanggal,
      keterangan: `Pinjaman ${p.nama}`,
      jenis: "KELUAR",
      jumlah: Number(p.jumlah) || 0
    });
  });

  /* =====================
     ANGSURAN (MASUK)
  ===================== */
  (db.transaksi || []).forEach(t=>{
    if(t.jenis === "ANGSURAN"){
      kas.push({
        tanggal: t.tanggal,
        keterangan: `Angsuran ${t.nama}`,
        jenis: "MASUK",
        jumlah: Number(t.jumlah) || 0
      });
    }
  });

  return kas;
}
