import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import axios from "../../api/axios";
import {
  getAdminIdCards,
  rejectAdminIdCard,
  verifyAdminIdCard,
} from "../../api/admin.api";
import {
  FiFileText,
  FiX,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiCheck
} from "react-icons/fi";

const statusConfig = {
  PENDING: { cls: "bg-amber-100 text-amber-700", label: "Pending" },
  VERIFIED: { cls: "bg-emerald-100 text-emerald-700", label: "Verified" },
  REJECTED: { cls: "bg-red-100 text-red-600", label: "Rejected" },
};

export default function IDCardVerification() {
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const buildImageUrl = (fileName) => {
    if (!fileName) return null;
    if (fileName.startsWith("http")) return fileName;
    const apiBase = (axios.defaults?.baseURL || "").replace(/\/+api\/?$/i, "");
    return `${apiBase}/uploads/idcards/${fileName}`;
  };

  const loadCards = async () => {
    try {
      setLoading(true);
      setError("");
      const rows = await getAdminIdCards();

      const normalized = rows.map((row) => ({
        id: row.id_card_id,
        studentId: row.student_id,
        student: row.student_name,
        roll: row.roll_no,
        room: row.room_no || "-",
        status: row.verification_status,
        front: buildImageUrl(row.id_front_image),
        back: buildImageUrl(row.id_back_image),
        verifiedBy: row.verified_by_email || null,
        rejectionReason: row.rejection_reason || null,
        submitted: `Record #${row.id_card_id}`,
      }));

      setCards(normalized);
      if (selectedId && !normalized.some((c) => c.id === selectedId)) {
        setSelectedId(null);
      }
    } catch (err) {
      console.error("Failed to load ID cards", err);
      setError(err?.response?.data?.message || "Failed to load ID cards");
    } finally {
      setLoading(false);
    }
  };

  const verifyCard = async (card) => {
    try {
      setActionLoading(true);
      await verifyAdminIdCard(card.studentId);
      await loadCards();
    } catch (err) {
      console.error("Failed to verify ID card", err);
      alert(err?.response?.data?.message || "Failed to verify ID card");
    } finally {
      setActionLoading(false);
    }
  };

  const openReject = (card) => {
    setRejectTarget(card);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    const description = rejectReason.trim();
    if (!description) return;
    try {
      setActionLoading(true);
      await rejectAdminIdCard(rejectTarget.studentId, { description });
      setShowRejectModal(false);
      setRejectTarget(null);
      await loadCards();
    } catch (err) {
      console.error("Failed to reject ID card", err);
      alert(err?.response?.data?.message || "Failed to reject ID card");
    } finally {
      setActionLoading(false);
    }
  };

  const selected = useMemo(
    () => cards.find((c) => c.id === selectedId) || null,
    [cards, selectedId]
  );

  const filtered = useMemo(
    () => (filter === "All" ? cards : cards.filter((c) => c.status === filter)),
    [cards, filter]
  );

  const counts = { All: cards.length, PENDING: 0, VERIFIED: 0, REJECTED: 0 };
  cards.forEach(c => counts[c.status]++);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">ID Card Verification</h2>
        <p className="text-gray-400 text-sm mt-0.5">Review and verify student ID card submissions</p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total", value: counts.All, cls: "bg-teal-50 text-teal-700" },
          { label: "Pending", value: counts.PENDING, cls: "bg-amber-50 text-amber-700" },
          { label: "Verified", value: counts.VERIFIED, cls: "bg-emerald-50 text-emerald-700" },
          { label: "Rejected", value: counts.REJECTED, cls: "bg-red-50 text-red-700" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-4 ${s.cls}`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[["All", counts.All], ["PENDING", counts.PENDING], ["VERIFIED", counts.VERIFIED], ["REJECTED", counts.REJECTED]].map(([key, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === key ? "bg-teal-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"
            }`}
          >
            {key === "All" ? "All" : statusConfig[key]?.label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>{count}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* List */}
        <div className="flex-1 space-y-3">
          {loading && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-sm text-gray-500">
              Loading ID cards...
            </div>
          )}

          {filtered.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedId(card.id)}
              className={`bg-white rounded-2xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                selectedId === card.id ? "border-teal-400 ring-1 ring-teal-200" : "border-gray-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                  {card.student[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-800">{card.student}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusConfig[card.status].cls}`}>
                      {statusConfig[card.status].label}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {card.roll} · Room {card.room} · Submitted {card.submitted}
                  </p>
                  {card.status === "REJECTED" && card.rejectionReason && (
                    <p className="text-red-500 text-xs mt-1 break-words">Reason: {card.rejectionReason}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
              <FiFileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="font-medium">No ID cards found</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">ID Card Preview</h3>
                <button onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-2">
                  {selected.student[0]}
                </div>
                <h4 className="font-bold text-gray-800">{selected.student}</h4>
                <p className="text-gray-400 text-sm">{selected.roll}</p>
                <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-bold ${statusConfig[selected.status].cls}`}>
                  {statusConfig[selected.status].label}
                </span>
              </div>

              {/* ID Card Images placeholder */}
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Front Side</p>
                  <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200 overflow-hidden">
                    {selected.front ? (
                      <img src={selected.front} alt="ID Front" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <FiFileText className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                        <p className="text-xs mt-1">Front Side</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Back Side</p>
                  <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200 overflow-hidden">
                    {selected.back ? (
                      <img src={selected.back} alt="ID Back" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <FiFileText className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                        <p className="text-xs mt-1">Back Side</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-400 mb-4 space-y-1">
                <p className="flex items-center gap-1"><FiCalendar className="w-3.5 h-3.5" /> Submitted: {selected.submitted}</p>
                {selected.verifiedBy && <p className="flex items-center gap-1"><FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Verified by: {selected.verifiedBy}</p>}
                {selected.status === "REJECTED" && selected.rejectionReason && (
                  <p className="flex items-center gap-1 text-red-500"><FiAlertCircle className="w-3.5 h-3.5" /> Reason: {selected.rejectionReason}</p>
                )}
              </div>

              {selected.status === "PENDING" && (
                <div className="space-y-2">
                  <button
                    onClick={() => verifyCard(selected)}
                    disabled={actionLoading}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FiCheck className="w-4 h-4" /> Verify ID Card
                  </button>
                  <button
                    onClick={() => openReject(selected)}
                    disabled={actionLoading}
                    className="w-full py-2.5 bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-600 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FiX className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Reject ID Card</h3>
              <p className="text-sm text-gray-500 mt-1">Provide a reason for rejection</p>
            </div>
            <div className="p-6">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="e.g. Image is blurry, ID card expired..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowRejectModal(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={confirmReject} disabled={!rejectReason.trim() || actionLoading} className="px-5 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
