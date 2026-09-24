import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowDownToLine, ArrowLeft, GraduationCap, LogOut, RefreshCw, Search, ShieldCheck, Users, PanelsTopLeft, Mail, Save, UserRound, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import WebsiteContentManager from "../components/WebsiteContentManager";
import { API_BASE_URL } from "../config/api";

const API = API_BASE_URL;
const statuses = ["New", "Contacted", "Visit Scheduled", "Admitted", "Closed"];

function Dashboard() {
  const [token, setToken] = useState(() => localStorage.getItem("stips-admin-token"));
  const [students, setStudents] = useState([]);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All applications");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [workspace, setWorkspace] = useState("admissions");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderConfigured, setSenderConfigured] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsNotice, setSettingsNotice] = useState("");
  const [adminProfile, setAdminProfile] = useState({ name: "", email: "" });
  const [profileForm, setProfileForm] = useState({ name: "", email: "", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileNotice, setProfileNotice] = useState("");

  const fetchStudents = useCallback(async (activeToken = token) => {
    if (!activeToken) return;
    setBusy(true);
    setError("");
    try {
      const response = await axios.get(`${API}/students`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      setStudents(response.data);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem("stips-admin-token");
        setToken(null);
      }
      setError(requestError.response?.data?.msg || "Could not connect to the school server. Please try again.");
    } finally {
      setBusy(false);
    }
  }, [token]);

  useEffect(() => { if (token) fetchStudents(token); }, [token, fetchStudents]);

  useEffect(() => {
    if (!token || workspace !== "notifications") return;
    axios.get(`${API}/admin/notification-settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => { setRecipientEmail(data.recipientEmail || ""); setSenderConfigured(data.senderConfigured); setSettingsNotice(""); })
      .catch((requestError) => setError(requestError.response?.data?.msg || "Could not load email settings."));
  }, [token, workspace]);

  useEffect(() => {
    if (!token || workspace !== "profile") return;
    axios.get(`${API}/admin/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        setAdminProfile(data);
        setProfileForm((current) => ({ ...current, name: data.name, email: data.email }));
        setProfileNotice("");
      })
      .catch((requestError) => setError(requestError.response?.data?.msg || "Could not load admin profile."));
  }, [token, workspace]);

  useEffect(() => {
    document.title = "Admin Portal | ST.IPS";
    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow";
    return () => robots.remove();
  }, []);

  const visibleStudents = useMemo(() => students.filter((student) => {
    const matchesFilter = filter === "All applications" || (student.status || "New") === filter;
    const searchValue = `${student.name} ${student.email} ${student.phone} ${student.classApplied}`.toLowerCase();
    return matchesFilter && searchValue.includes(query.toLowerCase());
  }), [students, filter, query]);

  const login = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await axios.post(`${API}/admin/login`, credentials);
      localStorage.setItem("stips-admin-token", response.data.token);
      setToken(response.data.token);
      setCredentials({ email: "", password: "" });
    } catch (requestError) {
      setError(requestError.response?.data?.msg || "Could not sign in. Check your details and server connection.");
    } finally {
      setBusy(false);
    }
  };

  const updateStatus = async (student, status) => {
    try {
      const response = await axios.patch(`${API}/students/${student._id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents((current) => current.map((item) => item._id === student._id ? response.data : item));
    } catch (requestError) {
      setError(requestError.response?.data?.msg || "Could not update the application.");
    }
  };

  const saveNotificationSettings = async (event) => {
    event.preventDefault();
    setSettingsSaving(true);
    setSettingsNotice("");
    setError("");
    try {
      const { data } = await axios.put(`${API}/admin/notification-settings`, { recipientEmail }, { headers: { Authorization: `Bearer ${token}` } });
      setRecipientEmail(data.recipientEmail);
      setSenderConfigured(data.senderConfigured);
      setSettingsNotice("Notification email saved.");
    } catch (requestError) {
      setError(requestError.response?.data?.msg || "Could not save email settings.");
    } finally {
      setSettingsSaving(false);
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setError("The new password and confirmation do not match.");
      return;
    }
    setProfileSaving(true);
    setProfileNotice("");
    setError("");
    try {
      const { data } = await axios.patch(`${API}/admin/profile`, {
        name: profileForm.name,
        email: profileForm.email,
        currentPassword: profileForm.currentPassword,
        newPassword: profileForm.newPassword,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setAdminProfile(data);
      setProfileForm({ ...data, currentPassword: "", newPassword: "", confirmPassword: "" });
      setProfileNotice("Admin profile updated successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.msg || "Could not save admin profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const deleteApplication = async (student) => {
    if (!window.confirm(`Permanently remove the application from ${student.name}?`)) return;
    try {
      await axios.delete(`${API}/students/${student._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setStudents((current) => current.filter((item) => item._id !== student._id));
    } catch (requestError) {
      setError(requestError.response?.data?.msg || "Could not remove the application.");
    }
  };

  const exportCsv = () => {
    const fields = ["name", "email", "phone", "classApplied", "status", "createdAt", "message"];
    const quote = (value) => {
      const text = String(value ?? "");
      const safeText = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
      return `"${safeText.replaceAll('"', '""')}"`;
    };
    const csv = [fields.join(","), ...visibleStudents.map((student) => fields.map((field) => quote(student[field] || (field === "status" ? "New" : ""))).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "stips-admission-applications.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const logout = () => {
    localStorage.removeItem("stips-admin-token");
    setToken(null);
        setStudents([]);
    setAdminProfile({ name: "", email: "" });
  };

  if (!token) return (
    <main className="admin-login-shell">
      <div className="admin-login-art">
        <div className="admin-login-brand"><span className="admin-crest">S</span><span>ST.IPS <small>STAFF PORTAL</small></span></div>
        <div className="admin-art-copy"><p className="admin-eyebrow">SCHOOL ADMINISTRATION</p><h1>Everything you need to support every learner.</h1><p>Manage admission enquiries with care, clarity and confidence.</p></div>
        <span className="admin-art-note">Rajnagar · Azizpur · Agra</span>
      </div>
      <section className="admin-login-card">
        <Link to="/" className="admin-back-link"><ArrowLeft size={16}/> Back to website</Link>
        <div className="admin-login-icon"><ShieldCheck size={24}/></div>
        <p className="admin-eyebrow">WELCOME BACK</p>
        <h2>Sign in to your portal</h2>
        <p className="admin-login-hint">Use your school administrator account to continue.</p>
        {error && <div className="admin-error" role="alert">{error}</div>}
        <form onSubmit={login} className="admin-form">
          <label htmlFor="admin-email">Email address</label>
          <input id="admin-email" type="email" autoComplete="username" placeholder="admin@school.edu" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} required />
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" autoComplete="current-password" placeholder="Enter your password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} required />
          <button className="admin-primary-button" disabled={busy}>{busy ? "Signing in…" : "Sign in securely"}</button>
        </form>
        <p className="admin-secure-note"><ShieldCheck size={15}/> Protected access for authorised school staff</p>
      </section>
    </main>
  );

  const newCount = students.filter((student) => !student.status || student.status === "New").length;
  const admittedCount = students.filter((student) => student.status === "Admitted").length;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar" aria-label="Administration workspace">
        <Link to="/" className="admin-sidebar-brand"><span className="admin-crest">S</span><span>ST.IPS <small>ADMIN PORTAL</small></span></Link>
        <p className="admin-side-label">WORKSPACE</p>
        <button aria-pressed={workspace === "admissions"} className={`admin-side-nav ${workspace === "admissions" ? "active" : ""}`} onClick={() => { setWorkspace("admissions"); setError(""); }}><GraduationCap size={18} aria-hidden="true"/> Admissions</button>
        <button aria-pressed={workspace === "website"} className={`admin-side-nav ${workspace === "website" ? "active" : ""}`} onClick={() => { setWorkspace("website"); setError(""); }}><PanelsTopLeft size={18} aria-hidden="true"/> Website Content</button>
        <button aria-pressed={workspace === "notifications"} className={`admin-side-nav ${workspace === "notifications" ? "active" : ""}`} onClick={() => { setWorkspace("notifications"); setError(""); }}><Mail size={18} aria-hidden="true"/> Email Notifications</button>
        <button aria-pressed={workspace === "profile"} className={`admin-side-nav ${workspace === "profile" ? "active" : ""}`} onClick={() => { setWorkspace("profile"); setError(""); }}><UserRound size={18} aria-hidden="true"/> Personal Profile</button>
        <div className="admin-sidebar-bottom"><span className="admin-avatar">{(adminProfile.name || "SA").slice(0, 1).toUpperCase()}</span><span>{adminProfile.name || "School Admin"}<small>{adminProfile.email || "Administrator"}</small></span><button onClick={logout} aria-label="Sign out" title="Sign out"><LogOut size={17}/></button></div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar"><div><p className="admin-eyebrow">ST.IPS · SCHOOL OFFICE</p><h1>{workspace === "website" ? "Website Content" : workspace === "notifications" ? "Email Notifications" : workspace === "profile" ? "Personal Profile" : "Admissions"}</h1></div><div className="admin-top-actions"><Link to="/" className="admin-site-link"><ArrowLeft size={16}/> View website</Link>{workspace === "admissions" && <button className="admin-icon-button" onClick={() => fetchStudents()} aria-label="Refresh applications"><RefreshCw size={17}/></button>}</div></header>
        {workspace === "website" ? <WebsiteContentManager token={token}/> : workspace === "notifications" ? <div className="admin-content">
          {error && <div className="admin-error" role="alert">{error}</div>}
          {settingsNotice && <div className="cms-success" role="status">{settingsNotice}</div>}
          <section className="admin-table-card notification-settings-card">
            <div className="admin-table-heading"><div><h2>Admission form email alerts</h2><p>Choose the school inbox that receives every new admission enquiry.</p></div><span className={`notification-status ${senderConfigured ? "ready" : "pending"}`}>{senderConfigured ? "Sender credentials added" : "Sender setup needed"}</span></div>
            <form className="notification-settings-form" onSubmit={saveNotificationSettings}>
              <label htmlFor="notification-recipient">Recipient Gmail or email address</label>
              <input id="notification-recipient" type="email" autoComplete="email" placeholder="school.inbox@gmail.com" value={recipientEmail} onChange={(event) => setRecipientEmail(event.target.value)} required />
              <p>After saving, new admission forms will be sent to this inbox. You can change it here at any time.</p>
              {senderConfigured && <p>Credentials are present. Gmail still verifies them when it sends each message; check the Admissions email status if delivery fails.</p>}
              {!senderConfigured && <div className="notification-setup-hint"><strong>One-time mail setup:</strong> Gmail must be connected on the server. Put the sending Gmail and its Google App Password in the backend’s private <code>.env</code> as <code>GMAIL_USER</code> and <code>GMAIL_APP_PASSWORD</code>. These secret values are never entered or shown here.</div>}
              <button className="admin-primary-button" type="submit" disabled={settingsSaving}><Save size={16}/>{settingsSaving ? "Saving…" : "Save email settings"}</button>
            </form>
          </section>
        </div> : workspace === "profile" ? <div className="admin-content">
          {error && <div className="admin-error" role="alert">{error}</div>}
          {profileNotice && <div className="cms-success" role="status">{profileNotice}</div>}
          <section className="admin-table-card profile-settings-card">
            <div className="admin-table-heading"><div><h2>Personal profile</h2><p>Update the name and sign-in details for this administrator account.</p></div><span className="profile-icon"><UserRound size={20}/></span></div>
            <form className="profile-settings-form" onSubmit={saveProfile}>
              <label htmlFor="profile-name">Admin name</label>
              <input id="profile-name" type="text" autoComplete="name" maxLength={80} value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} required />
              <label htmlFor="profile-email">Admin email</label>
              <input id="profile-email" type="email" autoComplete="username" value={profileForm.email} onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })} required />
              <div className="profile-password-heading"><KeyRound size={17}/><strong>Change password</strong></div>
              <p>Leave the new password fields empty to keep the current password. Use your current password to change your email or password.</p>
              <label htmlFor="profile-current-password">Current password</label>
              <input id="profile-current-password" type="password" autoComplete="current-password" value={profileForm.currentPassword} onChange={(event) => setProfileForm({ ...profileForm, currentPassword: event.target.value })} />
              <label htmlFor="profile-new-password">New password</label>
              <input id="profile-new-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} value={profileForm.newPassword} onChange={(event) => setProfileForm({ ...profileForm, newPassword: event.target.value })} />
              <label htmlFor="profile-confirm-password">Confirm new password</label>
              <input id="profile-confirm-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} value={profileForm.confirmPassword} onChange={(event) => setProfileForm({ ...profileForm, confirmPassword: event.target.value })} />
              <div className="profile-security-note"><ShieldCheck size={16}/> Passwords are securely hashed and never shown after saving.</div>
              <button className="admin-primary-button" type="submit" disabled={profileSaving}><Save size={16}/>{profileSaving ? "Saving…" : "Save profile"}</button>
            </form>
          </section>
        </div> : <div className="admin-content">
          {error && <div className="admin-error" role="alert">{error}</div>}
          <div className="admin-welcome"><div><p className="admin-eyebrow">ADMISSION ENQUIRIES</p><h2>A warm welcome starts here.</h2><p>Review new applications and keep each family informed.</p></div><div className="admin-welcome-icon"><GraduationCap size={30}/></div></div>
          <div className="admin-stats-grid">
            <article className="admin-stat-card"><span className="admin-stat-icon blue"><Users size={19}/></span><p>Total applications</p><strong>{students.length}</strong><small>All submitted enquiries</small></article>
            <article className="admin-stat-card"><span className="admin-stat-icon amber"><Search size={19}/></span><p>Needs follow-up</p><strong>{newCount}</strong><small>New applications</small></article>
            <article className="admin-stat-card"><span className="admin-stat-icon green"><GraduationCap size={19}/></span><p>Admitted</p><strong>{admittedCount}</strong><small>Marked admitted</small></article>
          </div>
          <section className="admin-table-card">
            <div className="admin-table-heading"><div><h2>Application inbox</h2><p>Review details and update each family’s progress.</p></div><button className="admin-export-button" onClick={exportCsv} disabled={!visibleStudents.length}><ArrowDownToLine size={17}/> Export CSV</button></div>
            <div className="admin-table-tools"><label className="admin-search"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, phone or class" /></label><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter applications"><option>All applications</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div>
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>STUDENT / GUARDIAN & MESSAGE</th><th>CONTACT</th><th>CLASS</th><th>RECEIVED</th><th>STATUS</th><th>EMAIL ALERT</th><th></th></tr></thead><tbody>
              {visibleStudents.map((student) => <tr key={student._id}><td><strong>{student.name}</strong><small className="admin-message">{student.message || "No additional message was included."}</small></td><td><a href={`mailto:${student.email}`}>{student.email}</a><a href={`tel:${student.phone}`}>{student.phone}</a></td><td>{student.classApplied || "—"}</td><td>{student.createdAt ? new Date(student.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</td><td><select className={`admin-status status-${(student.status || "New").toLowerCase().replaceAll(" ", "-")}`} value={student.status || "New"} onChange={(event) => updateStatus(student, event.target.value)} aria-label={`Status for ${student.name}`}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td><td><span className={`notification-result ${student.emailNotificationStatus === "sent" ? "sent" : student.emailNotificationStatus === "failed" ? "failed" : "not-sent"}`}>{student.emailNotificationStatus === "sent" ? "Sent" : student.emailNotificationStatus === "failed" ? "Failed" : "Not configured"}</span></td><td><button className="admin-delete" onClick={() => deleteApplication(student)} aria-label={`Delete application from ${student.name}`}>Remove</button></td></tr>)}
              {!visibleStudents.length && <tr><td colSpan="7" className="admin-empty">{busy ? "Loading applications…" : students.length ? "No applications match your search." : "No applications yet. New admission enquiries will appear here."}</td></tr>}
            </tbody></table></div>
            <div className="admin-table-footer">Showing {visibleStudents.length} of {students.length} applications <span>Application records are visible to authorised administrators only.</span></div>
          </section>
        </div>}
      </section>
    </main>
  );
}

export default Dashboard;
