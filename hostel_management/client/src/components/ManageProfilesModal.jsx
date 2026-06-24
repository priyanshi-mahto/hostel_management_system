import React, { useEffect, useMemo, useState } from "react";
import { getVisitorProfiles } from "../api/visitor.api";
import { FiUser } from "react-icons/fi";

const ManageProfilesModal = ({ onClose }) => {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const data = await getVisitorProfiles();
        setProfiles(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadProfiles();
  }, []);

  const filteredProfiles = useMemo(() => {
    const query = search.toLowerCase();
    return profiles.filter((profile) =>
      [profile.name, profile.relation, profile.email, profile.phone]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [profiles, search]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Manage Visitor Profiles</h2>

        <input
          type="text"
          placeholder="Search profiles by name, relation, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredProfiles.length === 0 ? (
          <div className="empty-state small">
            <div className="icon"><FiUser className="w-8 h-8 text-gray-300 mx-auto" /></div>
            <h4>No visitor profiles found</h4>
            <p>You have not added any visitor profiles yet.</p>
          </div>
        ) : (
          <div className="section">
            {filteredProfiles.map((profile) => (
              <div key={profile.visitor_id} className="empty-box">
                <strong>{profile.name}</strong>
                <p>{profile.relation}</p>
                <p>{profile.phone}</p>
                {profile.email && <p>{profile.email}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ManageProfilesModal;