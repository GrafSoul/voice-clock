import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';

import Header from './components/Header/Header';
import Clock from './components/Clock/Clock';
import TimeReader from './components/TimeReader/TimeReader';
import AlarmManager from './components/AlarmManager/AlarmManager';
import AlarmList from './components/AlarmList/AlarmList';
import AlarmNotification from './components/AlarmNotification/AlarmNotification';
import classes from './App.module.scss';

const App = () => {
    const [isSettings, setIsSettings] = useState(false);
    const [isAlarmManager, setIsAlarmManager] = useState(false);
    const [alarms, setAlarms] = useState([]);
    const [activeAlarm, setActiveAlarm] = useState(null);
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

    // Load alarms from localStorage on mount
    useEffect(() => {
        const savedAlarms = localStorage.getItem('alarms');
        if (savedAlarms) {
            setAlarms(JSON.parse(savedAlarms));
        }
    }, []);

    // Check alarms every minute
    useEffect(() => {
        const checkAlarms = () => {
            const now = moment();
            const currentTime = now.format('HH:mm');
            const currentDay = now.day();
            const currentDateTime = now.format('YYYY-MM-DD HH:mm');

            alarms.forEach((alarm) => {
                if (
                    alarm.enabled &&
                    alarm.time === currentTime &&
                    alarm.days.includes(currentDay) &&
                    (!alarm.lastTriggered || alarm.lastTriggered !== currentDateTime)
                ) {
                    setActiveAlarm(alarm);
                    // Update last triggered time with full date+time
                    const updatedAlarms = alarms.map((a) =>
                        a.id === alarm.id ? { ...a, lastTriggered: currentDateTime } : a
                    );
                    setAlarms(updatedAlarms);
                    localStorage.setItem('alarms', JSON.stringify(updatedAlarms));
                }
            });
        };

        const intervalId = setInterval(checkAlarms, 1000);
        return () => clearInterval(intervalId);
    }, [alarms]);

    const handleDismissAlarm = () => {
        setActiveAlarm(null);
    };

    const handleSnoozeAlarm = (minutes) => {
        // Just close notification - alarm stays active for next trigger
        setActiveAlarm(null);
    };

    return (
        <main className={classes.mainContent}>
            <Header
                setIsSettings={setIsSettings}
                isSettings={isSettings}
                setIsAlarmManager={setIsAlarmManager}
                isAlarmManager={isAlarmManager}
            />
            <Clock time={time} date={date} week={week} pm={pm} />
            <div
                className={[
                    classes.settingsContent,
                    isSettings ? null : classes.settingsContentHide,
                ].join(' ')}
            >
                <TimeReader hours={hours} min={min} />
            </div>

            <AlarmList alarms={alarms} />

            <AlarmManager
                alarms={alarms}
                setAlarms={setAlarms}
                onClose={isAlarmManager ? () => setIsAlarmManager(false) : null}
            />

            {activeAlarm && (
                <AlarmNotification
                    alarm={activeAlarm}
                    onDismiss={handleDismissAlarm}
                    onSnooze={handleSnoozeAlarm}
                />
            )}
        </main>
    );
};

export default App;
