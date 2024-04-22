import React from 'react';
import {View, Text, Image} from 'react-native';
// Home Section

import Home from '../Home/Home';

// Line or Linhas
import Line from '../Linhas/Line';
import SearchLinesDetails from '../Linhas/SearchLinesDetails';
// More or Mais
import More from '../Mais/More';
import EspaçosNavegante from '../Mais/EspaçosNavegante';
import PerguntasFrequentes from '../Mais/PerguntasFrequentes';
import ApoioAoCliente from '../Mais/ApoioAoCliente';
import CarregarOPasse from '../Mais/CarregarOPasse';
import Cartões from '../Mais/Cartões';
import Descontos from '../Mais/Descontos';
import Tarifários from '../Mais/Tarifários';
import Recrutamento from '../Mais/Recrutamento';
import DadosAbertos from '../Mais/DadosAbertos';
import Privacidade from '../Mais/Privacidade';
import AvisoLegal from '../Mais/AvisoLegal';
// Favourite
import Favourite from '../Paragens/Favourite';
import CompassDetails from '../Paragens/CompassDetails';
import StepIndicatorTrack from '../Paragens/StepIndicatorTrack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const HomeScreenNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <Stack.Screen
        options={{header: () => null}}
        name="Home"
        component={Home}
      />
    </Stack.Navigator>
  );
};
export {HomeScreenNavigator};

const LinesScreenNvigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Line"
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <Stack.Screen
        options={{header: () => null}}
        name="Line"
        component={Line}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="SearchLinesDetails"
        component={SearchLinesDetails}
      />
    </Stack.Navigator>
  );
};
export {LinesScreenNvigator};

const FavouriteScreenNvigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Favourite"
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <Stack.Screen
        options={{header: () => null}}
        name="Favourite"
        component={Favourite}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="CompassDetails"
        component={CompassDetails}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="StepIndicatorTrack"
        component={StepIndicatorTrack}
      />
    </Stack.Navigator>
  );
};
export {FavouriteScreenNvigator};

const MoreScreenNvigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="More"
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <Stack.Screen
        options={{header: () => null}}
        name="More"
        component={More}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="EspaçosNavegante"
        component={EspaçosNavegante}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="PerguntasFrequentes"
        component={PerguntasFrequentes}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="ApoioAoCliente"
        component={ApoioAoCliente}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="CarregarOPasse"
        component={CarregarOPasse}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="Cartões"
        component={Cartões}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="Descontos"
        component={Descontos}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="Tarifários"
        component={Tarifários}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="Recrutamento"
        component={Recrutamento}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="DadosAbertos"
        component={DadosAbertos}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="Privacidade"
        component={Privacidade}
      />
      <Stack.Screen
        options={{header: () => null}}
        name="AvisoLegal"
        component={AvisoLegal}
      />
    </Stack.Navigator>
  );
};
export {MoreScreenNvigator};
