import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  Switch,
  ActivityIndicator,
  FlatList,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import Play from '../../Assets/NewImages/Play.png';
import close from '../../Assets/NewImages/close.png';
import add from '../../Assets/NewImages/add.png';
import minus from '../../Assets/NewImages/minus.png';
import PauseButton from '../../Assets/NewImages/PauseButton.png';
import Star from '../../Assets/images/Star.png';
import RightArrow from '../../Assets/NewImages/RightArrow.png';
import RightArrowIcon from '../../Assets/images/RightArrowIcon.png';
import BellNotifee from '../../Assets/images/BellNotifee.png';
import Edit from '../../Assets/images/Edit.png';
import Profile from '../../Assets/images/Profile.png';
import MapImage from '../../Assets/images/Map.png';
import TextMenu from '../../Assets/NewImages/Menu.png';
import Wifi from '../../Assets/NewImages/Wifi.png';
import logo from '../../Assets/NewImages/logo.png';
import LeftArrow from '../../Assets/images/LeftArrow.png';
import SearchIcon from '../../Assets/NewImages/Search.png';
import RightGreyArrow from '../../Assets/images/RightGreyArrow.png';
import GreenTick from '../../Assets/images/GreenTick.png';
import MacIcon from '../../Assets/images/MacIcon.png';
import Direction from '../../Assets/NewImages/Direction.png';
import MapPin from '../../Assets/NewImages/MapPin.png';
import Api from '../Api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LineItems from './LineItems';
import MapView, {Marker} from 'react-native-maps';
import LineAddFavoriteItem from './LineAddFavoriteItem';

