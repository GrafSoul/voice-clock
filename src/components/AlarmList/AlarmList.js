import classes from './AlarmList.module.scss';

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AlarmList = ({ alarms }) => {
    const activeAlarms = alarms.filter((alarm) => alarm.enabled);

    if (activeAlarms.length === 0) {
        return null;
    }

    const getDaysDisplay = (days) => {
        if (days.length === 7) return 'Every day';
        if (days.length === 5 && days.every((d) => d >= 1 && d <= 5))
            return 'Weekdays';
        if (days.length === 2 && days.includes(0) && days.includes(6))
            return 'Weekends';
        return days
            .sort((a, b) => a - b)
            .map((d) => DAYS_SHORT[d])
            .join(', ');
    };

    return (
        <div className={classes.alarmList}>
            {activeAlarms.map((alarm) => (
                <div key={alarm.id} className={classes.alarmItem}>
                    <i className="fas fa-bell"></i>
                    <span className={classes.time}>{alarm.time}</span>
                    {alarm.label && (
                        <span className={classes.label}> - {alarm.label}</span>
                    )}
                    <span className={classes.days}>({getDaysDisplay(alarm.days)})</span>
                </div>
            ))}
        </div>
    );
};

export default AlarmList;
