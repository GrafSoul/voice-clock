import { useEffect, useRef } from 'react';
import AlarmSound from '../../utils/alarmSound';
import classes from './AlarmNotification.module.scss';

const AlarmNotification = ({ alarm, onDismiss, onSnooze }) => {
    const alarmSoundRef = useRef(null);

    useEffect(() => {
        if (alarm) {
            if (!alarmSoundRef.current) {
                alarmSoundRef.current = new AlarmSound();
            }
            alarmSoundRef.current.play();
        }

        return () => {
            if (alarmSoundRef.current) {
                alarmSoundRef.current.stop();
            }
        };
    }, [alarm]);

    if (!alarm) return null;

    const handleDismiss = () => {
        if (alarmSoundRef.current) {
            alarmSoundRef.current.stop();
        }
        onDismiss();
    };

    const handleSnooze = () => {
        if (alarmSoundRef.current) {
            alarmSoundRef.current.stop();
        }
        onSnooze(5); // Snooze for 5 minutes
    };

    return (
        <div className={classes.overlay}>
            
            <div className={classes.notification}>
                <div className={classes.icon}>
                    <i className="fas fa-bell"></i>
                </div>
                
                <div className={classes.content}>
                    <div className={classes.time}>{alarm.time}</div>
                    {alarm.label && (
                        <div className={classes.label}>{alarm.label}</div>
                    )}
                </div>

                <div className={classes.actions}>
                    <button onClick={handleSnooze} className={classes.snoozeBtn}>
                        <i className="fas fa-clock"></i>
                        <span>Snooze 5min</span>
                    </button>
                    <button onClick={handleDismiss} className={classes.dismissBtn}>
                        <i className="fas fa-times-circle"></i>
                        <span>Dismiss</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlarmNotification;
