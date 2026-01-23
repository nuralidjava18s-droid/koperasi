const { jsPDF } = window.jspdf;

function exportKasPDF(){

  if(!filteredKas || filteredKas.length === 0){
    alert("Tidak ada data untuk diexport");
    return;
  }

  const doc = new jsPDF("p","mm","a4");

  doc.setFontSize(14);
  doc.text("KOPERASI DRIVER ARFA",105,15,{align:"center"});
  doc.setFontSize(10);
  doc.text("Laporan Keuangan",105,21,{align:"center"});
  doc.line(15,25,195,25);

  doc.setFontSize(13);
  doc.text("LAPORAN KAS",105,34,{align:"center"});

  let body = [];
  let masuk = 0;
  let keluar = 0;

  filteredKas.forEach((k,i)=>{
    body.push([
      i+1,
      k.tanggal,
      k.keterangan,
      k.jenis==="MASUK" ? rupiah(k.jumlah) : "-",
      k.jenis==="KELUAR" ? rupiah(k.jumlah) : "-"
    ]);

    if(k.jenis==="MASUK") masuk += Number(k.jumlah);
    if(k.jenis==="KELUAR") keluar += Number(k.jumlah);
  });

  doc.autoTable({
    startY:40,
    head:[["No","Tanggal","Keterangan","Masuk","Keluar"]],
    body:body,
    styles:{fontSize:9},
    headStyles:{fillColor:[30,144,255]}
  });

  let y = doc.lastAutoTable.finalY + 8;

  doc.setFontSize(10);
  doc.text(`Total Masuk : ${rupiah(masuk)}`,15,y);
  doc.text(`Total Keluar : ${rupiah(keluar)}`,15,y+6);
  doc.text(`Saldo Akhir : ${rupiah(masuk-keluar)}`,15,y+12);

  doc.text(
    "Dicetak: " + new Date().toLocaleDateString("id-ID"),
    150,285
  );

  doc.save("laporan_kas_filter.pdf");
}