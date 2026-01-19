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
      masuk: k.jenis==="MASUK" ? Number(k.jumlah)||0 : 0,
      keluar: k.jenis==="KELUAR" ? Number(k.jumlah)||0 : 0,
      pokok: 0,
      bunga: 0
    });
  });

  /* =====================
     SIMPANAN (POKOK)
  ===================== */
  (db.simpanan || []).forEach(s=>{
    kas.push({
      tanggal: s.tanggal,
      keterangan: `Simpanan ${s.jenis} - ${s.nama}`,
      masuk: Number(s.jumlah)||0,
      keluar: 0,
      pokok: Number(s.jumlah)||0,
      bunga: 0
    });
  });

  /* =====================
     PINJAMAN CAIR
  ===================== */
  (db.pinjaman || []).forEach(p=>{
    kas.push({
      tanggal: p.tanggal,
      keterangan: `Pinjaman ${p.nama}`,
      masuk: 0,
      keluar: Number(p.jumlah)||0,
      pokok: Number(p.jumlah)||0,
      bunga: 0
    });
  });

  /* =====================
     ANGSURAN (POKOK + BUNGA)
  ===================== */
  (db.transaksi || []).forEach(t=>{
    if(t.jenis==="ANGSURAN"){
      kas.push({
        tanggal: t.tanggal,
        keterangan: `Angsuran - ${t.nama}`,
        masuk: (Number(t.pokok)||0) + (Number(t.bunga)||0),
        keluar: 0,
        pokok: Number(t.pokok)||0,
        bunga: Number(t.bunga)||0
      });
    }
  });

  return kas;
}

function hitungKas(kas){
  return kas.reduce((r,k)=>{
    r.masuk  += k.masuk;
    r.keluar += k.keluar;
    r.pokok  += k.pokok;
    r.bunga  += k.bunga;
    return r;
  },{
    masuk:0, keluar:0, pokok:0, bunga:0
  });
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
  const total = hitungKas(kas);
  const saldo = total.masuk - total.keluar;

  addHeader(doc,"LAPORAN KAS KOPERASI",`Bulan: ${bulanTahun}`);

  doc.setFontSize(11);
  doc.text(`Kas Masuk   : ${rupiah(total.masuk)}`,14,36);
  doc.text(`Kas Keluar  : ${rupiah(total.keluar)}`,14,42);
  doc.text(`Pokok       : ${rupiah(total.pokok)}`,14,48);
  doc.text(`Bunga       : ${rupiah(total.bunga)}`,14,54);
  doc.text(`Saldo Akhir : ${rupiah(saldo)}`,14,60);

  doc.autoTable({
    startY:68,
    head:[[
      "Tanggal","Keterangan",
      "Masuk","Keluar",
      "Pokok","Bunga"
    ]],
    body:kas.map(k=>[
      k.tanggal||"-",
      k.keterangan,
      k.masuk ? rupiah(k.masuk) : "-",
      k.keluar ? rupiah(k.keluar) : "-",
      k.pokok ? rupiah(k.pokok) : "-",
      k.bunga ? rupiah(k.bunga) : "-"
    ]),
    styles:{fontSize:9,cellPadding:3},
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
