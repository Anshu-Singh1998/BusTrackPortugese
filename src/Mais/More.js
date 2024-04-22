import * as React from 'react';
import {useState} from 'react';
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
} from 'react-native';
import Thunder from '../../Assets/NewImages/Thunder.png';
import Protection from '../../Assets/NewImages/Protection.png';
import RightGreyArrow from '../../Assets/images/RightGreyArrow.png';
import Padlock from '../../Assets/NewImages/Padlock.png';
import Effect from '../../Assets/NewImages/Effect.png';
import CreditCard from '../../Assets/NewImages/CreditCard.png';
import Euro from '../../Assets/NewImages/Euro.png';
import Verified from '../../Assets/NewImages/Verified.png';
import Chat from '../../Assets/NewImages/Chat.png';
import Help from '../../Assets/NewImages/Help.png';
import Home from '../../Assets/NewImages/Home.png';
const Data = [
  {
    id: '1',
    title: 'Amadora',
    description: 'Moinhos da Funcheria e Estacao Norte ganham ligacao direta',
    btn_text: 'a partir de 6 de marco',
    bus_img: require('../../Assets/images/Bus.png'),
    oval_img: require('../../Assets/images/oval.png'),
  },
  {
    id: '2',
    title: 'Amadora',
    description: 'Moinhos da Funcheria e Estacao Norte ganham ligacao direta',
    btn_text: 'a partir de 6 de marco',
    bus_img: require('../../Assets/images/Bus.png'),
    oval_img: require('../../Assets/images/oval.png'),
  },
  {
    id: '3',
    title: 'Amadora',
    description: 'Moinhos da Funcheria e Estacao Norte ganham ligacao direta',
    btn_text: 'a partir de 6 de marco',
    bus_img: require('../../Assets/images/Bus.png'),
    oval_img: require('../../Assets/images/oval.png'),
  },
];

