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
import MapImage from '../../Assets/images/Map.png';
import LeftArrow from '../../Assets/images/LeftArrow.png';
import Upload from '../../Assets/NewImages/Upload.png';
import MapLineButton from '../../Assets/NewImages/MapLineButton.png';
import StarImageOutline from '../../Assets/NewImages/StarImageOutline.png';
import Warning from '../../Assets/NewImages/Warning.png';
import SearchIcon from '../../Assets/NewImages/Search.png';
import RightGreyArrow from '../../Assets/NewImages/RightArrow.png';
import GreenTick from '../../Assets/images/GreenTick.png';
import MacIcon from '../../Assets/images/MacIcon.png';
import Modal from 'react-native-modal';

const CompassDetails = ({navigation, route}) => {
  const {modalData, specificRoutes} = route.params;
  const [favoriteStopVisible, setFavouriteStopVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectStopVisible, setSelectStopVisible] = useState(false);
  const [modalHeight, setModalHeight] = useState('50%');
  const [visibleItems, setVisibleItems] = useState(3);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const loadMoreItems = () => {
    setVisibleItems(visibleItems + 5);
  };
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor="#FFDD00"></StatusBar>
      <ScrollView>
        <View style={styles.ContainerAdjustView}>
          <View style={styles.Container}>
            <View style={styles.ContainerInner}>
              <View style={styles.CompassDetailsModalDataMapaTextLeftArrowView}>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Favourite');
                    }}>
                    <Image
                      source={LeftArrow}
                      style={styles.CompassDetailsModalDataMapaLeftArrowIcon}
                    />
                  </TouchableOpacity>
                </View>
                {/* <View style={styles.CompassDetailsModalDataMapaTextView}>
                  <Text style={styles.CompassDetailsModalDataMapaText}>
                    Mapa
                  </Text>
                </View> */}
              </View>
              <View style={{flexDirection:'column', alignContent:'center',justifyContent:'center'}}>
                <Text style={styles.CompassDetailsModalDataParagemText}>
                  Paragem
                </Text>
              </View>
              <View>
                <Image
                  source={Upload}
                  style={styles.CompassDetailsModalDataUploadIcon}
                />
              </View>
            </View>
          </View>
          <View style={styles.CompassDetailsModalDataIdLatLonView}>
            <View style={{}}>
              <View style={styles.CompassDetailsModalDataIDTextView}>
                <Text style={styles.CompassDetailsModalDataIdText}>
                  {modalData.id}
                </Text>
              </View>
            </View>
            <View style={styles.CompassDetailsModalDataLonLat}>
              <View style={styles.CompassDetailsModalDataLatView}>
                <Text style={styles.CompassDetailsModalDataLat}>
                  {modalData.lat}
                </Text>
              </View>
              <View>
                <Text style={styles.CompassDetailsModalDataLon}>
                  {modalData.lon}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.CompassDetailsModalDataNameTextView}>
            <Text style={styles.CompassDetailsModalDataName}>
              {modalData.name}
            </Text>
          </View>
          {/* <View style={styles.CompassDetailsPlaceTextView}>
            <Text style={styles.CompassDetailsPlaceText}>
              Cova da Piedade, Almada
            </Text>
          </View> */}
          <View style={styles.CompassDetailsStarAndWarningButtonView}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setFavouriteStopVisible(true);
                }}
                style={styles.CompassDetailsStarImageOutLineButton}>
                <Image
                  source={StarImageOutline}
                  style={styles.CompassDetailsStarImageOutLineIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.CompassDetailsMapLineButtonView}>
              <TouchableOpacity style={styles.CompassDetailsMapLineButton}>
                <Image
                  source={MapLineButton}
                  style={styles.CompassDetailsMapLineButtonIcon}
                />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={styles.CompassDetailsWarningButton}>
                <Image
                  source={Warning}
                  style={styles.CompassDetailsWarningIcon}
                />
              </TouchableOpacity>
            </View>
            <Modal
              onBackdropPress={() => setFavouriteStopVisible(false)}
              style={styles.ModalContainer}
              isVisible={favoriteStopVisible}>
              <View
                style={[styles.FavouriteModalContainer, {height: modalHeight}]}>
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
                  <View style={styles.FirstModalLeftArrowButton}>
                    <TouchableOpacity
                      onPress={() => {
                        setFavouriteStopVisible(false);
                      }}>
                      <Image
                        source={LeftArrow}
                        style={styles.FirstModalLeftArrowIcon}
                      />
                    </TouchableOpacity>
                    <Text style={styles.FirstModalPersonalizerText}>
                      Personalizar
                    </Text>
                  </View>
                  <View style={styles.FirstModalParagemFavoritaTextView}>
                    <Text style={styles.FirstModalParagemFavoritaText}>
                      Paragem Favorita
                    </Text>
                  </View>
                  <View style={styles.SortCardsTextView}>
                    <Text style={styles.FirstModalSelecionarParagemText}>
                      Selecionar paragem
                    </Text>
                    <Text style={styles.EscolhaUmaText}>
                      Escolha uma paragem para visualizar na página principal.
                    </Text>
                  </View>
                  <View style={styles.SearchViewMainAdjustView}>
                    <View style={styles.SearchViewMain}>
                      <View style={styles.SearchInputSearchIconView}>
                        <Image
                          source={SearchIcon}
                          style={styles.SearchInputSearchIcon}
                        />
                      </View>
                      <View style={styles.FirstModalSearchInputView}>
                        <TextInput
                          style={styles.FirstModalSearchInput}
                          placeholder="Procurar paragem"
                          placeholderTextColor="#969696"
                        />
                      </View>
                      <View style={styles.SearchInputIconViewMain}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectStopVisible(true);
                          }}>
                          <Image
                            source={RightGreyArrow}
                            style={styles.SearchInputIconView}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={styles.DestinationAdjustView}>
                    <Text style={styles.SelecionarDestinosText}>
                      Selecionar destinos
                    </Text>
                    <Text style={styles.EscolhaQuaisText}>
                      Escolha quais destinos pretende visualizar.
                    </Text>
                  </View>
                  <View style={styles.StopSortingAdjustView}>
                    <View style={styles.FirstModalDestinationContainer}>
                      <View style={styles.ToStopContainer}>
                        <View style={styles.ToStopRow}>
                          <View style={styles.FirstDestinationTitleTextView}>
                            <Text style={styles.FirstDestinationTitleText}>
                              0000
                            </Text>
                          </View>
                          <View style={styles.ToStopTextView}>
                            <Text
                              style={styles.FirstDestinationDescriptionText}>
                              Destination 1
                            </Text>
                          </View>
                        </View>
                        <View
                          style={
                            styles.FirstDestinationGreenTickIconView
                          }></View>
                      </View>
                      <View style={styles.FavouriteStopContainer}>
                        <View style={styles.FavouriteStopRow}>
                          <View style={styles.SecondDestinationTitleTextView}>
                            <Text style={styles.SecondDestinationTitleText}>
                              0000
                            </Text>
                          </View>
                          <View style={styles.ToStopTextView}>
                            <Text
                              style={styles.SecondDestinationDescriptionText}>
                              Destination 1
                            </Text>
                          </View>
                        </View>
                        <View style={styles.SecondDestinationGreenTickIconView}>
                          <Image
                            source={GreenTick}
                            style={styles.SecondDestinationGreenTickIcon}
                          />
                        </View>
                      </View>
                      <View style={styles.FavouriteStopSecondContainer}>
                        <View style={styles.FavouriteStopSecondRow}>
                          <View style={styles.ThirdDestinationTitleTextView}>
                            <Text style={styles.ThirdDestinationTitleText}>
                              0000
                            </Text>
                          </View>
                          <View style={styles.ToStopTextView}>
                            <Text
                              style={styles.ThirdDestinationDescriptionText}>
                              Destination 1
                            </Text>
                          </View>
                        </View>
                        <View style={styles.ThirdDestinationGreenTickIconView}>
                          <TouchableOpacity>
                            <Image
                              source={GreenTick}
                              style={styles.ThirdDestinationGreenTickIcon}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.AtivarRecberNotificacoesView}>
                    <Text style={styles.AtivarNotificacoesText}>
                      Ativar notificações
                    </Text>
                    <Text style={styles.ReceberNotificacoesSempreText}>
                      Receber notificações sempre que houver novos avisos para
                      as linhas e paragens selecionadas.
                    </Text>
                  </View>
                  <View style={styles.ReceberNotificacoesAdjustView}>
                    <View style={styles.ReceberNotificacoesTextView}>
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
                  <View style={styles.FirstModalGuardarButtonAdjustView}>
                    <TouchableOpacity
                      onPress={() => {
                        setFavouriteStopVisible(false);
                      }}
                      style={styles.FirstModalGuardarButton}>
                      <Text style={styles.FirstModalGuardarButtonText}>
                        Guardar
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.FirstModalEliminarButtonView}>
                    <TouchableOpacity style={styles.FirstModalEliminarButton}>
                      <Text style={styles.FirstModalEliminarText}>
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
                <View
                  style={[
                    styles.SelectStopVisibleContainer,
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
                    <View style={styles.SecondModalContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectStopVisible(false);
                        }}>
                        <Image
                          source={LeftArrow}
                          style={styles.SecondModalLeftArrow}
                        />
                      </TouchableOpacity>
                      <Text style={styles.SecondModalEditarCartaoText}>
                        Editar Cartão
                      </Text>
                    </View>
                    <View style={styles.SecondModalSelecionarParagemTextView}>
                      <Text style={styles.SecondModalSelecionarParagemText}>
                        Selecionar Paragem
                      </Text>
                    </View>
                    {/* <View>
                      <Image
                        source={MapImage}
                        style={styles.SecondModalMapImage}
                      />
                    </View> */}
                    <View style={styles.SecondModalViewContainerAdjustView}>
                      <View style={styles.SearchView}>
                        <View style={styles.SearchIconView}>
                          <Image
                            source={SearchIcon}
                            style={styles.SearchIconImage}
                          />
                        </View>
                        <View style={styles.SearchTextFieldView}>
                          <TextInput
                            style={styles.SearchTextField}
                            placeholder="Search"
                            placeholderTextColor="#969696"
                          />
                        </View>
                        <View style={styles.MacIconView}>
                          <Image source={MacIcon} style={styles.MacIcon} />
                        </View>
                      </View>
                    </View>
                    <View style={styles.OptionsContainerAdjustView}>
                      <View style={styles.OptionsContainerView}>
                        <View style={styles.CalcadaPovaoView}>
                          <View>
                            <Text style={styles.CalcadaChafarizText}>
                              Calçada Chafariz 8
                            </Text>
                            <Text style={styles.PovoaDeStoText}>
                              Póvoa de Sto. Adrião, Odivelas
                            </Text>
                          </View>
                          <View>
                            <View style={styles.CalcadaPovoaAddIconView}>
                              <Text style={styles.CalcadaPovoaAddIcon}>+</Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.AvPdero49VendaView}>
                          <View>
                            <Text style={styles.AvDPedro49Text}>
                              Av D Pedro V 49
                            </Text>
                            <Text style={styles.VendaDoPinheiroText}>
                              Venda do Pinheiro, Mafra
                            </Text>
                          </View>
                          <View>
                            <View style={styles.AvDPedroVendaAddIconView}>
                              <Text style={styles.AvDPedroVendaAddIconText}>
                                +
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.AvDPedroAlhosView}>
                          <View>
                            <Text style={styles.AvDpedroText}>
                              Av D Pedro V 1
                            </Text>
                            <Text style={styles.AlhosVedrosMoitaText}>
                              Alhos Vedros, Moita
                            </Text>
                          </View>
                          <View>
                            <View style={styles.AvDPedroAlhosFirstAddIconView}>
                              <Text style={styles.AvDPedroAlhosFirstAddIcon}>
                                +
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.LindaMoitaView}>
                          <View>
                            <Text style={styles.LindaVelheText}>
                              Linda-a-velha (Alto Stª Catarina)
                            </Text>
                            <Text style={styles.MoitaMoitaText}>
                              Moita, Moita
                            </Text>
                          </View>
                          <View>
                            <View style={styles.LindaMoitaAddIconView}>
                              <Text style={styles.LindaMoitaAddIcon}>+</Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.AvPortugalArroteiasView}>
                          <View>
                            <Text style={styles.AvPortugalXText}>
                              Av Portugal (X) Pct Eugénio Castro
                            </Text>
                            <Text style={styles.ArroteiasMoitaText}>
                              Arroteias, Moita
                            </Text>
                          </View>
                          <View>
                            <View style={styles.AvPortugalArroteiasAddIconView}>
                              <Text style={styles.AvPortugalArroteiasAddIcon}>
                                +
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.RCravosBarriroView}>
                          <View>
                            <Text style={styles.RCravosAbrilText}>
                              R Cravos Abril 45
                            </Text>
                            <Text style={styles.BairroDoAreiasBarreiroText}>
                              Bairro do Areias, Barreiro
                            </Text>
                          </View>
                          <View>
                            <View style={styles.RCravosBairroAddIconView}>
                              <Text style={styles.RCravosBairroAddIconText}>
                                +
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.RClaudioBairroView}>
                          <View>
                            <Text style={styles.RClaudioText}>
                              R Cláudio de Oliveira Bastos 20
                            </Text>
                            <Text style={styles.BairroDoAreiasText}>
                              Bairro do Areias, Barreiro
                            </Text>
                          </View>
                          <View>
                            <View style={styles.ClaudioBairroAddIconView}>
                              <Text style={styles.ClaudioBairroAddIcon}>+</Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.ParagensEncontradesTextView}>
                          <Text style={styles.ParagensEncontradesText}>
                            12 paragens encontradas
                          </Text>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </Modal>
            </Modal>
          </View>
        </View>
        {/* <View style={styles.MapViewContainer}>
          <Image source={MapImage} style={styles.MapView} />
        </View> */}

        <View style={styles.DestinosAPartirTextView}>
          <Text style={styles.DestinosAPartirText}>
            Destinos a partir desta paragem
          </Text>
        </View>
        <View style={styles.SpecificRoutesAdjustView}>
          <View style={styles.SpecificRoutesContainer}>
            {specificRoutes.slice(0, visibleItems).map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  navigation.navigate('StepIndicatorTrack', {
                    selectedRoute: item, // Pass the entire route object
                    selectedItem: item.patterns,
                  });
                }}>
                <View>
                  <View style={[styles.RecentResultsFirstRowView]}>
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
                          {item.id}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.RecentResultsFirstRowTextView}>
                      <Text style={styles.RecentResultsFirstRowTextValue}>
                        {item.long_name}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity>
                        <Image
                          source={RightGreyArrow}
                          style={styles.specificRoutesRightArrow}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {visibleItems < specificRoutes.length && (
              <TouchableOpacity onPress={loadMoreItems}>
                <View style={styles.ViewMoreButton}>
                  <View>
                    <Text style={styles.ViewMoreButtonText}>
                      Ver mais destinos
                    </Text>
                  </View>

                  <View style={styles.ViewMoreButtonIconView}>
                    <Image
                      source={RightGreyArrow}
                      style={styles.ViewMoreButtonIcon}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.SobreEstaParagemTextView}>
          <Text style={styles.SobreEstaParagemText}>Sobre esta paragem</Text>
        </View>
        <View style={styles.FirstContainerAdjustView}>
          <View style={styles.FirstContainerView}>
            <View style={{}}>
              <View style={styles.FirstContainerFirstView}>
                <View style={{}}>
                  <Text style={styles.FirstContainerEstadoDoPisoText}>
                    Estado do Piso
                  </Text>
                  <Text style={styles.FirstContainerEmEstadoText}>
                    Em estado razoável
                  </Text>
                </View>
              </View>
            </View>
            <View style={{}}>
              <View style={styles.FirstContainerSecondView}>
                <View style={{}}>
                  <Text style={styles.FirstContainerMaterialDoText}>
                    Material do Piso
                  </Text>
                  <Text style={styles.FirstContainerCalcadaText}>
                    Calçada Portuguesa
                  </Text>
                </View>
              </View>
            </View>
            <View style={{}}>
              <View style={styles.FirstContainerThirdView}>
                <View style={{}}>
                  <Text style={styles.FirstContainerTipoDeText}>
                    Tipo de Acesso à Paragem
                  </Text>
                  <Text style={styles.FirstContainerAcessoText}>
                    Acesso nivelado (rampa)
                  </Text>
                </View>
              </View>
            </View>
            <View style={{}}>
              <View style={styles.FirstContainerThirdLastView}>
                <View style={{}}>
                  <Text style={styles.FirstContainerEstadoDAPassadeiraText}>
                    Estado da Passadeira
                  </Text>
                  <Text style={styles.FirstContainerExistemBomText}>
                    Existe, em bom estado
                  </Text>
                </View>
              </View>
            </View>
            <View style={{}}>
              <View style={styles.FirstContainerSecondLastView}>
                <View style={{}}>
                  <Text style={styles.FirstContainerEstacioText}>
                    Estacionamento Abusivo
                  </Text>
                  <Text style={styles.FirstContainerSimText}>Sim</Text>
                </View>
              </View>
            </View>
            <View style={{}}>
              <View style={styles.FirstContainerLastView}>
                <View style={{}}>
                  <Text style={styles.FirstContainerDataDaText}>
                    Data da Última Verificação de Acessibilidade
                  </Text>
                  <Text style={styles.FirstContainerDateText}>
                    20 de Abril de 2023
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.SecondContainerAdjustView}>
          <View style={styles.SecondContainerView}>
            <View style={{}}>
              <View style={styles.SecondContainerFirstView}>
                <View style={{}}>
                  <Text style={styles.EstadoDoPainelText}>
                    Estado do Painel de Informação Real-Time
                  </Text>
                  <Text style={styles.ExisteeEstaOkText}>Existe e está OK</Text>
                </View>
              </View>
            </View>
            <View style={{}}>
              <View style={styles.SecondContainerSecondView}>
                <View style={{}}>
                  <Text style={styles.EstadoDaText}>
                    Estado da Sinalética H2OA
                  </Text>
                  <Text style={styles.ExistemEstaText}>
                    Existe mas está danificada / errada
                  </Text>
                </View>
              </View>
            </View>
            <View style={{}}>
              <View style={styles.SecondContainerSecondLastView}>
                <View style={{}}>
                  <Text style={styles.DisponibilizacaoDEText}>
                    Disponibilização de Horários
                  </Text>
                  <Text style={styles.ExistemText}>
                    Existem mas estão danificados / desatualizados
                  </Text>
                </View>
              </View>
            </View>
            <View style={{}}>
              <View style={styles.SecondContainerLastView}>
                <View style={{}}>
                  <Text style={styles.CompassDetailsDataDaText}>
                    Data da Última Verificação de Horários
                  </Text>
                  <Text style={styles.CompassDetailsDateText}>
                    20 de Abril de 2023
                  </Text>
                </View>
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
    // top: 0,
    position: 'relative',
    backgroundColor: '#FFDD00',
    width: '100%',
    padding: 20,
    // left: 0,
    // right: 0,
  },
  SearchLinesTextView: {
    paddingTop: 15,
    paddingLeft: 5,
    paddingRight: 5,
  },
  SearchLines: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 30,
  },
  SearchTextMessageTextView: {
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
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
  SearchImg: {
    height: 20,
    width: 20,
  },
  SearchInputView: {
    width: '70%',
    justifyContent: 'center',
  },
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
  },
  RecentResultsFirstRoundView: {
    width: 60,
    height: 24,
    borderRadius: 12,
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
  ModalContainer: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  ModalView: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
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
  FavouriteModalContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#e9eef7',
    width: '100%',
    right: 0,
    left: 0,
    // top:-30
    height: '50%',
  },
  ToStopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  ToStopRow: {
    flexDirection: 'row',
  },
  ToStopTextView: {
    paddingLeft: 10,
  },
  FavouriteStopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
  },
  FavouriteStopRow: {
    flexDirection: 'row',
  },
  FavouriteStopSecondContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  FavouriteStopSecondRow: {
    flexDirection: 'row',
  },
  StopSortingAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  CompassDetailsDateText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  CompassDetailsDataDaText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  SecondContainerLastView: {
    borderBottomWidth: 1,
    borderBottomColor: '#b8b1b0',
    paddingBottom: 10,
    paddingTop: 10,
  },
  ExistemText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  DisponibilizacaoDEText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  SecondContainerSecondLastView: {
    borderBottomWidth: 1,
    borderBottomColor: '#b8b1b0',
    paddingBottom: 10,
    paddingTop: 10,
  },
  ExistemEstaText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  EstadoDaText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  SecondContainerSecondView: {
    borderBottomWidth: 1,
    borderBottomColor: '#b8b1b0',
    paddingBottom: 10,
    paddingTop: 10,
  },
  ExisteeEstaOkText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  EstadoDoPainelText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  SecondContainerFirstView: {
    borderBottomWidth: 1,
    borderBottomColor: '#b8b1b0',
    paddingBottom: 10,
    paddingTop: 10,
  },
  SecondContainerView: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 10,
  },
  SecondContainerAdjustView: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  FirstContainerDateText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  FirstContainerDataDaText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  FirstContainerLastView: {
    borderBottomWidth: 1,
    borderBottomColor: '#b8b1b0',
    paddingBottom: 10,
    paddingTop: 10,
  },
  FirstContainerSimText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  FirstContainerEstacioText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',

  },
  FirstContainerSecondLastView: {
    borderBottomWidth: 1,
    borderBottomColor: '#b8b1b0',
    paddingBottom: 10,
    paddingTop: 10,
  },
  FirstContainerExistemBomText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  FirstContainerEstadoDAPassadeiraText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  FirstContainerThirdLastView: {
    borderBottomWidth: 1,
    borderBottomColor: '#b8b1b0',
    paddingBottom: 10,
    paddingTop: 10,
  },
  FirstContainerAcessoText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  FirstContainerTipoDeText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  FirstContainerThirdView: {
    borderBottomWidth: 1,
    borderBottomColor: '#b8b1b0',
    paddingBottom: 10,
    paddingTop: 10,
  },
  FirstContainerCalcadaText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  FirstContainerMaterialDoText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  FirstContainerSecondView: {
    borderBottomWidth: 1,
    borderBottomColor: '#b8b1b0',
    paddingBottom: 10,
    paddingTop: 10,
  },
  FirstContainerEmEstadoText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  FirstContainerEstadoDoPisoText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  FirstContainerFirstView: {
    borderBottomWidth: 1,
    borderBottomColor: '#b8b1b0',
    paddingBottom: 10,
    paddingTop: 10,
  },
  FirstContainerView: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 10,
  },
  FirstContainerAdjustView: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  SobreEstaParagemTextView: {
    paddingTop: 54,
    paddingLeft: 20,
    paddingRight: 20,
  },
  SobreEstaParagemText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ViewMoreButtonText: {
    color: '#969696',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  ViewMoreButtonIcon: {
    height: 10,
    width: 10,
  },
  ViewMoreButtonIconView: {
    paddingLeft: 5,
  },
  ViewMoreButton: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 10,
  },
  specificRoutesRightArrow: {
    height: 18,
    width: 11,
    tintColor: '#B9B9B9',
  },
  SpecificRoutesContainer: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 10,
  },
  SpecificRoutesAdjustView: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  DestinosAPartirText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  DestinosAPartirTextView: {
    paddingTop: 45,
    paddingLeft: 20,
    paddingRight: 20,
  },
  MapView: {
    width: '100%',
  },
  MapViewContainer: {
    paddingTop: 10,
  },
  ParagensEncontradesText: {
    color: '#E6E6E6',
    fontSize: 18,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  ParagensEncontradesTextView: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ClaudioBairroAddIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  ClaudioBairroAddIconView: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: '#00D530',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BairroDoAreiasText: {
    color: '#3C3C43',
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 20,
  },
  RClaudioText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 22,
  },
  RClaudioBairroView: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C43',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  RCravosBairroAddIconText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  RCravosBairroAddIconView: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: '#00D530',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BairroDoAreiasBarreiroText: {
    color: '#3C3C43',
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 20,
  },
  RCravosAbrilText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 22,
  },
  RCravosBarriroView: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C43',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  AvPortugalArroteiasAddIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  AvPortugalArroteiasAddIconView: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: '#00D530',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ArroteiasMoitaText: {
    color: '#3C3C43',
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 20,
  },
  AvPortugalXText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 22,
  },
  AvPortugalArroteiasView: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C43',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  LindaMoitaAddIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  LindaMoitaAddIconView: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: '#00D530',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MoitaMoitaText: {
    color: '#3C3C43',
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 20,
  },
  LindaVelheText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 22,
  },
  LindaMoitaView: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C43',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  AvDPedroAlhosAddIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  AvDPedroAlhosAddIconView: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: '#00D530',
    justifyContent: 'center',
    alignItems: 'center',
  },
  AlhosVedrosMoitaText: {
    color: '#3C3C43',
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 20,
  },
  AvDpedroText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 22,
  },
  AvDPedroAlhosView: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C43',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  AvDPedroAlhosFirstAddIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  AvDPedroVendaAddIconText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  AvDPedroAlhosFirstAddIconView: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: '#00D530',
    justifyContent: 'center',
    alignItems: 'center',
  },
  AvDPedroVendaAddIconView: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: '#00D530',
    justifyContent: 'center',
    alignItems: 'center',
  },
  VendaDoPinheiroText: {
    color: '#3C3C43',
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 20,
  },
  AvDPedro49Text: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 22,
  },
  AvPdero49VendaView: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C43',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  CalcadaPovoaAddIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  CalcadaPovoaAddIconView: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: '#00D530',
    justifyContent: 'center',
    alignItems: 'center',
  },
  PovoaDeStoText: {
    color: '#3C3C43',
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 20,
  },
  CalcadaChafarizText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 22,
  },
  CalcadaPovaoView: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C43',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  OptionsContainerView: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
  },
  OptionsContainerAdjustView: {
    paddingTop: 20,
  },
  MacIcon: {
    height: 40,
    width: 20,
  },
  MacIconView: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SearchTextField: {
    color: '#c7c9c8',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#000',
  },
  SearchTextFieldView: {
    width: '70%',
    justifyContent: 'center',
  },
  SearchIconImage: {
    height: 20,
    width: 20,
  },
  SearchIconView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  SearchView: {
    backgroundColor: '#3C3C43',
    width: '100%',
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    opacity: 0.2,
  },
  SecondModalViewContainerAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  SecondModalMapImage: {
    width: '100%',
    height: 245,
  },
  SecondModalSelecionarParagemText: {
    color: '#000',
    fontSize: 34,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  SecondModalSelecionarParagemTextView: {
    paddingLeft: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  SecondModalEditarCartaoText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    paddingLeft: 3,
  },
  SecondModalLeftArrow: {
    height: 17,
    width: 22,
  },
  SecondModalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  FirstModalEliminarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  FirstModalEliminarButton: {
    borderRadius: 12,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF0000',
  },
  FirstModalEliminarButtonView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  FirstModalGuardarButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  FirstModalGuardarButton: {
    borderRadius: 12,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006EFF',
  },
  FirstModalGuardarButtonAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  ReceberNotificacoesText: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ReceberNotificacoesTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  ReceberNotificacoesAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  ReceberNotificacoesSempreText: {
    color: '#969696',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  AtivarNotificacoesText: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  AtivarRecberNotificacoesView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  ThirdDestinationGreenTickIcon: {
    height: 40,
    width: 40,
  },
  ThirdDestinationGreenTickIconView: {
    right: -10,
  },
  ThirdDestinationDescriptionText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  ThirdDestinationTitleText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  ThirdDestinationTitleTextView: {
    width: 60,
    height: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  SecondDestinationGreenTickIcon: {
    height: 40,
    width: 40,
  },
  SecondDestinationGreenTickIconView: {
    right: -10,
  },
  SecondDestinationDescriptionText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  SecondDestinationTitleText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  SecondDestinationTitleTextView: {
    width: 60,
    height: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  FirstDestinationGreenTickIconView: {
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  FirstDestinationDescriptionText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  FirstDestinationTitleText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  FirstDestinationTitleTextView: {
    width: 60,
    height: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  FirstModalDestinationContainer: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  EscolhaQuaisText: {
    color: '#969696',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  SelecionarDestinosText: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  DestinationAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  SearchInputIconView: {
    height: 10,
    width: 10,
  },
  SearchInputIconViewMain: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FirstModalSearchInput: {
    color: '#969696',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  FirstModalSearchInputView: {
    width: '70%',
  },
  SearchInputSearchIcon: {
    height: 20,
    width: 20,
  },
  SearchInputSearchIconView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  SearchViewMain: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
  },
  SearchViewMainAdjustView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  EscolhaUmaText: {
    color: '#969696',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  FirstModalSelecionarParagemText: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  FirstModalParagemFavoritaText: {
    color: '#000',
    fontSize: 34,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  FirstModalParagemFavoritaTextView: {
    paddingLeft: 20,
    paddingTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#7d7e80',
    paddingBottom: 10,
  },
  FirstModalPersonalizerText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    paddingLeft: 3,
  },
  FirstModalLeftArrowIcon: {
    height: 17,
    width: 22,
  },
  FirstModalLeftArrowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  CompassDetailsWarningIcon: {
    height: 24,
    width: 24,
  },
  CompassDetailsWarningButton: {
    height: 50,
    width: 50,
    backgroundColor: '#fff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CompassDetailsMapLineButtonIcon: {
    height: 24,
    width: 24,
  },
  CompassDetailsMapLineButton: {
    height: 50,
    width: 50,
    backgroundColor: '#fff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CompassDetailsMapLineButtonView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  CompassDetailsStarImageOutLineIcon: {
    height: 24,
    width: 24,
    tintColor: '#FFC800',
  },
  CompassDetailsStarImageOutLineButton: {
    height: 50,
    width: 50,
    backgroundColor: '#fff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CompassDetailsStarAndWarningButtonView: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  CompassDetailsPlaceText: {
    color: '#787878',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  CompassDetailsPlaceTextView: {paddingTop: 5},
  CompassDetailsModalDataName: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  CompassDetailsModalDataNameTextView: {paddingTop: 9},
  CompassDetailsModalDataLon: {
    color: '#787878',
    fontSize: 10,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  CompassDetailsModalDataLat: {
    color: '#787878',
    fontSize: 10,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  CompassDetailsModalDataLatView: {paddingRight: 5},
  CompassDetailsModalDataLonLat: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 20,
  },
  CompassDetailsModalDataIdText: {
    color: '#787878',
    fontSize: 10,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  CompassDetailsModalDataIDTextView: {
    width: 50,
    height: 15,
    borderWidth: 1,
    borderColor: '#787878',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CompassDetailsModalDataIdLatLonView: {flexDirection: 'row', paddingTop: 20},
  CompassDetailsModalDataUploadIcon: {
    height: 20,
    width: 20,
    tintColor: '#5073FF',
  },
  CompassDetailsModalDataParagemText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',

  },
  CompassDetailsModalDataMapaText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
  },
  CompassDetailsModalDataMapaTextView: {paddingLeft: 5},
  CompassDetailsModalDataMapaLeftArrowIcon: {height: 17, width: 22},
  CompassDetailsModalDataMapaTextLeftArrowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ContainerInner: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Container: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingTop: 20,
    paddingBottom: 20,
  },
  ContainerAdjustView: {paddingLeft: 20, paddingRight: 20},
});
export default CompassDetails;
