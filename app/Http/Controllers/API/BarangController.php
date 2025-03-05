<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class BarangController extends Controller
{
    // Function untuk mengambil semua data barang
    public function index()
    {
        $barangs = Barang::all(); // Ambil semua data dari tabel barangs
        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diambil',
            'data' => $barangs
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'stok' => 'required|integer',
            'jumlah_terjual' => 'required|integer',
            'tanggal_transaksi' => 'required|date',
            'jenis_barang' => 'required|string|max:255',
        ]);

        $barang = Barang::create($validatedData);
        return response()->json($barang, 201);
    }

    public function show($id)
    {
        return response()->json(Barang::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $barang = Barang::findOrFail($id);

        $validatedData = $request->validate([
            'nama_barang' => 'sometimes|string|max:255',
            'stok' => 'sometimes|integer',
            'jumlah_terjual' => 'sometimes|integer',
            'tanggal_transaksi' => 'sometimes|date',
            'jenis_barang' => 'sometimes|string|max:255',
        ]);

        $barang->update($validatedData);
        return response()->json($barang);
    }

    public function destroy($id)
    {
        Barang::destroy($id);
        return response()->json(null, 204);
    }
}
