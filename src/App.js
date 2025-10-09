import React, { useEffect, useState, useCallback, useRef } from 'react';
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
    
    // Ref to track current alarms without recreating interval
    const alarmsRef = useRef(alarms);

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
        try {
            const savedAlarms = localStorage.getItem('alarms');
            if (savedAlarms) {
                const parsed = JSON.parse(savedAlarms);
                if (Array.isArray(parsed)) {
                    setAlarms(parsed);
                } else {
                    console.error('Invalid alarms data in localStorage, resetting');
                    localStorage.removeItem('alarms');
                }
            }
        } catch (error) {
            console.error('Failed to load alarms from localStorage:', error);
            localStorage.removeItem('alarms');
        }
    }, []);

    // Update ref when alarms change
    useEffect(() => {
        alarmsRef.current = alarms;
    }, [alarms]);

    // Check alarms every second - interval created ONCE
    useEffect(() => {
        const checkAlarms = () => {
            try {
                const now = moment();
                const currentTime = now.format('HH:mm');
                const currentDay = now.day();
                const currentDateTime = now.format('YYYY-MM-DD HH:mm');

                alarmsRef.current.forEach((alarm) => {
                    if (
                        alarm.enabled &&
                        alarm.time === currentTime &&
                        alarm.days.includes(currentDay) &&
                        (!alarm.lastTriggered || alarm.lastTriggered !== currentDateTime)
                    ) {
                        setActiveAlarm(alarm);
                        // Update last triggered time with full date+time
                        const updatedAlarms = alarmsRef.current.map((a) =>
                            a.id === alarm.id ? { ...a, lastTriggered: currentDateTime } : a
                        );
                        setAlarms(updatedAlarms);
                        try {
                            localStorage.setItem('alarms', JSON.stringify(updatedAlarms));
                        } catch (storageError) {
                            console.error('Failed to save alarm state:', storageError);
                        }
                    }
                });
            } catch (error) {
                console.error('Error checking alarms:', error);
            }
        };

        const intervalId = setInterval(checkAlarms, 1000);
        return () => clearInterval(intervalId);
    }, []); // Empty deps - interval created ONCE, uses ref for current alarms

    const handleDismissAlarm = () => {
        setActiveAlarm(null);
    };

    const handleSnoozeAlarm = (minutes) => {
        // Just close notification - alarm stays active for next trigger
        setActiveAlarm(null);
    };

    const activeAlarmsCount = alarms.filter((alarm) => alarm.enabled).length;

    return (
        <main className={classes.mainContent}>
            <Header
                setIsSettings={setIsSettings}
                isSettings={isSettings}
                setIsAlarmManager={setIsAlarmManager}
                isAlarmManager={isAlarmManager}
            />
            <Clock time={time} date={date} week={week} pm={pm} activeAlarmsCount={activeAlarmsCount} />
            <div
                className={[
                    classes.settingsContent,
                    isSettings ? null : classes.settingsContentHide,
                ].join(' ')}
            >
                <TimeReader hours={hours} min={min} />
            </div>

            <AlarmList alarms={alarms} setIsAlarmManager={setIsAlarmManager} />

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
