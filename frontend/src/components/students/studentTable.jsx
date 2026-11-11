import Icon from "../ui/icon.jsx";

function formatDate(date) {
  if (!date) return "-";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export default function StudentTable({ data, onEdit, onDelete }) {
  return (
    <div className="tabel-bungkus">
      <table>
        <colgroup>
          <col className="kolom-nis" />
          <col className="kolom-nama" />
          <col className="kolom-jurusan" />
          <col className="kolom-tanggal" />
          <col className="kolom-alamat" />
          <col className="kolom-aksi" />
        </colgroup>
        <thead>
          <tr>
            <th>Nomor Induk Siswa (NIS)</th>
            <th>Nama</th>
            <th>Jurusan</th>
            <th>Tanggal lahir</th>
            <th>Alamat</th>
            <th aria-label="Aksi">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student) => (
            <tr key={student.id}>
              <td className="nis">{student.nis}</td>
              <td>
                <strong>{student.nama}</strong>
              </td>
              <td>{student.jurusan}</td>
              <td>{formatDate(student.tanggal_lahir)}</td>
              <td className="alamat">{student.alamat || "-"}</td>
              <td className="aksi">
                <button
                  className="ikon-tombol"
                  onClick={() => onEdit(student)}
                  aria-label={`Ubah ${student.nama}`}
                  title="Ubah"
                >
                  <Icon name="edit" size={16} />
                </button>
                <button
                  className="ikon-tombol bahaya"
                  onClick={() => onDelete(student)}
                  aria-label={`Hapus ${student.nama}`}
                  title="Hapus"
                >
                  <Icon name="trash" size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
