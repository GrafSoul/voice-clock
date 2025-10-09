import { useState, useEffect } from 'react';
import classes from './AlarmManager.module.scss';

const DAYS_OF_WEEK = [
    { id: 0, name: 'Sunday', short: 'Sun' },
    { id: 1, name: 'Monday', short: 'Mon' },
    { id: 2, name: 'Tuesday', short: 'Tue' },
    { id: 3, name: 'Wednesday', short: 'Wed' },
    { id: 4, name: 'Thursday', short: 'Thu' },
    { id: 5, name: 'Friday', short: 'Fri' },
    { id: 6, name: 'Saturday', short: 'Sat' },
];

const AlarmManager = ({ alarms, setAlarms, onClose }) => {
    const [newAlarm, setNewAlarm] = useState({
        time: '08:00',
        label: '',
        days: [],
        enabled: true,
        sound: true,
    });

    const [presetMode, setPresetMode] = useState('custom');

    useEffect(() => {
        try {
            const savedAlarms = localStorage.getItem('alarms');
            if (savedAlarms) {
                const parsed = JSON.parse(savedAlarms);
                if (Array.isArray(parsed)) {
                    setAlarms(parsed);
                } else {
                    console.error('Invalid alarms data in localStorage');
                    localStorage.removeItem('alarms');
                }
            }
        } catch (error) {
            console.error('Failed to load alarms:', error);
            localStorage.removeItem('alarms');
        }
    }, [setAlarms]);

    const saveAlarmsToStorage = (alarmsToSave) => {
        try {
            localStorage.setItem('alarms', JSON.stringify(alarmsToSave));
        } catch (error) {
            console.error('Failed to save alarms:', error);
            alert('Failed to save alarm. Please try again.');
        }
    };

    const handleAddAlarm = () => {
        if (newAlarm.days.length === 0 && presetMode === 'custom') {
            alert('Please select at least one day');
            return;
        }

        let selectedDays = [...newAlarm.days];

        if (presetMode === 'everyday') {
            selectedDays = [0, 1, 2, 3, 4, 5, 6];
        } else if (presetMode === 'weekdays') {
            selectedDays = [1, 2, 3, 4, 5];
        } else if (presetMode === 'weekends') {
            selectedDays = [0, 6];
        } else if (presetMode === 'today') {
            selectedDays = [new Date().getDay()];
        }

        const alarm = {
            id: Date.now(),
            ...newAlarm,
            days: selectedDays,
        };

        const updatedAlarms = [...alarms, alarm];
        setAlarms(updatedAlarms);
        saveAlarmsToStorage(updatedAlarms);

        setNewAlarm({
            time: '08:00',
            label: '',
            days: [],
            enabled: true,
            sound: true,
        });
        setPresetMode('custom');
    };

    const handleDeleteAlarm = (id) => {
        const updatedAlarms = alarms.filter((alarm) => alarm.id !== id);
        setAlarms(updatedAlarms);
        saveAlarmsToStorage(updatedAlarms);
    };

    const handleToggleAlarm = (id) => {
        const updatedAlarms = alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
        );
        setAlarms(updatedAlarms);
        saveAlarmsToStorage(updatedAlarms);
    };

    const toggleDay = (dayId) => {
        if (presetMode !== 'custom') {
            setPresetMode('custom');
        }

        setNewAlarm((prev) => ({
            ...prev,
            days: prev.days.includes(dayId)
                ? prev.days.filter((d) => d !== dayId)
                : [...prev.days, dayId],
        }));
    };

    const getDaysDisplay = (days) => {
        if (days.length === 7) return 'Every day';
        if (days.length === 5 && days.every((d) => d >= 1 && d <= 5))
            return 'Weekdays';
        if (days.length === 2 && days.includes(0) && days.includes(6))
            return 'Weekends';
        return days
            .sort((a, b) => a - b)
            .map((d) => DAYS_OF_WEEK[d].short)
            .join(', ');
    };

    return (
        <div
            className={[
                classes.alarmPanel,
                onClose ? null : classes.alarmPanelHide,
            ].join(' ')}
        >
            <div className={classes.newAlarm}>
                <div className={classes.formGroup}>
                    <label>Time</label>
                    <input
                        type="time"
                        value={newAlarm.time}
                        onChange={(e) =>
                            setNewAlarm({ ...newAlarm, time: e.target.value })
                        }
                        className={classes.timeInput}
                    />
                </div>

                <div className={classes.formGroup}>
                    <label>Repeat</label>
                    <div className={classes.presetButtons}>
                        <button
                            className={
                                presetMode === 'today' ? classes.active : ''
                            }
                            onClick={() => setPresetMode('today')}
                        >
                                    Today
                        </button>
                        <button
                            className={
                                presetMode === 'everyday' ? classes.active : ''
                            }
                            onClick={() => setPresetMode('everyday')}
                        >
                                    Every day
                        </button>
                        <button
                            className={
                                presetMode === 'weekdays' ? classes.active : ''
                            }
                            onClick={() => setPresetMode('weekdays')}
                        >
                                    Weekdays
                        </button>
                        <button
                            className={
                                presetMode === 'weekends' ? classes.active : ''
                            }
                            onClick={() => setPresetMode('weekends')}
                        >
                                    Weekends
                        </button>
                        <button
                            className={
                                presetMode === 'custom' ? classes.active : ''
                            }
                            onClick={() => setPresetMode('custom')}
                        >
                                    Custom
                        </button>
                    </div>
                </div>

                {presetMode === 'custom' && (
                    <div className={classes.formGroup}>
                        <label>Select Days</label>
                        <div className={classes.daysSelector}>
                            {DAYS_OF_WEEK.map((day) => (
                                <button
                                    key={day.id}
                                    className={
                                        newAlarm.days.includes(day.id)
                                            ? classes.active
                                            : ''
                                    }
                                    onClick={() => toggleDay(day.id)}
                                >
                                    {day.short}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={handleAddAlarm}
                    className={classes.addButton}
                >
                    <i className="fas fa-plus"></i> Add Alarm
                </button>
            </div>

            <div className={classes.alarmsList}>
                {alarms.length === 0 ? (
                    <p className={classes.emptyState}>
                                No alarms set. Create your first alarm above.
                    </p>
                ) : (
                    <div className={classes.alarmsGrid}>
                        {alarms.map((alarm) => (
                            <div key={alarm.id} className={classes.alarmCard}>
                                <div className={classes.alarmHeader}>
                                    <div className={classes.alarmTime}>
                                        {alarm.time}
                                    </div>
                                    <label className={classes.switch}>
                                        <input
                                            type="checkbox"
                                            checked={alarm.enabled}
                                            onChange={() =>
                                                handleToggleAlarm(alarm.id)
                                            }
                                        />
                                        <span className={classes.slider}></span>
                                    </label>
                                </div>
                                <div className={classes.alarmDays}>
                                    {getDaysDisplay(alarm.days)}
                                </div>
                                <button
                                    onClick={() => handleDeleteAlarm(alarm.id)}
                                    className={classes.deleteBtn}
                                >
                                    <i className="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlarmManager;
