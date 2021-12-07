import './App.css';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import Banner from './components/Banner'
import NavBar from './components/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { Container } from "@material-ui/core";
import BrowseFlights from './pages/BrowseFlights';
import ViewFlight from './pages/ViewFlight';
import ComposeOrder from './pages/ComposeOrder';
import BonusCheckout from './pages/BonusCheckout';
import ProfileInfo from './pages/Profile';
import History from './pages/History';
import AboutUs from './pages/AboutUs';
import Help from './pages/Help';
import Footer from './components/Footer';
import Success from './pages/PaymentSuccess';
import PaymentError from './pages/PaymentError';
import ProtectedWrapper from './pages/ProtectedWrapper';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2566a6',
      contrastText: '#ececec',
    },
    secondary: {
      main: '#e91a0d',
      contrastText: '#ececec',
    },
    text: {
      main: '#0c1a28'
    },
    fadedtext: {
      main: '#6c6c6c',
    },
    bg: {
      main: '#c9e4ff',
    },
    papers: {
      main: '#f2f2f2',
    },
    darkBlue: {
      main: '#0b367a',
      contrastText: '#ececec',
    }
  },
  overrides: {
    MuiTypography: {
      body1: {
        color: '#0c1a28',
        /* link: {
          color: '#0c1a28',
          textDecoration: 'none',
        } */
      },
      h2: {
        color: '#0c1a28',
      },
      h4: {
        color: '#0c1a28',
      },
      h5: {
        color: '#0c1a28',
      },
    },
    MuiLink: {
      root: {
        color: '#0c1a28',
      }
    },
    MuiButton: {
      textPrimary: {
        color: '#ececec',
      }
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      
      <BrowserRouter>
        <div
          style={{
            backgroundColor: '#c9e4ff',
          }}

          className='App'
          onScroll={() => {console.log('scrrrr')}}
        >
          <div className='background-image' />

          <div className='content' >
            <Banner />

            <Box
              id='content'
              bgcolor='bg.main'
              sx={{
                top: 0,
                width: '100%',
                height: 'auto'
              }}
            >
              <NavBar />
              <Container fixed
                style={{
                  backgroundColor: 'white',
                  marginTop: 10,
                  padding: 20
                }}
              >

                <Routes>
                  <Route path='/' element={<BrowseFlights />} />
                  <Route path='/view/*' element={<ViewFlight />} />
                  <Route path='/place_order/*' element={<ProtectedWrapper><ComposeOrder/></ProtectedWrapper>} />
                  <Route path='/bonuses*' element={<ProtectedWrapper><BonusCheckout /></ProtectedWrapper>} />
                  <Route path='/profile' element={<ProtectedWrapper><ProfileInfo /></ProtectedWrapper>} />
                  <Route path='/history' element={<ProtectedWrapper><History /></ProtectedWrapper>} />
                  <Route path='/about' element={<AboutUs/>} />
                  <Route path='/help' element={<Help/>} />
                  <Route path='/payment/success/*' element={<ProtectedWrapper><Success /></ProtectedWrapper>} />
                  <Route path='/payment/error' element={<ProtectedWrapper><PaymentError /></ProtectedWrapper>} />
                </Routes>

              </Container>

              <Footer/>
            </Box>
          </div>
        </div>
      </BrowserRouter>
     
    </ThemeProvider>
  );
}

export default App;
