import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Import Supported Contents
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar, Alert, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Icons, Images and Colors 
import { icons, images } from '../../../constants';
import colors from '../../../constants/colors';
import { verifyResetCode } from '../../../src/services/api';

const Code = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  
  // Create refs array for each input
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      Alert.alert('Error', 'Please enter the 4-digit code');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyResetCode(email as string, fullCode);
      if (result.success) {
        router.push({
          pathname: '/new',
          params: { token: result.token }
        });
      } else {
        Alert.alert('Error', result.error || 'Verification failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);
    
    // Auto-focus next input if a digit was entered
    if (numericText && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit if last digit entered
    if (index === 3 && numericText) {
      handleVerify();
    }
  };

  const handleKeyPress = ({ nativeEvent }: any, index: number) => {
    // Handle backspace to move to previous input
    if (nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    // Implement resend logic here if needed
    Alert.alert('Code Resent', 'A new code has been sent to your email');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.header}>
          <Image source={icons.back} style={styles.smlicon} tintColor={colors.black} />
        </TouchableOpacity>

        <View style={styles.body}>
          <Text style={styles.bodytext}>Enter your 4 digit code</Text>
          <Text style={styles.bodysubtext}>Please check your email and enter your 4 digit code</Text>
        </View>

        <View style={styles.digits}>
          {[0, 1, 2, 3].map((index) => (
            <TextInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={code[index]}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress({ nativeEvent }, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              style={[
                styles.input,
                focusedIndex === index && styles.selectedinput
              ]}
              placeholder="•"
              placeholderTextColor={colors.grey}
              keyboardType="number-pad"
              maxLength={1}
              textContentType="oneTimeCode" // iOS autofill
              autoComplete="one-time-code" // Android autofill
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleResend} style={styles.resend}>
          <Text style={styles.sendtext}>
            Didn't receive a code? <Text style={styles.sendsub}>Resend</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading}
          style={[styles.button, loading && styles.disabledbutton]}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttontext}>Verify</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  safeArea: {
    height: '100%',
    backgroundColor: colors.white,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  /* Header */

  header: {
    width: '80%',
    marginTop: 50,
    marginBottom: 50,
  },

  /* Body */

  body: {
    flexDirection: 'column',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    gap: 20,
    marginBottom: 45,
  },

  bodytext: {
    fontSize: 25,
    fontFamily: 'SF-Pro-Display-Bold',
    color: colors.black,
    textAlign: 'center',
  },

  bodysubtext: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Display-Regular',
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 25,
  },

  /* Text */

  digits: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
  },

  input: {
    width: 60,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },

  selectedinput: {
    width: 60,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },

  /* Button */

  button: {
    position: 'relative',
    width: '80%',
    top: 350,
    backgroundColor: colors.red,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginTop: 40,
    marginBottom: 2,
    alignItems: 'center',
    textAlign: 'center',
  },

  buttontext: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Display-Regular',
    color: colors.white,
  },

  /* Resend */

  resend: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  sendtext: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Display-Regular',
    color: colors.black,
  },

  sendsub: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.red,
  },


  /* Images and Icons */

  smlicon: {
    width: 30,
    height: 30,
  },

});

export default Code;