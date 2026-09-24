import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Check, ChevronDown, ImagePlus, RotateCcw, Save, Upload, Eye, EyeOff } from "lucide-react";
import { defaultSiteContent } from "../data/defaultSiteContent";
import { ensureGalleryPhotoSlots } from "../galleryUtils";
import { API_BASE_URL } from "../config/api";

const API = API_BASE_URL;
const pages = [{ id: "site", label: "School details" }, { id: "home", label: "Home page" }, { id: "noticeBoard", label: "Notice Board" }, { id: "about", label: "About page" }, { id: "admissions", label: "Admissions" }, { id: "shared", label: "Header & footer" }];
const humanize = (key) => key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
const clone = (value) => JSON.parse(JSON.stringify(value));
const toLocalDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
function merge(base, saved) {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return saved ?? clone(base);
  if (!base || typeof base !== "object" || Array.isArray(base)) return saved;
  return Object.fromEntries([...new Set([...Object.keys(base), ...Object.keys(saved)])].map((key) => [key, merge(base[key], saved[key])]));
}
const isImage = (key) => /(image|photo|logo|backgroundImage)$/i.test(key);
const isLong = (key) => /(description|message|body|text|address|tagline)$/i.test(key);

function FieldEditor({ label, path, value, onChange, token, onError }) {
  const [uploading, setUploading] = useState(false);
  if (Array.isArray(value)) return <ArrayEditor label={label} path={path} value={value} onChange={onChange} token={token} onError={onError}/>;
  if (value && typeof value === "object") return <fieldset className="cms-object"><legend>{humanize(label)}</legend>{Object.entries(value).map(([key, child]) => <FieldEditor key={key} label={key} path={[...path, key]} value={child} onChange={onChange} token={token} onError={onError}/>)}</fieldset>;

  const setValue = (next) => onChange(path, next);
  const upload = async (file) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) { onError("Choose a JPG, PNG, WebP or AVIF image."); return; }
    if (file.size > 10 * 1024 * 1024) { onError("Images must be 10 MB or smaller."); return; }
    setUploading(true); onError("");
    try {
      const { data: signature } = await axios.post(`${API}/admin/media/signature`, {}, { headers: { Authorization: `Bearer ${token}` } });
      const body = new FormData();
      body.append("file", file); body.append("api_key", signature.apiKey); body.append("timestamp", signature.timestamp); body.append("folder", signature.folder); body.append("allowed_formats", signature.allowedFormats); body.append("signature", signature.signature);
      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${signature.cloudName}/${signature.resourceType}/upload`, body);
      setValue(data.secure_url);
    } catch (error) { onError(error.response?.data?.msg || "Image upload failed. Check the Cloudinary setup and try again."); }
    finally { setUploading(false); }
  };

  const controlId = `cms-${path.map(String).join("-").replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return <div className="cms-field"><label htmlFor={controlId}>{humanize(label)}</label>
    {typeof value === "boolean" ? <select id={controlId} value={String(value)} onChange={(event) => setValue(event.target.value === "true")}><option value="true">Yes</option><option value="false">No</option></select>
      : label === "publishAt" ? <><input id={controlId} type="datetime-local" value={toLocalDateTime(value)} onChange={(event) => setValue(event.target.value ? new Date(event.target.value).toISOString() : "")} /><small className="cms-field-help">Leave blank to publish as soon as the notice is saved. Time uses your device’s local timezone.</small></>
      : isImage(label) ? <><input id={controlId} value={value ?? ""} onChange={(event) => setValue(event.target.value)} placeholder="Paste an image URL or upload a photo"/><div className="cms-image-tools">{value && <img src={value} alt="Selected image preview"/>}<label className="cms-upload" htmlFor={`${controlId}-upload`} aria-busy={uploading}><input id={`${controlId}-upload`} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { upload(event.target.files?.[0]); event.target.value = ""; }}/><Upload size={15} aria-hidden="true"/>{uploading ? "Uploading…" : "Upload photo"}</label>{value && <button type="button" className="cms-link-button" onClick={() => setValue("")}>Remove image</button>}</div></>
      : isLong(label) ? <textarea id={controlId} rows={3} value={value ?? ""} onChange={(event) => setValue(event.target.value)} />
      : <input id={controlId} value={value ?? ""} onChange={(event) => setValue(event.target.value)} />}
  </div>;
}

