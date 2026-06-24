import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getAdminStudents } from "../../api/admin.api";
import { FiRefreshCw, FiSearch, FiX, FiCheck, FiXCircle } from "react-icons/fi";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const rows = await getAdminStudents();
      const normalized = rows.map((s) => ({
        id: s.student_id,
        name: s.name,
        roll: s.roll_no,
        email: s.email,
        phone: s.phone || "-",
        dob: s.DOB || "-",
        blood: s.blood_group || "-",
        room: s.room_no || "-",
        status: s.status || "Inactive",
        address: {
          house_no: s.house_no,
          street: s.street,
          area: s.area,
          city: s.city,
          state: s.state,
          pincode: s.pincode,
        },
        hasGuardian: s.guardian_count > 0,
        hasAddress: s.has_address === 1,
        phoneAdded: Boolean(s.phone),
        guardianInfo: s.guardian_info || "-",
        guardianCount: s.guardian_count,
      }));
      setStudents(normalized);
    } catch (err) {
      console.error("Failed to load students", err);
      setError(err?.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.roll.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [students, search]);

  return (
    <AdminLayout>
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
          <p className="text-gray-400 text-sm mt-0.5">{students.length} total students registered</p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <button
          onClick={loadStudents}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md"
        >
          <FiRefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, roll no, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mb-5">
        <div className={`rounded-xl p-4 bg-teal-50 text-teal-700 text-center`}>
          <p className="text-2xl font-black">{students.length}</p>
          <p className="text-xs font-semibold mt-0.5">Total Students</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading && (
            <div className="px-5 py-4 text-sm text-gray-500">Loading students...</div>
          )}

          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500 text-xs font-semibold">
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Roll No</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Guardian</th>
                <th className="px-5 py-3">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => (
                <tr key={s.id} onClick={() => setSelectedStudent(s)} className="hover:bg-teal-50 transition-colors cursor-pointer">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {s.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{s.name}</p>
                        <p className="text-gray-400 text-xs">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-600">{s.roll}</td>
                  <td className="px-5 py-3">
                    {s.phoneAdded ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                        <FiCheck className="w-3.5 h-3.5" /> {s.phone}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        <FiXCircle className="w-3.5 h-3.5" /> No
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {s.hasGuardian ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                        <FiCheck className="w-3.5 h-3.5" /> Added
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        <FiXCircle className="w-3.5 h-3.5" /> No
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {s.hasAddress ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                        <FiCheck className="w-3.5 h-3.5" /> Added
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        <FiXCircle className="w-3.5 h-3.5" /> No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <FiSearch className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="font-medium">No students found</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{selectedStudent.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedStudent.roll}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-800 break-all">{selectedStudent.email}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Phone</p>
                  <p className="text-sm font-medium text-gray-800">{selectedStudent.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">DOB</p>
                  <p className="text-sm font-medium text-gray-800">{selectedStudent.dob}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Blood Group</p>
                  <p className="text-sm font-medium text-gray-800 font-bold">{selectedStudent.blood}</p>
                </div>
              </div>

              {/* Address */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-3">Address</p>
                {selectedStudent.hasAddress ? (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    {selectedStudent.address.house_no && <p><span className="font-semibold text-gray-600">House:</span> {selectedStudent.address.house_no}</p>}
                    {selectedStudent.address.street && <p><span className="font-semibold text-gray-600">Street:</span> {selectedStudent.address.street}</p>}
                    {selectedStudent.address.area && <p><span className="font-semibold text-gray-600">Area:</span> {selectedStudent.address.area}</p>}
                    {selectedStudent.address.city && <p><span className="font-semibold text-gray-600">City:</span> {selectedStudent.address.city}</p>}
                    {selectedStudent.address.state && <p><span className="font-semibold text-gray-600">State:</span> {selectedStudent.address.state}</p>}
                    {selectedStudent.address.pincode && <p><span className="font-semibold text-gray-600">Pincode:</span> {selectedStudent.address.pincode}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-red-600">Not added</p>
                )}
              </div>

              {/* Guardian */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-3">Guardian Info</p>
                {selectedStudent.hasGuardian ? (
                  <div className="bg-gray-50 rounded-xl p-4 text-sm">
                    <p className="text-gray-800 break-words">{selectedStudent.guardianInfo}</p>
                  </div>
                ) : (
                  <p className="text-sm text-red-600">Not added</p>
                )}
              </div>

              {/* Room Status */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-3">Room & Status</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Room</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedStudent.room}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${selectedStudent.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
