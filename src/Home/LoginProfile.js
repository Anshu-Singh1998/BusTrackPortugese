
import * as React from 'react';
import { useState, useEffect } from 'react';
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
  Linking,
  ToastAndroid
} from 'react-native';
import URI from 'urijs'
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import Play from '../../Assets/NewImages/Play.png';
import PauseButton from '../../Assets/NewImages/PauseButton.png';
import Wifi from '../../Assets/NewImages/Wifi.png';
import logo from '../../Assets/NewImages/logo.png';
import GreenTick from '../../Assets/images/GreenTick.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LoginProfile = () => {
  const [modalHeight, setModalHeight] = useState('70%');
  const [visible, setVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [paused, setPaused] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState('');
  const [county, setCounty] = useState('');
  const [parish, setParish] = useState('');
  const [userPersonalData, setUserPersonalData] = useState({});
  const [WebViewVisible, setWebViewVisible] = useState(false);
  const [tokenWebViewVisible, setTokenWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [token, settoken] = useState(null);
  const [isCheckingForToken, setIsCheckingForToken] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(undefined);
  const initialUrl = React.useRef(null)
  const [data, setData] = useState([]);
  //***********created by Himanshi jan 2024 ***********************/
  const [isOpenWebViewWithToken, setIsOpenWebViewWithToken] = useState(false)
  const navigation = useNavigation()
  const storeToAsyncStorage = async (key, value) => {
    return AsyncStorage.setItem(key, value);
  }
  const getDatFromAsyncStorage = async (key) => {
    return AsyncStorage.getItem(key);
  }
  const removeFromAsyncStorage = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log('Item removed from AsyncStorage successfully!');
    } catch (error) {
      console.error('Error removing item from AsyncStorage:', error);
    }
  };
  const _getProfile = async (token) => {
    try {
      const response = await axios.get(
        'https://beta.carrismetropolitana.pt/api/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status === 200) {
        const data = response.data;
        // console.log("********* himmi data******", data)
        navigation.navigate('TabNavigation', {
          screen: 'HomeScreen', params: {
            screen: 'Home', params: {
              data
            }
          }
        })
      }
      else {
        console.error('Failed to fetch user details:', response.status);
      }
    } catch (error) {
      // console.log('Error fetching user details:', error.response.status);
      if (error.response.status == 401) {
        alert("token expired");
        removeFromAsyncStorage('userToken');
      }
    }
  }
  const _isLogin = async (token) => {
    console.log('try profile with token', token)
    if (token != null && token) {
      _getProfile(token)
    } else {
      alert('No Token found !')
    }
  };
  const handleCloseModal = () => {
    setWebViewVisible(false);
  };
  const _onNavigationStateChangInitialWebView = async e => {

    if (e.url?.includes('login/verify') && e.loading == false) {
      setWebViewVisible(false)
    }
  }
  const _onNavigationStateChange = async e => {
    if (!e.url || e.url.includes('login/error?error=Verification')) {
      ToastAndroid.showWithGravityAndOffset(
        'Your token has expired',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      removeFromAsyncStorage('userToken');
      setIsOpenWebViewWithToken(false);
      initialUrl.current = null
      if (navigation.canGoBack()) {
        navigation.goBack()
      }
      return
    }

    if (e.url !== null && e.url.includes("token")) {
      const result = URI.parse(e.url)
      const query = URI.parseQuery(`?${result.query}`)
      const token = query?.token
      await storeToAsyncStorage('userToken', token);
      setIsOpenWebViewWithToken(false);
      ToastAndroid.showWithGravityAndOffset(
        'Sign-in completed successfully',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      _isLogin(token);
    }
  };
  const checkWebLinkForToken = async (event) => {
    // console.log('deeplink url---->', event?.url)
    handleCloseModal()
    if (event.url != null && event.url?.includes("token")) {
      initialUrl.current = event.url
      setIsOpenWebViewWithToken(false)
      setTimeout(() => {
        setIsOpenWebViewWithToken(true)
      }, 1000);
    } else {
      alert('no deeplink url found')
    }
  }

  const checkAndAutoLogin = async () => {
    const mAutoLoginInitialUrl = await Linking.getInitialURL();
    if (mAutoLoginInitialUrl && mAutoLoginInitialUrl?.includes("token")) {
      initialUrl.current = mAutoLoginInitialUrl
      setTimeout(() => {
        setIsOpenWebViewWithToken(true)
      }, 1000);
      return
    }
    //testing himanshi
    // await storeToAsyncStorage('@TOKEN', '');
    //testing
    const token = await getDatFromAsyncStorage('userToken')
    if (token && token != null) {
      _isLogin(token)
    }
  }
  useEffect(() => {
    Linking.addEventListener('url', checkWebLinkForToken)
    checkAndAutoLogin()
    return () => {
      Linking.removeAllListeners('url')
    };
  }, []);

  if (isOpenWebViewWithToken && initialUrl && initialUrl.current && initialUrl.current != null && initialUrl.current.includes('token')) {
    return <WebView
      source={{
        uri: initialUrl.current,
      }}
      onNavigationStateChange={e => _onNavigationStateChange(e)}
      style={{ flex: 1 }}
    />
  }
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor="#FFDD00"></StatusBar>
      <View style={styles.MainView}>
        <View style={styles.LogoTextRow}>
          <View >
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
          <View style={styles.AdjustContainer}>
            <View>
              <Text style={styles.ACarrisMetropolitanaEstáMaisText}>
                A Carris Metropolitana está mais próxima
              </Text>
            </View>
            <View style={styles.VideoButtonAdjustView}>
              <View style={styles.VideoButtonAdjustViewInner}>
                <TouchableOpacity
                  onPress={() => {
                    setClicked(true);
                  }}
                  style={styles.VideoButtonView}>
                  <Video
                    paused={paused}
                    source={{
                      uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                    }}
                    muted
                    style={styles.VideoButton}
                    resizeMode="cover"
                    controls={true}
                  />
                  {clicked && (
                    <TouchableOpacity style={styles.PausePlayButtonIconView}>
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            setPaused(!paused);
                          }}
                          style={styles.PauseButtonIconView}>
                          <Image
                            source={paused ? Play : PauseButton}
                            style={styles.PauseButtonIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.CrieUmaContaTextView}>
              <Text style={styles.CrieUmaContaText}>
                Crie uma conta para personalizar a app com as suas linhas e
                paragens favoritas.
              </Text>
            </View>
            <View style={styles.SaibaExatamenteTextView}>
              <Text style={styles.SaibaExatamenteText}>
                Saiba exatamente onde andam todos os autocarros e exatamente
                quando chegam à sua paragem.
              </Text>
            </View>
            <View style={styles.LoginComEmailBtnView}>
              <TouchableOpacity
                style={styles.LoginComEmailBtn}
                onPress={() => {
                  setVisible(true);
                }}>
                <Text style={styles.LoginComEmailText}>Login com Email</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.AoIniciarSessãoMollitTextView}>
              <Text style={styles.AoIniciarSessãoMollitText}>
                Ao iniciar sessão mollit commodo incididunt commodo
                reprehenderit amet est officia exercitation tempor.
              </Text>
            </View>
          </View>
          <View>
            <Modal
              style={styles.ModalContainer}
              isVisible={visible}
              onBackdropPress={() => setVisible(false)}>
              <View style={[styles.LoginModalContainer, { height: modalHeight }]}>
                <View style={styles.CloseButtonView}>
                  <TouchableOpacity
                    style={styles.CloseBtn}
                    onPress={() => {
                      setModalHeight('90%');
                    }}></TouchableOpacity>
                </View>
                <ScrollView>
                  <View>
                    <View style={styles.LoginLogoView}>
                      <TouchableOpacity
                        onPress={() => {
                          setVisible(false);
                        }}>
                        <Image source={logo} style={styles.LoginLogo} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.LoginLogoBottomBorder}></View>
                    <View style={styles.TudoOQuePrecisaAdjustTextView}>
                      <View style={styles.TudoOQuePrecisaTextView}>
                        <Text style={styles.TudoOQuePrecisaText}>
                          Tudo o que precisa é o seu email
                        </Text>
                      </View>
                      <View style={styles.LoginEntrarBtnView}>
                        <TouchableOpacity
                          onPress={() => {
                            setWebViewVisible(true);
                          }}
                          style={styles.LoginEntrarBtn}>
                          <Text style={styles.LoginEntrarText}>Entrar</Text>
                        </TouchableOpacity>
                        {WebViewVisible && <Modal
                          isVisible={WebViewVisible}
                          onBackdropPress={handleCloseModal}>
                          <View style={{ flex: 1, backgroundColor: 'red' }}>
                            <WebView
                              source={{
                                uri: 'https://beta.carrismetropolitana.pt/token',
                              }}
                              onNavigationStateChange={e => _onNavigationStateChangInitialWebView(e)}
                              style={{ flex: 1 }}
                              incognito={true}
                            />
                          </View>
                        </Modal>}
                      </View>
                      <View style={styles.AoIniciarSessãoTextView}>
                        <Text style={styles.AoIniciarSessãoText}>
                          Ao iniciar sessão mollit commodo incididunt commodo
                          reprehenderit amet est officia exercitation tempor.
                        </Text>
                      </View>
                      <View style={styles.LoginSemPasswordGreenTickView}>
                        <View style={styles.GreenTickLoginModalIconView}>
                          <Image
                            source={GreenTick}
                            style={styles.GreenTickLoginModalIcon}
                          />
                          <Text style={styles.LoginSemPasswordLoginModalText}>
                            Login sem Password
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
              <View>
                <Modal
                  style={styles.ModalContainer}
                  isVisible={registerVisible}
                  onBackdropPress={() => setRegisterVisible(false)}>
                  <View
                    style={[
                      styles.RegisterModalContainer,
                      { height: modalHeight },
                    ]}>
                    <View style={styles.CloseButtonView}>
                      <TouchableOpacity
                        style={styles.CloseBtn}
                        onPress={() => {
                          setModalHeight('90%');
                        }}></TouchableOpacity>
                    </View>
                    <ScrollView>
                      <View>
                        <View style={styles.RegisterMainLogoAdjustView}>
                          <TouchableOpacity
                            onPress={() => {
                              setRegisterVisible(false);
                            }}>
                            <Image
                              source={logo}
                              style={styles.RegisterMainLogo}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.RegisterTopBorder}></View>
                        <View style={styles.CriarContaTextRegisterAdjustView}>
                          <View style={styles.CriarContaTextRegisterView}>
                            <Text style={styles.CriarContaTextRegister}>
                              Criar Conta
                            </Text>
                          </View>
                          <View style={styles.TextInputAdjustView}>
                            <View style={styles.TextInputView}>
                              <View style={styles.NomeTextInputView}>
                                <TextInput
                                  style={styles.NomeTextInput}
                                  placeholder="Nome"
                                  placeholderTextColor="#B9B9B9"
                                  value={name}
                                  onChangeText={text => setName(text)}
                                />
                              </View>
                              <View
                                style={
                                  styles.ApelidoTextInputAdjustView
                                }></View>
                              <View style={styles.ApelidoTextInputView}>
                                <TextInput
                                  style={styles.ApelidoTextInput}
                                  placeholder="Apelido"
                                  placeholderTextColor="#B9B9B9"
                                  value={surname}
                                  onChangeText={text => setSurname(text)}
                                />
                              </View>
                            </View>
                          </View>
                          <View style={styles.DataDeNascimentoTextInputView}>
                            <TextInput
                              style={styles.DataDeNascimentoTextInput}
                              placeholder="Data de Nascimento"
                              placeholderTextColor="#B9B9B9"
                              value={dob}
                              onChangeText={text => setDob(text)}
                            />
                          </View>
                          <View
                            style={styles.FreguesiaMunicipioAdjustContainer}>
                            <View style={styles.FreguesiaMunicipioContainer}>
                              <View style={styles.MunicípioTextInputView}>
                                <TextInput
                                  style={styles.MunicípioTextInput}
                                  placeholder="Município"
                                  placeholderTextColor="#B9B9B9"
                                  value={county}
                                  onChangeText={text => setCounty(text)}
                                />
                              </View>
                              <View
                                style={
                                  styles.FreguesiaAdjustTextInputView
                                }></View>
                              <View style={styles.FreguesiaTextInputView}>
                                <TextInput
                                  style={styles.FreguesiaTextInput}
                                  placeholder="Freguesia"
                                  placeholderTextColor="#B9B9B9"
                                  value={parish}
                                  onChangeText={text => setParish(text)}
                                />
                              </View>
                            </View>
                          </View>

                          <View style={styles.AceitoOSRowView}>
                            <View style={styles.AceitoOSTopView}></View>
                            <View style={styles.AceitoOsTextView}>
                              <Text style={styles.AceitoOsText}>
                                Aceito os Termos e Condições de criar uma conta
                                Carris Metropolitana.
                              </Text>
                            </View>
                          </View>
                          <View style={styles.RegisterCriarContaButton}>
                            <TouchableOpacity
                              onPress={() => {
                                setSuccessModal(true);
                                handleRegister();
                              }}
                              style={styles.RegisterCriarContaTextView}>
                              <Text style={styles.RegisterCriarContaText}>
                                Criar Conta
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.AoIniciarTextView}>
                            <Text style={styles.AoIniciarText}>
                              Ao iniciar sessão mollit commodo incididunt
                              commodo reprehenderit amet est officia
                              exercitation tempor.
                            </Text>
                          </View>
                          <View
                            style={
                              styles.RegisterLoginGreenTickIconAndTextView
                            }>
                            <View
                              style={styles.RegisterLoginGreenTickIconAndText}>
                              <Image
                                source={GreenTick}
                                style={styles.RegisterGreenTickIcon}
                              />
                              <Text style={styles.LoginSemText}>
                                Login sem Password
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                  <Modal style={styles.ModalContainer} isVisible={successModal}>
                    <View
                      style={[
                        styles.SuccessModalContainer,
                        { height: modalHeight },
                      ]}>
                      <View style={styles.CloseButtonView}>
                        <TouchableOpacity
                          style={styles.CloseBtn}
                          onPress={() => {
                            setModalHeight('90%');
                          }}></TouchableOpacity>
                      </View>
                      <ScrollView>
                        <View>
                          <View style={styles.SuccessModalLogoView}>
                            <TouchableOpacity
                              onPress={() => {
                                setSuccessModal(false);
                              }}>
                              <Image
                                source={logo}
                                style={styles.SuccessModalLogo}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.SuccessBottomBorder}></View>
                          <View style={styles.SuccessView}>
                            <View style={styles.VerifiqueATextView}>
                              <Text style={styles.VerifiqueAText}>
                                Verifique a suacaixa de email
                              </Text>
                            </View>
                            <View style={styles.EnviamosUmTextView}>
                              <Text style={styles.EnviamosUmText}>
                                Enviámos um email com um botão para fazer o
                                login na sua conta Carris Metropolitana.
                              </Text>
                            </View>
                            <View style={styles.NaoRecebeuTextView}>
                              <Text style={styles.NaoRecebeuText}>
                                Não recebeu o email?
                              </Text>
                            </View>
                            <View style={styles.EnviarOutraButtonView}>
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate('TabNavigation');
                                }}
                                style={styles.EnviarOutraButton}>
                                <Text style={styles.EnviarOutraText}>
                                  Enviar outra vez
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </ScrollView>
                    </View>
                  </Modal>
                </Modal>
              </View>
            </Modal>
          </View>
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
    // top: 0,
    position: 'relative',
    backgroundColor: '#FFDD00',
    width: '100%',
    height: 100,
    left: 0,
    right: 0,
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
    height: 55,
  },
  WifiTextView: {
    width: 150,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  WifiImgView: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#FFDD00',
    width: '100%',
    right: 0,
    left: 0,
    // top:-30
    // height: 600,
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
    backgroundColor: '#bccbeb',
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
    fontSize: 16,
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
  },
  OptionContainer: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#bccbeb',
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
    height: 20,
    width: 20,
  },
  ParagemFavouritaTextView: {
    paddingLeft: 10,
  },
  ParagemFavouritaText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: ' normal',
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
    height: 20,
    width: 20,
  },
  LinhaFavoritaTextView: {
    paddingLeft: 10,
  },
  LinhaFavoritaText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: ' normal',
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
    height: 20,
    width: 20,
  },
  NotificationSectionTextView: { paddingLeft: 10 },
  NotificationSectionText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: ' normal',
    textAlign: 'left',
  },
  NotificationSectionAddBtnView: { paddingTop: 20 },
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
  LoginModalContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FFDD00',
    width: '100%',
    right: 0,
    left: 0,
    // top:-30
    height: '50%',
  },
  RegisterModalContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FFDD00',
    width: '100%',
    right: 0,
    left: 0,
    // top:-30
    height: '50%',
  },
  SuccessModalContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FFDD00',
    width: '100%',
    right: 0,
    left: 0,
    // top:-30
    height: '50%',
  },
  EnviarOutraText: {
    color: '#000000',
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  EnviarOutraButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    opacity: 0.6,
  },
  EnviarOutraButtonView: { paddingTop: 20 },
  NaoRecebeuText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  NaoRecebeuTextView: { paddingTop: 180 },
  EnviamosUmText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  EnviamosUmTextView: { paddingTop: 30 },
  VerifiqueAText: {
    color: '#000',
    fontSize: 30,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
    width: '80%',
  },
  VerifiqueATextView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  SuccessView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 74,
  },
  SuccessBottomBorder: {
    paddingTop: 32,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  SuccessModalLogo: { height: 70, width: 200 },
  SuccessModalLogoView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  LoginSemText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
    paddingLeft: 5,
  },
  RegisterGreenTickIcon: { height: 20, width: 20 },
  RegisterLoginGreenTickIconAndText: {
    width: 190,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 13,
  },
  RegisterLoginGreenTickIconAndTextView: {
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  AoIniciarText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  AoIniciarTextView: { paddingTop: 20 },
  RegisterCriarContaText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  RegisterCriarContaTextView: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  RegisterCriarContaButton: { paddingTop: 20 },
  AceitoOsText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
    width: '65%',
  },
  AceitoOsTextView: { paddingLeft: 10 },
  AceitoOSTopView: {
    height: 40,
    width: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  AceitoOSRowView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  FreguesiaTextInput: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    color: '#B9B9B9',
    fontSize: 18,
    fontWeight: '600',
  },
  FreguesiaTextInputView: {
    borderTopWidth: 1,
    borderTopColor: '#c4c4c4',
  },
  FreguesiaAdjustTextInputView: {
    paddingBottom: 3,
  },
  MunicípioTextInput: {
    padding: 20,
    borderRadius: 15,
    color: '#B9B9B9',
    fontSize: 18,
    fontWeight: '600',
  },
  MunicípioTextInputView: {
    borderBottomWidth: 1,
    borderBottomColor: '#c4c4c4',
  },
  FreguesiaMunicipioContainer: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 15,
  },
  FreguesiaMunicipioAdjustContainer: { paddingTop: 20 },
  DataDeNascimentoTextInput: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    color: '#B9B9B9',
    fontSize: 18,
    fontWeight: '600',
  },
  DataDeNascimentoTextInputView: { paddingTop: 20 },
  ApelidoTextInput: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    color: '#B9B9B9',
    fontSize: 18,
    fontWeight: '600',
  },
  ApelidoTextInputView: {
    borderTopWidth: 1,
    borderTopColor: '#c4c4c4',
  },
  ApelidoTextInputAdjustView: {
    paddingBottom: 3,
  },
  NomeTextInput: {
    padding: 20,
    borderRadius: 15,
    color: '#B9B9B9',
    fontSize: 18,
    fontWeight: '600',
  },
  NomeTextInputView: {
    borderBottomWidth: 1,
    borderBottomColor: '#c4c4c4',
  },
  TextInputView: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 15,
  },
  TextInputAdjustView: { paddingTop: 20 },
  CriarContaTextRegister: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
    width: '80%',
  },
  CriarContaTextRegisterView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  CriarContaTextRegisterAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40,
  },
  RegisterTopBorder: {
    paddingTop: 32,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  RegisterMainLogo: { height: 70, width: 200 },
  RegisterMainLogoAdjustView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  LoginSemPasswordLoginModalText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
    paddingLeft: 5,
  },
  GreenTickLoginModalIcon: { height: 20, width: 20 },
  GreenTickLoginModalIconView: {
    width: 190,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 13,
  },
  LoginSemPasswordGreenTickView: {
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  AoIniciarSessãoText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  AoIniciarSessãoTextView: { paddingTop: 20 },
  GoogleSignOutText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  GoogleSignOutTextView: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  GoogleSignOutBtnView: { paddingTop: 20 },
  GoogleSignInText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  GoogleSignInBtn: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  GoogleSignInBtnView: { paddingTop: 20 },
  LoginEntrarText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  LoginEntrarBtn: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  LoginEntrarBtnView: { paddingTop: 20 },
  IndiqueOSeuEmailTextInput: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 10,
    color: '#B9B9B9',
    fontSize: 18,
    fontWeight: '600',
  },
  IndiqueOSeuEmailTextInputView: { paddingTop: 50 },
  TudoOQuePrecisaText: {
    color: '#000',
    fontSize: 25,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
    width: '80%',
  },
  TudoOQuePrecisaTextView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  TudoOQuePrecisaAdjustTextView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 50,
  },
  LoginLogoBottomBorder: {
    paddingTop: 32,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  LoginLogo: { height: 70, width: 200 },
  LoginLogoView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  AoIniciarSessãoMollitText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
    width: '80%',
  },
  AoIniciarSessãoMollitTextView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  LoginComEmailText: {
    color: '#000000',
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  LoginComEmailBtn: {
    backgroundColor: '#FFDD00',
    borderRadius: 12,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  LoginComEmailBtnView: { paddingTop: 50 },
  SaibaExatamenteText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  SaibaExatamenteTextView: { paddingTop: 20 },
  CrieUmaContaText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  CrieUmaContaTextView: { paddingTop: 20 },
  PauseButtonIcon: { height: 30, width: 30, tintColor: '#fff' },
  PauseButtonIconView: {
    height: 50,
    width: 50,
    backgroundColor: '#fedefe',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  PausePlayButtonIconView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  VideoButton: { width: '100%', height: 200, borderRadius: 15 },
  VideoButtonView: { width: '100%', height: 200, borderRadius: 15 },
  VideoButtonAdjustViewInner: {
    // width: '100%',
    // height: 200,
    // backgroundColor: '#e6eefa',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 16,
    flex: 1,
  },
  VideoButtonAdjustView: { paddingTop: 10 },
  ACarrisMetropolitanaEstáMaisText: {
    color: '#000',
    fontSize: 25,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  AdjustContainer: { paddingLeft: 20, paddingRight: 20, paddingTop: 30 },
});
export default LoginProfile;
