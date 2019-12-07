import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import MenuBookIcon from '@material-ui/icons/MenuBookSharp';

import { formatRelative } from 'date-fns';

const useStyles = makeStyles({
  card: {
    minWidth: '80%',
    backgroundColor: '#CDCDCD',
    marginBottom: '0.4rem',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  date: {
    color: 'blue',
    fontSize: 10,
    fontStyle: 'italic'
  },
  textContent: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  action: {
    display: 'flex',
    justifyContent: 'flex-end'
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
        <Link to={`/render-document/${document.id}`} className="navbar-link">
          <MenuBookIcon />
        </Link>
      </CardActions>
    </Card>
  );
};

export default DocumentCard;