function ArrayEditor({ label, path, value, onChange, token, onError }) {
  const fixedHeroSlides = path.join(".") === "content.home.hero.slides";
  const galleryPhotos = path.join(".") === "content.home.gallery.items";
  const teacherItems = path.join(".") === "content.home.teachers.items";
  const notices = path.join(".") === "content.home.noticeBoard.items";
  const update = (index, next) => onChange(path, value.map((item, i) => i === index ? next : item));
  const add = () => { if (fixedHeroSlides) return; const template = galleryPhotos ? { title: "New school photo", image: "", imageAlt: "" } : teacherItems ? { name: "", qualification: "", image: "", imageAlt: "" } : notices ? { title: "", body: "", publishAt: "" } : value.at(-1) ?? { title: "", description: "" }; onChange(path, [...value, clone(template)]); };
  return <section className="cms-array"><header><h4>{notices ? "Notices" : humanize(label)} <span>{value.length}{fixedHeroSlides ? " / 5" : ""}</span></h4>{!fixedHeroSlides && <button type="button" className="cms-link-button" onClick={add}>{galleryPhotos ? "+ Add photo" : teacherItems ? "+ Add teacher" : notices ? "+ Add notice" : "+ Add item"}</button>}</header>
    {notices && <p className="cms-field-help">Set a publish date to schedule a notice. Leave it blank to publish as soon as you save.</p>}
    {value.map((item, index) => <details className="cms-array-item" key={index} open={fixedHeroSlides || (galleryPhotos && !item?.image) || (teacherItems && !item?.name) || (notices && !item?.title) || value.length < 4}><summary><ChevronDown size={16}/>{typeof item === "object" ? item.title || item.name || `${humanize(label)} ${index + 1}` : String(item)}</summary><div className="cms-array-fields">{item && typeof item === "object" ? Object.entries(item).map(([key, child]) => <FieldEditor key={key} label={key} path={[...path, index, key]} value={child} onChange={(nextPath, next) => { let cursor = clone(value); let node = cursor; for (const part of nextPath.slice(path.length, -1)) node = node[part]; node[nextPath.at(-1)] = next; onChange(path, cursor); }} token={token} onError={onError}/>) : <FieldEditor label={`${label} ${index + 1}`} path={[...path, index]} value={item} onChange={onChange} token={token} onError={onError} />}{!fixedHeroSlides && <button type="button" className="cms-remove" onClick={() => onChange(path, value.filter((_, i) => i !== index))}>Remove item</button>}</div></details>)}
  </section>;
}

