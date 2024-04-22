import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, ActivityIndicator, View} from 'react-native';
import {WebView} from 'react-native-webview';

const htmlContent = `
<style>
  .results-timeline-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

.results-timetable ul li:first-child {
  background-color: #000;
  color: #fff;
  font-weight: 600;
}
.results-timetable ul:last-child li:first-child {
  border-top-right-radius: 999px;
  border-bottom-right-radius: 999px;
}
.results-timetable ul:first-child li:first-child {
  border-top-left-radius: 999px;
  border-bottom-left-radius: 999px;
}
.results-timetable ul:first-child li {
  padding-left: 15px;
}
.results-timetable ul {
  display: flex;
  flex-direction: column;
}
.results-timetable ul li {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 400;
  padding: 4px 5px;
  min-width: 35px;
}

  .stop-name {
    font-size: 16px;
    font-weight: bold;
    color: blue; 
  }
  .results-timetable { 
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 20px;
}
div{
    border: 0;
    font-size: 100%;
    margin: 0;
    outline: 0;
    padding: 0;
    vertical-align: top;
  }
.results-timetable ul {
    display: flex;
    flex-direction: column;
}
ul {
  list-style: none;
}
.results-timetable ul li {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 400;
  padding: 4px 5px;
  min-width: 35px;
}

</style>
<div class="results-timetable-container">
<h2>Horários previstos de passagem na paragem selecionada - <span class="stop-name">Alfragide (Hosp Veterinário)</span></h2>
<div class="results-timetable">
<ul class="timetable-legend">
<li>Hora</li>
<li>Min.</li>
</ul>
<ul class="timetable-time">
<li class="hour">06</li>
<li class="minute">20</li>
</ul>
<ul class="timetable-time">
<li class="hour">07</li>
<li class="minute">00</li>
<li class="minute">45</li>
</ul>
<ul class="timetable-time">
<li class="hour">08</li>
<li class="minute">35</li>
</ul>
<ul class="timetable-time">
<li class="hour">09</li>
<li class="minute">25</li>
</ul>
<ul class="timetable-time">
<li class="hour">10</li>
<li class="minute">20</li>
</ul>
<ul class="timetable-time">
<li class="hour">11</li>
<li class="minute">10</li>
</ul>
<ul class="timetable-time">
<li class="hour">12</li>
<li class="minute">00</li>
<li class="minute">50</li>
</ul
<ul class="timetable-time">
<li class="hour">13</li>
<li class="minute">40</li>
</ul>
<ul class="timetable-time">
<li class="hour">14</li>
<li class="minute">30</li>
</ul>
<ul class="timetable-time">
<li class="hour">15</li>
<li class="minute">20</li>
</ul>
<ul class="timetable-time">
<li class="hour">16</li>
<li class="minute">10</li>
</ul>
<ul class="timetable-time">
<li class="hour">17</li>
<li class="minute">00</li>
</ul>
<ul class="timetable-time">
<li class="hour">18</li>
<li class="minute">00</li>
</ul>
<ul class="timetable-time">
<li class="hour">19</li>
<li class="minute">00</li>
<li class="minute">55</li>
</ul>
<ul class="timetable-time">
<li class="hour">20</li>
<li class="minute">45</li>
</ul>
<ul class="timetable-time">
<li class="hour">21</li>
<li class="minute">35</li>
</ul>
<ul class="timetable-time">
<li class="hour">22</li>
<li class="minute">25</li>
</ul>
</div>
</div>
</div>
`;

const CarregarOPasse = () => {
  const [isLoading, setLoading] = useState(true);

  const hideLoader = () => {
    setLoading(false);
  };
  return (
    <SafeAreaView style={styles.WebViewContainer}>
      <View style={styles.container}>
        <WebView source={{html: htmlContent}} style={styles.webview} />
      </View>
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
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
export default CarregarOPasse;
