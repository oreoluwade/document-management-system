import React, { Fragment } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import MoreIcon from '@material-ui/icons/MoreVert';
import { logout } from '../../actions';

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block'
        }
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto'
        }
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputRoot: {
        color: 'inherit'
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200
        }
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex'
        }
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    }
}));

const Header = props => {
    const {
        isAuthenticated,
        isAdmin,
        location: { pathname }
    } = props;

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        props.logout();
        props.history.push('/');
    };

    const isOnDashboard = isAuthenticated && pathname === '/dashboard';

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <p>Messages</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <div className={classes.grow}>
            <AppBar position="static" className="navbar">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link to="/" className="navbar-link">
                        <HomeIcon />
                    </Link>
                    {isOnDashboard && (
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </div>
                    )}
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        {isAuthenticated && (
                            <Fragment>
                                <Button color="inherit">
                                    <Link
                                        to="/documents"
                                        className="navbar-link"
                                    >
                                        Documents
                                    </Link>
                                </Button>
                                <Button color="inherit">
                                    <Link
                                        to="/dashboard"
                                        className="navbar-link"
                                    >
                                        Dashboard
                                    </Link>
                                </Button>
                                <Button color="inherit">
                                    <Link to="/profile" className="navbar-link">
                                        Profile
                                    </Link>
                                </Button>
                            </Fragment>
                        )}
                        {isAuthenticated && (
                            <Fragment>
                                {isAdmin && (
                                    <Fragment>
                                        <Button color="inherit">
                                            <Link
                                                to="/users"
                                                className="navbar-link"
                                            >
                                                Users
                                            </Link>
                                        </Button>
                                        <Button color="inherit">
                                            <Link
                                                to="/roles"
                                                className="navbar-link"
                                            >
                                                Roles
                                            </Link>
                                        </Button>
                                    </Fragment>
                                )}
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Fragment>
                        )}
                        {!isAuthenticated && (
                            <Fragment>
                                <Button color="inherit">
                                    <Link to="/login" className="navbar-link">
                                        Login
                                    </Link>
                                </Button>
                                <Button color="inherit">
                                    <Link to="/signup" className="navbar-link">
                                        Signup
                                    </Link>
                                </Button>
                            </Fragment>
                        )}
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
};

Header.propTypes = {
    isAuthenticated: PropTypes.bool,
    isAdmin: PropTypes.bool,
    logout: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isAdmin: state.user.details.roleId === 1
});

export default withRouter(connect(mapStateToProps, { logout })(Header));
