import { lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import { SiteContentProvider } from "./context/SiteContentContext";

const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Admissions = lazy(() => import("./pages/Admissions.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));

function RouteLoading() {
  return <div className="route-loading" role="status" aria-live="polite">Loading school portal…</div>;
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <SiteContentProvider>
      <Routes>

        {/* Public Layout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Suspense fallback={<RouteLoading />}><Home /></Suspense>
            </MainLayout>
          }
        />

        <Route
          path="/about"
          element={
            <MainLayout>
              <Suspense fallback={<RouteLoading />}><About /></Suspense>
            </MainLayout>
          }
        />

        <Route
          path="/admissions"
          element={
            <MainLayout>
              <Suspense fallback={<RouteLoading />}><Admissions /></Suspense>
            </MainLayout>
          }
        />

        {/* Admin (No Navbar) */}
        <Route path="/admin" element={<Suspense fallback={<RouteLoading />}><Dashboard /></Suspense>} />

      </Routes>
      </SiteContentProvider>
    </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
