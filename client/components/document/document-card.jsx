import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  card: {
    minWidth: '80%',
    backgroundColor: '#CDCDCD',
    marginBottom: '0.4rem'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

const DocumentCard = ({ document }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary">
          {document.title}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={`/render-document/${document.id}`} className="navbar-link">
          <Button size="small">View Document</Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default DocumentCard;
