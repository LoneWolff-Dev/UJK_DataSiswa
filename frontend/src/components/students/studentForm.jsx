import { useState } from "react";
import Icon from "../ui/icon.jsx";

const EMPTY_STUDENT = {
  nis: "",
  nama: "",
  jurusan: "IPA",
  tanggal_lahir: "",
  alamat: "",
};

export default function StudentForm({ initialStudent, onSave, onCancel }) {
  const isEditing = Boolean(initialStudent.id);
  const [values, setValues] = useState({
    ...EMPTY_STUDENT,
    ...Object.fromEntries(
      Object.entries(initialStudent).map(([key, value]) => [key, value ?? ""]),
    ),
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateValue = (key) => (event) => {
    setValues({ ...values, [key]: event.target.value });
  };

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(values);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div
      className="latar"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onCancel()
      }
    >
      <form className="modal" onSubmit={submit}>
        <div className="modal-kepala">
          <div className="modal-ikon">
            <Icon name={isEditing ? "edit" : "plus"} />
          </div>
          <div>
            <h2>{isEditing ? "Ubah data siswa" : "Tambah siswa"}</h2>
            <p>Lengkapi informasi siswa di bawah ini.</p>
          </div>
          <button
            type="button"
            className="ikon-tombol"
            onClick={onCancel}
            aria-label="Tutup form"
            title="Tutup"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="baris">
          <label>
            Nomor Induk Siswa (NIS)
            <input
              value={values.nis}
              onChange={updateValue("nis")}
              maxLength="30"
              required
              autoFocus
            />
          </label>
          <label>
            Tanggal lahir
            <span className="input-ikon">
              <Icon name="calendar" size={16} />
              <input
                type="date"
                value={values.tanggal_lahir}
                onChange={updateValue("tanggal_lahir")}
              />
            </span>
          </label>
        </div>
        <label>
          Nama lengkap
          <input
            value={values.nama}
            onChange={updateValue("nama")}
            maxLength="100"
            required
          />
        </label>
        <label>
          Jurusan
          <select value={values.jurusan} onChange={updateValue("jurusan")} required>
            <option value="IPA">IPA</option>
            <option value="IPS">IPS</option>
          </select>
        </label>
        <label>
          Alamat
          <span className="input-ikon input-ikon-atas">
            <Icon name="mapPin" size={16} />
            <textarea
              rows="3"
              value={values.alamat}
              onChange={updateValue("alamat")}
              maxLength="65535"
            />
          </span>
        </label>
        {error && (
          <div className="galat" role="alert">
            {error}
          </div>
        )}
        <div className="tombol-form">
          <button type="button" className="tombol" onClick={onCancel}>
            Batal
          </button>
          <button type="submit" className="tombol utama" disabled={saving}>
            <Icon name="save" size={16} /> {saving ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
