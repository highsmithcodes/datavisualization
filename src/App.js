import { Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Page1 from './pages/page1';
import Page2 from './pages/page2';
import Page3 from './pages/page3';
import Nav from './component/Nav';
import Home from './pages/Home';

function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/chart-1" element={<Page1 />} />
          <Route path="/chart-2" element={<Page2 />} />
          <Route path="/chart-3" element={<Page3 />} />
      </Routes>
    </div>
  );
}

export default App;
