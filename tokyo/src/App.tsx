import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Message from "./components/Message";
import Home from "./routes/Home";
import Unsubscribe from "./routes/Unsubscribe";
import About from "./routes/About";

import { postingsMsg, unsubscribeMsg, notFoundMsg } from "./utils/constants";

// prettier-ignore
export default function App() {
  return (
    <div className="font-sen text-stone-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/postings" element={<Message message={postingsMsg} />} />
        <Route path="/unsubscribe" element={<Message message={unsubscribeMsg} />} />
        <Route path="/unsubscribe/:userId" element={<Unsubscribe />} />
        <Route path="/about" element={<About/>}/>
        <Route path="*" element={<Message message={notFoundMsg} />} />
      </Routes>
      <Footer />
    </div>
  );
}
