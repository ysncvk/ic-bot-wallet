import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

const useTelegramTheme = () => {
    const [theme, setTheme] = useState(WebApp.colorScheme);

    useEffect(() => {
        const handleThemeChange = () => {
            setTheme(WebApp.colorScheme);
        };

        WebApp.onEvent('themeChanged', handleThemeChange);

        return () => {
            WebApp.offEvent('themeChanged', handleThemeChange);
        };
    }, []);

    return theme;
};

export default useTelegramTheme;
