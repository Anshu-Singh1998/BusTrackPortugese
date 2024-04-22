//***********created by Himanshi feb 2024***********************/
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import moment from 'moment-timezone';
import Api from '../Api/Api';
import { useTimeZone } from './utils/TimeZoneContext';

const TimeCalculator = ({ id, stopId }) => {
    const [timestamp, setTimestamp] = useState(null);
    const { timeZone } = useTimeZone();
    // console.log("-------TimeCalculator---stopId----------->++++",stopId)
    // console.log("-------TimeCalculator---patterns--id---------->+++++",id)

    useEffect(() => {
        getPatternDetailById(id, stopId);
    }, [id, stopId]);

    const synchronizeTimezones = (arrivalTime) => {
        const localTime = moment.tz(arrivalTime, 'HH:mm:ss', 'Europe/London');
        return localTime.clone().tz(timeZone);
    };

    const getPatternDetailById = async (id, stopId) => {
        try {
            const response = await Api.get(`patterns/${id}`);
            const patternData = response.data;
            const trips = patternData?.trips;

            for (const trip of trips) {
                const index = trip.schedule.findIndex(scheduleItem => scheduleItem?.stop_id === stopId);
                if (index !== -1) {
                    const currentTime = moment().tz(timeZone);
                  //  console.log("--------currentTime------->",currentTime)
                    const arrivalTime = synchronizeTimezones(trip.schedule[index]?.arrival_time);
                   // console.log("--------arrivalTime------------->",arrivalTime)
                    if (arrivalTime.isAfter(currentTime)) {
                        const differenceInSeconds = arrivalTime.diff(currentTime, 'seconds');
                      //  console.log("--------differenceInSeconds----------------->",secondsToHM(differenceInSeconds))
                        setTimestamp(secondsToHM(differenceInSeconds));
                        return; // Exit loop after setting timestamp
                    }
                }
            }
            setTimestamp('N/A'); // No valid arrival time found
        } catch (error) {
           // console.error('Error fetching data:', error);
            // Display error message or trigger a reload
        }
    };

    function secondsToHM(secs) {
        if (!secs || !Number.isFinite(secs)) return '';
        const minutes = Math.floor((secs / 60) % 60);
        const hours = Math.floor(secs / 3600);
        return hours > 0 ? `${hours} hours ${minutes} mins` : `${minutes} mins`;
    }

   // console.log("timestamp------->",timestamp)
    return <Text style={styles.TimeText}>{timestamp}</Text>;
};

const styles = StyleSheet.create({
    TimeText: {
        color: '#00D530',
        fontSize: 12,
        fontWeight: '600',
        fontStyle: 'normal',
    },
});

export default TimeCalculator;
