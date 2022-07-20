import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Message from "./components/Message";
import Home from "./routes/Home";
import Unsubscribe from "./routes/Unsubscribe";
import About from "./routes/About";

import { postingsMsg, unsubscribeMsg, notFoundMsg } from "./utils/constants";
import TOS from "./routes/info/TOS";
import Privacy from "./routes/info/Privacy";

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
        <Route path="/info/">
          <Route path="tos" element={<TOS/>} />
          <Route path="privacy" element={<Privacy/>} />
        </Route>
        <Route path="*" element={<Message message={notFoundMsg} />} />
      </Routes>
      <Footer />
    </div>
  );
}
