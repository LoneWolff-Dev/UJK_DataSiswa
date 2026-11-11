import { useEffect, useState } from "react";
import Icon from "./components/ui/icon.jsx";
import StudentTable from "./components/students/studentTable.jsx";
import StudentForm from "./components/students/studentForm.jsx";
import { studentApi } from "./services/studentApi.js";

export default function App() {
  const [siswa, setSiswa] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formAwal, setFormAwal] = useState(null); // null = tertutup, {} = tambah, objek = ubah
  const [pesan, setPesan] = useState("");
  const [siswaAkanDihapus, setSiswaAkanDihapus] = useState(null);

  async function muat(kata = q) {
    try {
      setError("");
      setSiswa(await studentApi.list(kata));
    } catch (e) {
      setError("Gagal memuat data. Pastikan server backend sudah berjalan.");
    } finally {
      setLoading(false);
    }
  }

  // Muat ulang saat kata kunci berubah (dengan jeda singkat)
  useEffect(() => {
    const t = setTimeout(() => muat(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  function tampilkanPesan(teks) {
    setPesan(teks);
    setTimeout(() => setPesan(""), 2500);
  }

  async function simpan(data) {
    if (formAwal?.id) {
      await studentApi.update(formAwal.id, data);
      tampilkanPesan("Data siswa disimpan.");
    } else {
      await studentApi.create(data);
      tampilkanPesan("Siswa ditambahkan.");
    }
    setFormAwal(null);
    muat();
  }

  async function konfirmasiHapus() {
    if (!siswaAkanDihapus) return;
    try {
      await studentApi.remove(siswaAkanDihapus.id);
      tampilkanPesan("Siswa dihapus.");
      setSiswaAkanDihapus(null);
      muat();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="halaman">
      <header className="kepala">
        <div className="judul">
          <span className="eyebrow">KELOLA DATA SISWA</span>
          <h1>
            <span className="judul-utama">DATA SISWA</span>
            <span className="judul-sub">SUKAROBOT ACADEMY 2026</span>
          </h1>
        </div>
      </header>

      <label className="pencarian">
        <Icon name="search" />
        <input
          type="search"
          placeholder="Nama, Nomor Induk Siswa, atau Alamat"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Cari siswa"
        />
      </label>

      {error && (
        <div className="galat" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <p className="kosong">Memuat data…</p>
      ) : siswa.length === 0 ? (
        <div className="kosong">
          {q
            ? "Tidak ada siswa yang cocok dengan pencarian."
            : "Belum ada data siswa. Klik “Tambah siswa” untuk memulai."}
        </div>
      ) : (
        <section className="panel">
          <div className="panel-kepala">
            <div className="panel-aksi">
              <span className="jumlah">
                Terdaftar {siswa.length} Siswa Sukarobot Academy
                {q && ` • hasil untuk “${q}”`}
              </span>
              <button className="tombol utama" onClick={() => setFormAwal({})}>
                <Icon name="plus" size={17} /> Tambah siswa
              </button>
            </div>
          </div>
          <StudentTable
            data={siswa}
            onEdit={setFormAwal}
            onDelete={setSiswaAkanDihapus}
          />
        </section>
      )}

      {formAwal && (
        <StudentForm
          initialStudent={formAwal}
          onSave={simpan}
          onCancel={() => setFormAwal(null)}
        />
      )}

      {siswaAkanDihapus && (
        <div
          className="latar"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setSiswaAkanDihapus(null)
          }
        >
          <div className="konfirmasi" role="dialog" aria-modal="true" aria-labelledby="judul-hapus">
            <div className="konfirmasi-ikon">
              <Icon name="trash" size={22} />
            </div>
            <h2 id="judul-hapus">Hapus data siswa?</h2>
            <p>
              Data <strong>{siswaAkanDihapus.nama}</strong> akan dihapus
              permanen dan tidak dapat dikembalikan.
            </p>
            <div className="tombol-form">
              <button
                type="button"
                className="tombol"
                onClick={() => setSiswaAkanDihapus(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="tombol tombol-hapus"
                onClick={konfirmasiHapus}
              >
                <Icon name="trash" size={16} /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {pesan && (
        <div className="toast" role="status">
          {pesan}
        </div>
      )}
    </div>
  );
}
