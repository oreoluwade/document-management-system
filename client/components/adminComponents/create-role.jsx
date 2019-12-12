import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { saveRole } from '../../actions';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        marginBottom: '1rem',
        alignItems: 'center',
        maxWidth: '600px'
    },
    input: {
        outline: 'none',
        fontSize: '1rem',
        height: '1.5rem',
        border: '2px solid rgb(80, 143, 202)',
        borderRadius: '1.2rem',
        padding: '0.4rem',
        minWidth: '50%',
        marginRight: '2rem'
    },
    button: {
        width: '10rem'
    }
});

const CreateRole = ({ saveRole }) => {
    const classes = useStyles();
    const [title, setTitle] = useState('');

    const handleTitleChange = e => {
        e.preventDefault();
        setTitle(e.target.value);
    };

    const makeNewRole = e => {
        e.preventDefault();
        saveRole({ title });
    };

    return (
        <div className={classes.root}>
            <input
                type="text"
                value={title}
                placeholder="Enter Role Title"
                onChange={handleTitleChange}
                className={classes.input}
            />
            <button
                type="button"
                onClick={makeNewRole}
                disabled={title.trim().length < 4}
                className={`btn btn-default ${classes.button}`}
            >
                Create Role
            </button>
        </div>
    );
};

CreateRole.propTypes = {
    saveRole: PropTypes.func.isRequired
};

export default connect(null, { saveRole })(CreateRole);
