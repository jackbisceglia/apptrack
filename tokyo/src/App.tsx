import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { notFoundMsg, postingsMsg, unsubscribeMsg } from "./utils/constants";

import About from "./routes/About";
import Footer from "./components/Footer";
import Home from "./routes/Home";
import Message from "./components/Message";
import Navbar from "./components/Navbar";
import Postings from "./routes/Postings";
import Privacy from "./routes/info/Privacy";
import TOS from "./routes/info/TOS";
import Unsubscribe from "./routes/Unsubscribe";
import useForceScrollbar from "./utils/useForceScrollbar";

// prettier-ignore
export default function App() {
  const queryClient = new QueryClient()
  useForceScrollbar(["/postings"]);
  return (
    <>
    <QueryClientProvider client={queryClient}>
    <div className="font-sen text-stone-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/postings" element={<Postings />} />
        {/* <Route path="/postings" element={<Message message={postingsMsg} />} /> */}
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
    </QueryClientProvider>
</>
  );
}
