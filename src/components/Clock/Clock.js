import React from 'react';

import classes from './Clock.module.scss';

const Clock = ({ date, time, week, pm, activeAlarmsCount }) => {
    return (
        <div className={classes.clockContent}>
            <div className={classes.digitalDate}>
                {activeAlarmsCount > 3 ? `${week}, ${date}` : date}
            </div>
            <div className={classes.digitalTime}>
                {time} <span className={classes.digitalPm}>{pm}</span>
            </div>
            {activeAlarmsCount <= 3 && (
                <div className={classes.digitalDate}>{week}</div>
            )}
        </div>
    );
};

export default Clock;
