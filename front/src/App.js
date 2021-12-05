import './App.css';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import Banner from './components/Banner'
import NavBar from './components/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { Container } from "@material-ui/core";
import background from "./assets/better_banner_bckg_2.png";
import playAnimation from './scripts/animation'
import BrowseFlights from './pages/BrowseFlights';
import ViewFlight from './pages/ViewFlight';
import ComposeOrder from './pages/ComposeOrder';
import Checkout from './pages/Checkout';
import ProfileInfo from './pages/Profile';
import History from './pages/History';


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
                  <Route path='/place_order/*' element={<ComposeOrder />} />
                  <Route path='/checkout*' element={<Checkout />} />
                  <Route path='/profile' element={<ProfileInfo />} />
                  <Route path='/history' element={<History/>} />
                </Routes>

              </Container>


              {/* <div
              style={{
                backgroundImage: `url(${background})`,
                filter: 'blur(12px)',
                backgroundSize: 'cover',
                width: '100%',
                height: '100%'
              }}
            /> */}
            </Box>
          </div>
        </div>
      </BrowserRouter>
     
    </ThemeProvider>
  );
}

export default App;
