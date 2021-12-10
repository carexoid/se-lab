import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Box } from '@material-ui/core';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import track1 from '../assets/track1.mp3';
import track2 from '../assets/track2.mp3';
import track3 from '../assets/track3.mp3';
import track4 from '../assets/track4.mp3';


const useStyles = makeStyles((theme) => ({
    box: {
        position: 'sticky',
        bottom: 10,
        right: 10,
    }
}));

const useAudio = url => {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    },
        [playing]
    );

    useEffect(() => {
        audio.volume = 0.15
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return [playing, toggle];
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function FunButton() {
    const classes = useStyles();
    const tracks = [track1,track2,track3, track4]
    let [playing, toggle] = useAudio(tracks[getRandomInt(tracks.length)])

    return (
        <Box className={classes.box}>
            <SpeedDial
                color='primary'
                ariaLabel="SpeedDial openIcon example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon icon={< MusicNoteIcon />} />}
            >
                {!playing ?
                    <SpeedDialAction
                        key='Play'
                        icon={<PlayArrowIcon />}
                        tooltipTitle='Play'
                        onClick={toggle}
                    />
                    :
                    <SpeedDialAction
                        key='Pause'
                        icon={<PauseIcon />}
                        tooltipTitle='Pause'
                        onClick={toggle}
                    />
                }
{/*                 <SpeedDialAction
                    key='Shuffle'
                    icon={<PauseIcon />}
                    tooltipTitle='Shuffle'
                    onClick={() => {
                        if (playing)
                            toggle()
                            [playing, toggle] = useAudio(tracks[getRandomInt(tracks.length)])
                    }}
                /> */}
            </SpeedDial>

        </Box>
    );
}

export default FunButton;