import { useEffect, useState } from "react";
import axios from "axios";
import { BellRing, CalendarClock } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteContent } from "../context/SiteContentContext";
import { API_BASE_URL } from "../config/api";

const API = API_BASE_URL;
const indiaDate = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });

export default function NoticeBoard() {
  const { content } = useSiteContent();
  const section = content.home.noticeBoard;
  const [notices, setNotices] = useState(section.items);

  useEffect(() => setNotices(section.items), [section.items]);

  useEffect(() => {
    let active = true;
    const refreshNotices = async () => {
      try {
        const { data } = await axios.get(`${API}/site-content`, { timeout: 8000 });
        if (active) setNotices(data.content?.home?.noticeBoard?.items || []);
      } catch {
        // Keep the notices already available from the site content context.
      }
    };
    const timer = window.setInterval(refreshNotices, 60_000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  const publishedNotices = notices
    .filter((item) => item.title?.trim())
    .sort((a, b) => (b.publishAt ? Date.parse(b.publishAt) : 0) - (a.publishAt ? Date.parse(a.publishAt) : 0));

  if (!publishedNotices.length) return null;

  return (
    <section id="notices" className="bg-white py-20 md:py-24" aria-labelledby="notice-board-heading">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mx-auto mb-11 max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">{section.eyebrow}</p>
          <h2 id="notice-board-heading" className="mt-3 text-4xl font-black text-[#0A2A66] md:text-5xl">{section.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">{section.description}</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {publishedNotices.map((notice, index) => (
            <motion.article key={`${notice.title}-${notice.publishAt || index}`} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.2) }} className="notice-card flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-900"><BellRing size={19} aria-hidden="true"/></span>
              <div className="min-w-0">
                {notice.publishAt && <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500"><CalendarClock size={14} aria-hidden="true"/>Published {indiaDate.format(new Date(notice.publishAt))}</p>}
                <h3 className="text-lg font-bold text-slate-900">{notice.title}</h3>
                {notice.body && <p className="mt-2 whitespace-pre-wrap leading-6 text-slate-600">{notice.body}</p>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
