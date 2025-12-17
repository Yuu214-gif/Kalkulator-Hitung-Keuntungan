/**
 * KALKULATOR KEUNTUNGAN - VERSI TOMBOL MANUAL (CLEAN)
 */

// 1. Inisialisasi saat halaman dibuka
window.onload = function() {
    loadData();
};

// 2. Fungsi Tambah Varian (dengan animasi slide down)
function addVarian(nama = "", qty = "", modal = "") {
    const container = document.getElementById('varian-input-container');
    const newRow = document.createElement('div');
    newRow.className = 'varian-item';
    
    newRow.innerHTML = `
        <input type="text" class="nama-barang" placeholder="Nama Barang" value="${nama}" oninput="saveData()">
        <input type="number" class="jumlah-barang" placeholder="0" value="${qty}" oninput="saveData()">
        <input type="number" class="modal-per-pcs" placeholder="Rp" value="${modal}" oninput="saveData()">
        <button type="button" onclick="removeVarian(this)" class="remove-btn">×</button>
    `;
    
    container.appendChild(newRow);
    saveData();
}

// 3. Fungsi Hapus Varian (dengan animasi slide out)
function removeVarian(btn) {
    const row = btn.parentElement;
    row.style.opacity = '0';
    row.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        row.remove();
        saveData(); // Simpan perubahan susunan barang
    }, 300);
}

// 4. LOGIKA UTAMA: Hitung Keuntungan (Hanya jalan pas tombol diklik)
function hitungKeuntungan() {
    // Ambil input utama
    const hargaJualKotor = parseFloat(document.getElementById('hargaJualKotor').value) || 0;
    const voucherSubsidi = parseFloat(document.getElementById('voucherSubsidi').value) || 0;
    const biayaProsesPesanan = parseFloat(document.getElementById('biayaProsesPesanan').value) || 0;
    const persenAdmin = parseFloat(document.getElementById('persenAdmin').value) || 0;

    // A. Hitung Harga Jual Efektif
    const hargaJualEfektif = hargaJualKotor - voucherSubsidi;

    // B. Hitung Modal (Looping semua varian)
    let totalModal = 0;
    document.querySelectorAll('.varian-item').forEach(row => {
        const q = parseFloat(row.querySelector('.jumlah-barang').value) || 0;
        const m = parseFloat(row.querySelector('.modal-per-pcs').value) || 0;
        totalModal += (q * m);
    });

    // C. Hitung Potongan & Laba
    const biayaAdmin = (hargaJualEfektif * persenAdmin) / 100;
    const totalPotongan = biayaAdmin + biayaProsesPesanan;
    const bersihDiterima = hargaJualEfektif - totalPotongan;
    const labaBersih = bersihDiterima - totalModal;

    // D. Update UI dengan animasi bounce
    const resultBox = document.querySelector('.result-box');
    resultBox.classList.remove('updated');
    void resultBox.offsetWidth; // Trigger reflow untuk restart animasi
    resultBox.classList.add('updated');

    const formatRp = (n) => "Rp " + Math.round(n).toLocaleString('id-ID');
    
    document.getElementById('hargaJualEfektif').innerText = formatRp(hargaJualEfektif);
    document.getElementById('totalModal').innerText = formatRp(totalModal);
    document.getElementById('totalPotongan').innerText = formatRp(totalPotongan);
    document.getElementById('penghasilanOtomatis').innerText = formatRp(bersihDiterima);
    document.getElementById('keuntunganBersih').innerText = formatRp(labaBersih);

    // E. Status Untung/Rugi
    const statusMsg = document.getElementById('statusMsg');
    if (labaBersih > 0) {
        statusMsg.innerText = "💰 STATUS: UNTUNG";
        statusMsg.className = "status-msg untung";
    } else if (labaBersih < 0) {
        statusMsg.innerText = "⚠️ STATUS: RUGI";
        statusMsg.className = "status-msg rugi";
    } else {
        statusMsg.innerText = "⚖️ STATUS: IMPAS";
        statusMsg.className = "status-msg";
    }

    // Simpan posisi terakhir saat klik hitung
    saveData();
}

// 5. Fungsi Storage (Save & Load)
function saveData() {
    const varianArray = [];
    document.querySelectorAll('.varian-item').forEach(row => {
        varianArray.push({
            n: row.querySelector('.nama-barang').value,
            q: row.querySelector('.jumlah-barang').value,
            m: row.querySelector('.modal-per-pcs').value
        });
    });

    const dataAplikasi = {
        jual: document.getElementById('hargaJualKotor').value,
        subsidi: document.getElementById('voucherSubsidi').value,
        proses: document.getElementById('biayaProsesPesanan').value,
        admin: document.getElementById('persenAdmin').value,
        listVarian: varianArray
    };

    localStorage.setItem('db_kalkulator_v2', JSON.stringify(dataAplikasi));
}

function loadData() {
    const raw = localStorage.getItem('db_kalkulator_v2');
    if (!raw) {
        addVarian(); 
        return;
    }

    const data = JSON.parse(raw);
    document.getElementById('hargaJualKotor').value = data.jual || 0;
    document.getElementById('voucherSubsidi').value = data.subsidi || 0;
    document.getElementById('biayaProsesPesanan').value = data.proses || 0;
    document.getElementById('persenAdmin').value = data.admin || 0;

    // Load Varian
    const container = document.getElementById('varian-input-container');
    container.innerHTML = ""; 
    if (data.listVarian && data.listVarian.length > 0) {
        data.listVarian.forEach(v => addVarian(v.n, v.q, v.m));
    } else {
        addVarian();
    }
}

// 6. Fungsi Modal Reset (Animasi Bounce)
function resetData() {
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function executeReset() {
    localStorage.removeItem('db_kalkulator_v2');
    document.querySelector('.container').style.opacity = '0';
    setTimeout(() => location.reload(), 300);
}
