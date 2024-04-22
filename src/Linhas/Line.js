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
  ImageBackground,
  StatusBar,
  Alert,
  TextInput,
  Switch,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import SearchIcon from '../../Assets/NewImages/Search.png';
import RightGreyArrow from '../../Assets/NewImages/RightArrow.png';

import Api from '../Api/Api';

const Line = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await Api.get('lines');
      setData(response.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Alert For Line Data', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = data.filter(item => {
      const lowerCaseLongName = item.long_name
        ? item.long_name.toLowerCase()
        : null;

      const longNameMatches =
        lowerCaseLongName?.includes(lowercaseQuery) || item.long_name === null;

      const shortNameMatches = item.short_name
        .toLowerCase()
        .includes(lowercaseQuery);

      return longNameMatches || shortNameMatches;
    });
    setFilteredData(filtered);
  }, [searchQuery, data]);

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor="#FFDD00"></StatusBar>
      <View style={styles.MainView}>
        <View style={styles.SearchLinesTextView}>
          <Text style={styles.SearchLines}>Pesquisar Linhas</Text>
        </View>
        <View style={styles.SearchTextMessageTextView}>
          <Text style={styles.SearchTextMessageText}>
            Encontre a sua linha lorem ipsum dolor sit amet.
          </Text>
        </View>
        <View style={styles.SearchTextInputAdjustView}>
          <View style={styles.SeacrhTextInputRow}>
            <View style={styles.SearchImgView}>
              <Image source={SearchIcon} style={styles.SearchImg} />
            </View>
            <View style={styles.SearchInputView}>
              <TextInput
                style={styles.searchinput}
                placeholder="Search"
                placeholderTextColor="#969696"
                onChangeText={text => setSearchQuery(text)}
              />
            </View>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={{}}>
          <View style={styles.TodasAsLinhasAdjustView}>
            <View>
              <Text style={styles.TodasAsLinhasText}>Todas as Linhas</Text>
            </View>
          </View>
          <View style={styles.FlatListAdjustView}>
            <View style={styles.FilteredContainer}>
              <View>
                {loading ? ( // Render loader while loading
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                  <View>
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => (
                        <View key={index}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('SearchLinesDetails', {
                                wholeSelectedItem: item,
                              })
                            }>
                            <View style={styles.RecentResultsFirstRowView}>
                              <View>
                                <View
                                  style={[
                                    styles.RecentResultsFirstRoundView,
                                    {backgroundColor: item.color},
                                  ]}>
                                  <Text
                                    style={[
                                      styles.RecentResultsFirstRoundText,
                                      {color: item.text_color},
                                    ]}>
                                    {item.short_name}
                                  </Text>
                                </View>
                              </View>
                              <View
                                style={styles.RecentResultsFirstRowTextView}>
                                <Text
                                  style={styles.RecentResultsFirstRowTextValue}>
                                  {item.long_name}
                                </Text>
                              </View>
                              <View style={{right:5}}>
                                <Image
                                  source={RightGreyArrow}
                                  style={styles.RightGreyArrowIcon}
                                />
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  MainView: {
    position: 'relative',
    backgroundColor: '#FFDD00',
    width: '100%',
    padding: 20,
  },
  SearchLinesTextView: {paddingTop: 15, paddingLeft: 5, paddingRight: 5},
  SearchLines: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 30,
  },
  SearchTextMessageTextView: {paddingTop: 5, paddingLeft: 5, paddingRight: 5},
  SearchTextMessageText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  SearchTextInputAdjustView: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 20,
  },
  SeacrhTextInputRow: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
  },
  SearchImgView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  SearchImg: {height: 20, width: 20},
  SearchInputView: {width: '70%', justifyContent: 'center'},
  searchinput: {
    color: '#969696',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  RecentsRowView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  RecentsText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 30,
  },
  LimparBtn: {
    height: 15,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B9B9B9',
    borderRadius: 10,
    paddingTop: 2,
  },
  LimparText: {
    color: '#B9B9B9',
    fontSize: 10,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'center',
    lineHeight: 8,
  },
  RecentResultsAdjustView: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  RecentContainer: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 10,
  },
  RecentResultsFirstRowView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#b8b1b0',
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft:5
  },
  RecentResultsFirstRoundView: {
    width: 60,
    height: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  RecentResultsFirstRoundText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  RecentResultsFirstRowTextView: {
    width: '80%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  RecentResultsFirstRowTextValue: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  TodasAsLinhasAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  TodasAsLinhasText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 30,
  },
  FlatListAdjustView: {
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 240,
  },
  FilteredContainer: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 10,
  },
  RightGreyArrowIcon: {
    height: 18,
    width: 11,
    tintColor: '#B9B9B9',
  },
});
export default Line;
