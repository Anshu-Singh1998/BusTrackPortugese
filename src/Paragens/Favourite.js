import React, {useState, useEffect, useMemo, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import MapView, {Marker, Polygon, Polyline} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Modal from 'react-native-modal';
import RightGreyArrow from '../../Assets/NewImages/RightArrow.png';
import RightArrow from '../../Assets/images/RightArrow.png';
import Api from '../Api/Api';
import SearchIcon from '../../Assets/NewImages/Search.png';
import CrossNew from '../../Assets/NewImages/close.png';

const Favourite = ({navigation}) => {
  const [modalHeight, setModalHeight] = useState('50%');
  const [filterModal, setFilterModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [centerPoint, setCenterPoint] = useState({
    latitude: 38.754244,
    longitude: -8.959557,
  });
  const [specificRoutes, setSpecificRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [pressedMarker, setPressedMarker] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [dropModalData, setDropModalData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [lines, setLines] = useState([]);
  const [matchedLines, setMatchedLines] = useState([]);
  const [timeDifferences, setTimeDifferences] = useState([]);
  const [lisbonTime, setLisbonTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const mapRef = useRef(null);
  const mapStyle = [
    {
      featureType: 'transit.station.bus',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'transit.station.bus',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
  ];

  const calculateDistance = (point1, point2) => {
    const {latitude: lat1, longitude: lon1} = point1;
    const {latitude: lat2, longitude: lon2} = point2;
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const deg2rad = deg => {
    return deg * (Math.PI / 180);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get('stops');
        const markersWithinRadius = response.data
          .map(marker => ({
            id: marker.id,
            ...marker,
            latitude: parseFloat(marker.lat),
            longitude: parseFloat(marker.lon),
          }))
          .filter(point => {
            const distance = calculateDistance(centerPoint, point);
            return distance <= 10;
          });

        setMarkers(markersWithinRadius);
        setLoading(false);
        setInitialDataLoaded(true);
      } catch (error) {
        Alert.alert('Error on first fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = markers.filter(marker =>
      marker.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredMarkers(filtered);
  }, [searchQuery, markers]);

  const handleSearch = query => {
    setSearchQuery(query);
  };

  const handleRegionChangeComplete = async region => {
    const {latitude, longitude} = region;
    setCenterPoint({latitude, longitude});

    try {
      if (!initialDataLoaded) {
        const response = await Api.get('stops');

        const markersWithinRadius = response.data
          .map(marker => {
            const {id, lat, lon} = marker;
            return {
              id,
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
              ...marker,
            };
          })
          .filter(point => {
            const distance = calculateDistance(centerPoint, point);
            return distance <= 10;
          });

        setMarkers(markersWithinRadius);
        setInitialDataLoaded(true);
      }
    } catch (error) {
      Alert.alert('Error fetching data:', error);
    }
  };

  const handleMapScroll = async () => {
    if (initialDataLoaded) {
      try {
        const response = await Api.get('stops');

        const markersWithinRadius = response.data
          .map(marker => {
            const {id, lat, lon} = marker;
            return {
              id,
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
              ...marker,
            };
          })
          .filter(point => {
            const distance = calculateDistance(centerPoint, point);
            return distance <= 10;
          });

        setMarkers(markersWithinRadius);
      } catch (error) {
        Alert.alert('Error fetching Scroll data:', error);
      }
    }
  };

  const openModalOnMarkerPress = async marker => {
   
    setPressedMarker(marker.id);
    console.log('PressedMarker====>>>> -------------->>>>>>', marker.id);
    setFilterModal(true);
    setModalVisible(true);
    setModalData(marker);
    const markerLines = marker.lines || [];
    const allLines = markerLines || [];

    try {
      const linesResponse = await Api.get('lines');
      const lineIds = linesResponse.data.map(line => line.id);
      const matchedLines = allLines.filter(line => lineIds.includes(line));
      const detailsPromises = matchedLines.map(async matchedLine => {
        const lineDetailsResponse = await Api.get(
          `https://api.carrismetropolitana.pt/lines/${matchedLine}`,
        );
        return lineDetailsResponse.data;
      });

      const matchedLinesDetails = await Promise.all(detailsPromises);
      setMatchedLines(matchedLinesDetails);
      // console.log('matchedLinesDetails======>>>>>', matchedLinesDetails);
      const lisbonTimestamp = new Date().getTime();
      setLisbonTime(lisbonTimestamp);
      await Api.get(`stops/${marker.id}/realtime`)
        .then(response => {
          matchedLinesDetails.map(line => {
            const next_arrival = response.data.find(item => {
              if (
                Math.floor(lisbonTimestamp / 1000) <=
                  item.scheduled_arrival_unix &&
                item.line_id == line.id
              ) {
                return {
                  next_arrival_min:
                    (Math.floor(lisbonTime / 1000) -
                      item.scheduled_arrival_unix) /
                    60,
                };
              }
            });
            setMatchedLines(m => {
              const newm = m.map((item1, index) => {
                if (
                  typeof next_arrival !== 'undefined' &&
                  item1.id == line.id
                ) {
                  return {...item1, NextArrival: next_arrival};
                }
                return {...item1};
              });

              return newm;
            });
            // console.log('MatchedLine1234======>>>>>', markerLines);
          });
        })
        .catch(error => {
          console.log(error);
        });

      const defaultEndpoints = matchedLinesDetails.map(line => {
        if (line.patterns && line.patterns.length > 0) {
          return line.patterns[0];
        }
        return null;
      });

      const patternsResponses = await Promise.all(
        defaultEndpoints.map(async endpoint => {
          const response = await Api.get(`patterns/${endpoint}`);
          return response.data;
        }),
      );

      const lisbonTime = new Date();
      const newTimeDifferences = [];
      console.log('Lisbon Time=====>>>>', lisbonTime);

      patternsResponses.forEach(pattern => {
        pattern.trips.forEach(trip => {
          const arrivalTime = trip.schedule[0].arrival_time;

          // Constructing the full date object with current date and arrival time
        });
      });
      setTimeDifferences(newTimeDifferences);
    } catch (error) {
      Alert.alert('Error fetching lines data:', error);
    }
  };

  // console.log('Markerssss=====>>>>', markers);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <>
            <MapView
              style={styles.MapViewContainer}
              initialRegion={{
                latitude: centerPoint.latitude,
                longitude: centerPoint.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              customMapStyle={mapStyle}
              onRegionChangeComplete={handleRegionChangeComplete}
              onScroll={handleMapScroll}>
              {searchQuery === ''
                ? markers.map(marker => (
                    <Marker
                      key={marker.id}
                      coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                      }}
                      onPress={() => {
                        setPressedMarker(marker.id);
                        openModalOnMarkerPress(marker);
                      }}
                      onMarkerDragEnd={() => {
                        setPressedMarker(marker.id);
                        openModalOnMarkerPress(marker);
                      }}
                      onPoiClick={() => {
                        setPressedMarker(marker.id);
                        openModalOnMarkerPress(marker);
                      }}
                      title={marker.name}>
                      <View style={styles.YellowMarkerIndex}>
                        <View style={[styles.YellowMarker]} />
                      </View>
                    </Marker>
                  ))
                : filteredMarkers.map(marker => (
                    <Marker
                      key={marker.id}
                      coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                      }}
                      onPress={() => {
                        setPressedMarker(marker.id);
                        openModalOnMarkerPress(marker);
                      }}
                      title={marker.name}>
                      <View style={styles.YellowMarkerIndex}>
                        <View style={[styles.YellowMarker]} />
                      </View>
                    </Marker>
                  ))}
            </MapView>
            <View style={styles.autocompleteContainer}>
              <View style={styles.SearchIconAdjustView}>
                <View style={styles.SearchIconContainer}>
                  <View style={styles.SearchIconView}>
                    <Image source={SearchIcon} style={styles.SearchIconImg} />
                  </View>
                  <View style={styles.SelectStopVisibleSearchTextInputView}>
                    <TextInput
                      style={styles.SelectStopVisibleSearchTextInput}
                      placeholder="Pesquisar paragens ou locais"
                      placeholderTextColor="#969696"
                      onChangeText={handleSearch}
                    />
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </View>

      <View style={styles.buttonColumn}>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Image
            source={require('../../Assets/NewImages/MapFilterButton.png')}
            style={styles.MapFilterButtonImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Image
            source={require('../../Assets/NewImages/Compass.png')}
            style={styles.CompassButtonImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../Assets/NewImages/MapLineButton.png')}
            style={styles.MapLineButtonImage}
          />
        </TouchableOpacity>
      </View>

      <Modal
        style={styles.ModalContainer}
        isVisible={filterModal}
        onBackdropPress={() => setFilterModal(false)}>
        <View style={[styles.FilteredModalContainer, {height: modalHeight}]}>
          <View style={styles.CloseButtonView}>
            <TouchableOpacity
              style={styles.CloseBtn}
              onPress={() => {
                setModalHeight('90%');
              }}></TouchableOpacity>
          </View>
          {modalData && (
            <ScrollView>
              <View style={styles.ToCloseTextView}>
                <TouchableOpacity
                  onPress={() => {
                    setFilterModal(false);
                  }}>
                  <Image source={CrossNew} style={{height: 30, width: 30}} />
                </TouchableOpacity>
              </View>
              <View style={styles.AdjustContainer}>
                <View style={styles.SelectedMarkerStopNameTextView}>
                  <View>
                    <View>
                      <Text style={styles.SelectedMarkerStopNameText}>
                        {modalData.name}
                      </Text>
                    </View>
                    <View style={styles.NameRow}>
                      <View style={styles.ModalDataIdTextView}>
                        <Text style={styles.ModalDataIdText}>
                          {modalData.id}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.ProximasVeiculosTextView}>
                  <Text style={styles.ProximasVeiculosText}>
                    Próximos veículos nesta paragem
                  </Text>
                </View>
                <View style={styles.MatchedLinesAdjustView}>
                  <View style={styles.MatchedLinesContainer}>
                    <View>
                      {matchedLines.map(route => {
                        // console.log('Routes=====>>>', route);

                        return (
                          <View>
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate('StepIndicatorTrack', {
                                  selectedRoute: route,
                                  selectedItem: route.patterns,
                                  modalData: modalData,
                                });
                              }}>
                              <View
                                key={route.trip_id}
                                style={styles.RouteContainer}>
                                <View style={styles.RouteDetailsRow}>
                                  <View
                                    style={[
                                      styles.RouteIdTextView,
                                      {backgroundColor: route.color},
                                    ]}>
                                    <Text
                                      style={[
                                        styles.RouteIdText,
                                        {color: route.text_color},
                                      ]}>
                                      {route.id}
                                    </Text>
                                  </View>

                                  <View>
                                    <Text style={styles.RouteLongName}>
                                      {route.long_name}
                                    </Text>
                                  </View>
                                </View>
                                <View style={styles.TimeTextView}>
                                  <View>
                                    <Text style={styles.TimeText}>
                                      {route.NextArrival &&
                                        Math.ceil(
                                          (route.NextArrival
                                            .scheduled_arrival_unix -
                                            Math.floor(lisbonTime / 1000)) /
                                            60,
                                        )}{' '}
                                      min
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('CompassDetails', {
                          specificRoutes: matchedLines,
                          modalData: modalData,
                        });
                      }}>
                      <View style={styles.VerMaisCompassDetailsTextView}>
                        <View>
                          <Text style={styles.VerMaisCompassDetails}>
                            Ver mais serviços nesta paragem
                          </Text>
                        </View>

                        <View style={styles.RightGreyArrowBtnView}>
                          <Image
                            source={RightGreyArrow}
                            style={styles.RightGreyArrowImage}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  autocompleteContainer: {
    position: 'absolute',
    top: 20,
  },
  buttonColumn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    height: 50,
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#e9eef7',
    width: '100%',
    right: 0,
    left: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
    borderBottomWidth: 1,
    borderBottomColor: '#7d7e80',
    paddingBottom: 10,
  },
  PersonalizeText: {
    color: '#000',
    fontSize: 34,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  FilteredModalContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#e9eef7',
    width: '100%',
    right: 0,
    left: 0,
    height: '50%',
  },
  YellowMarker: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: 'yellow',
    borderColor: 'black',
    borderWidth: 2,
    alignSelf: 'center',
  },
  pressedMarker: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: 'yellow',
    borderColor: 'black',
    borderWidth: 2,
    alignSelf: 'center',
  },
  inputStyle: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  MapViewContainer: {flex: 1},
  MapFilterButtonImage: {height: 20, width: 20, tintColor: '#006EFF'},
  CompassButtonImage: {height: 20, width: 20, tintColor: '#006EFF'},
  MapLineButtonImage: {height: 20, width: 20, tintColor: '#006EFF'},
  AdjustContainer: {paddingLeft: 20, paddingRight: 20, paddingBottom: 40},
  RightGreyArrowImage: {height: 10, width: 10},
  RightGreyArrowBtnView: {paddingLeft: 5},
  NameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 2,
  },
  CovaNameTextView: {paddingRight: 20},
  CovaNameText: {
    color: '#787878',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  SelectedMarkerStopNameTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingBottom: 20,
    paddingTop: 20,
  },
  SelectedMarkerStopNameText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  YellowMarkerIndex: {zIndex: 9999},
  ModalDataIdText: {
    color: '#969696',
    fontSize: 8,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  ModalDataIdTextView: {
    width: 42,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#969696',
    borderRadius: 8,
  },
  VerMaisCompassDetails: {
    color: '#969696',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  VerMaisCompassDetailsTextView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 10,
  },
  RouteRightGreyArrowIcon: {height: 10, width: 10},
  RouteRightGreyArrowIconView: {paddingLeft: 5},
  TimeText: {
    color: '#00D530',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  TimeTextView: {
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  RouteLongName: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'normal',
    width: 130,
    paddingLeft: 10,
  },
  RouteRightNameArrow: {height: 15, width: 15},
  RouteIdText: {
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  RouteIdTextView: {
    borderRadius: 15,
    width: 60,

    justifyContent: 'center',
    alignItems: 'center',
  },
  RouteDetailsRow: {
    // backgroundColor:'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  RouteContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#969696',
    paddingTop: 10,
    paddingBottom: 20,
  },
  MatchedLinesContainer: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 15,
    borderRadius: 15,
    padding: 20,
  },
  MatchedLinesAdjustView: {paddingTop: 20, paddingBottom: 20},
  ProximasVeiculosText: {
    color: '#B9B9B9',
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ProximasVeiculosTextView: {paddingTop: 12},
  ModalDataRightGreyArrowIcon: {height: 18, width: 11, tintColor: '#B9B9B9'},
  SearchIconAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  SearchIconContainer: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
  },
  SearchIconView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '10%',
  },
  SearchIconImg: {height: 20, width: 20},
  SelectStopVisibleSearchTextInputView: {
    justifyContent: 'center',
    width: '90%',
    backgroundColor: '#fff',
  },
  SelectStopVisibleSearchTextInput: {
    color: '#c7c9c8',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
});

export default Favourite;
