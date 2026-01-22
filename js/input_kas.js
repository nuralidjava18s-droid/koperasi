let totalKasMasuk = 0;
let totalKasKeluar = 0;
let totalSaldoKas = 0;
let editIndex = null;
function rupiah(n){
  return "Rp " + Number(n).toLocaleString("id-ID");
}

/* LOAD DATA */
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
  db.transaksi.filter(t=>t.jenis==="BAYAR").forEach(t=>{
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
db.kas.forEach((k, i)=>{
  if(k.jenis==="MASUK"){
    kasMasuk += k.jumlah;
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
    kasKeluar += k.jumlah;
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
  totalKasMasuk = kasMasuk;
totalKasKeluar = kasKeluar;
totalSaldoKas = kasMasuk - kasKeluar;

document.getElementById("kasMasuk").innerText = rupiah(totalKasMasuk);
document.getElementById("kasKeluar").innerText = rupiah(totalKasKeluar);
document.getElementById("saldoKas").innerText = rupiah(totalSaldoKas);
  
}
/* FUNGSI EDIT */
function editKas(index){
  const db = getDB();
  const k = db.kas[index];

  tglKas.value = k.tanggal;
  ketKas.value = k.keterangan;
  jenisKas.value = k.jenis;
  jumlahKas.value = k.jumlah;

  editIndex = index;
}

/* SIMPAN KAS */
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
    // TAMBAH
    db.kas.push({ tanggal:tgl, keterangan:ket, jenis, jumlah });
  }else{
    // EDIT
    db.kas[editIndex] = { tanggal:tgl, keterangan:ket, jenis, jumlah };
    editIndex = null;
  }

  saveDB(db);

  tglKas.value = ketKas.value = jumlahKas.value = "";
  loadKas();
}
/* FUNGSI HAPUS*/
function hapusKas(index){
  if(!confirm("Hapus data kas ini?")) return;

  const db = getDB();
  db.kas.splice(index,1);
  saveDB(db);
  loadKas();
}

/* EXPORT PDF */
function exportPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const db = getDB();
  const kas = db.kasDetail || [];

  let kasMasuk = 0;
  let kasKeluar = 0;

  kas.forEach(k=>{
    if(k.jenis === "MASUK") kasMasuk += Number(k.jumlah);
    if(k.jenis === "KELUAR") kasKeluar += Number(k.jumlah);
  });

  const saldo = kasMasuk - kasKeluar;

  doc.setFontSize(16);
  doc.text("LAPORAN KAS KOPERASI", 14, 15);

  doc.setFontSize(11);
  doc.text(`Kas Masuk  : Rp ${kasMasuk.toLocaleString("id-ID")}`, 14, 25);
  doc.text(`Kas Keluar : Rp ${kasKeluar.toLocaleString("id-ID")}`, 14, 32);
  doc.text(`Saldo Kas  : Rp ${saldo.toLocaleString("id-ID")}`, 14, 39);

  const body = [];
  kas.forEach(k=>{
    body.push([
      k.tanggal,
      k.keterangan,
      k.jenis === "MASUK"
        ? "Rp " + Number(k.jumlah).toLocaleString("id-ID")
        : "-",
      k.jenis === "KELUAR"
        ? "Rp " + Number(k.jumlah).toLocaleString("id-ID")
        : "-"
    ]);
  });

  doc.autoTable({
    startY: 50,
    head: [["Tanggal","Keterangan","Masuk","Keluar"]],
    body: body,
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30,144,255], textColor: 255 }
  });

  window.open(doc.output("bloburl"));
}
/* EXPORT WA */
function exportWA(){
  let text = `Rekap Kas\nKas Masuk: ${kasMasuk.innerText}\nKas Keluar: ${kasKeluar.innerText}\nSaldo: ${saldoKas.innerText}\n\n`;
  document.querySelectorAll("#listKas tr").forEach(tr=>{
    const td = tr.querySelectorAll("td");
    text += `${td[0].innerText} | ${td[1].innerText} | ${td[2].innerText} | ${td[3].innerText}\n`;
  });
  window.open("https://wa.me/?text="+encodeURIComponent(text));
}