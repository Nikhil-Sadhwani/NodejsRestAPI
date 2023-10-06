import './App.css';

// For Navigation between pages
import { BrowserRouter , Routes , Route  } from 'react-router-dom';

// Components
import LoginForm from './components/LoginForm';
import AllCustomers from './components/AllCustomers';
import InsertForm from './components/InsertForm';
import CustomerDetails from './components/CustomerDetails';
import ImageView from './components/ImageView';
import Alert from './components/Alert';

// All States
import LogState from './context/logState/LogState';
import AlertState from './context/alertState/AlertState';

function App() {
  return (
    <>
    <AlertState>

      <LogState>

        <BrowserRouter>

          <Alert/>

          <Routes>

            <Route exact path="/" element={<AllCustomers/>} />
            <Route exact path="/login" element={<LoginForm/>} />
            <Route exact path="/createcustomer/:userid?" element={<InsertForm/>} />
            <Route exact path="/details/:id" element={<CustomerDetails/>} />
            <Route exact path="/imageview/:id" element={<ImageView/>} />

          </Routes>
        </BrowserRouter>

      </LogState>
      
    </AlertState>
    </>
  );
}

export default App;
