import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile, changeMyPassword, logoutUser } from "../../api/account";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../api/constants";
import ImagePreviewModal from "../../components/ImagePreviewModal";

function SettingsPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: "",
    office: "",
    bio: "",
  });
  const [newPhoto, setNewPhoto] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await getMyProfile();
      setProfile(res.data);
      setProfileForm({
        first_name: res.data.first_name || "",
        last_name: res.data.last_name || "",
        phone_number: res.data.phone_number || "",
        date_of_birth: res.data.date_of_birth || "",
        office: res.data.office || "",
        bio: res.data.bio || "",
      });
    } catch {
      setProfileError("Unable to load your profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setSavingProfile(true);
    try {
      const data = new FormData();
      data.append("first_name", profileForm.first_name);
      data.append("last_name", profileForm.last_name);
      data.append("phone_number", profileForm.phone_number);
      data.append("date_of_birth", profileForm.date_of_birth);
      data.append("office", profileForm.office);
      data.append("bio", profileForm.bio);
      if (newPhoto) data.append("passport_photo", newPhoto);

      const res = await updateMyProfile(data);
      setProfile(res.data);
      setProfileSuccess("Profile updated successfully.");
      setEditMode(false);
      setNewPhoto(null);
    } catch (err) {
      const backendData = err.response?.data;
      if (backendData) {
        const firstError = Object.values(backendData)[0];
        setProfileError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setProfileError("Unable to save changes.");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const openPasswordModal = () => {
    setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
    setPasswordError("");
    setPasswordSuccess("");
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    if (changingPassword) return;
    setShowPasswordModal(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.current_password.trim()) {
      setPasswordError("Current password is required.");
      return;
    }
    if (!passwordForm.new_password.trim()) {
      setPasswordError("New password is required.");
      return;
    }
    if (!passwordForm.confirm_password.trim()) {
      setPasswordError("Please confirm your new password.");
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordForm.new_password.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    setChangingPassword(true);
    try {
      await changeMyPassword(passwordForm);
      setPasswordSuccess("Password changed successfully.");
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
      setTimeout(() => setShowPasswordModal(false), 1200);
    } catch (err) {
      const backendData = err.response?.data;
      if (backendData) {
        const firstError = Object.values(backendData)[0];
        setPasswordError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setPasswordError("Unable to change password.");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    const refreshToken =
      localStorage.getItem(REFRESH_TOKEN) || sessionStorage.getItem(REFRESH_TOKEN);
    try {
      if (refreshToken) await logoutUser(refreshToken);
    } catch {
      // proceed with local cleanup regardless
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    }
  };

  const rowStyle = {
    borderBottom: "1px solid #eee",
    padding: "1rem 0",
  };

  if (loadingProfile) {
    return <p className="text-muted">Loading settings...</p>;
  }

  if (profileError && !profile) {
    return <div className="alert alert-danger">{profileError}</div>;
  }

  return (
    <div className="w-100 mx-auto" style={{ maxWidth: "500px" }}>
      <h3 className="text-navy fw-bold mb-4">Settings</h3>

      {profileSuccess && <div className="alert alert-success py-2 small">{profileSuccess}</div>}
      {profileError && <div className="alert alert-danger py-2 small">{profileError}</div>}

      {/* Profile photo — clickable to preview */}
      <div className="text-center py-4" style={{ borderBottom: "1px solid #eee" }}>
        <img
          src={profile.passport_photo}
          alt="Profile"
          onClick={() => setShowPhotoPreview(true)}
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />
        <div className="fw-bold text-navy mt-3">
          {profile.first_name} {profile.last_name}
        </div>
        <div className="small text-muted">{profile.email}</div>
      </div>

      {!editMode ? (
        <>
          <div style={rowStyle}>
            <div className="text-muted" style={{ fontSize: "0.75rem" }}>Phone</div>
            <div>{profile.phone_number}</div>
          </div>
          <div style={rowStyle}>
            <div className="text-muted" style={{ fontSize: "0.75rem" }}>Date of Birth</div>
            <div>{profile.date_of_birth}</div>
          </div>
          {profile.office && (
            <div className="py-2 border-bottom">
              <div className="text-muted" style={{ fontSize: "0.75rem" }}>Office</div>
              <div>{profile.office}</div>
            </div>
          )}
          {profile.bio && (
            <div className="py-2 border-bottom">
              <div className="text-muted" style={{ fontSize: "0.75rem" }}>Bio</div>
              <div>{profile.bio}</div>
            </div>
          )}
          <div style={rowStyle}>
            <div className="text-muted" style={{ fontSize: "0.75rem" }}>Status</div>
            <span className={`status-pill ${profile.is_active ? "status-approved" : "status-pending"}`}>
              {profile.is_active ? "Active" : "Pending"}
            </span>
          </div>

          <div style={rowStyle} role="button" onClick={() => setEditMode(true)}>
            <div className="fw-semibold text-navy">Edit Profile</div>
          </div>

          <div style={rowStyle} role="button" onClick={openPasswordModal}>
            <div className="fw-semibold text-navy">Change Password</div>
            <div className="small text-muted">Update your account password</div>
          </div>

          <div style={rowStyle} role="button" onClick={handleLogout}>
            <div className="fw-semibold text-danger">Log Out</div>
          </div>
        </>
      ) : (
        <form onSubmit={handleProfileSave} className="pt-3">
          <div className="mb-3 text-center">
            <img
              src={newPhoto ? URL.createObjectURL(newPhoto) : profile.passport_photo}
              alt="Preview"
              style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
            />
            <input
              type="file"
              accept="image/*"
              className="form-control form-control-sm mt-2"
              onChange={(e) => setNewPhoto(e.target.files[0])}
            />
          </div>
          <div className="mb-3">
            <label className="small text-muted d-block mb-1">First Name</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={profileForm.first_name}
              onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
              disabled={savingProfile}
              required
            />
          </div>
          <div className="mb-3">
            <label className="small text-muted d-block mb-1">Last Name</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={profileForm.last_name}
              onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
              disabled={savingProfile}
              required
            />
          </div>
          <div className="mb-3">
            <label className="small text-muted d-block mb-1">Phone Number</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={profileForm.phone_number}
              onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
              disabled={savingProfile}
              required
            />
          </div>
          <div className="mb-4">
            <label className="small text-muted d-block mb-1">Date of Birth</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={profileForm.date_of_birth}
              onChange={(e) => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
              disabled={savingProfile}
              required
            />
          </div>

          <div className="mb-2">
            <label className="small text-muted d-block mb-1">Office</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="e.g. Research & Publications"
              value={profileForm.office}
              onChange={(e) => setProfileForm({ ...profileForm, office: e.target.value })}
              disabled={savingProfile}
            />
          </div>
          <div className="mb-4">
            <label className="small text-muted d-block mb-1">Bio</label>
            <textarea
              className="form-control form-control-sm"
              rows={3}
              placeholder="A short bio about yourself..."
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              disabled={savingProfile}
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-navy btn-sm flex-grow-1" disabled={savingProfile}>
              {savingProfile ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm flex-grow-1"
              onClick={() => {
                setEditMode(false);
                setNewPhoto(null);
              }}
              disabled={savingProfile}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Photo preview modal */}
      {showPhotoPreview && (
        <ImagePreviewModal
          show={showPhotoPreview}
          imageUrl={profile.passport_photo}
          title={`${profile.first_name} ${profile.last_name}`}
          onClose={() => setShowPhotoPreview(false)}
        />
      )}

      {/* Change Password modal */}
      {showPasswordModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(6, 21, 48, 0.5)", zIndex: 1060 }}
          onClick={closePasswordModal}
        >
          <div
            className="bg-white rounded p-4"
            style={{ width: "90%", maxWidth: "380px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-navy mb-0">Change Password</h6>
              <button type="button" className="btn-close" onClick={closePasswordModal} disabled={changingPassword} />
            </div>

            {passwordSuccess && <div className="alert alert-success py-2 small">{passwordSuccess}</div>}
            {passwordError && <div className="alert alert-danger py-2 small">{passwordError}</div>}

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-2">
                <label className="small text-muted d-block mb-1">Current Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  disabled={changingPassword}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="small text-muted d-block mb-1">New Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  disabled={changingPassword}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="small text-muted d-block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  disabled={changingPassword}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-navy btn-sm flex-grow-1" disabled={changingPassword}>
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm flex-grow-1"
                  onClick={closePasswordModal}
                  disabled={changingPassword}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;