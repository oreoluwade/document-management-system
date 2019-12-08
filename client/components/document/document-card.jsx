import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

import { formatRelative } from 'date-fns';

const useStyles = makeStyles({
  card: {
    minWidth: '80%',
    backgroundColor: '#CDCDCD',
    marginBottom: '0.4rem',
    display: 'flex',
    flexDirection: 'column',
    height: '7rem',
    padding: '0.4rem'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  date: {
    color: 'rgb(49, 150, 175)',
    fontSize: 14,
    fontStyle: 'italic'
  },
  textContent: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  action: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  view: {
    color: 'green',
    height: '3rem',
    width: '3rem'
  },
  viewLink: {
    textDecoration: 'none'
  },
  delete: {
    height: '2.5rem',
    width: '3rem',
    color: '#8B0000',
    marginBottom: '0.7rem'
  }
});

const DocumentCard = ({ document }) => {
  const classes = useStyles();

  const getDate = document => {
    return formatRelative(new Date(document.createdAt), new Date());
  };

  return (
    <Card className={classes.card}>
      <CardContent className={classes.textContent}>
        <Typography className={classes.title}>{document.title}</Typography>
        <Typography className={classes.date}>{`Created ${getDate(
          document
        )}`}</Typography>
      </CardContent>
      <CardActions className={classes.action}>
        <Tooltip title="Delete Document">
          <DeleteIcon className={classes.delete} />
        </Tooltip>
        <Link to={`/render-document/${document.id}`} className="">
          <Tooltip title="View Document">
            <VisibilityIcon className={classes.view} />
          </Tooltip>
        </Link>
      </CardActions>
    </Card>
  );
};

export default DocumentCard;
