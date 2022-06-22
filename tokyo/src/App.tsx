import { Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Signup from "./routes/Signup";
import Listings from "./routes/Listings";
import Unsubscribe from "./routes/Unsubscribe";
import NotFound from "./routes/NotFound";

export default function App() {
  return (
    <div className="box-border font-sen text-stone-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}
