//***********created by Himanshi feb 2024***********************/
import * as React from 'react';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image
} from 'react-native';

import RightArrow from '../../Assets/images/RightArrow.png';
import RightArrowIcon from '../../Assets/images/RightArrowIcon.png';
import TimeCalculator from './TimeCalculator';
import GoogleMapLocation from './GoggleMapLocation';

const LineItems = ({ routeSummary, itemLine, item }) => {
    const [isShowMap, setIsShwoMap] = useState(false)
    const setLineInfo = (item) => {
        const mItem = routeSummary?.find(_val => "" + _val.id === "" + item)
        if (mItem) {
            return mItem
        }
        return null
    }

    return <>
        {isShowMap ?
            <GoogleMapLocation
                id={setLineInfo(itemLine)?.patterns[0]}
                stopId={item?.id}
                onPressHeadline={() => setIsShwoMap(false)}
            />
            :
              <TouchableOpacity
                onPress={() => {
                    setIsShwoMap(true);
                }}
                >
                <View style={[styles.SelectedStopMapContainerDataRow, { backgroundColor: 'white', top: -8 }]}>
                    <View key={itemLine} style={styles.RouteNameRows}>
                    <View
                        style={[
                        styles.RouteShortNameTextView,
                        { backgroundColor: setLineInfo(itemLine)?.color },
                        ]}
                    >
                        <Text style={styles.RouteShortNameText}>{itemLine}</Text>
                    </View>
                    <View>
                        <Text
                        numberOfLines={1}
                        style={styles.RouteLongNameText}
                        >
                        {setLineInfo(itemLine)?.long_name}
                        </Text>
                    </View>
                    </View>
                    <View style={styles.TimeArrowRow}>
                    <View >
                        <TimeCalculator id={setLineInfo(itemLine)?.patterns[0]} stopId={item?.id} />
                    </View>
                    </View>
                </View>
                </TouchableOpacity>

             }
             </>
         }
      
          
const styles = StyleSheet.create({
    TimeCalculatorContainer: {
       right:29,
    },
    TimeText: {
        color: '#00D530',
        fontSize: 12,
        fontWeight: '600',
        fontStyle: 'normal',
    },
    container: {
        flex: 1,
        paddingBottom: 150,
    },
    MainView: {
        position: 'relative',
        backgroundColor: '#FFDD00',
        width: '100%',
        height: 100,
    },
    LogoTextRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingBottom: 20,
        paddingTop: 40,
    },
    LogoImg: {
        width: 156,
        height: 56,
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
        fontSize: 16,
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
        paddingTop: 10,
    },
    ParagemFavouritaAddBtn: {
        height: 22,
        width: 22,
        borderRadius: 11,
        backgroundColor: '#00D530',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ParagemFavouritaAddBtnText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
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
        paddingTop: 20,
    },
    LinhaFavoritaAddBtn: {
        height: 22,
        width: 22,
        borderRadius: 11,
        backgroundColor: '#00D530',
        justifyContent: 'center',
        alignItems: 'center',
    },
    LinhaFavoritaAddBtnText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
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
        paddingTop: 20,
    },
    NotificationSectionAddBtn: {
        height: 22,
        width: 22,
        borderRadius: 11,
        backgroundColor: '#00D530',
        justifyContent: 'center',
        alignItems: 'center',
    },
    NotificationSectionAddBtnText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
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
        paddingTop: 5
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
        margin: 5
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
        padding: 1
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
    FavouriteStopModalContainerLeftArrow: { height: 17, width: 22 },
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
    SelectStopVisibleLeftArrow: { height: 17, width: 22 },
    EditarCartaoText: {
        color: '#000',
        fontSize: 17,
        fontWeight: '400',
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
    SelecionarParagemMapImage: { width: '100%', height: 245 },
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
    SearchIconImg: { height: 20, width: 20 },
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
    SelectStopVisibleMacIconImg: { height: 40, width: 20 },
    SelectStopVisibleFlatListContainerAdjustView: { paddingTop: 20 },
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
        height: 22,
        width: 22,
        borderRadius: 11,
        backgroundColor: '#00D530',
        justifyContent: 'center',
        alignItems: 'center',
    },
    SelectStopVisibleFlatListAddBtnImg: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
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
    LinhaFavouriteLeftArrow: { height: 17, width: 22 },
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
    ProcurarLinhaSearchIconImg: { height: 20, width: 20 },
    ProcurarLinhaTextInputView: { width: '70%' },
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
    ProcurarLinhaRightGreyArrowImg: { height: 10, width: 10 },
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
});
export default LineItems