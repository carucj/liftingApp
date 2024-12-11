


import { NavLink } from "react-router-dom"
import { AppBar, Box, Toolbar, Typography, Button, IconButton } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';

export default function NavBar() {

    return (
        <nav>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            News
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </nav>
    )
}

// const Navbar = () => {
//   return (
//     <AppBar position="static">
//       <Toolbar>
//         <Typography variant="h6" style={{ flexGrow: 1 }}>
//           MyApp
//         </Typography>
//         <Button color="inherit" component={Link} to="/">
//           Home
//         </Button>
//         <Button color="inherit" component={Link} to="/about">
//           About
//         </Button>
//         <Button color="inherit" component={Link} to="/contact">
//           Contact
//         </Button>
//       </Toolbar>
//     </AppBar>
//   );
// };




// const NavBar = () => {
//   return (
//     <nav>
//       <ul>
//         <li>
//           <NavLink to="/">Home</NavLink>
//         </li>
//         <li>
//           <NavLink to="/about">About</NavLink>
//         </li>
//         <li>
//           <NavLink to="/products">Products</NavLink>
//         </li>
//       </ul>
//     </nav>
//   );
// };