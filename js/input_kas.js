/* =====================
   KAS - MANUAL (FINAL)
===================== */

function simpanKas(){
  const jenisEl = document.getElementById("jenis");
  const jumlahEl = document.getElementById("jumlah");
  const ketEl    = document.getElementById("keterangan");
  const tglEl    = document.getElementById("tanggal");

  if(!jenisEl.value || !jumlahEl.value || !tglEl.value){
    alert("Jenis, jumlah, dan tanggal wajib diisi");
    return;
  }

  const db = getDB();

  const dataKas = {
    id: "KS" + Date.now(),           // ✅ ID unik
    jenis: jenisEl.value,            // masuk / keluar
    jumlah: Number(jumlahEl.value),
    keterangan: ketEl.value || "-",
    tanggal: tglEl.value
  };

  db.kas.push(dataKas);
  saveDB(db);

  alert("✅ Kas berhasil disimpan");

  jumlahEl.value = "";
  ketEl.value = "";
  tglEl.value = "";

  loadKas();
}

/* =====================
   LOAD KAS (REKAP)
===================== */
function loadKas(){
  const tbody = document.getElementById("listKas");
  if(!tbody) return;

  tbody.innerHTML = "";

  const db = getDB();
  const list = db.kas || [];

  let masuk = 0;
  let keluar = 0;

  if(list.length === 0){
    tbody.innerHTML = `<tr><td colspan="4">Belum ada transaksi kas</td></tr>`;
  }

  list.forEach(k=>{
    if(k.jenis === "masuk") masuk += k.jumlah;
    if(k.jenis === "keluar") keluar += k.jumlah;

    tbody.innerHTML += `
      <tr>
        <td>${k.tanggal}</td>
        <td>${k.keterangan}</td>
        <td>${k.jenis === "masuk" ? rupiah(k.jumlah) : "-"}</td>
        <td>${k.jenis === "keluar" ? rupiah(k.jumlah) : "-"}</td>
      </tr>
    `;
  });

  const saldo = masuk - keluar;

  if(document.getElementById("kasMasuk"))
    kasMasuk.innerText = rupiah(masuk);

  if(document.getElementById("kasKeluar"))
    kasKeluar.innerText = rupiah(keluar);

  if(document.getElementById("saldoKas"))
    saldoKas.innerText = rupiah(saldo);
}

/* =====================
   HELPER (PAKAI SATU SAJA)
===================== */
function rupiah(n){
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

/* =====================
   INIT
===================== */
document.addEventListener("DOMContentLoaded", loadKas);
