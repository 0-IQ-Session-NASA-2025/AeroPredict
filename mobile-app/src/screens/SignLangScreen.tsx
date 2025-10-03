import React, {useState, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import {Fonts} from '../constants/Fonts';
// import AppLoading from 'expo-app-loading';
// import {useFonts} from '@use-expo/font';
import {images} from '../constants/Images';
import {useAirPollution} from '../contexts/AirPollutionContext';

const {width, height} = Dimensions.get('window');

const SignLangScreen = () => {
  // let [fontsLoaded] = useFonts(Fonts);
  let [fontsLoaded] = useState(true);
  const [text, setText] = useState('');
  const [playing, setPlaying] = useState(false);
  const [counterPlayed, setCounterPlayed] = useState(0);
  const {airPollutionData} = useAirPollution();

  const renderTranslationCards = () => {
    return airPollutionData.predictionText.split('').map((letter, idx) => {
      // Skip spaces and non-alphabetic characters
      if (letter === ' ' || !/[A-Z]/i.test(letter)) {
        return (
          <View
            key={idx}
            style={{
              width: width * 0.45,
              height: width * 0.55,
              margin: 8,
              marginHorizontal: 12,
              borderRadius: 16,
              backgroundColor: '#F3F4F6',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}>
            <Text
              style={{
                fontFamily: 'Bold',
                fontSize: 24,
                color: '#6B7280',
              }}>
              {letter === ' ' ? 'SPACE' : letter}
            </Text>
          </View>
        );
      }

      const imageUrl = images[letter.toUpperCase() as keyof typeof images];
      return (
        <View
          key={idx}
          style={{
            width: width * 0.45,
            height: width * 0.55,
            margin: 8,
            marginHorizontal: 12,
            borderRadius: 16,
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#E5E7EB',
          }}>
          <Image
            style={{
              width: width * 0.35,
              height: width * 0.35,
              resizeMode: 'contain',
              marginBottom: 12,
            }}
            source={imageUrl}
          />
          <Text
            style={{
              fontFamily: 'Bold',
              fontSize: 28,
              color: '#1F2937',
              fontWeight: '700',
            }}>
            {letter.toUpperCase()}
          </Text>
        </View>
      );
    });
  };

  const renderTranslationSlideShow = () => {
    const currentLetter =
      airPollutionData.predictionText.split('')[
        counterPlayed % airPollutionData.predictionText.length
      ];
    const isNonAlphabetic =
      currentLetter === ' ' || !/[A-Z]/i.test(currentLetter);

    if (isNonAlphabetic) {
      return (
        <View
          style={{
            width: width * 0.7,
            height: width * 0.8,
            margin: 20,
            borderRadius: 24,
            backgroundColor: '#F3F4F6',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: '#9CA3AF',
          }}>
          <Text
            style={{
              fontFamily: 'Bold',
              fontSize: 48,
              color: '#6B7280',
              fontWeight: '800',
            }}>
            {currentLetter === ' ' ? 'SPACE' : currentLetter}
          </Text>
        </View>
      );
    }

    const imageUrl = images[currentLetter.toUpperCase() as keyof typeof images];
    return (
      <View
        style={{
          width: width * 0.7,
          height: width * 0.8,
          margin: 20,
          borderRadius: 24,
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 12,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: '#3B82F6',
        }}>
        <Image
          style={{
            width: width * 0.5,
            height: width * 0.5,
            resizeMode: 'contain',
            marginBottom: 16,
          }}
          source={imageUrl}
        />
        <Text
          style={{
            fontFamily: 'Bold',
            fontSize: 32,
            color: '#1F2937',
            fontWeight: '800',
          }}>
          {currentLetter.toUpperCase()}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    const intervalID = setTimeout(() => {
      console.log('==============');
      console.log('currently playing... counter at ' + counterPlayed);
      console.log('length of text:', airPollutionData.predictionText.length);
      if (counterPlayed >= airPollutionData.predictionText.length - 1) {
        setPlaying(false);
      } else {
        setCounterPlayed(counterPlayed + 1);
      }
    }, 1000);

    return () => clearInterval(intervalID);
  }, [counterPlayed, playing]);

  const renderTranslationSlider = () => {
    return (
      <View style={{alignItems: 'center', paddingVertical: 20}}>
        {playing ? (
          <View style={{alignItems: 'center'}}>
            {renderTranslationSlideShow()}
            <View
              style={{
                backgroundColor: '#F3F4F6',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginTop: 16,
              }}>
              <Text
                style={{
                  fontFamily: 'Medium',
                  fontSize: 14,
                  color: '#6B7280',
                  textAlign: 'center',
                }}>
                {counterPlayed + 1} / {airPollutionData.predictionText.length}
              </Text>
            </View>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}>
            {renderTranslationCards()}
          </ScrollView>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: playing ? '#EF4444' : '#3B82F6',
            paddingVertical: 16,
            paddingHorizontal: 40,
            borderRadius: 25,
            marginTop: 24,
            minWidth: width * 0.4,
            shadowColor: playing ? '#EF4444' : '#3B82F6',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={() => {
            setCounterPlayed(0);
            setPlaying(!playing);
          }}>
          <Text
            style={{
              fontFamily: 'Bold',
              fontSize: 16,
              textAlign: 'center',
              color: '#FFFFFF',
              fontWeight: '600',
            }}>
            {playing ? '⏹ Stop' : '▶ Play'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!fontsLoaded) {
    // return <AppLoading />;
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading app...</Text>
      </View>
    );
  } else {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#F8FAFC',
        }}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}>
          <View
            style={{
              marginTop: 60,
              marginHorizontal: 24,
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
            <View
              style={{
                alignItems: 'center',
                marginBottom: 24,
              }}>
              <Text
                style={{
                  fontFamily: 'Bold',
                  fontSize: 28,
                  marginBottom: 8,
                  color: '#1F2937',
                  textAlign: 'center',
                }}>
                Sign Language Translator
              </Text>
              <Text
                style={{
                  fontFamily: 'Regular',
                  fontSize: 16,
                  color: '#6B7280',
                  textAlign: 'center',
                  lineHeight: 24,
                  marginTop: 10,
                }}>
                {airPollutionData.predictionText}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 24,
              marginHorizontal: 24,
            }}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}>
              <Text
                style={{
                  fontFamily: 'Bold',
                  fontSize: 20,
                  marginBottom: 20,
                  color: '#1F2937',
                  textAlign: 'center',
                }}>
                Translation Results
              </Text>
              {airPollutionData.predictionText.length > 0 ? (
                renderTranslationSlider()
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 60,
                  }}>
                  <View
                    style={{
                      backgroundColor: '#F3F4F6',
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: 32,
                      }}>
                      📝
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

export default SignLangScreen;
