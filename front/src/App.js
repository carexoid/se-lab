import './App.css';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import Banner from './Banner'
import NavBar from './NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { Container } from "@material-ui/core";
import background from "./assets/better_banner_bckg_2.png";
import playAnimation from './animation'
import BrowseFlights from './BrowseFlights';
import ViewFlight from './ViewFlight';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2566a6',
      contrastText: '#ececec',
    },
    secondary: {
      main: '#ececec'
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
      }
    },
    MuiLink: {
      root: {
        color: '#0c1a28',
      }
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      
      <div
        style={{
          backgroundColor: '#c9e4ff',
        }}

        className='App'
        onScroll={playAnimation}
      >
        <div className='background-image' />

        <div className='content' >
          <Banner/>
          
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
              <BrowserRouter>
                <Routes>
                    <Route path='/' element={<BrowseFlights/>}/>
                    <Route path='/view/*' element={<ViewFlight/>}/>
                </Routes>
              </BrowserRouter>
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
     
    </ThemeProvider>
  );
}

export default App;
