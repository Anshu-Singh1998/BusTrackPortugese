//***********created by Himanshi feb 2024***********************/
import * as React from 'react';
import {
    StyleSheet,
    Text,
    View,ScrollView
} from 'react-native';
const LineAddFavoriteItem = ({ routeSummary, itemLine }) => {
    const setLineInfo = (item) => {
        const mItem = routeSummary?.find(_val => "" + _val.id === "" + item)
        if (mItem) {
            return mItem
        }
        return null
    }
    return <>
     <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View key={itemLine} style={styles.RouteNameRows}>
            <View>
                <Text style={styles.RouteShortNameText}>{itemLine}</Text>
            </View>
            <View>
                <Text
                    numberOfLines={1}
                    style={styles.RouteLongNameText}>{setLineInfo(itemLine)?.long_name}</Text>
            </View>
        </View>
        </ScrollView>
    </>
}
const styles = StyleSheet.create({
    RouteLongNameText: {
        color: '#000',
        fontSize: 13,
        fontWeight: '700',
        fontStyle: 'normal',
         width:200
    },
    RouteNameRows: {
        // flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0.9,
        overflow: 'hidden',
    },
    RouteShortNameText: {
        fontWeight: '700',
        fontSize: 13,
        color: '#000',
        fontStyle: 'normal',
        textAlign: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        //paddingLeft: 5,
        padding: 2,
      },
      scrollViewContent: {
        flexGrow: 1,
    },
});
export default LineAddFavoriteItem