import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';

import Header from './components/Header/Header';
import Clock from './components/Clock/Clock';
import TimeReader from './components/TimeReader/TimeReader';
import classes from './App.module.scss';

const App = () => {
    const [isSettings, setIsSettings] = useState(false);
    const [time, setTime] = useState(moment().format('HH:mm:ss'));
    const [date, setData] = useState(moment().format('Do MMMM YYYY'));
    const [hours, setHours] = useState(moment().format('HH'));
    const [min, setMin] = useState(moment().format('mm'));
    const [week, setWeek] = useState(moment().format('dddd'));
    const [pm, setPm] = useState(moment().format('a'));

    const updateTime = useCallback(() => {
        const now = moment();
        setTime(now.format('HH:mm:ss'));
        setData(now.format('Do MMMM YYYY'));
        setHours(now.format('HH'));
        setMin(now.format('mm'));
        setWeek(now.format('dddd'));
        setPm(now.format('a'));
    }, []);

    useEffect(() => {
        const intervalId = setInterval(updateTime, 1000);
        return () => clearInterval(intervalId);
    }, [updateTime]);

    return (
        <main className={classes.mainContent}>
            <Header setIsSettings={setIsSettings} isSettings={isSettings} />
            <Clock time={time} date={date} week={week} pm={pm} />
            <div
                className={[
                    classes.settingsContent,
                    isSettings ? null : classes.settingsContentHide,
                ].join(' ')}
            >
                <TimeReader hours={hours} min={min} />
            </div>
        </main>
    );
};

export default App;
