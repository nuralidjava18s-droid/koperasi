let lastPDF = null;
let lastPDFUrl = null;

function previewPDF(doc){
  lastPDF = doc;
  lastPDFUrl = doc.output("datauristring");

  document.getElementById("pdfFrame").src = lastPDFUrl;
  document.getElementById("pdfPreview").style.display = "block";
}

function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}


function shareWA(){
  if(!lastPDF){
    alert("PDF belum tersedia");
    return;
  }

  const text = encodeURIComponent(
    "📄 Laporan Koperasi\n\n" +
    "Laporan sudah dibuat.\n" +
    "Silakan unduh PDF dari aplikasi."
  );

  window.open("https://wa.me/?text=" + text, "_blank");
}


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


function exportPinjamanPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();

  doc.setFontSize(14);
  doc.text("LAPORAN PINJAMAN",14,15);

  doc.autoTable({
    startY:25,
    head:[["Anggota","Pinjaman","Bunga","Tenor","Sisa"]],
    body:(db.pinjaman||[]).map(p=>[
      p.nama,
      rupiah(p.jumlah),
      p.bunga+"%",
      p.tenor+" bln",
      rupiah(p.sisa)
    ])
  });

  previewPDF(doc);
}


function downloadPDF(){
  if(!lastPDF){
    alert("PDF belum tersedia");
    return;
  }

  lastPDF.save("laporan_koperasi.pdf");
}

function loadFilterAnggota(){
  const db = getDB();
  const select = document.getElementById("filterAnggota");
  if(!select) return;

  select.innerHTML = `<option value="">Semua Anggota</option>`;

  const namaUnik = [...new Set((db.pinjaman||[]).map(p=>p.nama))];
  namaUnik.forEach(nama=>{
    const opt = document.createElement("option");
    opt.value = nama;
    opt.textContent = nama;
    select.appendChild(opt);
  });
}



function exportPinjamanPerAnggotaPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();
  const pinjaman = db.pinjaman || [];

  if(pinjaman.length === 0){
    alert("Data pinjaman kosong");
    return;
  }

  // 🔹 GROUP BY NAMA ANGGOTA
  const group = {};
  pinjaman.forEach(p=>{
    if(!group[p.nama]) group[p.nama] = [];
    group[p.nama].push(p);
  });

  let firstPage = true;

  for(const nama in group){
    if(!firstPage) doc.addPage();
    firstPage = false;

    doc.setFontSize(14);
    doc.text("LAPORAN PINJAMAN ANGGOTA", 14, 15);

    doc.setFontSize(11);
    doc.text("Nama Anggota : " + nama, 14, 25);

    const body = group[nama].map(p=>[
      p.tanggal || "-",
      rupiah(p.jumlah),
      p.bunga + " %",
      p.tenor + " bln",
      rupiah(p.sisa)
    ]);

    doc.autoTable({
      startY: 35,
      head: [["Tanggal","Pinjaman","Bunga","Tenor","Sisa"]],
      body: body,
      styles: { fontSize: 9 }
    });
  }

  previewPDF(doc); // 🔥 preview + download + share siap
}

function exportPinjamanFilterPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();

  const anggota = document.getElementById("filterAnggota").value;
  const status  = document.getElementById("filterStatus").value;

  let data = db.pinjaman || [];

  // 🔹 FILTER ANGGOTA
  if(anggota){
    data = data.filter(p=>p.nama === anggota);
  }

  // 🔹 FILTER STATUS
  if(status === "LUNAS"){
    data = data.filter(p=>Number(p.sisa) === 0);
  }
  if(status === "AKTIF"){
    data = data.filter(p=>Number(p.sisa) > 0);
  }

  if(data.length === 0){
    alert("Data pinjaman tidak ditemukan");
    return;
  }

  doc.setFontSize(14);
  doc.text("LAPORAN PINJAMAN",14,15);

  doc.setFontSize(10);
  doc.text(
    `Filter: ${anggota || "Semua Anggota"} | ` +
    `${status || "Semua Status"}`,
    14,22
  );

  const body = data.map(p=>[
    p.nama,
    rupiah(p.jumlah),
    p.bunga+"%",
    p.tenor+" bln",
    rupiah(p.sisa),
    Number(p.sisa)===0 ? "LUNAS" : "AKTIF"
  ]);

  doc.autoTable({
    startY:30,
    head:[["Anggota","Pinjaman","Bunga","Tenor","Sisa","Status"]],
    body:body,
    styles:{fontSize:9}
  });

  previewPDF(doc); // 🔥 preview + download + WA
}