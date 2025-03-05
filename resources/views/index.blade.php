<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Barang</title>
    <!-- Sertakan Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- SweetAlert2 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
</head>

<body>
    <div class="container mt-5">
        <h1 class="text-center">Daftar Barang</h1>

        <h3>Data Transaksi terbanyak terjual atau terendah</h3>
        <!-- Tambahkan Tombol untuk Perbandingan -->
        <div class="row mb-3">
            <div class="col-md-6">
                <button class="btn btn-info" onclick="bandingkanJenisBarang('terbanyak')">Lihat Jenis Barang Terbanyak
                    Terjual</button>
            </div>
            <div class="col-md-6">
                <button class="btn btn-warning" onclick="bandingkanJenisBarang('terendah')">Lihat Jenis Barang Terendah
                    Terjual</button>
            </div>
        </div>

        <!-- Tambahkan Elemen untuk Menampilkan Hasil Perbandingan -->
        <div id="hasilPerbandingan" class="mt-3"></div><br>

        <h3>Rentang Waktu Transaksi terbanyak terjual atau terendah</h3>
        <!-- Tambahkan Input untuk Rentang Waktu -->
        <div class="row mb-3">
            <div class="col-md-3">
                <label for="startDate">Tanggal Mulai</label>
                <input type="date" id="startDate" class="form-control">
            </div>
            <div class="col-md-3">
                <label for="endDate">Tanggal Selesai</label>
                <input type="date" id="endDate" class="form-control">
            </div>
            <div class="col-md-3">
                <button class="btn btn-primary mt-4" onclick="filterByDateRange()">Filter Rentang Waktu</button>
            </div>
            <div class="col-md-3">
                <button class="btn btn-secondary mt-4" onclick="resetDateFilter()">Reset Filter</button>
            </div>
        </div><br>

        <h3>Fitur pencarian berdasarkan nama barang, tanggal transaksi dan mengurutkan nama</h3>
        <!-- Tambahkan Input Search dan Dropdown Sorting -->
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" id="searchInput" class="form-control" placeholder="Cari berdasarkan nama barang...">
            </div>
            <div class="col-md-6">
                <select id="sortSelect" class="form-select">
                    <option value="">Urutkan berdasarkan...</option>
                    <option value="nama_barang_asc">Nama Barang (A-Z)</option>
                    <option value="nama_barang_desc">Nama Barang (Z-A)</option>
                    <option value="tanggal_transaksi_asc">Tanggal Transaksi (Terlama)</option>
                    <option value="tanggal_transaksi_desc">Tanggal Transaksi (Terbaru)</option>
                </select>
            </div>
        </div><br>

        <table class="table table-striped table-bordered" id="barang-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama Barang</th>
                    <th>Stok</th>
                    <th>Jumlah Terjual</th>
                    <th>Tanggal Transaksi</th>
                    <th>Jenis Barang</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <!-- Data akan diisi oleh JavaScript -->
            </tbody>
        </table><br>

        <!-- Form untuk menambah data -->
        <form id="form-tambah-barang" class="mb-3">
            <h3>Tambah Barang</h3>
            <div class="mb-3">
                <label for="nama_barang" class="form-label">Nama Barang</label>
                <input type="text" class="form-control" id="nama_barang" required>
            </div>
            <div class="mb-3">
                <label for="stok" class="form-label">Stok</label>
                <input type="number" class="form-control" id="stok" required>
            </div>
            <div class="mb-3">
                <label for="jumlah_terjual" class="form-label">Jumlah Terjual</label>
                <input type="number" class="form-control" id="jumlah_terjual" required>
            </div>
            <div class="mb-3">
                <label for="tanggal_transaksi" class="form-label">Tanggal Transaksi</label>
                <input type="date" class="form-control" id="tanggal_transaksi" required>
            </div>
            <div class="mb-3">
                <label for="jenis_barang" class="form-label">Jenis Barang</label>
                <input type="text" class="form-control" id="jenis_barang" required>
            </div>
            <button type="submit" class="btn btn-primary">Tambah Barang</button>
        </form>
    </div>

    <!-- Modal untuk Edit Data -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editModalLabel">Edit Barang</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Form untuk mengupdate data -->
                    <form id="form-update-barang">
                        <input type="hidden" id="update_id">
                        <div class="mb-3">
                            <label for="update_nama_barang" class="form-label">Nama Barang</label>
                            <input type="text" class="form-control" id="update_nama_barang" required>
                        </div>
                        <div class="mb-3">
                            <label for="update_stok" class="form-label">Stok</label>
                            <input type="number" class="form-control" id="update_stok" required>
                        </div>
                        <div class="mb-3">
                            <label for="update_jumlah_terjual" class="form-label">Jumlah Terjual</label>
                            <input type="number" class="form-control" id="update_jumlah_terjual" required>
                        </div>
                        <div class="mb-3">
                            <label for="update_tanggal_transaksi" class="form-label">Tanggal Transaksi</label>
                            <input type="date" class="form-control" id="update_tanggal_transaksi" required>
                        </div>
                        <div class="mb-3">
                            <label for="update_jenis_barang" class="form-label">Jenis Barang</label>
                            <input type="text" class="form-control" id="update_jenis_barang" required>
                        </div>
                        <button type="submit" class="btn btn-warning">Update Barang</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Sertakan Bootstrap JavaScript dan dependensi -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
    <!-- SweetAlert2 JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- Sertakan file JavaScript eksternal -->
    <script src="{{ asset('js/script.js') }}"></script>
</body>

</html>
