import Link from 'next/link'
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

const linkStyle = {
  marginRight: 15
}

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
});

const Header = () => (
    <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography type="title" color="inherit">
              Wenmoon.fund
            </Typography>
          </Toolbar>
        </AppBar>
    </div>
)

export default withStyles(styles)(Header);
