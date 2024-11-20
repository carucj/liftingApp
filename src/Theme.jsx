import { createTheme } from '@mui/system';

export default function Theme() {

    const theme = createTheme({
        palette: {
            background: {
                paper: '#fff',
            },
            text: {
                primary: '#173A5E',
                secondary: '#46505A',
            },
            action: {
                active: '#001E3C',
            },
            success: {
                dark: '#009688',
            },
        },
    });

    return theme
}
