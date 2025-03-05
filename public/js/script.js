        // Fungsi untuk mereset filter
        function resetDateFilter() {
            document.getElementById('startDate').value = '';
            document.getElementById('endDate').value = '';
            displayData(allData); // Tampilkan semua data
        }

        // Fungsi untuk memfilter data berdasarkan rentang waktu
        function filterByDateRange() {
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;

            if (!startDate || !endDate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Harap pilih rentang waktu yang valid!',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const filteredData = allData.filter(barang => {
                const tanggalTransaksi = new Date(barang.tanggal_transaksi);
                const start = new Date(startDate);
                const end = new Date(endDate);

                // Filter data yang berada di antara startDate dan endDate
                return tanggalTransaksi >= start && tanggalTransaksi <= end;
            });

            displayData(filteredData); // Tampilkan data yang sudah difilter
        }

        // Fungsi untuk menampilkan hasil perbandingan
        function bandingkanJenisBarang(mode) {
            const groupedData = kelompokkanDataByJenisBarang(allData);

            // Ubah objek menjadi array untuk diurutkan
            const dataArray = Object.keys(groupedData).map(jenis_barang => ({
                jenis_barang,
                total_terjual: groupedData[jenis_barang]
            }));

            // Urutkan data berdasarkan total terjual
            if (mode === 'terbanyak') {
                dataArray.sort((a, b) => b.total_terjual - a.total_terjual);
            } else if (mode === 'terendah') {
                dataArray.sort((a, b) => a.total_terjual - b.total_terjual);
            }

            // Ambil hasil teratas
            const hasil = dataArray[0];

            // Tampilkan hasil
            const hasilPerbandingan = document.getElementById('hasilPerbandingan');
            hasilPerbandingan.innerHTML = `
        <div class="alert ${mode === 'terbanyak' ? 'alert-success' : 'alert-warning'}">
            <strong>Jenis Barang ${mode === 'terbanyak' ? 'Terbanyak' : 'Terendah'} Terjual:</strong><br>
            Jenis Barang: ${hasil.jenis_barang}<br>
            Total Terjual: ${hasil.total_terjual}
        </div>
    `;
        }

        // Fungsi untuk mengelompokkan data berdasarkan jenis barang
        function kelompokkanDataByJenisBarang(data) {
            const groupedData = {};

            data.forEach(barang => {
                if (!groupedData[barang.jenis_barang]) {
                    groupedData[barang.jenis_barang] = 0;
                }
                groupedData[barang.jenis_barang] += parseInt(barang.jumlah_terjual);
            });

            return groupedData;
        }

        // Fungsi untuk memfilter data berdasarkan nama barang
        function filterData(data, searchTerm) {
            return data.filter(barang =>
                barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Fungsi untuk mengurutkan data
        function sortData(data, sortBy) {
            switch (sortBy) {
                case 'nama_barang_asc':
                    return data.sort((a, b) => a.nama_barang.localeCompare(b.nama_barang));
                case 'nama_barang_desc':
                    return data.sort((a, b) => b.nama_barang.localeCompare(a.nama_barang));
                case 'tanggal_transaksi_asc':
                    return data.sort((a, b) => new Date(a.tanggal_transaksi) - new Date(b.tanggal_transaksi));
                case 'tanggal_transaksi_desc':
                    return data.sort((a, b) => new Date(b.tanggal_transaksi) - new Date(a.tanggal_transaksi));
                default:
                    return data;
            }
        }

        // Fungsi untuk menampilkan data yang sudah difilter dan diurutkan
        function displayData(data) {
            const tableBody = document.querySelector('#barang-table tbody');
            tableBody.innerHTML = ''; // Kosongkan tabel sebelum mengisi data baru

            data.forEach(barang => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <td>${barang.id}</td>
            <td>${barang.nama_barang}</td>
            <td>${barang.stok}</td>
            <td>${barang.jumlah_terjual}</td>
            <td>${barang.tanggal_transaksi}</td>
            <td>${barang.jenis_barang}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editBarang(${barang.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="hapusBarang(${barang.id})">Hapus</button>
            </td>
        `;
                tableBody.appendChild(row);
            });
        }

        let allData = []; // Variabel untuk menyimpan semua data

        // Event listener untuk input search
        document.getElementById('searchInput').addEventListener('input', function() {
            const searchTerm = this.value;
            const filteredData = filterData(allData, searchTerm);
            const sortBy = document.getElementById('sortSelect').value;
            const sortedData = sortData(filteredData, sortBy);
            displayData(sortedData);
        });

        // Event listener untuk dropdown sort
        document.getElementById('sortSelect').addEventListener('change', function() {
            const sortBy = this.value;
            const searchTerm = document.getElementById('searchInput').value;
            const filteredData = filterData(allData, searchTerm);
            const sortedData = sortData(filteredData, sortBy);
            displayData(sortedData);
        });

        // Function untuk mengambil data dari API
        async function fetchBarangs() {
            try {
                const response = await fetch('http://localhost:8000/api/barangs');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                allData = data.data; // Simpan data ke variabel allData
                displayData(allData); // Tampilkan data awal
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Gagal memuat data. Silakan coba lagi.',
                    confirmButtonText: 'OK'
                });
            }
        }

        // Function untuk menambah data
        document.getElementById('form-tambah-barang').addEventListener('submit', async function(e) {
            e.preventDefault();

            const data = {
                nama_barang: document.getElementById('nama_barang').value,
                stok: document.getElementById('stok').value,
                jumlah_terjual: document.getElementById('jumlah_terjual').value,
                tanggal_transaksi: document.getElementById('tanggal_transaksi').value,
                jenis_barang: document.getElementById('jenis_barang').value,
            };

            try {
                const response = await fetch('http://localhost:8000/api/barangs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data berhasil ditambahkan.',
                    confirmButtonText: 'OK'
                });
                fetchBarangs(); // Perbarui tabel
                document.getElementById('form-tambah-barang').reset(); // Reset form
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Gagal menambahkan data. Silakan coba lagi.',
                    confirmButtonText: 'OK'
                });
            }
        });

        // Function untuk mengedit data
        async function editBarang(id) {
            try {
                // Mengambil data dari server (GET)
                const response = await fetch(`http://localhost:8000/api/barangs/${id}`, {
                    method: 'PUT', // Metode GET untuk mengambil data
                    headers: {
                        'Content-Type': 'application/json',
                        // Jika API memerlukan token atau autentikasi, tambahkan header Authorization
                        // 'Authorization': 'Bearer ' + token
                    }
                });

                // Cek jika respons tidak OK
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Parse data JSON
                const data = await response.json();

                // Isi form edit dengan data yang diterima
                document.getElementById('update_id').value = data.id;
                document.getElementById('update_nama_barang').value = data.nama_barang;
                document.getElementById('update_stok').value = data.stok;
                document.getElementById('update_jumlah_terjual').value = data.jumlah_terjual;
                document.getElementById('update_tanggal_transaksi').value = data.tanggal_transaksi;
                document.getElementById('update_jenis_barang').value = data.jenis_barang;

                // Tampilkan modal
                const editModal = new bootstrap.Modal(document.getElementById('editModal'));
                editModal.show();
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Gagal memuat data untuk edit. Silakan coba lagi.',
                    confirmButtonText: 'OK'
                });
            }
        }

        // Menangani submit form update
        document.getElementById('form-update-barang').addEventListener('submit', async function(e) {
            e.preventDefault(); // Mencegah form submit default

            // Ambil data dari form
            const id = document.getElementById('update_id').value;
            const updatedData = {
                nama_barang: document.getElementById('update_nama_barang').value,
                stok: document.getElementById('update_stok').value,
                jumlah_terjual: document.getElementById('update_jumlah_terjual').value,
                tanggal_transaksi: document.getElementById('update_tanggal_transaksi').value,
                jenis_barang: document.getElementById('update_jenis_barang').value,
            };

            try {
                // Kirim data ke server (PUT atau PATCH)
                const response = await fetch(`http://localhost:8000/api/barangs/${id}`, {
                    method: 'PUT', // Metode PUT untuk mengupdate data
                    headers: {
                        'Content-Type': 'application/json',
                        // Jika API memerlukan token atau autentikasi, tambahkan header Authorization
                        // 'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(updatedData), // Kirim data yang di-update
                });

                // Cek jika respons tidak OK
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Parse data JSON
                const result = await response.json();

                // Tampilkan pesan sukses
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data berhasil diupdate.',
                    confirmButtonText: 'OK'
                });

                // Perbarui tabel setelah data diupdate
                fetchBarangs();

                // Sembunyikan modal
                const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
                editModal.hide();
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Gagal mengupdate data. Silakan coba lagi.',
                    confirmButtonText: 'OK'
                });
            }
        });

        // Function untuk menghapus data
        async function hapusBarang(id) {
            const result = await Swal.fire({
                title: 'Apakah Anda yakin?',
                text: "Data akan dihapus secara permanen!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            });

            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8000/api/barangs/${id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Data berhasil dihapus.',
                        confirmButtonText: 'OK'
                    });
                    fetchBarangs(); // Perbarui tabel
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: 'Gagal menghapus data. Silakan coba lagi.',
                        confirmButtonText: 'OK'
                    });
                }
            }
        }

        // Muat data saat halaman pertama kali dimuat
        fetchBarangs();
