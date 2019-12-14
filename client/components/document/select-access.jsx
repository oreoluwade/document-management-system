import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// Custom Green checkbox
const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600]
        }
    },
    checked: {}
})(props => <Checkbox color="default" {...props} />);

// Styles for the whole SelectAccess component
const useStyles = makeStyles(theme => ({
    selectRoot: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1)
    }
}));

const SelectAccess = ({
    publicChecked,
    privateChecked,
    roleChecked,
    handleChecked
}) => {
    const classes = useStyles();

    return (
        <FormGroup row className={classes.selectRoot}>
            <FormControlLabel
                control={
                    <GreenCheckbox
                        checked={publicChecked}
                        onChange={handleChecked}
                        value="public"
                        name="public"
                    />
                }
                label="Public"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={privateChecked}
                        onChange={handleChecked}
                        value="private"
                        name="private"
                    />
                }
                label="Private"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={roleChecked}
                        onChange={handleChecked}
                        value="role"
                        color="primary"
                        name="role"
                    />
                }
                label="Role"
            />
        </FormGroup>
    );
};

SelectAccess.propTypes = {
    publicChecked: PropTypes.bool.isRequired,
    privateChecked: PropTypes.bool.isRequired,
    roleChecked: PropTypes.bool.isRequired,
    handleChecked: PropTypes.func.isRequired
};

export default SelectAccess;
