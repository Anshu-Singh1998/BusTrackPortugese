import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
  Animated,
  Alert,
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Star from '../../Assets/NewImages/Star.png';
import close from '../../Assets/NewImages/close.png';
import closewhite from '../../Assets/NewImages/close-white.png'
import RNFetchBlob from 'rn-fetch-blob'
import Warning from '../../Assets/images/Warning.png';
import DoubleArrow from '../../Assets/images/DoubleArrow.png';
import DoubleFacedArrow from '../../Assets/images/DoubleFacedArrow.png';
import CrossImage from '../../Assets/NewImages/CrossImage.png';
import Preview from '../../Assets/NewImages/Preview.png';
import MapPin from '../../Assets/NewImages/MapPin.png';
import bikeparking from '../../Assets/NewImages/bike-parking.png';
import bikesharing from '../../Assets/NewImages/bike-sharing.png';
import boat from '../../Assets/NewImages/boat.png';
import bus from '../../Assets/NewImages/bus.png';
import healthclinic from '../../Assets/NewImages/health_clinic.png';
import hospital from '../../Assets/NewImages/hospital.png';
import navegante from '../../Assets/NewImages/navegante.png';
import public_office from '../../Assets/NewImages/public_office.png';
import school from '../../Assets/NewImages/schoolPng.png';
import shopping from '../../Assets/NewImages/shopping.png';
import subway from '../../Assets/NewImages/subway.png';
import tram from '../../Assets/NewImages/tram.png';
import wheelchair from '../../Assets/NewImages/wheelchair.png';
import ClockIcon from '../../Assets/NewImages/ClockIcon.png';
import Modal from 'react-native-modal';
import Api from '../Api/Api';
import MovingBus from '../../Assets/NewImages/MovingBus.png';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

const MAX_VISIBLE_WAYPOINTS = 15;

