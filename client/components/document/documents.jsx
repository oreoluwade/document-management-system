import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { loadAllDocuments } from '../../actions';
import DocumentCard from './document-card';
import SelectAccess from './select-access';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    height: '80%',
    overflow: 'scroll'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  }
}));

const filterDocuments = (checkedState, documents) => {
  const categoriesIncluded = Object.keys(checkedState).filter(
    cat => !!checkedState[cat]
  );
  console.log('Included', categoriesIncluded);
  return documents.filter(doc => categoriesIncluded.includes(doc.access));
};

const Documents = ({ allDocuments }) => {
  const classes = useStyles();
  const [documents, setDocuments] = useState([]);
  const [checkedState, setCheckedState] = useState({
    public: true,
    private: true,
    role: true
  });

  useEffect(() => {
    loadAllDocuments().then(() => {
      setDocuments(allDocuments);
    });
  }, []);

  const handleChecked = event => {
    setCheckedState({
      ...checkedState,
      [event.target.name]: event.target.checked
    });
    const filteredDocuments = filterDocuments(checkedState, allDocuments);
    setDocuments(filteredDocuments);
  };

  return (
    <div className={classes.root}>
      <SelectAccess
        publicChecked={checkedState.public}
        privateChecked={checkedState.private}
        roleChecked={checkedState.role}
        handleChecked={handleChecked}
      />
      <Grid container spacing={2}>
        {documents.map(document => (
          <Grid item xs={6} sm={3} key={document.id}>
            <DocumentCard document={document} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Documents.propTypes = {
  auth: PropTypes.object,
  loadAllDocuments: PropTypes.func,
  allDocuments: PropTypes.array
};

const mapStateToProps = state => {
  const { documents, auth } = state;

  return {
    auth,
    allDocuments: documents
  };
};

export default connect(mapStateToProps, { loadAllDocuments })(Documents);
