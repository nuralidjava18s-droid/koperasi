/* =====================
   GLOBAL PDF
===================== */
let lastPDF = null;
let lastPDFUrl = null;

/* =====================
   STORAGE
===================== */
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

/* =====================
   HELPER
===================== */
function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

/* =====================
   PREVIEW PDF (FINAL)
===================== */
function previewPDF(doc){
  lastPDF = doc;

  if(lastPDFUrl){
    URL.revokeObjectURL(lastPDFUrl);
  }

  lastPDFUrl = doc.output("bloburl");

  const frame = document.getElementById("pdfFrame");
  frame.src = lastPDFUrl;

  document.getElementById("pdfPreview").style.display = "block";
}

/* =====================
   DOWNLOAD PDF
===================== */
function downloadPDF(){
  if(!lastPDF){
    alert("PDF belum tersedia");
    return;
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
}

/* =====================
   SHARE WHATSAPP
===================== */
function shareWA(){
  if(!lastPDF){
    alert("PDF belum tersedia");
    return;
  }

  const text = encodeURIComponent(
    "📄 Laporan Koperasi\n\n" +
    "Laporan sudah dibuat.\n" +
    "Silakan unduh PDF dari aplikasi koperasi."
  );

  window.open("https://wa.me/?text=" + text, "_blank");
}

/* =====================
   LOAD FILTER ANGGOTA
===================== */
function loadFilterAnggota(){
  const db = getDB();
  const select = document.getElementById("filterAnggota");
  if(!select) return;

  select.innerHTML = `<option value="">Semua Anggota</option>`;

  const unik = [...new Set((db.pinjaman||[]).map(p=>p.nama))];
  unik.forEach(nama=>{
    const opt = document.createElement("option");
    opt.value = nama;
    opt.textContent = nama;
    select.appendChild(opt);
  });
}

/* =====================
   LAPORAN KAS
===================== */
function exportKasPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");

  const db = getDB();
  const kas = db.kas || [];

  doc.setFontSize(14);
  doc.text("LAPORAN KAS KOPERASI",14,15);

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

/* =====================
   LAPORAN PINJAMAN (SEMUA)
===================== */
function exportPinjamanPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();

  doc.setFontSize(14);
  doc.text("LAPORAN PINJAMAN",14,15);

  doc.autoTable({
    startY:25,
    head:[["Anggota","Pinjaman","Bunga","Tenor","Sisa","Status"]],
    body:(db.pinjaman||[]).map(p=>[
      p.nama,
      rupiah(p.jumlah),
      p.bunga+"%",
      p.tenor+" bln",
      rupiah(p.sisa),
      Number(p.sisa)===0 ? "LUNAS" : "AKTIF"
    ]),
    styles:{fontSize:9}
  });

  previewPDF(doc);
}

/* =====================
   PINJAMAN PER ANGGOTA
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

    doc.setFontSize(14);
    doc.text("LAPORAN PINJAMAN ANGGOTA",14,15);

    doc.setFontSize(11);
    doc.text("Nama : "+nama,14,25);

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
      styles:{fontSize:9}
    });
  }

  previewPDF(doc);
}

/* =====================
   PINJAMAN FILTER
===================== */
function exportPinjamanFilterPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();

  const anggota = document.getElementById("filterAnggota").value;
  const status  = document.getElementById("filterStatus").value;

  let data = db.pinjaman || [];

  if(anggota){
    data = data.filter(p=>p.nama===anggota);
  }

  if(status==="LUNAS"){
    data = data.filter(p=>Number(p.sisa)===0);
  }
  if(status==="AKTIF"){
    data = data.filter(p=>Number(p.sisa)>0);
  }

  if(data.length===0){
    alert("Data tidak ditemukan");
    return;
  }

  doc.setFontSize(14);
  doc.text("LAPORAN PINJAMAN",14,15);

  doc.setFontSize(10);
  doc.text(
    `Filter: ${anggota||"Semua Anggota"} | ${status||"Semua Status"}`,
    14,22
  );

  doc.autoTable({
    startY:30,
    head:[["Anggota","Pinjaman","Bunga","Tenor","Sisa","Status"]],
    body:data.map(p=>[
      p.nama,
      rupiah(p.jumlah),
      p.bunga+"%",
      p.tenor+" bln",
      rupiah(p.sisa),
      Number(p.sisa)===0?"LUNAS":"AKTIF"
    ]),
    styles:{fontSize:9}
  });
  
  
  function previewPDF(doc){
  lastPDF = doc;

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);

  document.getElementById("pdfFrame").src = url;
  document.getElementById("pdfPreview").style.display = "block";
}