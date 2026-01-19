/* =====================
   GLOBAL
===================== */
let totalKasMasuk = 0;
let totalKasKeluar = 0;
let totalSaldoKas = 0;
let editIndex = null;

let lastKasPDFBlob = null;
let lastKasPDFUrl  = null;

function rupiah(n){
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

/* =====================
   LOAD KAS
===================== */
function loadKas(){
  const db = getDB();
  const tbody = document.getElementById("listKas");

  let kasMasuk = 0;
  let kasKeluar = 0;

  tbody.innerHTML = "";

  /* SIMPANAN */
  db.simpanan.forEach(s=>{
    kasMasuk += Number(s.jumlah);
    tbody.innerHTML += `
      <tr>
        <td>${s.tanggal}</td>
        <td>Simpanan (${s.jenis})</td>
        <td>${rupiah(s.jumlah)}</td>
        <td>-</td>
      </tr>`;
  });

  /* ANGSURAN */
  db.transaksi
    .filter(t=>t.jenis==="BAYAR")
    .forEach(t=>{
      kasMasuk += Number(t.jumlah);
      tbody.innerHTML += `
        <tr>
          <td>${t.tanggal}</td>
          <td>Angsuran Pinjaman</td>
          <td>${rupiah(t.jumlah)}</td>
          <td>-</td>
        </tr>`;
    });

  /* PINJAMAN */
  db.pinjaman.forEach(p=>{
    kasKeluar += Number(p.jumlah);
    tbody.innerHTML += `
      <tr>
        <td>${p.tanggal}</td>
        <td>Pencairan Pinjaman</td>
        <td>-</td>
        <td>${rupiah(p.jumlah)}</td>
      </tr>`;
  });

  /* KAS MANUAL */
  db.kas.forEach((k,i)=>{
    if(k.jenis==="MASUK"){
      kasMasuk += Number(k.jumlah);
      tbody.innerHTML += `
        <tr>
          <td>${k.tanggal}</td>
          <td>${k.keterangan}</td>
          <td>${rupiah(k.jumlah)}</td>
          <td>-</td>
          <td>
            <button onclick="editKas(${i})">✏️</button>
            <button onclick="hapusKas(${i})">🗑️</button>
          </td>
        </tr>`;
    }else{
      kasKeluar += Number(k.jumlah);
      tbody.innerHTML += `
        <tr>
          <td>${k.tanggal}</td>
          <td>${k.keterangan}</td>
          <td>-</td>
          <td>${rupiah(k.jumlah)}</td>
          <td>
            <button onclick="editKas(${i})">✏️</button>
            <button onclick="hapusKas(${i})">🗑️</button>
          </td>
        </tr>`;
    }
  });

  totalKasMasuk  = kasMasuk;
  totalKasKeluar = kasKeluar;
  totalSaldoKas  = kasMasuk - kasKeluar;

  kasMasukEl.innerText  = rupiah(totalKasMasuk);
  kasKeluarEl.innerText = rupiah(totalKasKeluar);
  saldoKasEl.innerText  = rupiah(totalSaldoKas);
}

/* =====================
   EDIT & SIMPAN
===================== */
function editKas(index){
  const db = getDB();
  const k = db.kas[index];

  tglKas.value    = k.tanggal;
  ketKas.value    = k.keterangan;
  jenisKas.value  = k.jenis;
  jumlahKas.value = k.jumlah;

  editIndex = index;
}

function simpanKas(){
  const tgl = tglKas.value;
  const ket = ketKas.value;
  const jenis = jenisKas.value;
  const jumlah = Number(jumlahKas.value);

  if(!tgl || !ket || !jumlah){
    alert("Lengkapi data!");
    return;
  }

  const db = getDB();

  if(editIndex === null){
    db.kas.push({ tanggal:tgl, keterangan:ket, jenis, jumlah });
  }else{
    db.kas[editIndex] = { tanggal:tgl, keterangan:ket, jenis, jumlah };
    editIndex = null;
  }

  saveDB(db);
  tglKas.value = ketKas.value = jumlahKas.value = "";
  loadKas();
}

function hapusKas(index){
  if(!confirm("Hapus data kas ini?")) return;
  const db = getDB();
  db.kas.splice(index,1);
  saveDB(db);
  loadKas();
}

/* =====================
   PREVIEW PDF
===================== */
function previewKasPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const today = new Date().toLocaleDateString("id-ID");

  doc.setFontSize(14);
  doc.text("REKAP KAS KOPERASI", 105, 15, { align:"center" });

  doc.setFontSize(10);
  doc.text("Koperasi ARFA DRIVER'S", 105, 22, { align:"center" });
  doc.text(`Tanggal Cetak : ${today}`, 14, 30);

  doc.text(`Kas Masuk  : ${rupiah(totalKasMasuk)}`, 14, 40);
  doc.text(`Kas Keluar : ${rupiah(totalKasKeluar)}`, 14, 47);
  doc.text(`Saldo Akhir: ${rupiah(totalSaldoKas)}`, 14, 54);

  const data = [];
  document.querySelectorAll("#listKas tr").forEach(tr=>{
    const td = tr.querySelectorAll("td");
    data.push([
      td[0].innerText,
      td[1].innerText,
      td[2].innerText,
      td[3].innerText
    ]);
  });

  doc.autoTable({
    startY: 62,
    head: [["Tanggal","Keterangan","Masuk","Keluar"]],
    body: data,
    styles:{ fontSize:9 },
    headStyles:{ fillColor:[30,144,255] }
  });

  let y = doc.lastAutoTable.finalY + 15;
  doc.text("Mengetahui,", 150, y);
  doc.text("Bendahara", 150, y+7);
  doc.text("( .................... )", 150, y+25);

  lastKasPDFBlob = doc.output("blob");
  if(lastKasPDFUrl) URL.revokeObjectURL(lastKasPDFUrl);
  lastKasPDFUrl = URL.createObjectURL(lastKasPDFBlob);

  pdfPreview.src = lastKasPDFUrl;
}

/* =====================
   DOWNLOAD PDF
===================== */
function downloadKasPDF(){
  if(!lastKasPDFBlob){
    alert("Preview PDF dulu!");
    return;
  }
  const a = document.createElement("a");
  a.href = lastKasPDFUrl;
  a.download = "rekap_kas_koperasi.pdf";
  a.click();
}