const More = ({navigation}) => {
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor="#FFDD00"></StatusBar>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.NovidadesTextView}>
            <Text style={styles.NovidadesText}>Novidades</Text>
          </View>
          <View style={styles.CardTop}>
            <FlatList
              horizontal
              data={Data}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => (
                <View style={styles.CardAdjustContainer}>
                  <View style={styles.CardContainer}>
                    <View style={styles.TextView}>
                      <Text style={styles.TitleText}>{item.title}</Text>
                      <Text style={styles.DescriptionText}>
                        {item.description}
                      </Text>
                    </View>
                    <View>
                      <View style={styles.ImageTextRowView}>
                        <View>
                          <Image
                            source={item.oval_img}
                            style={styles.OvalImageIcon}
                          />
                        </View>
                        <View style={styles.AmadoraTextDescriptionView}>
                          <Text style={styles.AmadoraText}>Amadora</Text>
                          <Text style={styles.AmadoraDescriptionText}>
                            (Estacao Norte), via Moinhos da Funcheria
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Image
                          source={item.bus_img}
                          style={{height: 120, width: 120}}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
          <View style={styles.InformarTextView}>
            <Text style={styles.InformarText}>Informar</Text>
          </View>
          <View style={styles.EspaçosNaveganteAdjustView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EspaçosNavegante')}>
              <View style={styles.EspaçosNaveganteContainer}>
                <View style={styles.EspaçosNaveganteIconView}>
                  <Image source={Home} style={styles.EspaçosNaveganteIcon} />
                </View>
                <View style={styles.EspaçosNaveganteTextView}>
                  <Text style={styles.EspaçosNaveganteText}>
                    Espaços navegante®
                  </Text>
                </View>
                <View style={styles.EspaçosNaveganteRightArrowView}>
                  <Image
                    source={RightGreyArrow}
                    style={styles.EspaçosNaveganteRightArrowIcon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.PerguntasFrequentesAdjustView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('PerguntasFrequentes')}>
              <View style={styles.PerguntasFrequentesContainer}>
                <View style={styles.PerguntasFrequentesIconView}>
                  <Image source={Help} style={styles.PerguntasFrequentesIcon} />
                </View>
                <View style={styles.PerguntasFrequentesTextView}>
                  <Text style={styles.PerguntasFrequentesText}>
                    Perguntas Frequentes
                  </Text>
                </View>
                <View style={styles.PerguntasFrequentesRightArrowView}>
                  <Image
                    source={RightGreyArrow}
                    style={styles.PerguntasFrequentesRightArrowIcon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.ApoioAoClienteAdjustView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ApoioAoCliente')}>
              <View style={styles.ApoioAoClienteContainer}>
                <View style={styles.ApoioAoClienteIconView}>
                  <Image source={Chat} style={styles.ApoioAoClienteIcon} />
                </View>
                <View style={styles.ApoioAoClienteTextView}>
                  <Text style={styles.ApoioAoClienteText}>
                    Apoio ao Cliente
                  </Text>
                </View>
                <View style={styles.ApoioAoClienteRightArrowView}>
                  <Image
                    source={RightGreyArrow}
                    style={styles.ApoioAoClienteRightArrowIcon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.ViajarTextView}>
            <Text style={styles.ViajarText}>Viajar</Text>
          </View>
          <View style={styles.CarregarOPasseAdjustView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CarregarOPasse')}>
              <View style={styles.CarregarOPasseContainer}>
                <View style={styles.CarregarOPasseIconView}>
                  <Image
                    source={CreditCard}
                    style={styles.CarregarOPasseIcon}
                  />
                </View>
                <View style={styles.CarregarOPasseTextView}>
                  <Text style={styles.CarregarOPasseText}>
                    Carregar o Passe
                  </Text>
                </View>
                <View style={styles.CarregarOPasseRightArrowView}>
                  <Image
                    source={RightGreyArrow}
                    style={styles.CarregarOPasseRightArrowIcon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.CartõesAdjustView}>
            <TouchableOpacity onPress={() => navigation.navigate('Cartões')}>
              <View style={styles.CartõesContainer}>
                <View style={styles.CartõesIconView}>
                  <Image source={Thunder} style={styles.CartõesIcon} />
                </View>
                <View style={styles.CartõesTextView}>
                  <Text style={styles.CartõesText}>Cartões</Text>
                </View>
                <View style={styles.CartõesRightArrowView}>
                  <Image
                    source={RightGreyArrow}
                    style={styles.CartõesRightArrowIcon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.DescontosAdjustView}>
            <TouchableOpacity onPress={() => navigation.navigate('Descontos')}>
              <View style={styles.DescontosContainer}>
                <View style={styles.DescontosIconView}>
                  <Image source={Thunder} style={styles.DescontosIcon} />
                </View>
                <View style={styles.DescontosTextView}>
                  <Text style={styles.DescontosText}>Descontos</Text>
                </View>
                <View style={styles.DescontosRightArrowView}>
                  <Image
                    source={RightGreyArrow}
                    style={styles.DescontosRightArrowIcon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.TarifáriosAdjustView}>
            <TouchableOpacity onPress={() => navigation.navigate('Tarifários')}>
              <View style={styles.TarifáriosContainer}>
                <View style={styles.TarifáriosIconView}>
                  <Image source={Euro} style={styles.TarifáriosIcon} />
                </View>
                <View style={styles.TarifáriosTextView}>
                  <Text style={styles.TarifáriosText}>Tarifários</Text>
                </View>
                <View style={styles.TarifáriosRightArrowView}>
                  <Image
                    source={RightGreyArrow}
                    style={styles.TarifáriosRightArrowIcon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.CarrisMetropolitanaTextView}>
            <Text style={styles.CarrisMetropolitanaText}>
              Carris Metropolitana
            </Text>
          </View>
          <View style={styles.RecrutamentoAdjustView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Recrutamento')}>
              <View style={styles.RecrutamentoContainer}>
                <View style={styles.RecrutamentoIconView}>
                  <Image source={Protection} style={styles.RecrutamentoIcon} />
                </View>
                <View style={styles.RecrutamentoTextView}>
                  <Text style={styles.RecrutamentoText}>Recrutamento</Text>
                </View>
                <View style={styles.RecrutamentoRightArrowView}>
                  <Image
                    source={RightGreyArrow}
                    style={styles.RecrutamentoRightArrowIcon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.DadosAbertosAdjustView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('DadosAbertos')}>
              <View style={styles.DadosAbertosContainer}>
                <View style={styles.DadosAbertosIconView}>
                  <Image source={Effect} style={styles.DadosAbertosIcon} />
                </View>
                <View style={styles.DadosAbertosTextView}>
                  <Text style={styles.DadosAbertosText}>Dados Abertos</Text>
                </View>
                <View style={styles.DadosAbertosRightArrowView}>
                  <Image
                    source={RightGreyArrow}
                    style={styles.DadosAbertosRightArrowIcon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.PrivacidadeAdjustView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Privacidade')}>
              <View style={styles.PrivacidadeContainer}>
                <View style={styles.PrivacidadeIconView}>
                  <Image source={Padlock} style={styles.PrivacidadeIcon} />
                </View>
                <View style={styles.PrivacidadeTextView}>
                  <Text style={styles.PrivacidadeText}>Privacidade</Text>
                </View>
                <View style={styles.PrivacidadeRightArrowView}>
                  <Image
                    source={RightGreyArrow}
                    style={styles.PrivacidadeRightArrowIcon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.AvisoLegalAdjustView}>
            <TouchableOpacity onPress={() => navigation.navigate('AvisoLegal')}>
              <View style={styles.AvisoLegalContainer}>
                <View style={styles.AvisoLegalIconView}>
                  <Image source={Verified} style={styles.AvisoLegalIcon} />
                </View>
                <View style={styles.AvisoLegalTextView}>
                  <Text style={styles.AvisoLegalText}>Aviso Legal</Text>
                </View>
                <View style={styles.AvisoLegalRightArrowView}>
                  <Image
                    source={RightGreyArrow}
                    style={styles.AvisoLegalRightArrowIcon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  NovidadesTextView: {
    paddingTop: 20,
  },
  NovidadesText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  CardTop: {
    paddingTop: 20,
  },
  CardContainer: {
    backgroundColor: '#FFDD00',
    borderRadius: 12,
    width: 300,
    padding: 20,
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  CardAdjustContainer: {
    paddingRight: 10,
  },
  TextView: {
    width: '60%',
    justifyContent: 'center',
  },
  TitleText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  DescriptionText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  ImageTextRowView: {
    flexDirection: 'row',
    alignItems: 'center',
    left: -10,
  },
  OvalImageIcon: {
    height: 60,
    width: 60,
  },
  AmadoraTextDescriptionView: {
    left: -10,
  },
  AmadoraText: {
    fontSize: 10,
    color: '#000',
    fontWeight: '400',
  },
  AmadoraDescriptionText: {
    width: '40%',
    fontSize: 10,
    color: '#000',
    fontWeight: '400',
  },
  InformarTextView: {
    paddingTop: 50,
  },
  InformarText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  EspaçosNaveganteAdjustView: {
    paddingTop: 20,
  },
  EspaçosNaveganteContainer: {
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'space-around',
  },
  EspaçosNaveganteIconView: {
    width: '10%',
  },
  EspaçosNaveganteIcon: {
    height: 30,
    width: 30,
    tintColor: '#C337A5',
  },
  EspaçosNaveganteTextView: {
    width: '80%',
    paddingLeft: 10,
  },
  EspaçosNaveganteText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  EspaçosNaveganteRightArrowView: {
    width: '10%',
  },
  EspaçosNaveganteRightArrowIcon: {
    height: 30,
    width: 30,
  },
  PerguntasFrequentesAdjustView: {
    paddingTop: 15,
  },
  PerguntasFrequentesContainer: {
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'space-around',
  },
  PerguntasFrequentesIconView: {
    width: '10%',
  },
  PerguntasFrequentesIcon: {
    height: 30,
    width: 30,
    tintColor: '#FF732D',
  },
  PerguntasFrequentesTextView: {
    width: '80%',
    paddingLeft: 10,
  },
  PerguntasFrequentesText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  PerguntasFrequentesRightArrowView: {
    width: '10%',
  },
  PerguntasFrequentesRightArrowIcon: {
    height: 30,
    width: 30,
  },
  ApoioAoClienteAdjustView: {
    paddingTop: 15,
  },
  ApoioAoClienteContainer: {
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'space-around',
  },
  ApoioAoClienteIconView: {
    width: '10%',
  },
  ApoioAoClienteIcon: {
    height: 30,
    width: 30,
    tintColor: '#5073FF',
  },
  ApoioAoClienteTextView: {
    width: '80%',
    paddingLeft: 10,
  },
  ApoioAoClienteText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  ApoioAoClienteRightArrowView: {
    width: '10%',
  },
  ApoioAoClienteRightArrowIcon: {
    height: 30,
    width: 30,
  },
  ViajarTextView: {
    paddingTop: 50,
  },
  ViajarText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  CarregarOPasseAdjustView: {
    paddingTop: 20,
  },
  CarregarOPasseContainer: {
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'space-around',
  },
  CarregarOPasseIconView: {
    width: '10%',
  },
  CarregarOPasseIcon: {
    height: 30,
    width: 30,
    tintColor: '#FA3250',
  },
  CarregarOPasseTextView: {
    width: '80%',
    paddingLeft: 10,
  },
  CarregarOPasseText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  CarregarOPasseRightArrowView: {
    width: '10%',
  },
  CarregarOPasseRightArrowIcon: {
    height: 30,
    width: 30,
  },
  CartõesAdjustView: {
    paddingTop: 15,
  },
  CartõesContainer: {
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'space-around',
  },
  CartõesIconView: {
    width: '10%',
  },
  CartõesIcon: {
    height: 30,
    width: 30,
    tintColor: '#FA3250',
  },
  CartõesTextView: {
    width: '80%',
    paddingLeft: 10,
  },
  CartõesText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  CartõesRightArrowView: {
    width: '10%',
  },
  CartõesRightArrowIcon: {
    height: 30,
    width: 30,
  },
  DescontosAdjustView: {
    paddingTop: 15,
  },
  DescontosContainer: {
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'space-around',
  },
  DescontosIconView: {
    width: '10%',
  },
  DescontosIcon: {
    height: 30,
    width: 30,
    tintColor: '#FA3250',
  },
  DescontosTextView: {
    width: '80%',
    paddingLeft: 10,
  },
  DescontosText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  DescontosRightArrowView: {
    width: '10%',
  },
  DescontosRightArrowIcon: {
    height: 30,
    width: 30,
  },
  TarifáriosAdjustView: {
    paddingTop: 15,
  },
  TarifáriosContainer: {
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'space-around',
  },
  TarifáriosIconView: {
    width: '10%',
  },
  TarifáriosIcon: {
    height: 30,
    width: 30,
    tintColor: '#FA3250',
  },
  TarifáriosTextView: {
    width: '80%',
    paddingLeft: 10,
  },
  TarifáriosText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  TarifáriosRightArrowView: {
    width: '10%',
  },
  TarifáriosRightArrowIcon: {
    height: 30,
    width: 30,
  },
  CarrisMetropolitanaTextView: {
    paddingTop: 50,
  },
  CarrisMetropolitanaText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  RecrutamentoAdjustView: {
    paddingTop: 20,
  },
  RecrutamentoContainer: {
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'space-around',
  },
  RecrutamentoIconView: {
    width: '10%',
  },
  RecrutamentoIcon: {
    height: 30,
    width: 30,
    tintColor: '#FFC800',
  },
  RecrutamentoTextView: {
    width: '80%',
    paddingLeft: 10,
  },
  RecrutamentoText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  RecrutamentoRightArrowView: {
    width: '10%',
  },
  RecrutamentoRightArrowIcon: {
    height: 30,
    width: 30,
  },
  DadosAbertosAdjustView: {
    paddingTop: 15,
  },
  DadosAbertosContainer: {
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'space-around',
  },
  DadosAbertosIconView: {
    width: '10%',
  },
  DadosAbertosIcon: {
    height: 30,
    width: 30,
    tintColor: '#5073FF',
  },
  DadosAbertosTextView: {
    width: '80%',
    paddingLeft: 10,
  },
  DadosAbertosText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  DadosAbertosRightArrowView: {
    width: '10%',
  },
  DadosAbertosRightArrowIcon: {
    height: 30,
    width: 30,
  },
  PrivacidadeAdjustView: {
    paddingTop: 15,
  },
  PrivacidadeContainer: {
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'space-around',
  },
  PrivacidadeIconView: {
    width: '10%',
  },
  PrivacidadeIcon: {
    height: 30,
    width: 30,
    tintColor: '#5073FF',
  },
  PrivacidadeTextView: {
    width: '80%',
    paddingLeft: 10,
  },
  PrivacidadeText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  PrivacidadeRightArrowView: {
    width: '10%',
  },
  PrivacidadeRightArrowIcon: {
    height: 30,
    width: 30,
  },
  AvisoLegalAdjustView: {
    paddingTop: 15,
    paddingBottom: 30,
  },
  AvisoLegalContainer: {
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'space-around',
  },
  AvisoLegalIconView: {
    width: '10%',
  },
  AvisoLegalIcon: {
    height: 30,
    width: 30,
    tintColor: '#5073FF',
  },
  AvisoLegalTextView: {
    width: '80%',
    paddingLeft: 10,
  },
  AvisoLegalText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  AvisoLegalRightArrowView: {
    width: '10%',
  },
  AvisoLegalRightArrowIcon: {
    height: 30,
    width: 30,
  },
  container: {paddingLeft: 20, paddingRight: 20},
});
export default More;
