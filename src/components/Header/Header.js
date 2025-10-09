import { useState, useEffect } from 'react';

import classes from './Header.module.scss';

const Header = ({ setIsSettings, isSettings, setIsAlarmManager, isAlarmManager }) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(true);

    useEffect(() => {
        // Получаем начальное состояние alwaysOnTop
        if (window.electron && window.electron.getAlwaysOnTop) {
            window.electron.getAlwaysOnTop().then(state => {
                setIsAlwaysOnTop(state);
            });
        }
    }, []);

    const handleMinimizeWindow = () => {
        if (window.electron && window.electron.hideWindow) {
            window.electron.hideWindow();
        }
    };

    const handleToggleAlwaysOnTop = async () => {
        if (window.electron && window.electron.toggleAlwaysOnTop) {
            const newState = await window.electron.toggleAlwaysOnTop();
            setIsAlwaysOnTop(newState);
        }
    };

    const handleIsSettings = () => {
        setIsSettings(!isSettings);
    };

    return (
        <div className={classes.header}>
            <div className={classes.topBar}>
                <div className={classes.title}>
                    <img
                        src="./icons/16x16.png"
                        alt="Logo"
                        className={classes.logo}
                    />{' '}
                    Voice Clock
                </div>
                <div>
                    <button
                        className={classes.btnWindow}
                        onClick={handleToggleAlwaysOnTop}
                        title={isAlwaysOnTop ? 'Открепить окно' : 'Закрепить окно поверх'}
                    >
                        <i className={isAlwaysOnTop ? 'fas fa-thumbtack' : 'fal fa-thumbtack'}></i>
                    </button>
                    <button
                        className={classes.btnWindow}
                        onClick={() => setIsAlarmManager(!isAlarmManager)}
                        title="Alarm Settings"
                    >
                        <i className="fal fa-alarm-clock"></i>
                    </button>
                    <button
                        className={classes.btnWindow}
                        onClick={handleIsSettings}
                        title="Voice Settings"
                    >
                        <i className="fal fa-bars"></i>
                    </button>
                    {!isMac && (
                        <button
                            className={classes.btnWindow}
                            onClick={handleMinimizeWindow}
                        >
                            <i className="fal fa-window-minimize" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
