import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    title: {
        color: 'white',
        letterSpacing: '0.2rem'
    }
});

const Home = () => {
    const classes = useStyles();

    return (
        <div>
            <h1 className={classes.title}>DOCUMENT MANAGEMENT SYSTEM</h1>
        </div>
    );
};

export default Home;