const SearchLinesDetails = ({ route }) => {
  const wholeSelectedItem = route.params.wholeSelectedItem;
  const [visible, setVisible] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [scheduledTimeModal, setScheduledTimeModal] = useState(false);
  const [alert, setAlert] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowAlert, setShouldShowAlert] = useState(false);
  const [filteredStops, setFilteredStops] = useState([]);
  const [stopCoordinates, setStopCoordinates] = useState([]);
  const [travelTime, setTravelTime] = useState(null);
  const [shapeId, setShapeId] = useState(null);
  const [shapesData, setShapesData] = useState([]);
  const [headsigns, setHeadsigns] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [vehicleCoordinates, setVehicleCoordinates] = useState(null);
  const [vehiclePosition] = useState(new Animated.Value(0));
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [lineId, setLineId] = useState(null);
  const [direction, setDirection] = useState(null);
  const [extractedHours, setExtractedHours] = useState([]);
  const [extractedMinutes, setExtractedMinutes] = useState([]);
  const [downloadError, setDownloadError] = useState(null);
  const [trips, setTrips] = useState([]);
  const [busSchedules, setBusSchedules] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [visibleWaypoints, setVisibleWaypoints] = useState(
    stopCoordinates.slice(0, MAX_VISIBLE_WAYPOINTS),
  );
  const [lisbonTime, setLisbonTime] = useState(Date.now());
  const mapRef = useRef(null);
  const handleRegionChange = () => {
    const newVisibleWaypoints = stopCoordinates.slice(0, MAX_VISIBLE_WAYPOINTS);
    setVisibleWaypoints(newVisibleWaypoints);
  };
  const GOOGLE_MAPS_APIKEY = 'AIzaSyANNnQQ9GU6Jymw1ZpdJP0dPQgDPr3SViU';
  useEffect(() => {
    const fetchAlertData = async () => {
      setLoading(true);
      try {
        const response = await Api.get('alerts');
        const alertData = response.data.entity || [];
        const filteredAlerts = alertData.filter(alert => {
          if (alert.alert.informedEntity) {
            return alert.alert.informedEntity.some(entity => {
              return (
                (entity.routeId &&
                  wholeSelectedItem.routes.includes(entity.routeId)) ||
                (entity.stopId && wholeSelectedItem.stopId === entity.stopId)
              );
            });
          }
          return false;
        });
        setAlert(filteredAlerts);
        if (filteredAlerts.length > 0) {
          setShouldShowAlert(true);
        } else {
          setShouldShowAlert(false);
        }
      } catch (error) {
        console.error('Error fetching data:-----', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlertData();
  }, []);
  useEffect(() => {
    const loadLabelValue = async () => {
      let headsignArray = [];

      if (wholeSelectedItem) {
        for (let i = 0; i < wholeSelectedItem.patterns.length; i++) {
          try {
            const pattern = wholeSelectedItem.patterns[i];
            const response = await Api.get(`patterns/${pattern}`);
            headsignArray.push({ key: pattern, value: response.data.headsign });
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
        setHeadsigns(headsignArray);
        if (headsignArray.length > 0) {
          const initialPatternId = headsignArray[0].key;
          setSelectedValue(initialPatternId);
          fetchVehicleData(initialPatternId);
        }
      }
    };
    loadLabelValue();
  }, [wholeSelectedItem]);
  useEffect(() => {
    if (selectedValue) {
      fetchVehicleData(selectedValue);

      // const vehicleUpdateInterval = setInterval(() => {
      //   fetchVehicleData(selectedValue);
      // }, 10000);

      // return () => clearInterval(vehicleUpdateInterval);
    }
  }, [selectedValue]);

  const fetchVehicleData = async selectedValue => {
    try {
      const response = await Api.get('vehicles');
      const matchedVehicle = response.data.find(
        vehicle => vehicle.pattern_id === selectedValue,
      );
      if (matchedVehicle) {
        updateVehiclePosition({
          latitude: matchedVehicle.lat,
          longitude: matchedVehicle.lon,
        });
      } else {
        // console.log('No matching Vechile found for current trip.');
        //Alert.alert('No matching Vehicles found for current trip.');
      }
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      //Alert.alert('Error fetching vehicle data:', error);
    }
  };
  const updateVehiclePosition = newCoordinates => {
    Animated.timing(vehiclePosition, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      setVehicleCoordinates(newCoordinates);
      vehiclePosition.setValue(0);
    });
  };
  useEffect(() => {
    fetchData(selectedValue);
  }, [selectedValue]);
  const fetchData = async selectedValue => {
    try {
      const timeToleranceSeconds = 900;
      const offsetMinutes = 0;
      const currentLisbonTime = new Date();
      currentLisbonTime.setMinutes(
        currentLisbonTime.getMinutes() - offsetMinutes,
      );
      setLisbonTime(currentLisbonTime.getTime());
      let extractedHours = [];
      let extractedMinutes = [];
      console.log(
        'Current Lisbon Time:+++++++++++++++++++',
        currentLisbonTime,
        currentLisbonTime.getTime(),
      );
      const response = await Api.get(`patterns/${selectedValue}`);
      if (
        !response ||
        !response.data ||
        !response.data.trips ||
        !response.data.path
      ) {
        return;
      }
      const responseData = response.data;
      const lineIdFromResponse = responseData.line_id;
      const directionFromResponse = responseData.direction;
      setLineId(lineIdFromResponse);
      setDirection(directionFromResponse);
      const extractedShapeId = responseData.shape_id;
      setShapeId(extractedShapeId);
      setTrips(responseData.trips);
      const extractedStops = response.data.path.map(item => ({
        id: item.stop.id,
        name: item.stop.name,
        distance_delta: item.distance_delta,
        stop_sequence: item.stop_sequence,
        facilities: item.stop.facilities,
        lines: item.stop.lines,
        showDatePicker: false,
        selectedDate: new Date(),
        IsSelected: false,
        isModalVisible: false
      }));
      setFilteredStops(extractedStops);
      const extractedCoordinates = response.data.path.map(item => ({
        lat: parseFloat(item.stop.lat),
        lon: parseFloat(item.stop.lon),
      }));

      setStopCoordinates(extractedCoordinates);
      const realTimeDataMapped = extractedStops.map(item => ({
        id: item.id,
        lines: item.lines,
      }));
      const realTimeDataPromises = realTimeDataMapped.map(async stop => {
        try {
          const realTimeResponse = await Api.get(`stops/${stop.id}/realtime`);
          setFilteredStops(m => {
            const newm = m.map((item1, index) => {

              if (item1.id == stop.id) {
                var nextArrivalInner = realTimeResponse.data.find(data => {
                  if (
                    Math.floor(lisbonTime / 1000) <=
                    data.scheduled_arrival_unix &&
                    selectedValue == data.pattern_id &&
                    item1.id == stop.id
                  ) {

                    return {
                      next_arrival_min:
                        (Math.floor(lisbonTime / 1000) -
                          data.scheduled_arrival_unix) /
                        60,
                    };
                  }
                });
                var Schedules = realTimeResponse.data.filter(data => {
                  if (
                    Math.floor(lisbonTime / 1000) <=
                    data.scheduled_arrival_unix &&
                    selectedValue == data.pattern_id &&
                    item1.id == stop.id
                  ) {
                    this.count++;
                    return true;
                  }
                  return false;
                }, { count: 0 });
                
                return {
                  ...item1,
                  nextSchedules: Schedules,
                  arrivals: {
                    line_id: nextArrivalInner && nextArrivalInner.line_id,
                    pattern_id: nextArrivalInner && nextArrivalInner.pattern_id,
                    scheduledArrival: nextArrivalInner && nextArrivalInner.scheduled_arrival,
                    estimatedArrival: nextArrivalInner && nextArrivalInner.estimated_arrival,
                    observedArrival: nextArrivalInner && nextArrivalInner.observed_arrival
                  },
                  nextArrival: nextArrivalInner
                };
              }
              return { ...item1 };
            });

            return newm;
          });

          return {
            id: stop.id,
            lines: stop.lines,
            realTimeData: realTimeResponse.data,
          };

        } catch (realTimeError) {
          console.error('Error fetching real-time data:', realTimeError);
          return null;
        }
      });

      //   console.log("Repeating");
      setExtractedHours(extractedHours);
      setExtractedMinutes(extractedMinutes);

    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchShapesData = async () => {
      try {
        const response = await Api.get(`shapes/${shapeId}`);
        if (response && response.data && Array.isArray(response.data.points)) {
          const points = response.data.points;

          const extractedPoints = points.map(point => ({
            shape_pt_lat: point.shape_pt_lat,
            shape_pt_lon: point.shape_pt_lon,
          }));

          setShapesData(extractedPoints);
        } else {
          console.error('API response structure is not as expected');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Loading Shapes Data');
      }
    };

    fetchShapesData();
  }, [shapeId]);

  const handleMapReady = () => {
    if (mapRef.current && stopCoordinates.length > 0) {
      const markersToZoom = stopCoordinates.map(item => {
        return {
          latitude: item.lat,
          longitude: item.lon,
        };
      });
      mapRef.current.fitToCoordinates(markersToZoom);
    }
  };
  const handleMapPress = () => {
    const newRegion = {
      latitude: stopCoordinates[0].lat,
      longitude: stopCoordinates[0].lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current.animateToRegion(newRegion, 500);
  };
  const handleDateChange = (selectedDate, id) => {
    setFilteredStops(m => {
      const newm = m.map((item1, index) => {

        if (item1.id == id) {


          return { ...item1, showDatePicker: false, selectedDate: selectedDate };
        }
        return { ...item1 };
      });

      return newm;
    });
    console.log("Date Handling=====>>>", selectedDate)
    // setShowDatePicker(Platform.OS === 'ios'); // Hide the picker on iOS automatically

    setSchedules(id, selectedDate);

  };
  const showDatePickerModal = (id) => {


    setFilteredStops(m => {
      const newm = m.map((item1, index) => {

        if (item1.id == id) {


          return { ...item1, showDatePicker: !item1.showDatePicker };
        }
        return { ...item1 };
      });

      return newm;
    });


  };
  // Function to format the date based on Portugal/Lisbon time zone
  const formatDate = date => {
    console.log("Date=====>>>", date)
    // date picker pdf screen
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Lisbon',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };
  // created by sameer pdf screen
  const setSchedules = (stop_id, date) => {
    var time_array = [];
    var today = date
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '' + mm + '' + dd;
    trips.forEach(trip => {
      if (trip.dates.includes(today)) {
        trip.schedule.forEach(schedule => {
          if (schedule.stop_id == stop_id) {
            time_array.push(schedule.arrival_time);
          }
        });
      }
    });
    var slot = [];
    time_array.forEach(function (val, index) {
      var h = val.split(':')[0];
      var m = val.split(':')[1];
      if (index !== 0) {
        // console.log('test');
        if (time_array[index - 1].split(':')[0] == h) {
          // console.log('test');
          slot = slot.filter(function (arr) {
            if (arr.hour == h) {
              arr.min.push(m);
            }
            return arr;
          });
          return;
        }
      }
      slot.push({ hour: h, min: [m] });
    });
    console.log("sss", slot.length)

    setBusSchedules(slot);
    setFilteredStops(m => {
      const newm = m.map((item1, index) => {

        if (item1.id == stop_id) {


          return { ...item1, isModalVisible: true };
        }
        return { ...item1 };
      });

      return newm;
    })
  };

  const downloadFile = async id => {
    const pattern_direction = selectedValue.split("_")[2];
    console.log('LineId=======>>>>', lineId),
      console.log('Directionn======>>>>>', pattern_direction),
      console.log('StopId=========>>>>', id);
    if (lineId === null || pattern_direction === null) {
      console.log('lineId or pattern direction is null. Unable to download the file.');
      return;
    }

    const fileUrl = `https://storage.carrismetropolitana.pt/static/pdfs/horarios/horario-singular-${id}-${lineId}-${pattern_direction}.pdf`;
    console.log("FileURL", fileUrl)
    const fileName = `horario-singular-${id}-${lineId}-${pattern_direction}.pdf`;

    try {
      const res = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'pdf',
        path: `${RNFetchBlob.fs.dirs.DocumentDir}/${fileName}`,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: fileName,
          description: 'File downloaded by download manager.',
          mime: 'application/pdf',
        },
      }).fetch('GET', fileUrl);

      if (Platform.OS === 'ios') {
        const filePath = res.path();
        const options = {
          type: 'application/pdf',
          url: filePath,
          saveToFiles: true,
        };
        Share.open(options)
          .then(resp => console.log(resp))
          .catch(err => console.log(err));
      }
    } catch (err) {
      setDownloadError(err);
      console.log('BLOB ERROR -> ', err);
    }
  };

  const handleScroll = (it) => {
    console.log("IT>>>>>>>>>>>>", it)
  }

  const Steps = () => {
    if (!filteredStops) {
      return <ActivityIndicator size={'large'} />;
    }


    return (
      <View>
        {filteredStops ? (
          <FlatList
            data={filteredStops}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => {
              // console.log('Item====>>>>', item);
              const isItemSelected = selectedItemIds.includes(item.id);
              //  console.log("itemselected", isItemSelected);
              const handleItemSelection = () => {
                setSelectedItemIds(prevSelectedItems => {
                  const newSelectedItems = new Set(prevSelectedItems);
                  if (isItemSelected) {
                    newSelectedItems.delete(item.id); // Deselect the item
                  } else {
                    newSelectedItems.add(item.id); // Select the item
                  }
                  return Array.from(newSelectedItems);
                });
              };
              return (
                <View>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        //setIsLoading(true);

                        //     await new Promise(resolve => setTimeout(resolve, 1000));

                        handleItemSelection();
                        //   setIsLoading(false);
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          right: -36,
                          top: -10,
                          borderRadius: 8,
                          marginBottom: isItemSelected ? 32 : -20,
                        }}>
                        <View
                          style={{
                            width: '100%',
                            backgroundColor: isItemSelected
                              ? '#fff'
                              : 'transparent',
                            padding: 20,
                          }}>
                          <View
                            style={{
                              height: isItemSelected ? 7 : 4,
                              width: isItemSelected ? 7 : 4,
                              borderRadius: isItemSelected ? 4 : 2,
                              borderColor: '#fff',
                              backgroundColor: '#fff',
                              left: isItemSelected ? -32 : -31,
                              bottom: -5,
                            }}></View>
                          <View style={{ left: -22, bottom: -2, padding: 2 }}>
                            <View
                              style={{
                                height: 2,
                                width: 25,
                                backgroundColor: '#000',
                                right: 0,
                              }}></View>
                            <View style={{ top: -10, right: -25 }}>
                              <View>
                                <Text
                                  style={{
                                    color: '#000',
                                    fontSize: 14,
                                    fontWeight: '700',
                                    fontFamily: 'Inter-SemiBold',
                                  }}>
                                  {item.name}
                                </Text>
                              </View>
                              {isItemSelected ? (
                                <View style={styles.FacilitiesIconArrow}>
                                  {item.facilities &&
                                    item.facilities.includes('bike-parking') ? (
                                    <View style={styles.BikeParkingView}>
                                      <Image
                                        source={bikeparking}
                                        style={styles.BikeParkingIcon}
                                      />
                                    </View>
                                  ) : null}
                                  {item.facilities &&
                                    item.facilities.includes('bike-sharing') ? (
                                    <View style={styles.BikeSharingView}>
                                      <Image
                                        source={bikesharing}
                                        style={styles.BikeSharingIcon}
                                      />
                                    </View>
                                  ) : null}
                                  {item.facilities &&
                                    item.facilities.includes('boat') ? (
                                    <View style={styles.BoatView}>
                                      <Image
                                        source={boat}
                                        style={styles.BoatIcon}
                                      />
                                    </View>
                                  ) : null}
                                  {item.facilities &&
                                    item.facilities.includes('bus') ? (
                                    <View style={styles.BusView}>
                                      <Image
                                        source={bus}
                                        style={styles.BusIcon}
                                      />
                                    </View>
                                  ) : null}
                                  {item.facilities &&
                                    item.facilities.includes('health_clinic') ? (
                                    <View style={styles.HealthClinicView}>
                                      <Image
                                        source={healthclinic}
                                        style={styles.HealthClinicIcon}
                                      />
                                    </View>
                                  ) : null}
                                  {item.facilities &&
                                    item.facilities.includes('hospital') ? (
                                    <View style={styles.HospitalView}>
                                      <Image
                                        source={hospital}
                                        style={styles.HospitalIcon}
                                      />
                                    </View>
                                  ) : null}
                                  {item.facilities &&
                                    item.facilities.includes('navegante') ? (
                                    <View style={styles.NavegateView}>
                                      <Image
                                        source={navegante}
                                        style={styles.NavegateIcon}
                                      />
                                    </View>
                                  ) : null}
                                  {item.facilities &&
                                    item.facilities.includes('public_office') ? (
                                    <View style={styles.PublicOfficeView}>
                                      <Image
                                        source={public_office}
                                        style={styles.PublicOfficeIcon}
                                      />
                                    </View>
                                  ) : null}
                                  {item.facilities &&
                                    item.facilities.includes('school') ? (
                                    <View style={styles.SchoolView}>
                                      <Image
                                        source={school}
                                        style={styles.SchoolIcon}
                                      />
                                    </View>
                                  ) : null}
                                  {item.facilities &&
                                    item.facilities.includes('shopping') ? (
                                    <View style={styles.ShoppingView}>
                                      <Image
                                        source={shopping}
                                        style={styles.ShoppingIcon}
                                      />
                                    </View>
                                  ) : null}
                                  {item.facilities &&
                                    item.facilities.includes('subway') ? (
                                    <View style={styles.SubwayView}>
                                      <Image
                                        source={subway}
                                        style={styles.SubwayIcon}
                                      />
                                    </View>
                                  ) : null}
                                  {item.facilities &&
                                    item.facilities.includes('tram') ? (
                                    <View style={styles.TramView}>
                                      <Image
                                        source={tram}
                                        style={styles.TramIcon}
                                      />
                                    </View>
                                  ) : null}
                                  {item.facilities &&
                                    item.facilities.includes('wheelchair') ? (
                                    <View>
                                      <Image
                                        source={wheelchair}
                                        style={styles.WheelChairIcon}
                                      />
                                    </View>
                                  ) : null}
                                </View>
                              ) : null}
                              {isItemSelected ? (
                                <View style={{ paddingTop: 5 }}>
                                  <Text
                                    style={{
                                      color: '#B9B9B9',

                                      fontSize: 10,
                                      fontWeight: '400',

                                      textAlign: 'left',
                                      fontFamily: 'Inter-SemiBoldItalic',
                                    }}>
                                    Próximas circulações
                                  </Text>
                                </View>
                              ) : null}
                              <View
                                style={{ flexDirection: 'row', paddingTop: 10 }}>
                                {item.nextArrival &&
                                  <View style={{ bottom: -5 }}>
                                    <View
                                      style={{
                                        height: 15,
                                        width: 15,
                                        borderRadius: 7.5,
                                        backgroundColor: '#d5fcd2',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <View
                                        style={{
                                          height: 3.75,
                                          width: 3.75,
                                          borderRadius: 2,
                                          backgroundColor: '#00D530',
                                        }}></View>
                                    </View>
                                  </View>
                                }
                                {item.nextArrival &&
                                  <View style={styles.TravelTimeTextView}>
                                    {/* <Text>7min</Text> */}
                                    <Text style={styles.TravelTimeText}>
                                      {
                                        Math.ceil(
                                          (item.nextArrival
                                            .scheduled_arrival_unix -
                                            Math.floor(lisbonTime / 1000)) /
                                          60,
                                        )}{' '}
                                      min
                                    </Text>
                                  </View>
                                }
                                {isItemSelected && item.arrivals && (
                                  <View
                                    style={{
                                      paddingLeft: 10,
                                      flexDirection: 'row',
                                      paddingTop: 3,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <View style={{ paddingRight: 5 }}>
                                      <Image
                                        source={ClockIcon}
                                        style={styles.ArrivalClockIcon}
                                      />
                                    </View>
                                    {item.nextSchedules.slice(0, 3).map((arrivalType, y) => (
                                      <View
                                        key={y}
                                        style={styles.ArrivalTypeTextView}>
                                        <Text style={styles.ArrivalTypeText}>
                                          {arrivalType.scheduled_arrival &&
                                            arrivalType.scheduled_arrival
                                              .split(':')
                                              .slice(0, 2)
                                              .join(':')}
                                        </Text>
                                      </View>
                                    ))}
                                  </View>
                                )}
                              </View>

                              {isItemSelected ? (
                                <View>
                                  <View
                                    style={[
                                      styles.HorariosSobreAParagemView,
                                      { left: -10 },
                                    ]}>
                                    <View style={styles.HorariosButtonView}>
                                      <TouchableWithoutFeedback>
                                        <TouchableOpacity
                                          style={styles.HorariosButton}
                                          onPress={() => {
                                            setSchedules(item.id, item.selectedDate);
                                          }}>
                                          <View
                                            style={[
                                              styles.HorariosButtonTextIconView,
                                              { backgroundColor: '', left: 1 },
                                            ]}>
                                            <Image
                                              source={ClockIcon}
                                              style={styles.HorariosButtonIcon}
                                            />
                                            <Text
                                              style={styles.HorariosButtonText}>
                                              Horários
                                            </Text>
                                          </View>
                                        </TouchableOpacity>
                                      </TouchableWithoutFeedback>
                                    </View>
                                    <View
                                      style={styles.SobreAParagemButtonView}>
                                      <TouchableOpacity
                                        style={styles.SobreAParagemButton}>
                                        <View
                                          style={[
                                            styles.SobreAParagemIconTextView,
                                            { backgroundColor: '', left: 1 },
                                          ]}>
                                          <Image
                                            source={MapPin}
                                            style={
                                              styles.SobreAParagemButtonIcon
                                            }
                                          />
                                          <Text
                                            style={
                                              styles.SobreAParagemButtonText
                                            }>
                                            Sobre a Paragem
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                  <Modal
                                    style={styles.ModalContainer}
                                    isVisible={item.isModalVisible}
                                    onBackdropPress={() =>
                                      setFilteredStops(m => {
                                        const newm = m.map((item1, index) => {

                                          if (item1.id == item.id) {


                                            return { ...item1, isModalVisible: false };
                                          }
                                          return { ...item1 };
                                        });

                                        return newm;
                                      })}>
                                    <View style={styles.TimeModalContainer}>
                                      <View
                                        style={
                                          styles.HorariosPrevistosTextView
                                        }>
                                        <View>
                                          <Text
                                            style={
                                              styles.HorariosPrevistosText
                                            }>
                                            Horários previstos
                                          </Text>
                                        </View>
                                        <TouchableOpacity
                                          style={styles.TimeModalCrossButton}
                                          onPress={() => {
                                            setFilteredStops(m => {
                                              const newm = m.map((item1, index) => {

                                                if (item1.id == item.id) {


                                                  return { ...item1, isModalVisible: false };
                                                }
                                                return { ...item1 };
                                              });

                                              return newm;
                                            })
                                          }}>
                                          <Image
                                            source={close}
                                            style={styles.TimeModalCrossImage}
                                          />
                                        </TouchableOpacity>
                                      </View>
                                      <ScrollView>
                                        <View
                                          style={
                                            styles.HorirousPrevistosParagemTextView
                                          }>
                                          <View>
                                            <Text
                                              style={
                                                styles.HorirousPrevistosParagemText
                                              }>
                                              Horários previstos na paragem
                                            </Text>
                                          </View>
                                          <View
                                            style={styles.ModalStopTextView}>
                                            <Text style={styles.ModalStopText}>
                                              {/* {wholeSelectedItem.long_name} */}
                                              {item.name}
                                            </Text>
                                          </View>
                                          <View
                                            style={styles.ModalPlaceTextView}>
                                            <Text style={styles.ModalPlaceText}>
                                              {/* Cova da Piedade, Almada */}
                                            </Text>
                                          </View>
                                          <View style={{ paddingTop: 30 }}>
                                            <TouchableOpacity
                                              onPress={() => showDatePickerModal(item.id)}
                                              style={styles.CurrentDateButton}>
                                              <Text
                                                style={styles.CurrentDateText}>
                                                {formatDate(item.selectedDate)}
                                              </Text>
                                            </TouchableOpacity>
                                            {/* {showDatePicker && (
                                              <DateTimePicker
                                                value={selectedDate}
                                                mode="date"
                                                display="calendar"
                                                onChange={(e,d)=>handleDateChange(e,d)}
                                              />
                                            )} */}
                                            <DateTimePickerModal
                                              isVisible={item.showDatePicker}
                                              mode="date"
                                              date={item.selectedDate}
                                              onConfirm={(e) => handleDateChange(e, item.id)}
                                            />
                                          </View>
                                          {busSchedules.length > 0 &&
                                            <View
                                              style={styles.TimeSchedulesView}>
                                              <View style={styles.HoraContainer}>
                                                <View style={styles.HoraTextView}>
                                                  <Text style={styles.HoraText}>
                                                    Hora
                                                  </Text>
                                                </View>
                                                {busSchedules
                                                  .slice(0, 9)
                                                  .map(item => (
                                                    <View
                                                      style={styles.HourTextView}>
                                                      <Text
                                                        style={styles.HourText}>
                                                        {item.hour}
                                                      </Text>
                                                    </View>
                                                  ))}
                                              </View>
                                              <View style={styles.MinContainer}>
                                                <View style={styles.MinTextView}>
                                                  <Text style={styles.MinText}>
                                                    Min
                                                  </Text>
                                                </View>
                                                {busSchedules
                                                  .slice(0, 9)
                                                  .map(item => (
                                                    <View
                                                      style={
                                                        styles.ItemMinZeroIndexTextView
                                                      }>
                                                      <Text
                                                        style={
                                                          styles.ItemMinZeroIndexText
                                                        }>
                                                        {item.min[0]}
                                                      </Text>
                                                    </View>
                                                  ))}
                                              </View>
                                              {busSchedules.length > 0 &&
                                                Array(
                                                  Math.max(
                                                    ...busSchedules
                                                      .slice(0, 9)
                                                      .map(o => o.min.length),
                                                  ) - 1,
                                                )
                                                  .fill(null)
                                                  .map((value, index1) => (
                                                    <View
                                                      style={
                                                        styles.BusSchedulesContainer
                                                      }>
                                                      <View
                                                        style={
                                                          styles.BusSchedulesTextView
                                                        }>
                                                        <Text
                                                          style={
                                                            styles.BusSchedulesText
                                                          }></Text>
                                                      </View>
                                                      {busSchedules
                                                        .slice(0, 9)
                                                        .map(item => (
                                                          <View
                                                            style={
                                                              styles.FirstItemMinTextView
                                                            }>
                                                            <Text
                                                              style={
                                                                styles.FirstItemMinText
                                                              }>
                                                              {item.min[
                                                                index1 + 1
                                                              ] === undefined
                                                                ? ''
                                                                : item.min[
                                                                index1 + 1
                                                                ]}
                                                            </Text>
                                                          </View>
                                                        ))}
                                                    </View>
                                                  ))}
                                            </View>
                                          }
                                          {busSchedules.length > 9 &&
                                            <View style={styles.HourMinView}>
                                              <View
                                                style={
                                                  styles.ItemHourContainerView
                                                }>
                                                {busSchedules
                                                  .slice(9, 18)
                                                  .map(item => (
                                                    <View
                                                      style={
                                                        styles.ItemHourTextView
                                                      }>
                                                      <Text
                                                        style={
                                                          styles.ItemHourText
                                                        }>
                                                        {item.hour}
                                                      </Text>
                                                    </View>
                                                  ))}
                                              </View>
                                              {busSchedules.length > 9 &&
                                                Array(
                                                  Math.max(
                                                    ...busSchedules
                                                      .slice(9, 18)
                                                      .map(o => o.min.length),
                                                  ),
                                                )
                                                  .fill(null)
                                                  .map((value, index1) => (
                                                    <View
                                                      style={
                                                        styles.ItemMinContainerView
                                                      }>
                                                      {busSchedules
                                                        .slice(9, 18)
                                                        .map(item => (
                                                          <View
                                                            style={
                                                              styles.ItemMinTextView
                                                            }>
                                                            <Text
                                                              style={
                                                                styles.ItemMinText
                                                              }>
                                                              {item.min[
                                                                index1
                                                              ] === 'undefined'
                                                                ? ''
                                                                : item.min[
                                                                index1
                                                                ]}
                                                            </Text>
                                                          </View>
                                                        ))}
                                                    </View>
                                                  ))}
                                            </View>
                                          }
                                        </View>
                                        <View
                                          style={
                                            styles.ConsultPDFButtonTopBorder
                                          }></View>
                                        <View
                                          style={styles.ConsultPDFButtonView}>
                                          <TouchableOpacity
                                            onPress={() =>
                                              downloadFile(item.id)
                                            }
                                            style={styles.ConsultPDFButton}>
                                            <Image
                                              source={Preview}
                                              style={styles.ConsultPDFIcon}
                                            />
                                            <Text style={styles.ConsultPDFText}>
                                              Consultar PDF
                                            </Text>
                                          </TouchableOpacity>
                                        </View>
                                      </ScrollView>
                                    </View>
                                  </Modal>
                                </View>
                              ) : null}
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <ActivityIndicator size={'large'} />
        )}
        {isLoading && (
          <View style={styles.HorirousButtonWaitLoader}>
            <ActivityIndicator size={'large'} color={'black'} />
          </View>
        )}
      </View>
    );
  };
  if (loading) {
    return (
      <View style={styles.LoadingTextView}>
        <Text style={styles.LoadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView style={{}}>
        <View style={styles.MainContainer}>
          <View style={styles.LineShortNameAdjustView}>
            <View
              style={[
                styles.LineShortNameView,
                { backgroundColor: wholeSelectedItem.color },
              ]}>
              <Text
                style={[
                  styles.LineShortNameText,
                  { color: wholeSelectedItem.text_color },
                ]}>
                {wholeSelectedItem.short_name}
              </Text>
            </View>
          </View>
          <View style={styles.LineLongNameTextView}>
            <Text style={styles.LineLongNameText}>
              {wholeSelectedItem.long_name}
            </Text>
          </View>
          <View style={styles.StarAdjustView}>
            <View style={styles.StarWarningRow}>
              <View style={styles.StarBtnView}>
                <TouchableOpacity
                  onPress={() => {
                    setConfirmationModal(true);
                  }}>
                  <View style={styles.StarBtn}>
                    <Image source={Star} style={styles.StarImage} />
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                {shouldShowAlert && (
                  <TouchableOpacity
                    onPress={() => {
                      setVisible(true);
                    }}>
                    <View style={styles.WarningBtn}>
                      <Image source={Warning} style={styles.WarningImage} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View style={styles.BorderWidthBottom}></View>
          <View style={styles.SelectDestinationTextView}>
            <View>
              <Text style={styles.SelectDestinoText}>Selecionar Destino</Text>
            </View>
          </View>

          <View style={styles.DropdownAdjustView}>
            <SelectDropdown
              data={headsigns.map(item => item.key)}
              defaultValue={headsigns[0]?.key}
              onSelect={selectedItem => {
                setSelectedValue(selectedItem);
              }}
              buttonTextAfterSelection={selectedItem => {
                return (
                  headsigns.find(item => item.key === selectedItem)?.value ||
                  selectedItem
                );
              }}
              buttonStyle={styles.DropdownButtonStyle}
              buttonTextStyle={styles.DropdownButtonTextStyle}
              rowStyle={styles.DropdownRowStyle}
              rowTextStyle={styles.DropdownRowTextStyle}
              rowTextForSelection={item => {
                return (
                  headsigns.find(headsign => headsign.key === item)?.value ||
                  item
                );
              }}>
              <Image
                source={DoubleFacedArrow}
                style={styles.DropdownDoubleFacedArrow}
              />
            </SelectDropdown>
          </View>

          <View style={styles.MapImageView}>
            {stopCoordinates.length > 0 ? (
              <MapView
                ref={mapRef}
                initialRegion={{
                  latitude: stopCoordinates[0].lat,
                  longitude: stopCoordinates[0].lon,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={styles.MapViewSize}
                onMapReady={handleMapReady}
                // onLayout={handleMapReady}
                onPress={handleMapPress}
                onRegionChange={handleRegionChange}
                showsUserLocation={true}>
                <Marker
                  coordinate={{
                    latitude: stopCoordinates[0].lat,
                    longitude: stopCoordinates[0].lon,
                  }}
                  title="Origin">
                  <View style={styles.OriginMarkerIndex}>
                    <View style={[styles.OriginMarker]} />
                  </View>
                </Marker>

                <Polyline
                  coordinates={shapesData.map(point => ({
                    latitude: point.shape_pt_lat,
                    longitude: point.shape_pt_lon,
                  }))}
                  strokeWidth={4}
                  strokeColor="#FA3250"
                />

                {vehicleCoordinates && (
                  <Marker
                    coordinate={{
                      latitude: vehicleCoordinates.latitude,
                      longitude: vehicleCoordinates.longitude,
                    }}
                    title="Bus">
                    <View style={styles.VehicleMarkerIndex}>
                      <Image source={MovingBus} style={styles.VehicleMarker} />
                    </View>
                  </Marker>
                )}

                {stopCoordinates.slice(1, -1).map((coordinate, index) => (
                  <Marker
                    key={`waypoint-${index}`}
                    coordinate={{
                      latitude: coordinate.lat,
                      longitude: coordinate.lon,
                    }}
                    title={`Waypoint ${index + 1}`}>
                    <View style={styles.YellowMarkerIndex}>
                      <View style={[styles.YellowMarker]} />
                    </View>
                  </Marker>
                ))}

                <Marker
                  coordinate={{
                    latitude: stopCoordinates[stopCoordinates.length - 1].lat,
                    longitude: stopCoordinates[stopCoordinates.length - 1].lon,
                  }}
                  title="Destination">
                  <View style={styles.DestinationIndex}>
                    <View style={[styles.DestinationMarker]} />
                  </View>
                </Marker>

                <MapViewDirections
                  origin={{
                    latitude: stopCoordinates[0].lat,
                    longitude: stopCoordinates[0].lon,
                  }}
                  destination={{
                    latitude: stopCoordinates[stopCoordinates.length - 1].lat,
                    longitude: stopCoordinates[stopCoordinates.length - 1].lon,
                  }}
                  waypoints={stopCoordinates.slice(1, -1).map(coordinate => ({
                    latitude: coordinate.lat,
                    longitude: coordinate.lon,
                  }))}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={3}
                  strokeColor="#FA3250"
                />
                {stopCoordinates.length === 0 && (
                  <View style={stopCoordinatesActivityIndicator}>
                    <ActivityIndicator size="large" />
                  </View>
                )}
              </MapView>
            ) : (
              <View style={{ padding: 20 }}>
                <ActivityIndicator size={'large'}></ActivityIndicator>
              </View>
            )}
          </View>
          <View style={styles.StepIndicatorAdjustContainer}>
            <View style={styles.VerticalLineAdjust}>
              <View style={styles.verticalLine}></View>

              <View style={styles.verticalWrap}>
                <View style={styles.StepComponentRow}>
                  <Steps />
                </View>
              </View>
            </View>
          </View>
        </View>
        <Modal
          style={styles.ModalContainer}
          isVisible={visible}
          onBackdropPress={() => setVisible(false)}>
          <View style={styles.AlertsModalContainer}>
            <View style={styles.CloseButtonView}>
              <TouchableOpacity
                style={styles.CloseBtn}
                onPress={() => {
                  setVisible(false);
                }}></TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.ToCloseButtonView}>
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                  }}>
                  <Image source={close} style={styles.closeButton} />
                </TouchableOpacity>
              </View>
              <View style={styles.PersonalizeTextView}>
                <Text style={styles.PersonalizeText}>Alertas</Text>
              </View>
              <View style={styles.AlertsFlatListAdjust}>
                <FlatList
                  data={alert}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => {
                    const headerText =
                      item.alert.headerText?.translation[0]?.text || '';
                    const descriptionText =
                      item.alert.descriptionText?.translation[0]?.text || '';
                    return (
                      <View style={styles.AlertsInnerAdjustContainer}>
                        <View style={styles.AlertsContainer}>
                          <View style={styles.AlertsInnerContainer}>
                            <View style={styles.AlertsDoubleArrowIconView}>
                              <View>
                                <Image
                                  source={DoubleArrow}
                                  style={styles.AlertsDoubleArrowIcon}
                                />
                              </View>
                              <View style={styles.AlertsHeadingHeaderTextView}>
                                <Text style={styles.AlertsHeadingHeaderText}>
                                  {headerText}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.AlertsHeaderTextView}>
                            <View>
                              <Text style={styles.AlertsHeaderText}>
                                {headerText}
                              </Text>
                            </View>
                            <View style={styles.AlertsDescriptionTextView}>
                              <Text style={styles.AlertsDescriptionText}>
                                {descriptionText}
                              </Text>
                            </View>
                            {item.Publication ? (
                              <View style={styles.AlertsPublicationTextView}>
                                <Text style={styles.AlertsPublicationText}>
                                  Publicado a 22-07-2023
                                </Text>
                              </View>
                            ) : null}
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Modal
          style={styles.ModalContainer}
          isVisible={confirmationModal}
          onBackdropPress={() => setConfirmationModal(false)}>
          <View style={styles.ConfirmationModalContainer}>
            <View style={styles.CloseButtonView}>
              <TouchableOpacity
                style={styles.CloseBtn}
                onPress={() => {
                  setConfirmationModal(false);
                }}></TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                setConfirmationModal(false);
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <Image source={closewhite} style={styles.closeButton} />
            </TouchableOpacity>
            <ScrollView>
              <View style={styles.ModalTitleTextView}>
                <View>
                  <Text style={styles.ModalTitleText}>Modal Title</Text>
                </View>
                <View style={styles.ModalDescriptionTextView}>
                  <Text style={styles.ModalDescriptionText}>
                    Modal description…
                  </Text>
                </View>
                <View style={styles.QuestionFirstContainer}>
                  <View>
                    <Text style={styles.QuestionFirstText}>Question</Text>
                  </View>
                  <View style={styles.QuestionFirstAnswerYesNoRow}>
                    <View style={styles.QuestionFirstYesButtonView}>
                      <TouchableOpacity style={styles.QuestionFirstYesButton}>
                        <View>
                          {/* <Image /> */}
                          <Text style={styles.QuestionFirstYesText}>Sim</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.QuestionFirstNoButton}>
                        <View>
                          <Text style={styles.QuestionFirstNoText}>Não</Text>
                          {/* <Image /> */}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.QuestionSecondContainer}>
                  <View>
                    <Text style={styles.QuestionSecondText}>Question</Text>
                  </View>
                  <View style={styles.QuestionSecondAnswerYesNoRow}>
                    <View style={styles.QuestionSecondYesButtonView}>
                      <TouchableOpacity style={styles.QuestionSecondYesButton}>
                        <View>
                          {/* <Image /> */}
                          <Text style={styles.QuestionSecondYesText}>Sim</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.QuestionSecondNoButton}>
                        <View>
                          <Text style={styles.QuestionSecondNoText}>Não</Text>
                          {/* <Image /> */}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.QuestionThirdContainer}>
                  <View>
                    <Text style={styles.QuestionThirdText}>Question</Text>
                  </View>
                  <View style={styles.QuestionThirdAnswerYesNoRow}>
                    <View style={styles.QuestionThirdYesButtonView}>
                      <TouchableOpacity style={styles.QuestionThirdYesButton}>
                        <View>
                          {/* <Image /> */}
                          <Text style={styles.QuestionThirdYesText}>Sim</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.QuestionThirdNoButton}>
                        <View>
                          <Text style={styles.QuestionThirdNoText}>Não</Text>
                          {/* <Image /> */}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  MainContainer: {
    backgroundColor: '#f0f2f5',
    flex: 1,
  },
  LineShortNameAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  LineShortNameView: {
    width: 80,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FA3250',
    justifyContent: 'center',
    alignItems: 'center',
  },
  LineShortNameText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
    lineHeight: 24,
  },
  LineLongNameTextView: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  LineLongNameText: {
    color: '#000',
    fontSize: 22,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  StarAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  StarWarningRow: {
    flexDirection: 'row',
  },
  StarBtnView: {
    paddingRight: 10,
  },
  StarBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  StarImage: {
    height: 20,
    width: 20,
  },
  WarningBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  WarningImage: {
    height: 20,
    width: 20,
  },
  BorderWidthBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#969696',
  },
  SelectDestinationTextView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
  SelectDestinoText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  LinesAdjustView: {
    paddingTop: 10,
  },
  LineNameTextView: {
    width: '100%',
    backgroundColor: '#767680',
    padding: 10,
    borderRadius: 10,
    opacity: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  LineNameText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  DoubleFacedArrowImage: {
    height: 20,
    width: 20,
  },
  MapImageView: {
    paddingTop: 20,
  },
  MapImage: {
    width: '100%',
    height: 200,
  },
  VerticalLineAdjust: {
    flex: 1,
  },
  verticalLine: {
    backgroundColor: '#FA3250',
    width: 16,
    height: '100%',
    position: 'absolute',
    marginLeft: 20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  verticalWrap: {
    //justifyContent: 'space-between',
    // height: '100%',
  },
  itemWrap: {
    width: '100%',
    marginLeft: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointWrap: {
    backgroundColor: '#fff',
    height: 4,
    width: 4,
    marginLeft: 5,
    borderRadius: 2,
    alignItems: 'center',
    left: -19,
  },
  firstPoint: {
    backgroundColor: '#fff',
    borderRadius: 4,
    height: 8,
    width: 8,
    marginLeft: 10,
    left: -26,
  },
  markerText: {
    color: 'white',
  },
  currentMarker: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
    fontStyle: 'normal',
    textAlign: 'left',
    paddingTop: 5,
  },
  uncurrentMarker: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 16,
    paddingTop: 10,
  },
  currentBoxContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
  },
  ModalContainer: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  ModalView: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    right: 0,
    left: 0,
    zIndex: 0
  },
  CloseButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  CloseBtn: {
    height: 8,
    width: 42,
    borderRadius: 16,
    backgroundColor: '#787878',
  },
  AddBtnText: {
    fontSize: 40,
    color: '#000',
  },
  ToCloseTextView: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  ToCloseText: {
    color: '#4b85e3',
    fontSize: 17,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'right',
  },
  PersonalizeTextView: {
    paddingLeft: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },
  PersonalizeText: {
    color: '#000',
    fontSize: 34,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  CardBackground: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 5,
  },
  CurrentTimeDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 9,
    paddingBottom: 50,
  },
  UnCurrentTimeDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 9,
    paddingBottom: 20,
  },
  StepIndicatorAdjustContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 80,
  },
  FirstIndicatorPointView: {
    height: 3,
    width: 20,
    backgroundColor: '#000',
    left: -12,
    bottom: -10,
  },
  FirstIndicatorPointViewContainer: {
    flex: 1,
    paddingTop: 10,
  },
  firstItemLocationView: {
    right: -70,
  },
  firstItemLocationText: {
    color: '#5A5A5A',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  IndicatorCircleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    right: -70,
    paddingTop: 9,
  },
  IndicatorCircle: {
    height: 15,
    width: 15,
    backgroundColor: '#c3ebcb',
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  IndicatorLine: {
    height: 5,
    width: 5,
    backgroundColor: '#00D530',
    borderRadius: 2.5,
  },
  firstItemTimeDurationTextView: {
    paddingLeft: 10,
  },
  FirstItemTimeDurationText: {
    color: '#00D530',
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ItemIndicatorLine: {
    height: 3,
    width: 20,
    backgroundColor: '#000',
    left: -12,
    top: -30,
  },
  ItemLocationTextView: {
    paddingTop: 4,
  },
  ItemLocationText: {
    color: '#5A5A5A',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ItemCircleAdjustContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ItemCircleAdjustContainerCircleInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ItemCircle: {
    height: 15,
    width: 15,
    backgroundColor: '#c3ebcb',
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ItemLine: {
    height: 5,
    width: 5,
    backgroundColor: '#00D530',
    borderRadius: 2.5,
  },
  ItemTimeDurationTextView: {
    paddingLeft: 10,
  },
  ItemTimeDurationText: {
    color: '#00D530',
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },

  YellowMarker: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: 'yellow',
    borderColor: 'black',
    borderWidth: 2,
    alignSelf: 'center',
  },
  DestinationMarker: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'green',
    borderColor: 'black',
    borderWidth: 2,
    alignSelf: 'center',
  },
  OriginMarker: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    borderColor: '#fff',
    borderWidth: 2,
    alignSelf: 'center',
  },
  MovingMarker: {
    height: 15,
    width: 15,
    borderRadius: 10,
    backgroundColor: 'blue',
    borderColor: '#000',
    borderWidth: 2,
    alignSelf: 'center',
  },
  FacilitiesIconArrow: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  BikeParkingView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  BikeParkingIcon: { height: 15, width: 15 },
  BikeSharingView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  BikeSharingIcon: { height: 15, width: 15 },
  BoatView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  BoatIcon: { height: 15, width: 15 },
  BusView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  BusIcon: { height: 15, width: 15 },
  HealthClinicView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  HealthClinicIcon: { height: 15, width: 15 },
  HospitalView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  HospitalIcon: { height: 15, width: 15 },
  NavegateView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  PublicOfficeView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  PublicOfficeIcon: { height: 15, width: 15 },
  SchoolView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  SchoolIcon: { height: 15, width: 15 },
  ShoppingView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  ShoppingIcon: { height: 15, width: 15 },
  SubwayView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  SubwayIcon: { height: 15, width: 15 },
  TramView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  TramIcon: { height: 15, width: 15 },
  WheelChairIcon: { height: 20, width: 20 },
  AlertsPublicationTextView: { paddingTop: 20 },
  AlertsPublicationText: {
    color: '#787878',
    fontSize: 10,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  AlertsDescriptionTextView: { paddingTop: 10 },
  AlertsDescriptionText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  AlertsHeaderTextView: { padding: 15 },
  AlertsHeaderText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  AlertsHeadingHeaderText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
    maxWidth: '98%',
  },
  AlertsHeadingHeaderTextView: { paddingLeft: 10 },
  AlertsDoubleArrowIcon: { height: 20, width: 20 },
  AlertsDoubleArrowIconView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  AlertsInnerContainer: {
    width: '100%',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#000',
  },
  AlertsContainer: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  AlertsInnerAdjustContainer: { paddingBottom: 20 },
  AlertsFlatListAdjust: { paddingTop: 20, paddingLeft: 20, paddingRight: 20 },
  AlertsModalContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    right: 0,
    left: 0,
    height: 600,
  },
  ConfirmationModalContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#202121',
    width: '100%',
    right: 0,
    left: 0,
    padding: 20,
  },
  ModalTitleTextView: { padding: 20 },
  ModalTitleText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ModalDescriptionTextView: { paddingTop: 5 },
  ModalDescriptionText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  QuestionFirstContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 10,
  },
  QuestionFirstText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  QuestionFirstAnswerYesNoRow: { flexDirection: 'row', alignItems: 'center' },
  QuestionFirstYesButtonView: { paddingRight: 10 },
  QuestionFirstYesButton: {
    height: 40,
    width: 80,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  QuestionFirstYesText: {
    color: '#00D530',
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  QuestionFirstNoButton: {
    height: 40,
    width: 80,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  QuestionFirstNoText: {
    color: '#FA3250',
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  QuestionSecondContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
  },
  QuestionSecondText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  QuestionSecondAnswerYesNoRow: { flexDirection: 'row', alignItems: 'center' },
  QuestionSecondYesButtonView: { paddingRight: 10 },
  QuestionSecondYesButton: {
    height: 40,
    width: 80,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  QuestionSecondYesText: {
    color: '#00D530',
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  QuestionSecondNoButton: {
    height: 40,
    width: 80,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  QuestionSecondNoText: {
    color: '#FA3250',
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  QuestionThirdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
  },
  QuestionThirdText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  QuestionThirdAnswerYesNoRow: { flexDirection: 'row', alignItems: 'center' },
  QuestionThirdYesButtonView: { paddingRight: 10 },
  QuestionThirdYesButton: {
    height: 40,
    width: 80,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  QuestionThirdYesText: {
    color: '#00D530',
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  QuestionThirdNoButton: {
    height: 40,
    width: 80,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  QuestionThirdNoText: {
    color: '#FA3250',
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  StepComponentRow: {
    flexDirection: 'row',
  },
  stopCoordinatesActivityIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 9999,
  },
  DestinationIndex: { zIndex: 9999 },
  YellowMarkerIndex: { zIndex: 9999 },
  VehicleMarker: { height: 20, width: 20 },
  VehicleMarkerIndex: { zIndex: 9999 },
  OriginMarkerIndex: { zIndex: 9999 },
  MapViewSize: { width: '100%', height: 200 },
  DropdownDoubleFacedArrow: { width: 20, height: 20, tintColor: 'red' },
  DropdownRowTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  DropdownRowStyle: {
    backgroundColor: 'white',
  },
  DropdownButtonTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  DropdownButtonStyle: {
    width: '100%',
    backgroundColor: '#767680',
    padding: 10,
    borderRadius: 10,
    opacity: 0.5,
    borderColor: '#767680',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  DropdownAdjustView: { padding: 20 },
  LoadingText: { fontWeight: '600', color: '#000', fontSize: 30 },
  LoadingTextView: { justifyContent: 'center', alignItems: 'center' },
  HorirousButtonWaitLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  ConsultPDFText: {
    color: 'black',
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  ConsultPDFIcon: { height: 20, width: 20 },
  ConsultPDFButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 34,
    width: 140,
    padding: 5,
    backgroundColor: '#F9F9F9',
    borderRadius: 7,
  },
  ConsultPDFButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 30,
    left: 20,
    paddingBottom: 78,
  },
  ConsultPDFButtonTopBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
    // paddingTop: 30,
  },
  ItemMinText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  ItemMinTextView: {
    width: '10%',
    left: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ItemMinContainerView: {
    width: '100%',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ItemHourText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  ItemHourTextView: {
    width: '10%',
    left: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ItemHourContainerView: {
    width: '100%',
    backgroundColor: '#000',
    padding: 5,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HourMinView: { paddingTop: 20 },
  FirstItemMinText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  FirstItemMinTextView: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BusSchedulesText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  BusSchedulesTextView: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BusSchedulesContainer: {
    width: '100%',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ItemMinZeroIndexText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  ItemMinZeroIndexTextView: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MinText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  MinTextView: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MinContainer: {
    width: '100%',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HourText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  HourTextView: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HoraText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  HoraTextView: {
    width: '15%',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  HoraContainer: {
    width: '100%',
    backgroundColor: '#000',
    padding: 5,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TimeSchedulesView: { paddingTop: 30 },
  CurrentDateText: {
    color: 'black',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  CurrentDateButton: {
    padding: 10,
    width: 147,
    backgroundColor: '#cccccc',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ModalPlaceText: {
    color: '#5A5A5A',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ModalPlaceTextView: { paddingTop: 3 },
  ModalStopText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ModalStopTextView: { paddingTop: 8 },
  HorirousPrevistosParagemText: {
    color: '#969696',
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'italic',
    textAlign: 'left',
  },
  HorirousPrevistosParagemTextView: { padding: 15 },
  TimeModalCrossImage: {
    height: 25,
    width: 25,
    //tintColor: '#fff',
  },
  TimeModalCrossButton: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
  },
  HorariosPrevistosText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  HorariosPrevistosTextView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
    paddingTop: 10,
    paddingBottom: 20,
  },
  TimeModalContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#e9eef7',
    width: '100%',
    right: 0,
    left: 0,
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  SobreAParagemButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A5A5A',
    paddingLeft: 10,
  },
  SobreAParagemButtonIcon: {
    fontWeight: '600',
    height: 14,
    width: 12,
    tintColor: '#5A5A5A',
  },
  SobreAParagemIconTextView: {
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SobreAParagemButton: {
    padding: 10,
    width: '100%',
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  SobreAParagemButtonView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  HorariosButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A5A5A',
    paddingLeft: 10,
  },
  HorariosButtonIcon: {
    fontWeight: '600',
    height: 13,
    width: 13,
    tintColor: '#5A5A5A',
  },
  HorariosButtonTextIconView: {
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HorariosButton: {
    padding: 8,
    width: '100%',
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  HorariosButtonView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  HorariosSobreAParagemView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  TravelTimeText: {
    color: '#00D530',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  TravelTimeTextView: { paddingLeft: 5, paddingRight: 5 },
  ArrivalTypeText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'normal',
    left: 20,
  },
  ArrivalTypeTextView: { paddingRight: 5 },
  ArrivalClockIcon: { height: 10, width: 10 },
  closeButton: {
    height: 40,
    width: 40,
  },
  ToCloseButtonView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingLeft: 20,
    paddingRight: 10,
  },
});
export default SearchLinesDetails;
