import React from 'react';

import classes from './Header.module.scss';

const Header = ({ setIsSettings, isSettings }) => {
    const handleMinimizeWindow = () => {
        if (window.electron && window.electron.hideWindow) {
            window.electron.hideWindow();
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
                        onClick={handleIsSettings}
                    >
                        <i className="fal fa-bars"></i>
                    </button>
                    <button
                        className={classes.btnWindow}
                        onClick={handleMinimizeWindow}
                    >
                        <i className="fal fa-window-minimize" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
