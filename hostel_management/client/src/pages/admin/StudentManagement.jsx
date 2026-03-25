import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

const mockStudents = [
  { id: 1, name: "Rahul Sharma", roll: "CS2101", email: "rahul@college.edu", gender: "MALE", room: "A-201", blood: "B+", phone: "9876543210", status: "Active" },
  { id: 2, name: "Priya Nair", roll: "CS2102", email: "priya@college.edu", gender: "FEMALE", room: "C-104", blood: "O+", phone: "9876543211", status: "Active" },
  { id: 3, name: "Amit Verma", roll: "EC2201", email: "amit@college.edu", gender: "MALE", room: "B-310", blood: "A+", phone: "9876543212", status: "Active" },
  { id: 4, name: "Sneha Kulkarni", roll: "ME2301", email: "sneha@college.edu", gender: "FEMALE", room: "C-405", blood: "AB+", phone: "9876543213", status: "Active" },
  { id: 5, name: "Karan Singh", roll: "CS2103", email: "karan@college.edu", gender: "MALE", room: "A-102", blood: "B-", phone: "9876543214", status: "Inactive" },
  { id: 6, name: "Meera Pillai", roll: "IT2201", email: "meera@college.edu", gender: "FEMALE", room: "C-206", blood: "O-", phone: "9876543215", status: "Active" },
];

export default function StudentManagement() {
  const [students, setStudents] = useState(mockStudents);
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("ALL");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchGender = filterGender === "ALL" || s.gender === filterGender;
    return matchSearch && matchGender;
  });

  return (
    <AdminLayout>
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
          <p className="text-gray-400 text-sm mt-0.5">{students.length} total students registered</p>
        </div>
        <button
          onClick={() => { setSelectedStudent(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md"
        >
          <span>➕</span> Add Student
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
            <span className="absolute left-3 top-3 text-gray-400">🔎</span>
          </div>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          >
            <option value="ALL">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: "Total", value: students.length, color: "bg-teal-50 text-teal-700" },
          { label: "Male", value: students.filter(s => s.gender === "MALE").length, color: "bg-blue-50 text-blue-700" },
          { label: "Female", value: students.filter(s => s.gender === "FEMALE").length, color: "bg-pink-50 text-pink-700" },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500 text-xs font-semibold">
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Roll No</th>
                <th className="px-5 py-3">Gender</th>
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3">Blood</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-teal-50 transition-colors">
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
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.gender === "MALE" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}>
                      {s.gender}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{s.room}</td>
                  <td className="px-5 py-3">
                    <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs font-bold">{s.blood}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{s.phone}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedStudent(s); setShowModal(true); }}
                        className="p-1.5 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                        title="Edit"
                      >✏️</button>
                      <button
                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🔍</p>
              <p className="font-medium">No students found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                {selectedStudent ? "Edit Student" : "Add New Student"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", key: "name", type: "text" },
                { label: "Roll Number", key: "roll", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Phone", key: "phone", type: "tel" },
                { label: "Date of Birth", key: "dob", type: "date" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    defaultValue={selectedStudent?.[f.key] || ""}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Gender</label>
                <select defaultValue={selectedStudent?.gender || ""} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="NOT PREFER TO SAY">Not Prefer to Say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Blood Group</label>
                <select defaultValue={selectedStudent?.blood || ""} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                  {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors">
                {selectedStudent ? "Save Changes" : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