export default function WebsiteContentManager({ token }) {
  const [tab, setTab] = useState("site");
  const [saved, setSaved] = useState(defaultSiteContent);
  const [draft, setDraft] = useState(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  useEffect(() => {
    let active = true;
    axios.get(`${API}/admin/site-content`, { headers: { Authorization: `Bearer ${token}` } }).then(({ data }) => {
      if (!active) return;
      const merged = { site: merge(defaultSiteContent.site, data.site), content: ensureGalleryPhotoSlots(merge(defaultSiteContent.content, data.content)), visibility: merge(defaultSiteContent.visibility, data.visibility) };
      setSaved(merged); setDraft(merged);
    }).catch((requestError) => { if (active) setError(requestError.response?.data?.msg || "Could not load website content. Check the server connection."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  const setAtPath = (path, next) => setDraft((current) => {
    const result = clone(current); let target = result;
    for (const part of path.slice(0, -1)) target = target[part];
    target[path.at(-1)] = next; return result;
  });
  const save = async () => {
    setSaving(true); setError(""); setNotice("");
    try { const { data } = await axios.patch(`${API}/admin/site-content`, draft, { headers: { Authorization: `Bearer ${token}` } }); const merged = { site: merge(defaultSiteContent.site, data.site), content: merge(defaultSiteContent.content, data.content), visibility: merge(defaultSiteContent.visibility, data.visibility) }; setSaved(merged); setDraft(merged); setNotice("Website content saved successfully."); }
    catch (requestError) { setError(requestError.response?.data?.msg || "Could not save your changes. Please try again."); }
    finally { setSaving(false); }
  };
  const contentPage = tab === "noticeBoard" ? "home" : tab;
  const sections = tab === "site" ? draft.site : tab === "shared" ? draft.content.shared : tab === "noticeBoard" ? { noticeBoard: draft.content.home.noticeBoard } : draft.content[tab];
  const toggle = (page, section) => setAtPath(["visibility", page, section], !draft.visibility[page][section]);

  return <div className="cms-workspace">
    <header className="cms-heading"><div><p className="admin-eyebrow">WEBSITE CONTENT</p><h2>Manage your school website</h2><p>Update the photos and words families see, or hide a section until it is ready.</p></div><ImagePlus size={27}/></header>
    <nav className="cms-tabs" aria-label="Website content pages">{pages.map((page) => <button key={page.id} type="button" aria-pressed={tab === page.id} className={tab === page.id ? "active" : ""} onClick={() => setTab(page.id)}>{page.label}</button>)}</nav>
    {error && <div className="admin-error" role="alert">{error}</div>}{notice && <div className="cms-success" role="status"><Check size={17}/>{notice}</div>}
    {loading ? <div className="cms-loading">Loading website content…</div> : <div className="cms-sections">
      {Object.entries(sections).map(([section, value]) => <section className="cms-section" key={section}>
        {tab !== "site" && <header className="cms-section-heading"><div><h3>{tab === "noticeBoard" ? "Notice Board" : humanize(section)}</h3><p>Choose whether this section appears on the {tab === "shared" ? "whole website" : tab === "noticeBoard" ? "home page" : `${tab} page`}.</p>{tab === "home" && section === "hero" && <p>Upload up to five hero photos below. They rotate automatically; empty slots are skipped.</p>}{tab === "home" && section === "gallery" && <p>Five extra photo slots are ready below. Upload a photo to add it to the public gallery; empty slots stay hidden.</p>}{tab === "home" && section === "teachers" && <p>Add each teacher’s name, qualification and photo. Uploaded portraits appear just below the home page hero.</p>}{tab === "noticeBoard" && <p>Add notices, remove outdated ones, or set a publish date and time. Scheduled notices stay private until then.</p>}</div><button type="button" className={`cms-visibility ${draft.visibility[contentPage][section] ? "is-visible" : ""}`} onClick={() => toggle(contentPage, section)} aria-pressed={draft.visibility[contentPage][section]} aria-label={`${draft.visibility[contentPage][section] ? "Hide" : "Show"} ${humanize(section)}`}>{draft.visibility[contentPage][section] ? <Eye size={17} aria-hidden="true"/> : <EyeOff size={17} aria-hidden="true"/>} {draft.visibility[contentPage][section] ? "Visible" : "Hidden"}</button></header>}
        <div className="cms-fields">{Object.entries(value).map(([key, child]) => <FieldEditor key={key} label={key} path={tab === "site" ? ["site", key] : ["content", contentPage, section, key]} value={child} onChange={setAtPath} token={token} onError={setError}/>)}</div>
      </section>)}
    </div>}
    <footer className="cms-savebar"><span>{dirty ? "You have unsaved changes" : "All changes are saved"}</span><div><button type="button" className="cms-reset" disabled={!dirty || saving} onClick={() => { setDraft(clone(saved)); setError(""); setNotice(""); }}><RotateCcw size={16}/> Discard changes</button><button type="button" className="admin-primary-button" disabled={!dirty || saving || loading} onClick={save}><Save size={17}/>{saving ? "Saving…" : "Save website changes"}</button></div></footer>
  </div>;
}