const Home = ({route}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedLineItem, setSelectedLineItem] = useState(null);
  const [modalHeight, setModalHeight] = useState('95%');
  const [visible, setVisible] = useState(false);
  const [favoriteStopVisible, setFavouriteStopVisible] = useState(false);
  const [toStopVisible, setToStopVisible] = useState(false);
  const [notificationStopVisible, setNotificationStopVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectStopVisible, setSelectStopVisible] = useState(false);
  const [selectPatternVisible, setSelectPatternVisible] = useState(false);
  const [selectLineVisible, setSelectLineVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [paused, setPaused] = useState(false);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routeSummary, setRouteSummary] = useState([]);
  const [selectedStopName, setSelectedStopName] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editFavourites, setEditFavourites] = useState(null);
  const [matchedStops, setMatchedStops] = useState([]);
  const [matchedPatterns, setMatchedPatterns] = useState([]);
  const [data, setData] = useState([]);
  const [favLineData, setFavLineData] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedStops, setSelectedStops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStops, setFilteredStops] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const [showMapView, setShowMapView] = useState(false);
  const [favoriteStops, setFavoriteStops] = useState(['010101']);
  const [favoritePatterns, setFavoritePatterns] = useState(['1001_0_1']);
  const [isMapReady, setIsMapReady] = useState(false);
  const [filteredRouteSummary, setFilteredRouteSummary] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchLineText, setSearchLineText] = useState('');
  const [loadingStop, setLoadingStop] = useState(false);
  const [firstFavoritePattern, setFirstFavoritePattern] = useState([]);
  const [finalPattern,setFinalPattern]= useState([])

  useEffect(() => {
    if (route.params) {
      setUserData(route.params.data);
      setLoading(false);
    }
  }, [route.params]);

  const handleArrowButtonClick = () => {
    setSelectStopVisible(true);
  };

  const handleLineArrowButtonClick = () => {
    setSelectLineVisible(true);
  };

  const deleteItem = async itemToDelete => {
    try {
      const indexToDelete = data?.favorite_stops?.findIndex(
        item => item?.id === itemToDelete?.id,
      );
      const updatedFavoriteStops = [...data?.favorite_stops];
      updatedFavoriteStops.splice(indexToDelete, 1);
      await EditUserFavouriteStopDetails({
        favorite_stops: updatedFavoriteStops,
      });
      setData(prevData => ({
        ...prevData,
        favorite_stops: updatedFavoriteStops,
      }));
      if (selectedItem && selectedItem?.id === itemToDelete?.id) {
        setSelectedItem(null);
      }
      // setSelectStopVisible(false);
      ToastAndroid.showWithGravity(
        'Unfavorited stop successfully!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } catch (error) {
      console.error('Error unfavoriting stop:', error);
      ToastAndroid.showWithGravity(
        'Failed to unfavorite stop. Please try again later.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  let isAlreadyFavoriteToastShown = false;
  const handleSelectStopFavorite = async item => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await getUserDetailsWithToken(userToken);
      const isDuplicate =
        userData?.favorite_stops &&
        userData?.favorite_stops.some(favItem => favItem?.id === item?.id);
      if (isDuplicate) {
        if (!isAlreadyFavoriteToastShown) {
          ToastAndroid.showWithGravity(
            'This stop is already a favorite!',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          isAlreadyFavoriteToastShown = true; // Update the flag
        }
        return;
      }
      if (!userData?.favorite_stops) {
        var temp_arr = [];
        var updatedFavoriteStops = temp_arr.concat(item);
      } else {
        var updatedFavoriteStops = [...userData?.favorite_stops, {...item}];
      }
      console.log('sameer', updatedFavoriteStops);

      await EditUserFavouriteStopDetails({
        favorite_stops: updatedFavoriteStops,
      });
      setSelectedStop(updatedFavoriteStops);
      //  setSelectStopVisible(false);
      ToastAndroid.showWithGravity(
        'Favorite stop added Successfully!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );

      // Update the data state here
      setData(prevData => ({
        ...prevData,
        favorite_stops: updatedFavoriteStops,
      }));
    } catch (error) {
      console.error('Error adding favorite stop:', error);
      ToastAndroid.showWithGravity(
        'Failed to add favorite stop. Please try again later.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  const handleSelectLineFavorite = async item => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await getUserDetailsWithToken(userToken);
      const isDuplicate =
        userData?.favorite_patterns &&
        userData?.favorite_patterns.some(favItem => favItem?.id === item?.id);
      if (isDuplicate) {
        if (!isAlreadyFavoriteToastShown) {
          ToastAndroid.showWithGravity(
            'This stop is already a favorite!',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          isAlreadyFavoriteToastShown = true; // Update the flag
        }
        return;
      }
      if (!userData?.favorite_patterns) {
        var temp_arr = [];
        var updatedFavoriteLines = temp_arr.concat(item);
      } else {
        var updatedFavoriteLines = [...userData?.favorite_patterns, {...item}];
      }
      console.log('Anshu Patterns', updatedFavoriteLines);

      await EditUserFavouriteStopDetails({
        favorite_patterns: updatedFavoriteLines,
      });
      setSelectedPattern(updatedFavoriteLines);
      console.log('SelectedPattern=====>>>>', selectedPattern);
      //  setSelectStopVisible(false);
      ToastAndroid.showWithGravity(
        'Favorite patterns added Successfully!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );

      // Update the data state here
      setFavLineData(prevData => ({
        ...prevData,
        favorite_patterns: updatedFavoriteLines,
      }));

      console.log('FavData=====>>>', favLineData);
      // setFirstFavoritePattern(favLineData.favorite_patterns[0]);

      console.log(
        'Length of favorite_patterns:',
        favLineData.favorite_patterns.length,
      );
      console.log(
        'Last favorite pattern:',
        favLineData.favorite_patterns[favLineData.favorite_patterns.length - 1],
      );
      setFirstFavoritePattern(
        favLineData.favorite_patterns[favLineData.favorite_patterns.length - 1],
      );
      
      // console.log('FirstFavoritePattern', firstFavoritePattern);
    } catch (error) {
      console.error('Error adding favorite Lines:', error);
      ToastAndroid.showWithGravity(
        'Failed to add favorite Lines. Please try again later.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };
  console.log('FirstFavoritePattern', firstFavoritePattern);
  useEffect(() => {
    const fetchDataLine = async () => {
      try {
        const response = await Api.get('lines');
        setRouteSummary(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataLine();
  }, []);

  const StopSearchModal = ({searchText}) => {
    const [modalHeight, setModalHeight] = useState('90%');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFeatureData, setSearchFeatureData] = useState([]);
    const [mapData, setMapData] = useState([]);
    const [originalData, setOriginalData] = useState([]);

    useEffect(() => {
      setSearchQuery(searchText);
      fetchSearchStopData(searchText);
    }, [searchText]);

    const fetchSearchStopData = async (text = '') => {
      try {
        const response = await Api.get('stops');
        const responseData = response.data;
        setOriginalData(responseData);
        const filteredData =
          text.trim() === ''
            ? responseData
            : responseData.filter(item =>
                item.name.toLowerCase().includes(text.toLowerCase()),
              );

        setSearchFeatureData(filteredData);
        const mapData = filteredData.map(stop => ({
          latitude: stop.lat,
          longitude: stop.lon,
        }));

        setMapData(mapData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const handleSearch = text => {
      setSearchQuery(text);
      fetchSearchStopData(text);
    };

    return (
      <View style={[styles.SelectStopVisibleContainer, {height: modalHeight}]}>
        <View style={styles.CloseButtonView}>
          <TouchableOpacity
            style={styles.CloseBtn}
            onPress={() => {
              setModalHeight('90%');
            }}>
            <Text style={styles.AddBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {/* <View style={styles.SelectStopVisibleEditarCartaoView}>
            <TouchableOpacity
              onPress={() => {
                setSelectStopVisible(false);
              }}>
              <Image
                source={LeftArrow}
                style={styles.SelectStopVisibleLeftArrow}
              />
            </TouchableOpacity>
            <Text style={styles.EditarCartaoText}>Editar Cartão hjhhh</Text>
          </View> */}
          <TouchableOpacity onPress={() => setSelectStopVisible(false)}>
            <View style={styles.SelectStopVisibleEditarCartaoView}>
              <Image
                source={LeftArrow}
                style={styles.SelectStopVisibleLeftArrow}
              />
              <Text style={styles.EditarCartaoText}>Editar Cartão</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.SelecionarParagemTextView}>
            <Text style={styles.SelecionarParagemText}>Selecionar Paragem</Text>
          </View>

          <View style={styles.SearchIconAdjustView}>
            <View style={styles.SearchIconContainer}>
              <View style={styles.SearchIconView}>
                <Image source={SearchIcon} style={styles.SearchIconImg} />
              </View>
              <View style={styles.SelectStopVisibleSearchTextInputView}>
                <TextInput
                  style={styles.SelectStopVisibleSearchTextInput}
                  placeholder="Search"
                  placeholderTextColor="#969696"
                  onChangeText={handleSearch}
                  value={searchQuery}
                />
              </View>
              <View style={styles.SelectStopVisibleMacIconView}>
                <Image
                  source={MacIcon}
                  style={styles.SelectStopVisibleMacIconImg}
                />
              </View>
            </View>
          </View>
          <View style={styles.SelectStopVisibleFlatListContainerAdjustView}>
            <View style={styles.SelectStopVisibleFlatListContainer}>
              <FlatList
                data={searchQuery ? searchFeatureData : originalData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => {
                  // const isFavorite = data?.favorite_stops?.some(favItem => favItem?.id === item?.id);
                  const isFavorite =
                    data?.favorite_stops &&
                    data?.favorite_stops?.some(
                      favItem => favItem?.id === item?.id,
                    );

                  return (
                    <View>
                      <TouchableOpacity
                        key={item.id}
                        // onPress={() => handleSelectStopFavorite(item)}
                        onPress={() =>
                          isFavorite
                            ? deleteItem(item)
                            : handleSelectStopFavorite(item)
                        }>
                        <View
                          style={
                            styles.SelectStopVisibleFlatListContainerInner
                          }>
                          <View>
                            <Text
                              style={styles.SelectStopVisibleFlatListItemName}>
                              {item.name}
                            </Text>
                          </View>

                          <View
                            style={styles.SelectStopVisibleFlatListItemAddBtn}>
                            {/* <Text
                              style={styles.SelectStopVisibleFlatListAddBtnImg}> */}
                            {/* <Text style={isFavorite ? styles.minusIcon : styles.plusIcon}>
                              {isFavorite ? '-' : '+'}
                            </Text> */}

                            {isFavorite ? (
                              <Image
                                source={minus}
                                style={styles.favoriteButton}
                              />
                            ) : (
                              <Image
                                source={add}
                                style={styles.favoriteButton}
                              />
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
              <View style={styles.SelectStopVisibleParagensEncontradasView}>
                <Text style={styles.SelectStopVisibleParagensEncontradasText}>
                  {searchQuery
                    ? `${searchFeatureData.length} paragens encontradas`
                    : `${originalData.length} paragens encontradas`}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const LineSearchModal = ({searchText}) => {
    const [modalHeight, setModalHeight] = useState('90%');
    const [searchLineQuery, setSearchLineQuery] = useState('');
    const [filteredRouteSummary, setFilteredRouteSummary] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
      setSearchLineQuery(searchText);
    }, [searchLineText]);

    const fetchData = async (text = '') => {
      try {
        const response = await Api.get('lines');
        const responseData = response.data;

        setData(responseData);
        const filteredData =
          text.trim() === ''
            ? responseData
            : responseData.filter(
                item =>
                  item.short_name.toLowerCase().includes(text.toLowerCase()) ||
                  item.long_name.toLowerCase().includes(text.toLowerCase()),
              );

        setFilteredRouteSummary(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    useEffect(() => {
      fetchData(searchLineQuery);
    }, [searchLineQuery]);

    const handleSearch = text => {
      setSearchLineQuery(text);
    };

    return (
      <View style={[styles.SelectLinesVisibleContainer, {height: modalHeight}]}>
        <View style={styles.CloseButtonView}>
          <TouchableOpacity
            style={styles.CloseBtn}
            onPress={() => {
              setModalHeight('90%');
            }}>
            <Text style={styles.AddBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 8,
            }}>
            <TouchableOpacity
              onPress={() => {
                setSelectLineVisible(false);
              }}>
              <Image source={LeftArrow} style={{height: 17, width: 22}} />
            </TouchableOpacity>
            <Text
              style={{
                color: '#000',
                fontSize: 17,
                fontWeight: '400',
                fontStyle: 'normal',
                textAlign: 'left',
                paddingLeft: 3,
                fontFamily: 'SFPro-Regular',
              }}>
              Editar Cartão
            </Text>
          </View>
          <View
            style={{
              paddingLeft: 20,
              paddingTop: 14,
              borderBottomWidth: 1,
              borderBottomColor: '#7d7e80',
              paddingBottom: 10,
            }}>
            <Text
              style={{
                color: '#000',
                fontSize: 34,
                fontWeight: '700',
                fontStyle: 'normal',
                textAlign: 'left',
                fontFamily: 'SFPro-Bold',
              }}>
              Selecionar Linha
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 20,
            }}>
            <View>
              <Text
                style={{
                  color: '#000',
                  fontSize: 24,
                  fontWeight: '700',
                  fontStyle: 'normal',
                  textAlign: 'left',
                  lineHeight: 30,
                  fontFamily: 'Inter-Bold',
                }}>
                Recentes
              </Text>
            </View>
            <View>
              <TouchableOpacity
                style={{
                  height: 15,
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#B9B9B9',
                  borderRadius: 10,
                  paddingTop: 2,
                }}>
                <Text
                  style={{
                    color: '#B9B9B9',
                    fontSize: 10,
                    fontWeight: '500',
                    fontStyle: 'normal',
                    textAlign: 'center',
                    lineHeight: 8,
                    fontFamily: 'Inter-Medium',
                  }}>
                  Limpar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 20,
            }}>
            <View
              style={{
                backgroundColor: '#3C3C43',
                width: '100%',
                padding: 10,
                borderRadius: 12,
                flexDirection: 'row',
                opacity: 0.2,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '20%',
                }}>
                <Image source={SearchIcon} style={{height: 20, width: 20}} />
              </View>
              <View style={{width: '70%', justifyContent: 'center'}}>
                <TextInput
                  style={{
                    color: '#c7c9c8',
                    fontSize: 14,
                    fontWeight: '600',
                    fontStyle: 'normal',
                    textAlign: 'left',
                    color: '#000',
                  }}
                  placeholder="Search"
                  placeholderTextColor="#969696"
                  onChangeText={handleSearch}
                  value={searchLineQuery}
                />
              </View>
              <View
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image source={MacIcon} style={{height: 40, width: 20}} />
              </View>
            </View>
          </View>

          <View
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 20,
            }}>
            <View>
              <Text
                style={{
                  color: '#000',
                  fontSize: 24,
                  fontWeight: '700',
                  fontStyle: 'normal',
                  textAlign: 'left',
                  lineHeight: 30,
                  fontFamily: 'Inter-Bold',
                }}>
                Todas as Linhas
              </Text>
            </View>
          </View>
          <View
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 10,
            }}>
            <View>
              <FlatList
                data={searchLineQuery ? filteredRouteSummary : data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#969696',
                        paddingTop: 20,
                        paddingBottom: 20,
                      }}>
                      <TouchableOpacity
                        onPress={() => handleSelectLineFavorite(item)}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                        }}>
                        <View>
                          <View
                            style={{
                              width: 60,
                              height: 24,
                              backgroundColor: item.color,
                              borderRadius: 12,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                color: '#FFF',
                                fontSize: 16,
                                fontWeight: '700',
                                fontStyle: 'normal',
                                textAlign: 'center',
                                fontFamily: 'Inter-Bold',
                              }}>
                              {item.short_name}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            width: '65%',
                            paddingLeft: 10,
                            paddingRight: 10,
                          }}>
                          <Text
                            style={{
                              color: '#000',
                              fontSize: 16,
                              fontWeight: '700',
                              fontStyle: 'normal',
                              textAlign: 'left',
                              fontFamily: 'Inter-Bold',
                            }}>
                            {item.long_name}
                          </Text>
                        </View>
                        <View>
                          <View
                            style={styles.SelectstopVisibleFlatListItemAddBtn}>
                            {/* <Text
                              style={styles.SelectStopVisibleFlatListAddBtnImg}>
                              +
                            </Text> */}
                            <TouchableOpacity>
                              <Image
                                source={add}
                                style={styles.favoriteButton}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          </View>
          <View
            style={{
              paddingTop: 40,
              paddingBottom: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#3C3C43',
                fontSize: 18,
                fontWeight: '500',
                fontStyle: 'normal',
                textAlign: 'center',
                fontFamily: 'SFPro-Medium',
              }}>
              {searchLineQuery
                ? `${filteredRouteSummary.length} paragens encontradas`
                : `${data.length} paragens encontradas`}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };

 

  const EditUserFavouriteStopDetails = async (
    selectedStop,
    selectedPattern,
  ) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        return null;
      }
      const response = await Api.post(
        'https://beta.carrismetropolitana.pt/api/profile/edit/favorites',
        selectedStop,
        selectedPattern,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status === 200) {
        const data = response.data;
        // setEditFavourites(data);
        return data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get(
          `patterns/${setLineInfo(itemLine.patterns)}`,
        );

        setStops(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchStopsData = async editFavourites => {
      try {
        const {favorite_stops} = editFavourites;
        const response = await Api.get(
          'https://api.carrismetropolitana.pt/stops',
        );
        const stopsData = response.data;
        const matchedItems = favorite_stops.map(favoriteStopId => {
          const matchingStop = stopsData.find(
            stop => stop.id === favoriteStopId,
          );
          if (matchingStop) {
            return {
              id: matchingStop.id,
              name: matchingStop.name,
            };
          }
          return null;
        });
        const filteredMatchedItems = matchedItems.filter(item => item !== null);
        setMatchedStops(filteredMatchedItems);
      } catch (error) {}
    };

    if (editFavourites) {
      fetchStopsData(editFavourites);
    }
  }, [editFavourites]);

  useEffect(() => {
    getUserDetailsWithToken();
  }, []);

  const getUserDetailsWithToken = async userToken => {
    try {
      const response = await Api.get(
        'https://beta.carrismetropolitana.pt/api/profile',
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status === 200) {
        const data = response.data;
        setData(data);
        return data;
      } else {
        console.error('Failed to fetch user details:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
      return null;
    }
  };
  const handleCloseButtonPress = () => {
    setVisible(false);
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor="#FFDD00"></StatusBar>
      <View style={styles.MainView}>
        <View style={styles.LogoTextRow}>
          <View>
            <Image source={logo} style={styles.LogoImg} />
          </View>
          <View style={styles.WifiTextViewView}>
            <View style={styles.WifiImgView}>
              <Image source={Wifi} style={styles.WifiImg} />
            </View>
            <View style={styles.WifiTextView}>
              <Text style={styles.WifiText}>Ligar ao Wi-Fi</Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.ProfileImageGreetingAdjustView}>
            <View style={styles.ProfileImageGreetingRow}>
              <TouchableOpacity
                onPress={() => {
                  setProfileVisible(true);
                }}>
                <View style={styles.ProfileBgView}>
                  <Image source={Profile} style={styles.ProfileImage} />
                </View>
              </TouchableOpacity>

              <View style={styles.OláAndréTextView}>
                <Text style={styles.OláAndréText}> {userData.email}</Text>
              </View>
            </View>
            {/* stop list view */}

            <FlatList
              // data={data?.favorite_stops}
              data={data?.favorite_stops ? data?.favorite_stops : []}
              renderItem={({item, index}) => {
                // addLineFt(item);
                return (
                  <View>
                    <View style={styles.FirstViewContainerTop}>
                      <View style={styles.FirstViewContainer}>
                        <View style={styles.FirstViewContainerInnerViewRow}>
                          <View>
                            <View style={styles.CovaDaStopTextView}>
                              <Text style={styles.HospitalText}>
                                {item?.name}
                                {setSelectedItem(item)}
                              </Text>
                            </View>
                            <View style={styles.SelectedStopStopIdTextView}>
                              <Text style={styles.SelectedStopStopIdText}>
                                {item?.id}
                              </Text>
                            </View>

                            <View style={styles.CovaDaStopIdRow}>
                              <View style={styles.CovaDaStopTextView}></View>
                            </View>
                          </View>
                          <TouchableOpacity onPress={() => deleteItem(index)}>
                            <View style={{paddingRight: 10, top: -10}}>
                              <Image
                                source={Star}
                                style={styles.FirstViewContainerStarImage}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {item?.lines?.map(itemLine => (
                        <>
                          <TouchableOpacity
                            onPress={() => {
                              setIsShwoMap(false);
                            }}></TouchableOpacity>
                          <LineItems
                            itemLine={itemLine}
                            routeSummary={routeSummary}
                            item={item}
                          />
                        </>
                      ))}
                    </View>
                  </View>
                );
              }}
              contentContainerStyle={{flexGrow: 1}}
            />
            {/* linhas list view */}
            <View style={[styles.FirstViewContainerTop, {paddingTop: 20}]}>
              <View style={styles.FirstViewContainer}>
                <View style={styles.FirstViewContainerInnerViewRow}>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={[
                        styles.RouteShortNameTextView,
                        {
                          backgroundColor: 'red',
                          height: 20,
                          top: -10,
                          borderRadius: 11,
                          width: 52,
                          margin: 0,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.SelectedStopStopIdText,
                          {color: '#fff', fontSize: 14},
                        ]}>
                        1234
                      </Text>
                    </View>
                    <View style={{top: -10, paddingLeft: 10}}>
                      <Text style={{fontSize: 14, color: '#000'}}>Amadora</Text>
                    </View>
                  </View>

                  <TouchableOpacity>
                    <View style={{paddingRight: 10, top: -10}}>
                      <Image
                        source={Star}
                        style={styles.FirstViewContainerStarImage}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <MapView
                initialRegion={{
                  latitude: 38.754244,
                  longitude: -8.959557,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={styles.MapViewArea}
                onMapReady={() => console.log('Map is ready')}
                showsUserLocation={true}></MapView>
            </View>

            {route.params.data &&
            route.params.data.favorite_patterns &&
            route.params.data.favorite_patterns.length > 0 ? (
              <View style={styles.SelectedStopMapContainerDataRow}>
                {route.params.data.favorite_patterns.map(stop => (
                  <View key={stop} style={styles.RouteNameRows}>
                    <View
                      style={[
                        styles.RouteShortNameTextView,
                        {backgroundColor: ''},
                      ]}>
                      <Text style={styles.RouteShortNameText}>{stop}</Text>
                    </View>
                    <View>
                      <Image source={RightArrow} style={styles.RightArrowImg} />
                    </View>

                    <View>
                      <Text style={styles.RouteLongNameText}>{stop}</Text>
                    </View>
                  </View>
                ))}
                <View style={styles.TimeArrowRow}>
                  <View>
                    <Text style={styles.TimeText}></Text>
                  </View>
                  <View style={styles.TimeRightArrowIconView}>
                    <Image
                      source={RightArrowIcon}
                      style={styles.selectedStopRightArrowIcon}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <Text></Text>
            )}

            <View style={styles.PersonalizerButtonContainerAdjustView}>
              <TouchableOpacity
                style={styles.PersonalizerButton}
                onPress={() => {
                  setVisible(true);
                }}>
                <View style={styles.PersonalizerButtonRow}>
                  <Image source={Edit} style={styles.PersonalizerButtonImg} />
                  <Text style={styles.PersonalizerButtonText}>
                    Personalizar
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Modal
              style={styles.ModalContainer}
              isVisible={visible}
              onBackdropPress={() => setVisible(false)}
              animationType="slide"
              transparent={true}>
              <View style={[styles.ModalView, {height: modalHeight}]}>
                <View style={styles.CloseButtonView}>
                  <TouchableOpacity
                    style={styles.CloseBtn}
                    onPress={() => {
                      setModalHeight('100%');
                    }}></TouchableOpacity>
                </View>
                <ScrollView>
                  <View style={styles.ToCloseButtonView}>
                    <TouchableOpacity onPress={handleCloseButtonPress}>
                      <Image source={close} style={styles.closeButton} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.PersonalizeTextView}>
                    <Text style={styles.PersonalizeText}>Personalizar</Text>
                  </View>

                  <View style={styles.SortCardsTextView}>
                    <Text style={styles.SortCardsText}>Ordenar cartões</Text>
                    <View style={styles.ArrangeCardsTextMessageView}>
                      <Text style={styles.ArrangeCardsTextMessage}>
                        Organize os cartões como quer que apareçam na página
                        principal. Altere a ordem deslizando no ícone
                      </Text>
                      {/* <View style={styles.FirstHamburgerTextMessageImageView}>
                        <Image
                          source={TextMenu}
                          style={styles.FirstHamburgerTextMessageImage}
                        />
                      </View> */}
                    </View>
                  </View>
                  <View style={styles.StopSortingAdjustView}>
                    <View style={styles.StopSortingContainer}>
                      <View style={styles.ToStopContainer}>
                        <TouchableOpacity
                          onPress={() => {
                            setFavouriteStopVisible(true);
                          }}
                          style={styles.ToStopRow}>
                          <View style={styles.ToStopRow}>
                            <View>
                              <Image
                                source={TextMenu}
                                style={styles.FirstHamburgerImage}
                              />
                            </View>
                            <View style={styles.ToStopTextView}>
                              <Text style={styles.ToStopText}>
                                Paragem Favorita
                              </Text>
                              <Text style={styles.HospitalText}>
                                {selectedItem
                                  ? selectedItem.name
                                  : 'Adicionar paragens favoritas'}
                              </Text>
                            </View>
                          </View>
                          {/* <View style={{left:50}}>
                    
                             <Image
                              source={RightArrowIcon}
                              style={styles.ToStopRightArrowImage}
                            />                          
                        </View> */}
                        </TouchableOpacity>
                      </View>
                      <View style={styles.FavouriteStopContainer}>
                        <TouchableOpacity
                          // onPress={() => {
                          //   setSelectStopVisible(true);
                          // }}
                          onPress={() => {
                            setToStopVisible(true);
                          }}
                          style={styles.FavouriteStopRow}>
                          <View
                            style={[styles.FavouriteStopRow, {paddingTop: 10}]}>
                            <View>
                              <Image
                                source={TextMenu}
                                style={styles.SecondHamburgerImage}
                              />
                            </View>
                            <View style={styles.FavouriteStopTextView}>
                              <Text style={styles.FavouriteStopText}>
                                Linha Favorita
                              </Text>

                              <ScrollView style={{flexGrow: 1}}>
                                {selectedItem &&
                                selectedItem.lines &&
                                selectedItem.lines.length > 0 ? (
                                  selectedItem.lines.map(itemLine => (
                                    <LineAddFavoriteItem
                                      key={itemLine.id}
                                      itemLine={itemLine}
                                      routeSummary={routeSummary}
                                    />
                                  ))
                                ) : (
                                  <Text style={styles.HospitalText}>
                                    Adicione linhas favoritas
                                  </Text>
                                )}
                              </ScrollView>
                            </View>
                          </View>
                          {/* <View style={{left:50,paddingTop:10}}>
                            <Image
                              source={RightArrowIcon}
                              style={styles.FavouriteStopArrowImage}
                            />
                        </View> */}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={styles.AddNewCardTextView}>
                    <Text style={styles.AddNewCardText}>
                      Adicionar novo cartão
                    </Text>
                    <Text style={styles.AddNewCardTextMessage}>
                      Escolha um tipo de cartão para adicionar à página
                      principal.
                    </Text>
                  </View>
                  <View style={styles.OptionsAdjustView}>
                    <View style={styles.OptionContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          setFavouriteStopVisible(true);
                        }}>
                        <View style={styles.OptionFavouriteStopContainer}>
                          <View style={styles.ParagemFavoritaRow}>
                            <View>
                              <Image
                                source={MapPin}
                                style={
                                  styles.ParagemFavouritaNotificationBellImage
                                }
                              />
                            </View>
                            <View style={styles.ParagemFavouritaTextView}>
                              <Text style={styles.ParagemFavouritaText}>
                                Paragem Favorita
                              </Text>
                            </View>
                          </View>
                          <View style={styles.ParagemFavouritaAddBtnView}>
                            <View style={styles.ParagemFavouritaAddBtn}>
                              <Text style={styles.ParagemFavouritaAddBtnText}>
                                +
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setToStopVisible(true);
                        }}>
                        <View style={styles.LinhaFavoritaRow}>
                          <View style={styles.LinhaFavoritaInnerRow}>
                            <View>
                              <Image
                                source={Direction}
                                style={styles.LinhaFavoritaNoticationBellImage}
                              />
                            </View>
                            <View style={styles.LinhaFavoritaTextView}>
                              <Text style={styles.LinhaFavoritaText}>
                                Linha Favorita
                              </Text>
                            </View>
                          </View>
                          <View style={styles.LinhaFavoritaAddBtnView}>
                            <View style={styles.LinhaFavoritaAddBtn}>
                              <Text style={styles.LinhaFavoritaAddBtnText}>
                                +
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setNotificationStopVisible(true);
                        }}>
                        <View style={styles.NotificationRow}>
                          <View style={styles.NotificationInnerRow}>
                            <View>
                              <Image
                                source={BellNotifee}
                                style={styles.NotificationViewBellImg}
                              />
                            </View>
                            <View style={styles.NotificationSectionTextView}>
                              <Text style={styles.NotificationSectionText}>
                                Notificações Inteligentes
                              </Text>
                            </View>
                          </View>
                          <View style={styles.NotificationSectionAddBtnView}>
                            <View style={styles.NotificationSectionAddBtn}>
                              <Text
                                style={styles.NotificationSectionAddBtnText}>
                                +
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </View>
              <Modal
                onBackdropPress={() => setFavouriteStopVisible(false)}
                style={styles.ModalContainer}
                isVisible={favoriteStopVisible}>
                <View
                  style={[
                    styles.FavouriteModalContainer,
                    {height: modalHeight},
                  ]}>
                  <View style={styles.CloseButtonView}>
                    <TouchableOpacity
                      style={styles.CloseBtn}
                      onPress={() => {
                        setModalHeight('90%');
                      }}>
                      <Text style={styles.AddBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView>
                    <View style={styles.FavouriteStopModalContainer}>
                      <TouchableOpacity
                        style={styles.FavouriteStopModalContainer}
                        onPress={() => {
                          setFavouriteStopVisible(false);
                        }}>
                        <Image
                          source={LeftArrow}
                          style={styles.FavouriteStopModalContainerLeftArrow}
                        />

                        <Text
                          style={
                            styles.FavouriteStopModalContainerPersonalizar
                          }>
                          Personalizar
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={
                        styles.FavouriteStopModalContainerParagemFavouritaTextView
                      }>
                      <Text
                        style={
                          styles.FavouriteStopModalContainerParagemFavouritaText
                        }>
                        Paragem Favorita
                      </Text>
                    </View>
                    <View style={styles.SortCardsTextView}>
                      <Text
                        style={
                          styles.FavouriteStopModalContainerSelecionarParagemText
                        }>
                        Selecionar paragem
                      </Text>
                      <Text style={styles.EscolhaUmaText}>
                        Escolha uma paragem para visualizar na página principal.
                      </Text>
                    </View>
                    {/* <View style={styles.ProcurarParagemAdjustView}>
                      <View style={styles.ProcurarParagemBackgroundView}>
                        <View style={styles.ProcurarParagemSearchIconView}>
                          <Image
                            source={SearchIcon}
                            style={styles.ProcurarParagemSearchIconImg}
                          />
                        </View>

                        <View style={styles.ProcurarParagemTextInputView}>
                          <TextInput
                            style={styles.ProcurarParagemTextInput}
                            placeholder="Procurar paragem"
                            placeholderTextColor="#969696"
                            value={searchText}
                            onChangeText={setSearchText}
                            onSubmitEditing={handleArrowButtonClick}
                            
                          />
                        </View>

                        <TouchableOpacity onPress={handleArrowButtonClick}>
                          <View
                            style={
                              styles.ProcurarParagemRightGreyArrowIconView
                            }>
                            <Image
                              source={RightGreyArrow}
                              style={
                                styles.ProcurarParagemRightGreyArrowIconImg
                              }
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View> */}
                    <TouchableOpacity onPress={handleArrowButtonClick}>
                      <View
                        style={[
                          styles.ProcurarParagemAdjustView,
                          {backgroundColor: ''},
                        ]}>
                        <View
                          style={[
                            styles.ProcurarParagemBackgroundView,
                            {backgroundColor: '', top: -10},
                          ]}>
                          <View style={styles.ProcurarParagemSearchIconView}>
                            <Image
                              source={SearchIcon}
                              style={styles.ProcurarParagemSearchIconImg}
                            />
                          </View>
                          <View style={styles.ProcurarParagemTextInputView}>
                            <TextInput
                              style={styles.ProcurarParagemTextInput}
                              placeholder="Procurar paragem"
                              placeholderTextColor="#969696"
                              value={searchText}
                              onChangeText={setSearchText}
                              onSubmitEditing={handleArrowButtonClick}
                            />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={styles.SelecionarDestinosEscolhaQuaisAdjustView}>
                      <Text style={styles.SelecionarDestinosText}>
                        Selecionar destinos
                      </Text>
                      <Text style={styles.EscolhaQuaisText}>
                        Escolha quais destinos pretende visualizar.
                      </Text>
                    </View>
                    <View style={styles.StopSortingAdjustView}>
                      <View style={styles.StopSortingAdjustContainer}>
                        <View style={styles.ToStopContainer}>
                          <View style={styles.ToStopRow}>
                            <View
                              style={styles.StopSortingDestinationOptionOne}>
                              <Text
                                style={
                                  styles.StopSortingDestinationOptionOneZeroText
                                }>
                                0000
                              </Text>
                            </View>
                            <View style={styles.ToStopTextView}>
                              <Text style={styles.ToStopTextOptionOne}>
                                Destination 1
                              </Text>
                            </View>
                          </View>
                          <View
                            style={styles.StopSortingDestinationBorder}></View>
                        </View>
                        <View style={styles.FavouriteStopContainer}>
                          <View style={styles.FavouriteStopRow}>
                            <View style={styles.FavouriteStopOptionSecond}>
                              <Text
                                style={styles.FavouriteStopOptionSecondText}>
                                0000
                              </Text>
                            </View>
                            <View style={styles.ToStopTextView}>
                              <Text
                                style={
                                  styles.FavouriteStopOptionSecondDestinationText
                                }>
                                Destination 1
                              </Text>
                            </View>
                          </View>
                          <View style={styles.FirstGreenTickView}>
                            <Image
                              source={GreenTick}
                              style={styles.FirstGreenTickImg}
                            />
                          </View>
                        </View>
                        <View style={styles.FavouriteStopSecondContainer}>
                          <View style={styles.FavouriteStopSecondRow}>
                            <View
                              style={
                                styles.FavouriteStopSecondContainerSecondDestinationZeroView
                              }>
                              <Text
                                style={
                                  styles.FavouriteStopSecondContainerDestinationZeroText
                                }>
                                0000
                              </Text>
                            </View>
                            <View style={styles.ToStopTextView}>
                              <Text
                                style={
                                  styles.FavouriteStopSecondContainerDestinationText
                                }>
                                Destination 1
                              </Text>
                            </View>
                          </View>
                          <View
                            style={
                              styles.FavouriteStopSecondContainerGreenTickView
                            }>
                            <TouchableOpacity>
                              <Image
                                source={GreenTick}
                                style={
                                  styles.FavouriteStopSecondContainerGreenTickImg
                                }
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.AtivarNotificacoesTextView}>
                      <Text style={styles.AtivarNotificacoesText}>
                        Ativar notificações
                      </Text>
                      <Text style={styles.ReceberNotificacoesMsgText}>
                        Receber notificações sempre que houver novos avisos para
                        as linhas e paragens selecionadas.
                      </Text>
                    </View>
                    <View style={styles.ReceberNotificacoesAdjustView}>
                      <View style={styles.ReceberNotificacoesContainerView}>
                        <View>
                          <Text style={styles.ReceberNotificacoesText}>
                            Receber notificações
                          </Text>
                        </View>
                        <View>
                          <Switch
                            trackColor={{false: '#767577', true: '#62c95b'}}
                            thumbColor={isEnabled ? '#fff' : '#fff'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.FavouriteStopGuardarAdjustView}>
                      <TouchableOpacity
                        onPress={() => {
                          setFavouriteStopVisible(false);
                        }}
                        style={styles.FavouriteStopGuardarButton}>
                        <Text style={styles.FavouriteStopGuardarText}>
                          Guardar
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={styles.FavouriteStopContainerEliminarAdjustView}>
                      <TouchableOpacity
                        style={styles.FavouriteStopEliminarButton}>
                        <Text style={styles.FavouriteStopEliminarText}>
                          Eliminar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
                <Modal
                  style={styles.ModalContainer}
                  isVisible={selectStopVisible}
                  onBackdropPress={() => setSelectStopVisible(false)}>
                  <StopSearchModal searchText={searchText} />
                </Modal>
              </Modal>
              <Modal
                style={styles.ModalContainer}
                isVisible={toStopVisible}
                onBackdropPress={() => setToStopVisible(false)}>
                <View
                  style={[
                    styles.ToStopVisibleContainer,
                    {height: modalHeight},
                  ]}>
                  <View style={styles.CloseButtonView}>
                    <TouchableOpacity
                      style={styles.CloseBtn}
                      onPress={() => {
                        setModalHeight('99%');
                      }}>
                      <Text style={styles.AddBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView>
                    <View style={styles.LinhaFavouriteContainer}>
                      <TouchableOpacity
                        style={styles.LinhaFavouriteContainer}
                        onPress={() => {
                          setToStopVisible(false);
                        }}>
                        <Image
                          source={LeftArrow}
                          style={styles.LinhaFavouriteLeftArrow}
                        />
                        <Text style={styles.LinhaFavouritePersonalizarText}>
                          Personalizar
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.LinhaFavouriteTextView}>
                      <Text style={styles.LinhaFavouriteText}>
                        Linha Favorita
                      </Text>
                    </View>
                    <View style={styles.SortCardsTextView}>
                      <Text style={styles.LinhaFavouriteSelecionarLinha}>
                        Selecionar linha
                      </Text>
                      <Text style={styles.LinhaFavouriteEscolhaUmaText}>
                        Escolha uma linha para visualizar na página principal.
                      </Text>
                    </View>

                    <View style={styles.ProcurarLinhaAdjustView}>
                      <View style={styles.ProcurarLinhaContainer}>
                        <View style={styles.ProcurarLinhaSearchIconView}>
                          <Image
                            source={SearchIcon}
                            style={styles.ProcurarLinhaSearchIconImg}
                          />
                        </View>

                        <View style={styles.ProcurarLinhaTextInputView}>
                          <TextInput
                            style={styles.ProcurarLinhaTextInput}
                            placeholder="Procurar linha"
                            placeholderTextColor="#969696"
                            value={searchLineText}
                            onChangeText={setSearchLineText}
                            onSubmitEditing={handleLineArrowButtonClick}
                          />
                        </View>
                        <View style={styles.ProcurarLinhaRightGreyArrowView}>
                          <TouchableOpacity
                            onPress={handleLineArrowButtonClick}>
                            <Image
                              source={RightGreyArrow}
                              style={styles.ProcurarLinhaRightGreyArrowImg}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    <View
                      style={styles.LinhaFavouriteSelecionarDestinosAdjustView}>
                      <Text style={styles.LinhaFavouriteSelecionarDestinosText}>
                        Selecionar destinos
                      </Text>
                      <Text style={styles.LinhaFavouriteEscolhaDestinoTextMsg}>
                        Escolha 1 destino para gravar na página de entrada.
                      </Text>
                    </View>
                    <View style={styles.StopSortingAdjustView}>
                      <View
                        style={styles.FavouriteStopSortingAdjustViewContainer}>
                        <View style={styles.ToStopContainer}>
                          <View style={styles.ToStopRow}>
                            <View
                              style={
                                styles.FavouriteStopSortingDestinationOptionOneBg
                              }>
                              <Text
                                style={
                                  styles.FavouriteStopSortingDestinationOptionOneZeroText
                                }>
                                0000
                              </Text>
                            </View>
                            <View style={styles.ToStopTextView}>
                              <Text
                                style={
                                  styles.FavouriteStopSortingDestinationOptionOneText
                                }>
                                Destination 1
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: 1,
                              borderColor: '#000',
                            }}></View>
                        </View>
                        <View style={styles.FavouriteStopContainer}>
                          <View style={styles.FavouriteStopRow}>
                            <View
                              style={{
                                width: 60,
                                height: 24,
                                backgroundColor: '#000',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 12,
                              }}>
                              <Text
                                style={{
                                  color: '#FFF',
                                  fontSize: 16,
                                  fontWeight: '700',
                                  fontStyle: 'normal',
                                  textAlign: 'center',
                                }}>
                                0000
                              </Text>
                            </View>
                            <View style={styles.ToStopTextView}>
                              <Text
                                style={{
                                  color: '#000',
                                  fontSize: 16,
                                  fontWeight: '700',
                                  fontStyle: 'normal',
                                  textAlign: 'left',
                                }}>
                                Destination 1
                              </Text>
                            </View>
                          </View>
                          <View style={{right: -10}}>
                            <Image
                              source={GreenTick}
                              style={{height: 40, width: 40}}
                            />
                          </View>
                        </View>
                        <View style={styles.FavouriteStopSecondContainer}>
                          <View style={styles.FavouriteStopSecondRow}>
                            <View
                              style={{
                                width: 60,
                                height: 24,
                                backgroundColor: '#000',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 12,
                              }}>
                              <Text
                                style={{
                                  color: '#FFF',
                                  fontSize: 16,
                                  fontWeight: '700',
                                  fontStyle: 'normal',
                                  textAlign: 'center',
                                }}>
                                0000
                              </Text>
                            </View>
                            <View style={styles.ToStopTextView}>
                              <Text
                                style={{
                                  color: '#000',
                                  fontSize: 16,
                                  fontWeight: '700',
                                  fontStyle: 'normal',
                                  textAlign: 'left',
                                }}>
                                Destination 1
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: 1,
                              borderColor: '#000',
                            }}></View>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 20,
                      }}>
                      <Text
                        style={{
                          color: '#5A5A5A',
                          fontSize: 16,
                          fontWeight: '600',
                          fontStyle: 'normal',
                          textAlign: 'left',
                        }}>
                        Ativar notificações
                      </Text>
                      <Text
                        style={{
                          color: '#969696',
                          fontSize: 12,
                          fontWeight: '500',
                          fontStyle: 'normal',
                          textAlign: 'left',
                        }}>
                        Receber notificações sempre que houver novos avisos para
                        as linhas e paragens selecionadas.
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 20,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          backgroundColor: '#fff',
                          borderRadius: 10,
                          padding: 20,
                        }}>
                        <View>
                          <Text
                            style={{
                              color: '#5A5A5A',
                              fontSize: 16,
                              fontWeight: '600',
                              fontStyle: 'normal',
                              textAlign: 'left',
                            }}>
                            Receber notificações
                          </Text>
                        </View>
                        <View>
                          <Switch
                            trackColor={{false: '#767577', true: '#62c95b'}}
                            thumbColor={isEnabled ? '#fff' : '#fff'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                          />
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 20,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setToStopVisible(false);
                        }}
                        style={{
                          borderRadius: 12,
                          width: '100%',
                          padding: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#006EFF',
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 22,
                            fontWeight: '600',
                            fontStyle: 'normal',
                            textAlign: 'center',
                          }}>
                          Guardar
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 20,
                        paddingBottom: 20,
                      }}>
                      <TouchableOpacity
                        style={{
                          borderRadius: 12,
                          width: '100%',
                          padding: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#FF0000',
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 22,
                            fontWeight: '600',
                            fontStyle: 'normal',
                            textAlign: 'center',
                          }}>
                          Eliminar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
                <Modal
                  style={styles.ModalContainer}
                  isVisible={selectLineVisible}
                  onBackdropPress={() => setSelectLineVisible(false)}>
                  <LineSearchModal searchText={searchLineText} />
                </Modal>
              </Modal>
              <Modal
                style={styles.ModalContainer}
                isVisible={notificationStopVisible}
                onBackdropPress={() => setNotificationStopVisible(false)}>
                <View
                  style={[
                    styles.NotificationVisibleContainer,
                    {height: modalHeight},
                  ]}>
                  <View style={styles.CloseButtonView}>
                    <TouchableOpacity
                      style={styles.CloseBtn}
                      onPress={() => {
                        // setVisible(false);
                        setModalHeight('100%');
                      }}></TouchableOpacity>
                  </View>
                  <ScrollView>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: 8,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          // setVisible(false);
                          setNotificationStopVisible(false);
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingLeft: 8,
                        }}>
                        <Image
                          source={LeftArrow}
                          style={{height: 17, width: 22}}
                        />
                        <Text
                          style={{
                            color: '#000',
                            fontSize: 17,
                            fontWeight: '400',
                            fontStyle: 'normal',
                            textAlign: 'left',
                            paddingLeft: 3,
                          }}>
                          Personalizar
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        paddingLeft: 20,
                        paddingTop: 14,
                        borderBottomWidth: 1,
                        borderBottomColor: '#7d7e80',
                        paddingBottom: 10,
                      }}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 34,
                          fontWeight: '700',
                          fontStyle: 'normal',
                          textAlign: 'left',
                        }}>
                        Nova Notificação
                      </Text>
                    </View>

                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10,
                      }}>
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          backgroundColor: '#B9B9B9',
                          borderRadius: 10,
                        }}></View>
                      <View
                        style={{
                          width: 2,
                          height: 30,
                          borderRadius: 4,
                          borderWidth: 1,
                          borderColor: '#B9B9B9',
                        }}></View>
                      <View>
                        <Text
                          style={{
                            color: '#5A5A5A',
                            fontSize: 16,
                            fontWeight: '600',
                            fontStyle: 'normal',
                            textAlign: 'center',
                          }}>
                          Notificar-me quando um veículo da linha
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 10,
                      }}>
                      <View
                        style={{
                          backgroundColor: '#fff',
                          width: '100%',
                          padding: 20,
                          borderRadius: 12,
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '20%',
                          }}>
                          <Image
                            source={SearchIcon}
                            style={{height: 20, width: 20}}
                          />
                        </View>
                        <View style={{width: '70%'}}>
                          <TextInput
                            style={{
                              color: '#969696',
                              fontSize: 14,
                              fontWeight: '600',
                              fontStyle: 'normal',
                              textAlign: 'left',
                            }}
                            placeholder="Procurar linha"
                            placeholderTextColor="#969696"
                          />
                        </View>
                        <View
                          style={{
                            width: '10%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={RightGreyArrow}
                            style={{height: 10, width: 10}}
                          />
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10,
                      }}>
                      <View
                        style={{
                          width: 2,
                          height: 30,
                          borderRadius: 4,
                          borderWidth: 1,
                          borderColor: '#B9B9B9',
                        }}></View>
                      <View>
                        <Text
                          style={{
                            color: '#5A5A5A',
                            fontSize: 16,
                            fontWeight: '600',
                            fontStyle: 'normal',
                            textAlign: 'center',
                          }}>
                          estiver a
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 10,
                        // left: -10,
                      }}>
                      <View
                        style={{
                          width: '100%',
                          padding: 20,
                          backgroundColor: '#fff',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          borderRadius: 6,
                        }}>
                        <View style={{width: '40%', left: -10}}>
                          <View
                            style={{
                              borderRadius: 6,
                              width: 145,
                              padding: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#767680',
                              opacity: 0.5,
                            }}>
                            <Text
                              style={{
                                color: '#006EFF',
                                fontSize: 17,
                                fontWeight: '400',
                                fontStyle: 'normal',
                                textAlign: 'center',
                              }}>
                              5
                            </Text>
                          </View>
                        </View>
                        <View style={{width: '60%', left: -12}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: '#767680',
                              opacity: 0.5,
                              width: 180,
                              marginLeft: 30,
                              borderRadius: 6,
                              padding: 4,
                            }}>
                            <TouchableOpacity
                              style={{
                                backgroundColor: '#fff',
                                width: 89,
                                padding: 6,
                                borderRadius: 6,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: '#767680',
                                borderWidth: 1,
                              }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: '#000',
                                  textAlign: 'center',
                                  fontStyle: 'normal',
                                  fontWeight: '700',
                                }}>
                                Minutos
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                backgroundColor: '#767680',
                                // opacity: 0.5,
                                width: 87,
                                padding: 6,
                                borderRadius: 6,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: '#000',
                                  textAlign: 'center',
                                  fontStyle: 'normal',
                                  fontWeight: '700',
                                }}>
                                Metros
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10,
                      }}>
                      <View
                        style={{
                          width: 2,
                          height: 30,
                          borderRadius: 4,
                          borderWidth: 1,
                          borderColor: '#B9B9B9',
                        }}></View>
                      <View>
                        <Text
                          style={{
                            color: '#5A5A5A',
                            fontSize: 16,
                            fontWeight: '600',
                            fontStyle: 'normal',
                            textAlign: 'center',
                          }}>
                          da paragem
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 10,
                      }}>
                      <View
                        style={{
                          backgroundColor: '#fff',
                          width: '100%',
                          padding: 20,
                          borderRadius: 12,
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '20%',
                          }}>
                          <Image
                            source={SearchIcon}
                            style={{height: 20, width: 20}}
                          />
                        </View>
                        <View style={{width: '70%'}}>
                          <TextInput
                            style={{
                              color: '#969696',
                              fontSize: 14,
                              fontWeight: '600',
                              fontStyle: 'normal',
                              textAlign: 'left',
                            }}
                            placeholder="Procurar linha"
                            placeholderTextColor="#969696"
                          />
                        </View>
                        <View
                          style={{
                            width: '10%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={RightGreyArrow}
                            style={{height: 10, width: 10}}
                          />
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10,
                      }}>
                      <View
                        style={{
                          width: 2,
                          height: 30,
                          borderRadius: 4,
                          borderWidth: 1,
                          borderColor: '#B9B9B9',
                        }}></View>
                      <View>
                        <Text
                          style={{
                            color: '#5A5A5A',
                            fontSize: 16,
                            fontWeight: '600',
                            fontStyle: 'normal',
                            textAlign: 'center',
                          }}>
                          no período
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 10,
                      }}>
                      <View
                        style={{
                          width: '100%',
                          paddingTop: 20,
                          paddingBottom: 20,
                          backgroundColor: '#fff',
                          borderRadius: 16,
                        }}>
                        <View style={styles.ToStopContainer}>
                          <View style={styles.ToStopRow}>
                            <View>
                              <Text
                                style={{
                                  color: '#5A5A5A',
                                  fontSize: 16,
                                  fontWeight: '600',
                                  fontStyle: 'normal',
                                  textAlign: 'left',
                                }}>
                                Hora de Início
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              borderRadius: 6,
                              opacity: 0.5,
                              backgroundColor: '#767680',
                              width: 100,
                              padding: 5,
                              justifyContent: 'center',
                              alignItems: 'flex-end',
                            }}>
                            <Text
                              style={{
                                color: '#006EFF',
                                fontSize: 17,
                                fontWeight: '400',
                                fontStyle: 'normal',
                                textAlign: 'right',
                              }}>
                              07:10
                            </Text>
                          </View>
                        </View>
                        <View style={styles.FavouriteStopContainer}>
                          <View style={{paddingTop: 10}}>
                            <View>
                              <Text
                                style={{
                                  color: '#5A5A5A',
                                  fontSize: 16,
                                  fontWeight: '600',
                                  fontStyle: 'normal',
                                  textAlign: 'left',
                                }}>
                                Hora de Fim
                              </Text>
                            </View>
                          </View>
                          <View style={{paddingTop: 10}}>
                            <View
                              style={{
                                borderRadius: 6,
                                opacity: 0.5,
                                backgroundColor: '#767680',
                                width: 100,
                                padding: 5,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                              }}>
                              <Text
                                style={{
                                  color: '#006EFF',
                                  fontSize: 17,
                                  fontWeight: '400',
                                  fontStyle: 'normal',
                                  textAlign: 'right',
                                }}>
                                07:10
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.FavouriteStopSecondContainer}>
                          <View style={{paddingTop: 10}}>
                            <View>
                              <Text
                                style={{
                                  color: '#5A5A5A',
                                  fontSize: 16,
                                  fontWeight: '600',
                                  fontStyle: 'normal',
                                  textAlign: 'left',
                                }}>
                                Dias da Semana
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View
                          style={{
                            paddingTop: 5,
                            paddingLeft: 10,
                            paddingRight: 10,
                          }}>
                          <View
                            style={{
                              width: '100%',
                              borderRadius: 6,
                              padding: 5,
                              flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                              style={{
                                width: 46,
                                height: 30,
                                borderTopLeftRadius: 6,
                                borderBottomLeftRadius: 6,
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: 0.5,

                                backgroundColor: '#767680',
                              }}>
                              <Text
                                style={{
                                  color: '#969696',
                                  fontSize: 16,
                                  fontWeight: '600',
                                  fontStyle: 'normal',
                                  textAlign: 'center',
                                }}>
                                Seg
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                width: 46,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#006EFF',
                              }}>
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 16,
                                  fontWeight: '600',
                                  fontStyle: 'normal',
                                  textAlign: 'center',
                                }}>
                                Ter
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                width: 46,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#006EFF',
                              }}>
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 16,
                                  fontWeight: '600',
                                  fontStyle: 'normal',
                                  textAlign: 'center',
                                }}>
                                Qua
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                width: 46,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#006EFF',
                              }}>
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 16,
                                  fontWeight: '600',
                                  fontStyle: 'normal',
                                  textAlign: 'center',
                                }}>
                                Qui
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                width: 46,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: 0.5,
                                backgroundColor: '#767680',
                              }}>
                              <Text
                                style={{
                                  color: '#969696',
                                  fontSize: 16,
                                  fontWeight: '600',
                                  fontStyle: 'normal',
                                  textAlign: 'center',
                                }}>
                                Sex
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                width: 46,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#006EFF',
                              }}>
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 16,
                                  fontWeight: '600',
                                  fontStyle: 'normal',
                                  textAlign: 'center',
                                }}>
                                Sab
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                width: 46,
                                height: 30,
                                borderTopRightRadius: 6,
                                borderBottomRightRadius: 6,
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: 0.5,
                                backgroundColor: '#767680',
                              }}>
                              <Text
                                style={{
                                  color: '#969696',
                                  fontSize: 16,
                                  fontWeight: '600',
                                  fontStyle: 'normal',
                                  textAlign: 'center',
                                }}>
                                Dom
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 20,
                      }}>
                      <Text
                        style={{
                          color: '#969696',
                          fontSize: 12,
                          fontWeight: '500',
                          fontStyle: 'normal',
                          textAlign: 'center',
                        }}>
                        Atenção!
                      </Text>
                      <Text
                        style={{
                          color: '#969696',
                          fontSize: 12,
                          fontWeight: '500',
                          fontStyle: 'normal',
                          textAlign: 'center',
                        }}>
                        Por favor teste esta funcionalidade antes de utilizar
                        com confiança. Poderá ser necessário ajustar os tempos
                        para garantir que chega ao local.
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 20,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setNotificationStopVisible(false);
                        }}
                        style={{
                          borderRadius: 12,
                          width: '100%',
                          padding: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#006EFF',
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 22,
                            fontWeight: '600',
                            fontStyle: 'normal',
                            textAlign: 'center',
                          }}>
                          Guardar
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 20,
                        paddingBottom: 20,
                      }}>
                      <TouchableOpacity
                        style={{
                          borderRadius: 12,
                          width: '100%',
                          padding: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#FF0000',
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 22,
                            fontWeight: '600',
                            fontStyle: 'normal',
                            textAlign: 'center',
                          }}>
                          Eliminar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </Modal>
            </Modal>
          </View>
          <Modal
            style={styles.ModalContainer}
            isVisible={profileVisible}
            onBackdropPress={() => setProfileVisible(false)}>
            <View
              style={[styles.ProfileVisibleContainer, {height: modalHeight}]}>
              <View style={styles.CloseButtonView}>
                <TouchableOpacity
                  style={styles.CloseBtn}
                  onPress={() => {
                    setModalHeight('99%');
                  }}></TouchableOpacity>
              </View>
              <ScrollView>
                <TouchableOpacity
                  onPress={() => {
                    setFavouriteStopVisible(false);
                  }}>
                  <View style={styles.ToCloseTextView}>
                    <Text style={styles.ToCloseText}>Guardar</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.PersonalizeTextView}>
                  <Text style={styles.PersonalizeText}>Perfil</Text>
                </View>
                <View style={styles.SortCardsTextView}>
                  <Text style={styles.SortCardsText}>Dados pessoais</Text>
                  <View style={styles.ArrangeCardsTextMessageView}>
                    <Text style={styles.ArrangeCardsTextMessage}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Fusce eget mauris accumsan, ornare tortor non, tristique
                      osdlio.
                    </Text>
                  </View>
                </View>
                <View style={styles.StopSortingAdjustView}>
                  <View style={styles.StopSortingContainer}>
                    <View style={styles.ToStopContainer}>
                      <TextInput
                        onChangeText={userData.email}
                        value={userData.email}
                        placeholder="Nome e Apelido"
                        placeholderTextColor="#969696"
                        style={{
                          color: '#969696',
                          fontSize: 14,
                          fontWeight: '600',
                          fontStyle: 'normal',
                          textAlign: 'left',
                          width: 300,
                        }}
                      />
                    </View>
                    <View style={styles.FavouriteStopContainer}>
                      <View style={{paddingTop: 20}}>
                        <TextInput
                          onChangeText={userData.emailVerified}
                          value={userData.emailVerified}
                          placeholder="Nome e Apelido"
                          placeholderTextColor="#969696"
                          style={{
                            color: '#969696',
                            fontSize: 14,
                            fontWeight: '600',
                            fontStyle: 'normal',
                            textAlign: 'left',
                            width: 300,
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.FavouriteStopSecondContainer}>
                      <View style={{paddingTop: 20}}>
                        <TextInput
                          placeholder="Nome e Apelido"
                          placeholderTextColor="#969696"
                          style={{
                            color: '#969696',
                            fontSize: 14,
                            fontWeight: '600',
                            fontStyle: 'normal',
                            textAlign: 'left',
                            width: 150,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 20,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#bccbeb',
                      padding: 20,
                      borderRadius: 16,
                      paddingTop: 20,
                      paddingBottom: 20,
                    }}>
                    <View>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 16,
                          fontWeight: '700',
                          fontStyle: 'normal',
                          textAlign: 'center',
                        }}>
                        Saiba a importância dos dados para gerir a rede da
                        Carris Metropolitana.
                      </Text>
                    </View>
                    <View style={{paddingTop: 15}}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 14,
                          fontWeight: '600',
                          fontStyle: 'normal',
                          textAlign: 'center',
                        }}>
                        Saiba exatamente onde andam todos�os autocarros e
                        exatamente quando�chegam à sua paragem.
                      </Text>
                    </View>
                    <View style={{paddingTop: 10}}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setClicked(true);
                          }}
                          style={{
                            width: '100%',
                            height: 200,
                            borderRadius: 15,
                          }}>
                          <Video
                            paused={paused}
                            source={{
                              uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                            }}
                            muted
                            style={{
                              width: '100%',
                              height: 200,
                              borderRadius: 15,
                            }}
                            resizeMode="contain"
                          />
                          {clicked && (
                            <TouchableOpacity
                              style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                backgroundColor: 'rgba(0,0,0,.3)',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <View>
                                <TouchableOpacity
                                  onPress={() => {
                                    setPaused(!paused);
                                  }}
                                  style={{
                                    height: 50,
                                    width: 50,
                                    backgroundColor: '#fedefe',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 25,
                                  }}>
                                  <Image
                                    source={paused ? Play : PauseButton}
                                    style={{
                                      height: 30,
                                      width: 30,
                                      tintColor: '#fff',
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 20,
                    paddingBottom: 40,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setProfileVisible(false);
                    }}
                    style={{
                      borderRadius: 12,
                      width: '100%',
                      padding: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#006EFF',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 22,
                        fontWeight: '600',
                        fontStyle: 'normal',
                        textAlign: 'center',
                      }}>
                      Guardar
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 150,
  },
  MainView: {
    position: 'relative',
    backgroundColor: '#FFDD00',
    width: '100%',
    //height: 100,
    height: 'auto', // Adjust the height as needed
  },
  LogoTextRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingBottom: 20,
    paddingTop: 40,
    // paddingTop: 20, // Adjust the paddingTop to provide adequate space for the logo
  },
  LogoImg: {
    width: 156,
    height: 55,
  },
  WifiTextViewView: {
    width: 150,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    left: -10,
  },
  WifiImgView: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    left: -6,
  },
  WifiImg: {
    height: 20,
    width: 20,
    tintColor: '#fff',
  },
  WifiTextView: {
    paddingLeft: 5,
  },
  WifiText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
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
    height: '50%',
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
  ToCloseButtonView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingLeft: 20,
    paddingRight: 10,
  },
  closeButton: {
    height: 30,
    width: 30,
  },
  crossIcon: {
    // position: 'absolute',
    //top: 20,
    right: -20,
    flexDirection: 'column',
    flex: 1,
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    width: 40,
    height: 40,
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
  SortCardsTextView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  SortCardsText: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ArrangeCardsTextMessageView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ArrangeCardsTextMessage: {
    color: '#969696',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  FirstHamburgerTextMessageImageView: {
    bottom: -8,
    left: -65,
  },
  FirstHamburgerTextMessageImage: {
    height: 10,
    width: 10,
  },
  StopSortingAdjustView: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  StopSortingContainer: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  ToStopContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#7d7e80',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
  ToStopRow: {
    flexDirection: 'row',
  },
  FirstHamburgerImage: {
    height: 20,
    width: 20,
  },
  ToStopTextView: {
    paddingLeft: 10,
  },
  ToStopText: {
    color: '#787878',
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
    top: -10,
  },
  HospitalText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
    top: -5,
  },
  ToStopRightArrowImage: {
    height: 15,
    width: 15,
  },
  FavouriteStopContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#7d7e80',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
  FavouriteStopRow: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  SecondHamburgerImage: {
    height: 20,
    width: 20,
  },
  FavouriteStopTextView: {
    paddingLeft: 10,
  },
  FavouriteStopText: {
    color: '#787878',
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
    top: -10,
  },
  FavouriteStopHospitalText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
    top: -5,
  },
  FavouriteStopArrowImage: {
    height: 15,
    width: 15,
  },
  FavouriteStopSecondContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 0,
  },
  FavouriteStopSecondRow: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  ThirdHamburgerImage: {
    height: 20,
    width: 20,
  },
  FavouriteStopSecondTextView: {
    paddingLeft: 10,
  },
  FavouriteStopSecondText: {
    color: '#787878',
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
    top: -10,
  },
  FavouriteStopSecondHospitalText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
    top: -5,
  },
  FavouriteStopSecondArrowImage: {
    height: 15,
    width: 15,
  },
  AddNewCardTextView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
  },
  AddNewCardText: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  AddNewCardTextMessage: {
    color: '#969696',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  OptionsAdjustView: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  OptionContainer: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  OptionFavouriteStopContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#7d7e80',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  ParagemFavoritaRow: {
    flexDirection: 'row',
  },
  ParagemFavouritaNotificationBellImage: {
    height: 30,
    width: 25,
    tintColor: '#FF732D',
  },
  ParagemFavouritaTextView: {
    paddingLeft: 10,
  },
  ParagemFavouritaText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ParagemFavouritaAddBtnView: {
    // paddingTop: 5,
  },
  ParagemFavouritaAddBtn: {
    height: 24,
    width: 24,
    borderRadius: 13,
    backgroundColor: '#00D530',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ParagemFavouritaAddBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 22, // Ensure the text is centered vertically
  },
  LinhaFavoritaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#7d7e80',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  LinhaFavoritaInnerRow: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  LinhaFavoritaNoticationBellImage: {
    height: 30,
    width: 30,
    tintColor: '#FA3250',
  },
  LinhaFavoritaTextView: {
    paddingLeft: 10,
  },
  LinhaFavoritaText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  LinhaFavoritaAddBtnView: {
    paddingTop: 14,
  },
  LinhaFavoritaAddBtn: {
    height: 24,
    width: 24,
    borderRadius: 13,
    backgroundColor: '#00D530',
    justifyContent: 'center',
    alignItems: 'center',
  },
  LinhaFavoritaAddBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 22, // Ensure the text is centered vertically
  },

  NotificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 0,
  },
  NotificationInnerRow: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  NotificationViewBellImg: {
    height: 30,
    width: 30,
    tintColor: '#00CDAA',
  },
  NotificationSectionTextView: {
    paddingLeft: 10,
  },
  NotificationSectionText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  NotificationSectionAddBtnView: {
    paddingTop: 14,
  },
  NotificationSectionAddBtn: {
    height: 24,
    width: 24,
    borderRadius: 13,
    backgroundColor: '#00D530',
    justifyContent: 'center',
    alignItems: 'center',
  },
  NotificationSectionAddBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 22, // Ensure the text is centered vertically
  },
  videoPlayer: {
    width: 300,
    height: 200,
  },
  FavouriteModalContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    right: 0,
    left: 0,
    height: '50%',
  },
  ToStopVisibleContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    right: 0,
    left: 0,
    height: '50%',
  },
  NotificationVisibleContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#e9eef7',
    width: '100%',
    right: 0,
    left: 0,
    height: '50%',
  },
  ProfileVisibleContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#e9eef7',
    width: '100%',
    right: 0,
    left: 0,
    height: '50%',
  },
  SelectStopVisibleContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#e9eef7',
    width: '100%',
    right: 0,
    left: 0,
    height: '50%',
  },
  SelectLinesVisibleContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#e9eef7',
    width: '100%',
    right: 0,
    left: 0,
    height: '50%',
  },
  ProfileBgView: {
    height: 40,
    width: 40,
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileImage: {
    height: 20,
    width: 20,
  },
  OláAndréTextView: {
    paddingLeft: 10,
  },
  OláAndréText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  FirstViewContainerTop: {
    paddingTop: 20,
  },
  FirstViewContainer: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 15,
    // borderRadius: 15,
    borderRadius: 8,
  },
  FirstViewContainerInnerViewRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    // borderBottomWidth: 1,
    //  borderBottomColor: '#D3D3D3',
    paddingTop: 10,
    paddingBottom: 10,
  },
  SelectedStopStopName: {
    opacity: 1,
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    width: '80%',
  },
  CovaDaStopIdRow: {
    flexDirection: 'row',
  },
  CovaDaStopTextView: {
    paddingRight: 10,
    paddingTop: 5,
  },
  CovaDaPiedadeText: {
    opacity: 1,
    color: '#969696',
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  SelectedStopStopIdTextView: {
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#969696',
    borderRadius: 8,
  },
  SelectedStopStopIdText: {
    opacity: 1,
    color: '#969696',
    fontSize: 8,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  SelectedStopMapContainerDataRow: {
    borderRadius: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
    shadowColor: '#000000',
    // shadowOpacity: 0.1,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    elevation: 4,
  },
  RouteNameRows: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.9,
    overflow: 'hidden',
    // backgroundColor:'red'
  },
  RouteShortNameTextView: {
    borderRadius: 11,
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // paddingRight: 10,
    margintop: 5,
    margin: 5,
  },
  RouteShortNameText: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    color: '#fff',
    textAlign: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    //paddingLeft: 5,
    padding: 1,
  },
  RightArrowImg: {
    height: 15,
    width: 15,
  },
  RouteLongNameText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  TimeArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  TimeText: {
    color: '#00D530',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  TimeRightArrowIconView: {
    padding: 3,
  },
  ProfileImageGreetingAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
  },
  ProfileImageGreetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  UserFavouriteStopsAdjustView: {
    paddingTop: 20,
  },
  UserFavouriteStopsContainer: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 15,
  },
  SpaceViewForUserFavouriteHeading: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
  UserFavouriteHeadingRow: {
    flexDirection: 'row',
  },
  UserFavouriteHeadingShortNameView: {
    borderRadius: 12,
    width: 60,
    backgroundColor: '#FA3250',
    justifyContent: 'center',
    alignItems: 'center',
  },
  UserFavouriteHeadingShortNameText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  UserFavouriteHeadingMiddleText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  UserFavouriteHeadingMiddleTextView: {
    paddingLeft: 5,
  },
  UserFavouriteHeadingStar: {
    height: 20,
    width: 20,
  },
  MapViewImg: {
    width: '100%',
  },
  UserFavouriteLinesAdjustView: {
    paddingTop: 20,
  },
  UserFavouriteLinesContainer: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 15,
    borderRadius: 15,
  },
  UserFavouriteLinesSpaceRowView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#969696',
    paddingTop: 10,
    paddingBottom: 20,
  },
  UserFavouriteLineSelectedLineNameText: {
    opacity: 1,
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    width: '80%',
  },
  UserFavouriteLineSelectedLocationIDRow: {
    flexDirection: 'row',
  },
  UserFavouriteLineSelectedLocationTextView: {
    paddingRight: 10,
  },
  UserFavouriteLineSelectedLocationText: {
    opacity: 1,
    color: '#969696',
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  UserFavouriteSelectedLineIDTextView: {
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#969696',
    borderRadius: 8,
  },
  UserFavouriteSelectedLineIDText: {
    opacity: 1,
    color: '#969696',
    fontSize: 8,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  PersonalizerButtonContainerAdjustView: {
    paddingTop: 20,
  },
  PersonalizerButton: {
    backgroundColor: '#E6E6E6',
    borderRadius: 12,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  PersonalizerButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  PersonalizerButtonImg: {
    height: 20,
    width: 20,
  },
  PersonalizerButtonText: {
    color: '#969696',
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'normal',
    paddingLeft: 5,
  },
  UserFavouriteSelectedLineStar: {
    height: 20,
    width: 20,
  },
  TimeDayAdjustViewContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#969696',
    paddingTop: 20,
    paddingBottom: 20,
  },
  TimeDayInnerAdjustViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  FavouriteLineTimeArrowRow: {
    backgroundColor: '#F9F9F9',
    width: 132,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 10,
    paddingRight: 10,
  },
  BellNotifeeImg: {
    height: 20,
    width: 20,
  },
  FirstTimeText: {
    color: '#5F5F5F',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  FirstTimeRightArrowImg: {
    height: 15,
    width: 15,
  },
  SecondTimeText: {
    color: '#5F5F5F',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  DayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  DayViewContainer: {
    backgroundColor: '#F9F9F9',
    width: 132,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 10,
    paddingRight: 10,
  },
  FirstSText: {
    color: '#E6E6E6',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  TText: {
    color: '#5A5A5A',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  FirstQText: {
    color: '#5A5A5A',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  SecondQText: {
    color: '#5A5A5A',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  SecondSText: {
    color: '#E6E6E6',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  ThirdSText: {
    color: '#5A5A5A',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  DText: {
    color: '#E6E6E6',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  FavouriteSelectedLineFirstRow: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#969696',
    paddingTop: 20,
    paddingBottom: 20,
  },
  FavouriteSelectedLineFirstRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  FirstViewContainerStarImage: {
    height: 20,
    width: 20,
  },
  selectedStopRightArrowIcon: {
    height: 10,
    width: 10,
  },
  StarBgPadding: {
    paddingTop: 50,
  },
  FavoriteSelectedLineFirstRowShortNameBg: {
    borderRadius: 12,
    width: 60,
    backgroundColor: '#FFC800',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FavoriteSelectedLineFirstRowShortName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  FavoriteLineOptionFirstTextView: {
    paddingLeft: 5,
  },
  FavoriteLineOptionFirstText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  FavouriteSelectedLineSecondRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
  },
  FavouriteSelectedLineSecondRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  FavoriteSelectedLineSecondRowShortNameBg: {
    borderRadius: 12,
    width: 60,
    backgroundColor: '#FFC800',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FavouriteSelectedLineSecondRowShortName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  FavoriteLineOptionSecondTextView: {
    paddingLeft: 5,
  },
  FavoriteLineOptionSecondText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  FavouriteStopModalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  FavouriteStopModalContainerLeftArrow: {height: 17, width: 22},
  FavouriteStopModalContainerPersonalizar: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    paddingLeft: 3,
  },
  FavouriteStopModalContainerParagemFavouritaTextView: {
    paddingLeft: 20,
    paddingTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#7d7e80',
    paddingBottom: 10,
  },
  FavouriteStopModalContainerParagemFavouritaText: {
    color: '#000',
    fontSize: 34,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  FavouriteStopModalContainerSelecionarParagemText: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  EscolhaUmaText: {
    color: '#969696',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ProcurarParagemAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  ProcurarParagemBackgroundView: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
  },
  ProcurarParagemSearchIconView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  ProcurarParagemSearchIconImg: {
    height: 20,
    width: 20,
  },
  ProcurarParagemTextInputView: {
    width: '70%',
  },
  ProcurarParagemTextInput: {
    color: '#969696',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ProcurarParagemRightGreyArrowIconView: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ProcurarParagemRightGreyArrowIconImg: {
    height: 20,
    width: 20,
  },
  SelecionarDestinosEscolhaQuaisAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  SelecionarDestinosText: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  EscolhaQuaisText: {
    color: '#969696',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  StopSortingAdjustContainer: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  StopSortingDestinationOptionOne: {
    width: 60,
    height: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  StopSortingDestinationOptionOneZeroText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  ToStopTextOptionOne: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  StopSortingDestinationBorder: {
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  FavouriteStopOptionSecond: {
    width: 60,
    height: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  FavouriteStopOptionSecondText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  FavouriteStopOptionSecondDestinationText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  FirstGreenTickView: {
    right: -10,
  },
  FirstGreenTickImg: {
    height: 40,
    width: 40,
  },
  FavouriteStopSecondContainerSecondDestinationZeroView: {
    width: 60,
    height: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  FavouriteStopSecondContainerDestinationZeroText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  FavouriteStopSecondContainerDestinationText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  FavouriteStopSecondContainerGreenTickView: {
    right: -10,
  },
  FavouriteStopSecondContainerGreenTickImg: {
    height: 40,
    width: 40,
  },
  AtivarNotificacoesTextView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  AtivarNotificacoesText: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ReceberNotificacoesMsgText: {
    color: '#969696',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ReceberNotificacoesAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  ReceberNotificacoesContainerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  ReceberNotificacoesText: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  FavouriteStopGuardarAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  FavouriteStopGuardarButton: {
    borderRadius: 12,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006EFF',
  },
  FavouriteStopGuardarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  FavouriteStopContainerEliminarAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  FavouriteStopEliminarButton: {
    borderRadius: 12,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF0000',
  },
  FavouriteStopEliminarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  SelectStopVisibleEditarCartaoView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  SelectStopVisibleLeftArrow: {height: 17, width: 17, marginRight: 6},
  EditarCartaoText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  SelecionarParagemTextView: {
    paddingLeft: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  SelecionarParagemText: {
    color: '#000',
    fontSize: 34,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  SelecionarParagemMapImage: {width: '100%', height: 245},
  SearchIconAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  SearchIconContainer: {
    backgroundColor: '#3C3C43',
    width: '100%',
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    opacity: 0.2,
  },
  SearchIconView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  SearchIconImg: {height: 20, width: 20},
  SelectStopVisibleSearchTextInputView: {
    width: '70%',
    justifyContent: 'center',
  },
  SelectStopVisibleSearchTextInput: {
    color: '#c7c9c8',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#000',
  },
  SelectStopVisibleMacIconView: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SelectStopVisibleMacIconImg: {height: 40, width: 20},
  SelectStopVisibleFlatListContainerAdjustView: {paddingTop: 20},
  SelectStopVisibleFlatListContainer: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
  },
  SelectStopVisibleFlatListContainerInner: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C43',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  SelectStopVisibleFlatListItemName: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    maxWidth: '95%',
    // lineHeight: 22,
  },
  SelectStopVisibleFlatListItemAddBtn: {
    height: 24,
    width: 24,
    borderRadius: 13,
    // backgroundColor: '#00D530',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SelectlinhaVisibleFlatListItemAddBtn: {
    height: 24,
    width: 24,
    borderRadius: 13,
    backgroundColor: '#00D530',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SelectStopVisibleFlatListAddBtnImg: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 24,
  },
  minusIcon: {
    fontSize: 27,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 27,
  },
  plusIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 24,
  },
  SelectStopVisibleParagensEncontradasView: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SelectStopVisibleParagensEncontradasText: {
    color: '#E6E6E6',
    fontSize: 18,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  LinhaFavouriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  LinhaFavouriteLeftArrow: {height: 17, width: 22},
  LinhaFavouritePersonalizarText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    paddingLeft: 3,
  },
  LinhaFavouriteTextView: {
    paddingLeft: 20,
    paddingTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#7d7e80',
    paddingBottom: 10,
  },
  LinhaFavouriteText: {
    color: '#000',
    fontSize: 34,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  LinhaFavouriteSelecionarLinha: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  LinhaFavouriteEscolhaUmaText: {
    color: '#969696',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ProcurarLinhaAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  ProcurarLinhaContainer: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
  },
  ProcurarLinhaSearchIconView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  ProcurarLinhaSearchIconImg: {height: 20, width: 20},
  ProcurarLinhaTextInputView: {width: '70%'},
  ProcurarLinhaTextInput: {
    color: '#969696',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ProcurarLinhaRightGreyArrowView: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ProcurarLinhaRightGreyArrowImg: {height: 10, width: 10},
  LinhaFavouriteSelecionarDestinosAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  LinhaFavouriteSelecionarDestinosText: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  LinhaFavouriteEscolhaDestinoTextMsg: {
    color: '#969696',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  FavouriteStopSortingAdjustViewContainer: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  FavouriteStopSortingDestinationOptionOneBg: {
    width: 60,
    height: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  FavouriteStopSortingDestinationOptionOneZeroText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  FavouriteStopSortingDestinationOptionOneText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  MapViewArea: {width: '100%', height: 200},
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 4,
  },
  YellowMarker: {
    height: 15,
    width: 15,
    borderRadius: 4,
    backgroundColor: 'yellow',
    borderColor: 'black',
    borderWidth: 2,
    alignSelf: 'center',
  },
  YellowMarker: {
    height: 8,
    width: 8,
    borderRadius: 4,
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
  VehicleMarkerIndex: {zIndex: 9999},
  OriginMarkerIndex: {zIndex: 9999},
  MapViewSize: {width: '100%', height: 200},
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  favoriteButton: {
    height: 22,
    width: 22,
  },
});
export default Home;
