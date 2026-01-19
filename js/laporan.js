/* =====================
   GLOBAL PDF PREVIEW
===================== */
let lastPDFBlob = null;
let lastPDFUrl  = null;

/* =====================
   FILTER ANGGOTA
===================== */
function loadFilter(){
  const db = getDB();
  const sel = document.getElementById("filterAnggota");
  sel.innerHTML = `<option value="">-- Semua Anggota --</option>`;

  db.anggota.forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   LOAD LAPORAN
===================== */
function loadLaporan(){
  const db = getDB();
  const filter = document.getElementById("filterAnggota").value;

  /* ===== SIMPANAN ===== */
  let totalS = 0;
  const listS = document.getElementById("listSimpanan");
  listS.innerHTML = "";

  db.simpanan
    .filter(s => !filter || s.anggota_id === filter)
    .forEach(s=>{
      const a = db.anggota.find(x=>x.id === s.anggota_id);
      totalS += Number(s.jumlah);

      listS.innerHTML += `
        <tr>
          <td>${a ? a.nama : "-"}</td>
          <td>${s.jenis}</td>
          <td>Rp ${Number(s.jumlah).toLocaleString("id-ID")}</td>
        </tr>
      `;
    });

  document.getElementById("totalSimpanan").innerText =
    "Total Simpanan: Rp " + totalS.toLocaleString("id-ID");

  /* ===== PINJAMAN ===== */
  let totalP = 0;
  const listP = document.getElementById("listPinjaman");
  listP.innerHTML = "";

  db.pinjaman
    .filter(p => !filter || p.anggota_id === filter)
    .forEach(p=>{
      const a = db.anggota.find(x=>x.id === p.anggota_id);
      totalP += Number(p.sisa);

      listP.innerHTML += `
        <tr>
          <td>${a ? a.nama : "-"}</td>
          <td>Rp ${Number(p.jumlah).toLocaleString("id-ID")}</td>
          <td>Rp ${Number(p.sisa).toLocaleString("id-ID")}</td>
          <td>${p.status}</td>
        </tr>
      `;
    });

  document.getElementById("totalPinjaman").innerText =
    "Total Sisa Pinjaman: Rp " + totalP.toLocaleString("id-ID");
}

/* =====================
   PREVIEW SIMPANAN PDF
===================== */
function previewSimpananPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const db = getDB();
  const filter = document.getElementById("filterAnggota").value;

  let y = 10;
  doc.setFontSize(12);
  doc.text("LAPORAN SIMPANAN", 10, y);
  y += 10;

  db.simpanan
    .filter(s => !filter || s.anggota_id === filter)
    .forEach((s,i)=>{
      const a = db.anggota.find(x=>x.id === s.anggota_id);
      doc.setFontSize(10);
      doc.text(
        `${i+1}. ${s.tanggal} | ${a ? a.nama : "-"} | ${s.jenis} | Rp ${Number(s.jumlah).toLocaleString("id-ID")}`,
        10, y
      );
      y += 7;
      if(y > 280){
        doc.addPage();
        y = 10;
      }
    });

  lastPDFBlob = doc.output("blob");
  if(lastPDFUrl) URL.revokeObjectURL(lastPDFUrl);
  lastPDFUrl = URL.createObjectURL(lastPDFBlob);

  document.getElementById("pdfPreview").src = lastPDFUrl;
}

/* =====================
   DOWNLOAD PDF
===================== */
function downloadPDF(){
  if(!lastPDFBlob){
    alert("Preview PDF dulu sebelum download!");
    return;
  }

  const a = document.createElement("a");
  a.href = lastPDFUrl;
  a.download = "laporan_simpanan.pdf";
  a.click();
}

/* =====================
   SIMPANAN → EXCEL
===================== */
function exportSimpananExcel(){
  const db = getDB();
  const filter = document.getElementById("filterAnggota").value;

  const data = db.simpanan
    .filter(s => !filter || s.anggota_id === filter)
    .map(s=>{
      const a = db.anggota.find(x=>x.id === s.anggota_id);
      return {
        Tanggal: s.tanggal,
        Anggota: a ? a.nama : "-",
        Jenis: s.jenis,
        Jumlah: s.jumlah
      };
    });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Simpanan");

  const out = XLSX.write(wb, { bookType:"xlsx", type:"array" });
  const blob = new Blob([out], { type:"application/octet-stream" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "laporan_simpanan.xlsx";
  a.click();
  URL.revokeObjectURL(url);
}
