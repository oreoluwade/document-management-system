import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        width: '25rem'
    },

    input: {
        fontSize: '1.5rem',
        width: '80%',
        padding: '0.3rem',
        border: '2px solid rgb(49, 150, 175)',
        borderRadius: '0.8rem',
        outline: 'none'
    }
}));

const Search = ({ query, handleQueryChange }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <input
                value={query}
                onChange={handleQueryChange}
                className={classes.input}
                placeholder="Search..."
            />
        </div>
    );
};

Search.propTypes = {
    query: PropTypes.string,
    handleQueryChange: PropTypes.func
};

export default Search;
