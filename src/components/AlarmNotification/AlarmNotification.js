import { useEffect, useRef } from 'react';
import AlarmSound from '../../utils/alarmSound';
import classes from './AlarmNotification.module.scss';

const AlarmNotification = ({ alarm, onDismiss, onSnooze }) => {
    const alarmSoundRef = useRef(null);

    useEffect(() => {
        if (alarm) {
            try {
                if (!alarmSoundRef.current) {
                    alarmSoundRef.current = new AlarmSound();
                }
                alarmSoundRef.current.play();
            } catch (error) {
                console.error('Failed to play alarm sound:', error);
                // Continue showing notification even if sound fails
            }
        }

        return () => {
            try {
                if (alarmSoundRef.current) {
                    alarmSoundRef.current.stop();
                }
            } catch (error) {
                console.error('Failed to stop alarm sound:', error);
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
            
            <div className={classes.icon}>
                <i className="fas fa-bell"></i>
            </div>
                
            <div className={classes.content}>
                <div className={classes.time}>{alarm.time}</div>
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
    );
};

export default AlarmNotification;
