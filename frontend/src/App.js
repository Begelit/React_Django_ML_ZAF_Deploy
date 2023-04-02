import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import UserCasesListPage from './pages/UserCasesListPage.js';
import UserCasePage from './pages/UserCasePage.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
//import './components/modules/Speech2Text/worklets/awp.js'

function App() {

  return (
    <Router>
      <div className="App">
        <Navbar bg="light" variant="dark">
          <Header />
        </Navbar>
      </div>
      <Routes>
          <Route path="/" element = {<UserCasesListPage />} />
          <Route path="/note/:id" element = {<UserCasePage />} />
      </Routes>  
    </Router>

  );
}

export default App;
