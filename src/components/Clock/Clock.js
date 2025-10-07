import React from 'react';

import classes from './Clock.module.scss';

const Clock = ({ date, time, week, pm }) => {
    return (
        <div className={classes.clockContent}>
            <div className={classes.digitalDate}>{date}</div>
            <div className={classes.digitalTime}>
                {time} <span className={classes.digitalPm}>{pm}</span>
            </div>
            <div className={classes.digitalDate}>{week}</div>
        </div>
    );
};

export default Clock;
