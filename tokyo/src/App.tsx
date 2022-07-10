import { Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Signup from "./routes/Signup";
import Postings from "./routes/Postings";
import Unsubscribe from "./routes/Unsubscribe";
import NotFound from "./routes/NotFound";

export default function App() {
  return (
    <div className="box-border font-sen text-stone-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/postings" element={<Postings />} />
        <Route path="/unsubscribe/" element={<Unsubscribe />}>
          <Route path=":createdAt" element={<Unsubscribe />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}
