import * as React from 'react';
import {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Animated,
  Share,
} from 'react-native';
import LeftArrow from '../../Assets/images/LeftArrow.png';
import Upload from '../../Assets/NewImages/Upload.png';
import MapView, {Marker, Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import MovingBus from '../../Assets/NewImages/MovingBus.png';
import Api from '../Api/Api';
import SelectDropdown from 'react-native-select-dropdown';
import DoubleFacedArrow from '../../Assets/images/DoubleFacedArrow.png';

const MAX_VISIBLE_WAYPOINTS = 15;

const StepIndicatorTrack = ({navigation, route}) => {
  const {selectedRoute, selectedItem, modalData} = route.params;
  // console.log('RouteParams======>>>>>', route.params);
  const [loading, setLoading] = useState(true);
  const [filteredStops, setFilteredStops] = useState([]);
  const [stopCoordinates, setStopCoordinates] = useState([]);
  const [travelTime, setTravelTime] = useState(null);
  const [shapesData, setShapesData] = useState([]);
  const [shapeId, setShapeId] = useState(null);
  const [vehiclePosition] = useState(new Animated.Value(0));
  const [vehicleCoordinates, setVehicleCoordinates] = useState(null);
  const [lineId, setLineId] = useState(null);
  const [direction, setDirection] = useState(null);
  const [headsigns, setHeadsigns] = useState([]);
  const [selectedItemState, setSelectedItemState] = useState(selectedItem[0]);
  const [selectedValue, setSelectedValue] = useState('');
  const [lisbonTime, setLisbonTime] = useState(Date.now());
  const [visibleWaypoints, setVisibleWaypoints] = useState(
    stopCoordinates.slice(0, MAX_VISIBLE_WAYPOINTS),
  );

  const handleShare = async () => {
    try {
      const message =
        'Hi, check this amazing app out which helps me plan my bus route for the day';
      await Share.share({
        message: message,
      });
    } catch (error) {
      console.error('Error sharing text:', error.message);
    }
  };

  const handleRegionChange = region => {
    const newVisibleWaypoints = stopCoordinates.slice(0, MAX_VISIBLE_WAYPOINTS);
    setVisibleWaypoints(newVisibleWaypoints);
  };

  const GOOGLE_MAPS_APIKEY = 'AIzaSyANNnQQ9GU6Jymw1ZpdJP0dPQgDPr3SViU';

  useEffect(() => {
    const loadLabelValue = async () => {
      let headsignArray = [];

      if (selectedRoute) {
        for (let i = 0; i < selectedRoute.patterns.length; i++) {
          try {
            const pattern = selectedRoute.patterns[i];
            // console.log(`Fetching data for pattern: ${pattern}`);
            const response = await Api.get(`patterns/${pattern}`);
            // console.log(`Data fetched for pattern ${pattern}:`, response.data);

            headsignArray.push({key: pattern, value: response.data.headsign});
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }

        setHeadsigns(headsignArray);

        if (headsignArray.length > 0) {
          const initialPatternId = headsignArray[0].key;
          setSelectedValue(initialPatternId);
          // console.log('Selected initial pattern:', initialPatternId);
          fetchVehicleData(initialPatternId);
          // fetchData(headsignArray[0].key);
          // fetchVehicleData(headsignArray[0].key);
        }
      }
    };

    loadLabelValue();
  }, [selectedRoute]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeToleranceSeconds = 900;
        const offsetMinutes = 0;
        const currentLisbonTime = new Date();
        currentLisbonTime.setMinutes(
          currentLisbonTime.getMinutes() - offsetMinutes,
        );
        setLisbonTime(currentLisbonTime.getTime());

        // Assuming you have an endpoint property
        if (selectedValue) {
          const response = await Api.get(`patterns/${selectedValue}`);

          if (
            !response ||
            !response.data ||
            !response.data.trips ||
            !response.data.path
          ) {
            // console.error(
            //   'API response structure is not as expected. Missing trip or path data.',
            // );
            // If there's an error, stop the loader and return
            setLoading(false);
            return;
          }

          const responseData = response.data;
          const {line_id, direction} = responseData;

          // Set the extracted values into the corresponding states
          setLineId(line_id); // Assuming you have a state variable like const [lineId, setLineId] = useState(null);
          setDirection(direction);
          const extractedShapeId = responseData.shape_id;

          setShapeId(extractedShapeId);

          const extractedStops = response.data.path.map(item => ({
            id: item.stop.id,
            name: item.stop.name,
            distance_delta: item.distance_delta,
            stop_sequence: item.stop_sequence,
            facilities: item.stop.facilities,
            lines: item.stop.lines,
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
              const realTimeResponse = await Api.get(
                `stops/${stop.id}/realtime`,
              );
              console.log('RealTime');
              setFilteredStops(m => {
                const newm = m.map((item1, index) => {
                  var nextArrivalInner = realTimeResponse.data.find(data => {
                    if (
                      Math.floor(lisbonTime / 1000) <=
                        data.scheduled_arrival_unix &&
                      selectedValue == data.pattern_id &&
                      item1.id == stop.id
                    ) {
                      // console.log('TimeTime=======>>>>', data.scheduled_arrival);
                      // console.log('StopId=======>>>>', item.id);
                      return {
                        next_arrival_min:
                          (Math.floor(lisbonTime / 1000) -
                            data.scheduled_arrival_unix) /
                          60,
                      };
                    }
                  });
                  if (item1.id == stop.id) {
                    console.log('in>>>>>>>>>>>>>>>>>>>');
                    return {
                      ...item1,
                      arrivals: {
                        line_id: nextArrivalInner && nextArrivalInner.line_id,
                        pattern_id:
                          nextArrivalInner && nextArrivalInner.pattern_id,
                        scheduledArrival:
                          nextArrivalInner &&
                          nextArrivalInner.scheduled_arrival,
                        estimatedArrival:
                          nextArrivalInner &&
                          nextArrivalInner.estimated_arrival,
                        observedArrival:
                          nextArrivalInner && nextArrivalInner.observed_arrival,
                      },
                      nextArrival: nextArrivalInner,
                    };
                  }
                  return {...item1};
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

          // setFilteredStops(updatedFilteredStops);
        } else {
          console.error('Invalid selectedRoute or selectedItem.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // console.error('Error response:', error.response);
      } finally {
        // Stop the loader in the finally block to ensure it's stopped
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedValue]);

  useEffect(() => {
    if (selectedValue) {
      // console.log('InnerConsoleForSelectedValue=======>>>>>', selectedValue);
      fetchVehicleData(selectedValue);

      const vehicleUpdateInterval = setInterval(() => {
        fetchVehicleData(selectedValue);
      }, 10000);

      return () => clearInterval(vehicleUpdateInterval);
    }
  }, [selectedValue]);

  const fetchVehicleData = async selectedValue => {
    try {
      const response = await Api.get('vehicles');

      const matchedVehicle = response.data.find(
        vehicle => vehicle.pattern_id === selectedValue,
      );
      // console.log('MatchedVehicle=====>>>>', matchedVehicle);
      if (matchedVehicle) {
        // console.log('Vehicle Latitude:', matchedVehicle.lat);
        // console.log('Vehicle Longitude:', matchedVehicle.lon);
        updateVehiclePosition({
          latitude: matchedVehicle.lat,
          longitude: matchedVehicle.lon,
        });
      } else {
        console.log('No matching Vechile found for current trip.');
      }
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    }
  };

  const updateVehiclePosition = newCoordinates => {
    // console.log('Updating Vehicle Position:', newCoordinates);

    Animated.timing(vehiclePosition, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      setVehicleCoordinates(newCoordinates);
      vehiclePosition.setValue(0); // Reset the animation value
    });
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
      }
    };

    fetchShapesData();
  }, [shapeId]);

  if (loading) {
    return (
      <View style={{paddingTop: 140}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              fontStyle: 'normal',
              color: '#0000ff',
            }}>
            Loading...
          </Text>
        </View>
      </View>
    );
  }

  const Steps = () => {
    if (filteredStops.length === 0) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 12, fontWeight: '600', color: '#000'}}>
            Loading...
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredStops}
        keyExtractor={item => item.id}
        renderItem={(item, index) => {
          // console.log('Item=======>>>>>', item);

          return (
            <View style={{flexDirection: 'row', right: -25, bottom: -30}}>
              <View style={{bottom: -3}}>
                <View
                  style={{
                    height: 4,
                    width: 4,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                  }}></View>
              </View>
              <View style={{paddingLeft: 10, bottom: -5}}>
                <View
                  style={{
                    height: 2,
                    width: 25,
                    backgroundColor: 'grey',
                  }}></View>
              </View>
              <View style={{top: -3, paddingLeft: 10}}>
                <View styles={{paddingBottom: 5}}>
                  <Text
                    style={{color: '#000', fontSize: 12, fontWeight: '400'}}>
                    {item.item.name}
                  </Text>
                </View>

                <View style={{flexDirection: 'row', paddingBottom: 30}}>
                  {item.item.nextArrival && (
                    <View
                      style={{
                        height: 20,
                        width: 20,
                        borderRadius: 10,
                        backgroundColor: '#00D530',
                        borderWidth: 5,
                        borderColor: '#ccffcc',
                      }}></View>
                  )}
                  {item.item.nextArrival && (
                    <View>
                      <Text
                        style={{
                          color: '#00D530',
                          fontSize: 14,
                          fontWeight: '600',
                          fontStyle: 'normal',
                          textAlign: 'left',
                        }}>
                        {Math.ceil(
                          (item.item.nextArrival.scheduled_arrival_unix -
                            Math.floor(lisbonTime / 1000)) /
                            60,
                        )}{' '}
                        min
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />
    );
  };
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor="#FFDD00"></StatusBar>
      <ScrollView>
        <View>
          <View style={{paddingLeft: 20, paddingRight: 20}}>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#000000',
                paddingTop: 20,
                paddingBottom: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View>
                      <Image
                        source={LeftArrow}
                        style={{height: 17, width: 22, tintColor: 'black'}}
                      />
                    </View>

                    <View style={{paddingLeft: 5}}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 17,
                          fontWeight: '400',
                          fontStyle: 'normal',
                          textAlign: 'left',
                        }}>
                        Mapa
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View>
                  <TouchableOpacity onPress={handleShare}>
                    <Image
                      source={Upload}
                      style={{height: 20, width: 20, tintColor: 'black'}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                color: '#000',
                fontSize: 17,
                fontWeight: '600',
                fontStyle: 'normal',
                textAlign: 'center',
                maxWidth: '80%',

                top: 5,
              }}>
              {selectedRoute.long_name}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 20,
            }}>
            <View
              style={{
                backgroundColor: '#FA3250',
                height: 30,
                width: 80,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 15,
                top: -5,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: '700',
                  fontStyle: 'normal',
                  textAlign: 'center',
                }}>
                {selectedRoute.short_name}
              </Text>
            </View>
          </View>
          <View
            style={{
              paddingTop: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#787878',
                fontSize: 12,
                fontWeight: '600',
                fontStyle: 'normal',
                textAlign: 'center',
              }}>
              para
            </Text>
          </View>
          <View style={{padding: 10, top: -12}}>
            <SelectDropdown
              data={headsigns.map(item => item.key)}
              defaultValue={headsigns[0]?.key}
              onSelect={(selectedItem, index) => {
                setSelectedValue(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return (
                  headsigns.find(item => item.key === selectedItem)?.value ||
                  selectedItem
                );
              }}
              buttonStyle={styles.DropdownButtonStyle}
              buttonTextStyle={styles.DropdownButtonTextStyle}
              rowStyle={styles.DropdownRowStyle}
              rowTextStyle={styles.DropdownRowTextStyle}
              rowTextForSelection={(item, index) => {
                return (
                  headsigns.find(headsign => headsign.key === item)?.value ||
                  item
                );
              }}>
              <Image source={DoubleFacedArrow} style={styles.DropdownArrow} />
            </SelectDropdown>
          </View>

          {stopCoordinates.length > 0 ? (
            //console.log('StopCoordinates=====>>>>', stopCoordinates),
            <MapView
              initialRegion={{
                latitude: stopCoordinates[0].lat,
                longitude: stopCoordinates[0].lon,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              style={styles.MapViewArea}
              onMapReady={() => console.log('Map is ready')}
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
                strokeWidth={3}
                strokeColor="#FA3250"
              />

              {vehicleCoordinates && (
                <Marker
                  coordinate={{
                    latitude: vehicleCoordinates.latitude,
                    longitude: vehicleCoordinates.longitude,
                  }}
                  title="Bus">
                  <View style={styles.MovingBusIndex}>
                    <Image source={MovingBus} style={styles.MovingBusIcon} />
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
                <View style={styles.DestinationMarkerIndex}>
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
            </MapView>
          ) : (
            <View style={styles.MapViewLoader}>
              <ActivityIndicator size={'large'} color={'#000'} />
            </View>
          )}

          <View style={styles.StepIndicatorAdjustContainer}>
            <View style={styles.VerticalLineAdjust}>
              <View style={styles.verticalLine}></View>

              <View style={styles.verticalWrap}>
                <View style={styles.IndicatorRow}>
                  <Steps />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  VerticalLineAdjust: {
    flex: 1,
    left: -10,
    height: '100%',
  },
  verticalLine: {
    backgroundColor: '#FA3250',
    width: 16,
    height: '100%',
    position: 'absolute',
    marginLeft: 20,
    marginTop: 20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  verticalWrap: {
    justifyContent: 'space-between',
    height: '100%',
  },

  StepIndicatorAdjustContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 80,
  },

  YellowMarker: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'yellow',
    borderColor: 'black',
    borderWidth: 2,
    alignSelf: 'center',
  },
  DestinationMarker: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    borderColor: 'black',
    borderWidth: 2,
    alignSelf: 'center',
  },
  OriginMarker: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    borderColor: '#fff',
    borderWidth: 2,
    alignSelf: 'center',
  },
  IndicatorRow: {flexDirection: 'row'},
  MapViewLoader: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  DestinationMarkerIndex: {zIndex: 9999},
  YellowMarkerIndex: {zIndex: 9999},
  MovingBusIcon: {height: 20, width: 20},
  MovingBusIndex: {zIndex: 9999},
  OriginMarkerIndex: {zIndex: 9999},
  MapViewArea: {width: '100%', height: 200},
  DropdownArrow: {width: 20, height: 20, tintColor: 'red'},
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
    padding: 10,
    borderRadius: 10,
    opacity: 0.5,
    borderColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default StepIndicatorTrack;
