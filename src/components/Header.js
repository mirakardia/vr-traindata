import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Typography';
import Typography from '@material-ui/core/Typography';
import 'typeface-roboto';

/*const theme = createMuiTheme ({
    typography: {
        useNextVariants: true,
    },
});
*/

const styles = {
  root: {
    flexGrow: 1
  },
  bar: {
    background: '#56a319',
    position: 'static'
  },
  text: {
    padding: 10,
    marginLeft: 35,
    color: 'white',
    fontWeight: 350
  }
};

const Header = props => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <AppBar className={classes.bar}>
        <Toolbar>
          <Typography className={classes.text} variant='title'>
            Aseman junatiedot
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
