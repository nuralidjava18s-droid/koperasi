function loadFilterAnggota(){
  const db = getDB();
  const select = document.getElementById("filterAnggota");
  if(!select) return;

  select.innerHTML = `<option value="">-- Semua Anggota --</option>`;

  (db.anggota || []).forEach(a=>{
    const opt = document.createElement("option");
    opt.value = a.nama;
    opt.textContent = a.nama;
    select.appendChild(opt);
  });
}

function loadPinjaman(){
  const db = getDB();
  const filter = document.getElementById("filterAnggota")?.value || "";
  const tbody = document.getElementById("listPinjaman");

  tbody.innerHTML = "";

  (db.pinjaman || [])
    .filter(p => !filter || p.nama === filter)
    .forEach(p=>{
      tbody.innerHTML += `
        <tr>
          <td>${p.nama}</td>
          <td>${rupiah(p.pokok)}</td>
          <td>${p.bunga}%</td>
          <td>${p.tenor} bln</td>
          <td>${rupiah(p.sisa)}</td>
          <td style="color:${p.sisa==0?'green':'red'}">
            ${p.sisa==0?'LUNAS':'AKTIF'}
          </td>
        </tr>`;
    });
}

const anggota = document.getElementById("filterAnggota").value;
if(anggota){
  data = data.filter(p=>p.nama===anggota);
}
/* =====================
   GLOBAL PDF
===================== */
let lastPDF = null;
let lastPDFUrl = null;

/* =====================
   PREVIEW PDF
===================== */
function previewPDF(doc){
  lastPDF = doc;

  if(lastPDFUrl){
    URL.revokeObjectURL(lastPDFUrl);
  }

  lastPDFUrl = doc.output("bloburl");

  const frame = document.getElementById("pdfFrame");
  const wrap  = document.getElementById("pdfPreview");

  if(!frame || !wrap){
    alert("Viewer PDF tidak ditemukan di HTML");
    return;
  }

  frame.src = lastPDFUrl;
  wrap.style.display = "block";
}

/* =====================
   DOWNLOAD PDF
===================== */
function downloadPDF(){
  if(!lastPDF){
    alert("PDF belum tersedia");
    return;
  }

  lastPDF.save("laporan_koperasi.pdf");
}

/* =====================
   LAPORAN PINJAMAN FILTER
===================== */
function exportPinjamanFilterPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();

  const anggota = document.getElementById("filterAnggota")?.value || "";
  const status  = document.getElementById("filterStatus")?.value || "";

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

  doc.autoTable({
    startY:25,
    head:[["Anggota","Pinjaman","Bunga","Tenor","Sisa","Status"]],
    body:data.map(p=>[
      p.nama,
      rupiah(p.pokok),
      p.bunga+"%",
      p.tenor+" bln",
      rupiah(p.sisa),
      p.sisa==0?"LUNAS":"AKTIF"
    ]),
    styles:{fontSize:9}
  });

  previewPDF(doc);
}

/* =====================
   LAPORAN KAS
===================== */
function exportKasPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");
  const db = getDB();

  let masuk=0, keluar=0;
  (db.kas||[]).forEach(k=>{
    if(k.jenis==="MASUK") masuk+=Number(k.jumlah||0);
    if(k.jenis==="KELUAR") keluar+=Number(k.jumlah||0);
  });

  doc.text("LAPORAN KAS",14,15);
  doc.autoTable({
    startY:25,
    head:[["Jenis","Jumlah"]],
    body:[
      ["Kas Masuk", rupiah(masuk)],
      ["Kas Keluar", rupiah(keluar)],
      ["Saldo", rupiah(masuk-keluar)]
    ]
  });

  previewPDF(doc);
}