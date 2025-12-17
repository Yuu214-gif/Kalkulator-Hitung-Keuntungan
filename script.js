// Fungsi untuk menambah baris input varian baru
function addVarian() {
    const container = document.getElementById('varian-input-container');
    const newDiv = document.createElement('div');
    newDiv.className = 'varian-item';
    newDiv.innerHTML = `
        <input type="text" class="nama-barang" placeholder="OD 25/Warna Merah">
        <input type="number" class="jumlah-barang" placeholder="0" value="0">
        <input type="number" class="modal-per-pcs" placeholder="Rp 890" value="0">
        <button onclick="removeVarian(this)" class="remove-btn">X</button>
    `;
    container.appendChild(newDiv);
}

// Fungsi untuk menghapus baris input varian
function removeVarian(button) {
    const item = button.parentNode;
    item.remove();
}

// Tambahkan varian default saat memuat agar ada 1 baris
window.onload = function() {
    // Pastikan container sudah ada isinya 1, jika belum, tambahkan
    if (document.querySelectorAll('.varian-item').length === 0) {
        addVarian();
    }
};

function hitungKeuntungan() {
    // Ambil data keuangan
    const hargaJualKotor = parseFloat(document.getElementById('hargaJualKotor').value) || 0;
    const voucherSubsidi = parseFloat(document.getElementById('voucherSubsidi').value) || 0; 
    const biayaProsesPesanan = parseFloat(document.getElementById('biayaProsesPesanan').value) || 0; 
    const persenAdmin = parseFloat(document.getElementById('persenAdmin').value) || 0;
    
    // --- Langkah 1: Hitung Harga Jual Kotor Efektif ---
    // Ini adalah dasar perhitungan komisi dan uang yang masuk
    const hargaJualEfektif = hargaJualKotor - voucherSubsidi;

    // --- Langkah 2: Hitung Total Biaya Modal Multi-Varian ---
    let totalModal = 0;
    const varianItems = document.querySelectorAll('.varian-item');
    
    varianItems.forEach(item => {
        const jumlah = parseInt(item.querySelector('.jumlah-barang').value) || 0;
        const modal = parseFloat(item.querySelector('.modal-per-pcs').value) || 0;
        totalModal += (jumlah * modal);
    });
    
    // --- Langkah 3: Hitung Total Potongan ---
    
    // 3a. Hitung Biaya Komisi (Admin Persen) dari Harga Jual Efektif
    const biayaKomisi = (hargaJualEfektif * persenAdmin) / 100;

    // 3b. Hitung Total Potongan (Komisi + Biaya Proses Pesanan)
    const totalPotongan = biayaKomisi + biayaProsesPesanan;

    // 4. Hitung Penghasilan Akhir (Uang Bersih Diterima)
    // Rumus: Harga Jual Efektif - Total Potongan
    const penghasilanAkhirOtomatis = hargaJualEfektif - totalPotongan;

    // 5. Hitung Keuntungan Bersih
    // Rumus: Penghasilan Akhir - Total Modal
    const keuntunganBersih = penghasilanAkhirOtomatis - totalModal;

    // --- Tampilkan Hasil ---

    // Fungsi format Rupiah
    const formatRupiah = (angka) => {
        const sign = angka < 0 ? '-' : '';
        const absoluteAngka = Math.abs(angka);
        const dibulatkan = Math.round(absoluteAngka); 
        return sign + 'Rp ' + dibulatkan.toLocaleString('id-ID');
    };

    // Tampilkan data output
    document.getElementById('hargaJualEfektif').textContent = formatRupiah(hargaJualEfektif);
    document.getElementById('totalModal').textContent = formatRupiah(totalModal);
    document.getElementById('totalPotongan').textContent = formatRupiah(totalPotongan);
    document.getElementById('penghasilanOtomatis').textContent = formatRupiah(penghasilanAkhirOtomatis);
    document.getElementById('keuntunganBersih').textContent = formatRupiah(keuntunganBersih);

    const statusMsg = document.getElementById('statusMsg');
    
    // Tentukan status (Untung/Rugi)
    if (keuntunganBersih > 0) {
        statusMsg.textContent = "Status: Transaksi INI UNTUNG!";
        statusMsg.className = "status-msg untung";
    } else if (keuntunganBersih < 0) {
        statusMsg.textContent = "Status: Transaksi INI RUGI!";
        statusMsg.className = "status-msg rugi";
    } else {
        statusMsg.textContent = "Status: Titik Impas (BEP).";
        statusMsg.className = "status-msg";
    }
}