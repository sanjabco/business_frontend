import { useState, useEffect } from 'react';
import PropTypes from "prop-types";

function Countdown({ storedTime }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(storedTime));

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimeLeft = calculateTimeLeft(storedTime);
            setTimeLeft(newTimeLeft);

            if (newTimeLeft.totalSeconds <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [storedTime]);

    function calculateTimeLeft(storedTime) {
        const currentTime = new Date();
        const [storedHours, storedMinutes, storedSeconds] = storedTime.split(':').map(Number);
        const storedDate = new Date(currentTime);
        storedDate.setHours(storedHours, storedMinutes, storedSeconds, 0);

        let totalSeconds = Math.floor((storedDate - currentTime) / 1000);
        if (totalSeconds < 0) totalSeconds = 0;

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return { minutes, seconds, totalSeconds };
    }

    return (
        <div>
            <p>{`${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}</p>
        </div>
    );
}

Countdown.propTypes = {
    storedTime: PropTypes.string
}

export default Countdown;