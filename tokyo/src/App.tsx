import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Message from "./components/Message";
import Home from "./routes/Home";
import Unsubscribe from "./routes/Unsubscribe";

export default function App() {
  return (
    <div className="font-sen text-stone-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/postings"
          element={<Message message="Coming Soon! 🚧" />}
        />
        <Route
          path="/unsubscribe"
          element={
            <Message message="To unsubscribe, use the unsubscribe link at the bottom of any email we have sent you. Thanks!" />
          }
        />
        <Route path="/unsubscribe/:userId" element={<Unsubscribe />} />
        <Route
          path="*"
          element={
            <Message message="The page you are looking for does not exist. Sorry about that." />
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}
