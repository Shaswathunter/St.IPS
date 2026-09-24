import { useState } from "react";
import axios from "axios";
import { useSiteContent } from "../context/SiteContentContext";
import usePageSEO from "../hooks/usePageSEO";
import { API_BASE_URL } from "../config/api";

const Admissions = () => {
  const { content, visibility, site } = useSiteContent();
  const admission = content.admissions;
  usePageSEO({ title: `Admissions | ${site.name}`, description: admission.intro.description, site });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    classApplied: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.phone) {
      setFeedback({ type: "error", text: "Please fill in your name, email and phone number." });
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);

      const response = await axios.post(`${API_BASE_URL}/students`, form);

      const notificationStatus = response.data.emailNotificationStatus;
      setFeedback(notificationStatus === "sent"
        ? { type: "success", text: "Your admission enquiry was submitted successfully. The school has also been notified by email." }
        : notificationStatus === "failed"
          ? { type: "warning", text: "Your admission enquiry was saved, but the school email could not be sent. Please contact the school office; your application remains saved." }
          : { type: "warning", text: "Your admission enquiry was saved, but email notifications are not configured yet. The school has not received an email." });

      setForm({
        name: "",
        email: "",
        phone: "",
        classApplied: "",
        message: "",
      });

    } catch (error) {
      setFeedback({ type: "error", text: error.response?.data?.msg || "We could not submit your enquiry. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">

      {visibility.admissions?.intro === false && <h1 className="sr-only">{admission.intro.title}</h1>}
      {visibility.admissions?.intro !== false && <div className="text-center"><h1 className="text-3xl font-bold text-primary">{admission.intro.title}</h1><p className="mt-3 text-gray-600">{admission.intro.description}</p></div>}

      {visibility.admissions?.form !== false && <form
        onSubmit={handleSubmit}
        aria-busy={loading}
        aria-labelledby="admission-form-title"
        className="mt-8 space-y-4 bg-white p-6 shadow-md rounded-lg"
      >

        <h2 id="admission-form-title" className="text-xl font-semibold text-primary">{admission.form.title}</h2>

        {feedback && <p className={`admission-feedback ${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"} aria-live={feedback.type === "error" ? "assertive" : "polite"}>{feedback.text}</p>}

        <label className="admissions-field" htmlFor="admission-name">{admission.form.nameLabel}<input id="admission-name" type="text" name="name" autoComplete="name" placeholder={admission.form.nameLabel} value={form.name} onChange={handleChange} className="w-full border p-3 rounded" required /></label>

        <label className="admissions-field" htmlFor="admission-email">{admission.form.emailLabel}<input id="admission-email" type="email" name="email" autoComplete="email" placeholder={admission.form.emailLabel} value={form.email} onChange={handleChange} className="w-full border p-3 rounded" required /></label>

        <label className="admissions-field" htmlFor="admission-phone">{admission.form.phoneLabel}<input id="admission-phone" type="tel" name="phone" autoComplete="tel" placeholder={admission.form.phoneLabel} value={form.phone} onChange={handleChange} className="w-full border p-3 rounded" required /></label>

        <label className="admissions-field" htmlFor="admission-class">{admission.form.classLabel}<input id="admission-class" type="text" name="classApplied" placeholder={admission.form.classLabel} value={form.classApplied} onChange={handleChange} className="w-full border p-3 rounded" /></label>

        <label className="admissions-field" htmlFor="admission-message">{admission.form.messageLabel}<textarea id="admission-message" name="message" placeholder={admission.form.messageLabel} value={form.message} onChange={handleChange} className="w-full border p-3 rounded" rows="4" /></label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg"
        >
          {loading ? "Submitting..." : admission.form.submitLabel}
        </button>

      </form>}
      {visibility.admissions?.contactDetails !== false && <section className="mt-8 rounded-xl bg-blue-50 p-6 text-center text-gray-700" aria-label="School contact details"><p>{admission.contactDetails.address}</p><a className="mt-2 inline-block font-semibold text-primary" href={`tel:${admission.contactDetails.phone}`}>{admission.contactDetails.phone}</a>{admission.contactDetails.email && <a className="mt-2 block font-semibold text-primary" href={`mailto:${admission.contactDetails.email}`}>{admission.contactDetails.email}</a>}</section>}
    </div>
  );
};

export default Admissions;
