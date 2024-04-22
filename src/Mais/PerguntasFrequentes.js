import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, ActivityIndicator, View} from 'react-native';
import {WebView} from 'react-native-webview';

const PerguntasFrequentes = () => {
  const [isLoading, setLoading] = useState(true);

  const hideLoader = () => {
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.WebViewContainer}>
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <WebView
        source={{
          uri: 'https://www.carrismetropolitana.pt/perguntas-frequentes/1530/',
        }}
        onLoad={hideLoader}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  WebViewContainer: {flex: 1},
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PerguntasFrequentes;
