import {
  StyleSheet, Text, View,
  Image, Dimensions, TouchableOpacity
}
  from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../utils/Colors'
import CustomTextInput from '../components/CustomTextInput'
import LinearGradient from 'react-native-linear-gradient'
import { BASE_URL, REGISTER_USER } from '../utils/Strings'
import Loader from '../components/Loader'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux'
import { setAuthData } from '../redux/AuthSlice'

const Signup = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [mobile, setMobile] = useState('');
  const [badMobile, setBadMobile] = useState('');
  const [badEmail, setBadEmail] = useState('');
  const [badPassword, setBadPassword] = useState('');
  const [badUserName, setBadUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedGender, setSelectedGender] = useState(0);

  const validate = () => {
    let isvalid = false;
    if (email == '') {
      setBadEmail('Please Enter Email');
      isvalid = false;
    } else if (email != '' && !email.toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
      setBadEmail('Please Enter valid Email');
      isvalid = false;
    } else if (email != '' && email.toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
      setBadEmail('');
      isvalid = true;
    }


    if (password == '') {
      setBadPassword('please Enter Password');
      isvalid = false;
    } else if (password != '' && password.length < 6) {
      setBadPassword('please Enter Min 6 Character Password');
      isvalid = false;
    } else if (password != '' && password.length > 5) {
      setBadPassword('');
      isvalid = true;
    }


    if (userName == '') {
      setBadUserName('Please Enter UserName');
      isvalid = false;
    } else if (userName != '') {
      setBadUserName('');
      isvalid = true;
    }


    if (mobile == '') {
      setBadMobile('Please Enter Mobile No');
      isvalid = false;
    } else if (mobile != '' && mobile.length < 11) {
      setBadMobile('Please Enter valid Mobile No');
      isvalid = false;
    } else if (mobile != '' && mobile.length == 11) {
      setBadMobile('');
      isvalid = true;
    }

    return isvalid;
  };
  // console.log(BASE_URL + Login_USER)
  const signup = () => {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");
    fetch(BASE_URL + REGISTER_USER, {
      body: JSON.stringify({
        emailId: email,
        password: password,
        //password
        username: userName,
        mobile: mobile,
        gender: selectedGender == 0 ? 'Male' : 'Female'
      }),
      method: "post",
      headers: myHeaders,
    }).then(res => res.json()).then(json => {
      setLoading(false);
      if (json) {
        dispatch(setAuthData(json));
      }

      console.log(json)
      navigation.navigate('Main');

    }).catch(err => {
      setLoading(false);
      console.log(err);
    })
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={require("../images/icon.png")} style={styles.logo} />
      <Text style={[styles.welcomeTxt, { marginTop: 30 }]}>Create Account</Text>
      <Text style={[styles.welcomeTxt, { marginTop: 10 }]}>
        in <Text style={styles.welcomeTxt2}>Social</Text></Text>

      <CustomTextInput
        placeholder={"Enter Name"}
        value={userName}
        onChangeText={setUserName}
        isValid={badUserName == '' ? true : false}
      />
      <View style={styles.errorBox}>
        {badUserName != '' && <Text style={styles.errorTxt}>{badUserName}</Text>}
      </View>
      <CustomTextInput
        placeholder={"Enter Email"}
        value={email}
        onChangeText={setEmail}
        isValid={badEmail == '' ? true : false}
      />
      {badEmail != '' && <Text style={styles.errorTxt}>{badEmail}</Text>}
      <CustomTextInput
        placeholder={"Enter Mobile"}
        value={mobile}
        onChangeText={setMobile}
        isValid={badMobile == '' ? true : false}
        keyboardType={'number-pad'}
      />
      {badMobile != '' && <Text style={styles.errorTxt}>{badMobile}</Text>}

      <Text style={styles.heading}>Select Gender </Text>
      <View style={styles.genderView}>
        <TouchableOpacity style={[styles.genderBtn,
        { borderColor: selectedGender == 0 ? "green" : '#9e9e9e' }]}
          onPress={() => {
            setSelectedGender(0);
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#000' }}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.genderBtn,
        { borderColor: selectedGender == 1 ? "green" : '#9e9e9e' }]}
          onPress={() => {
            setSelectedGender(1);
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#000' }}>Female</Text>
        </TouchableOpacity>
      </View>
      <CustomTextInput
        placeholder={"Enter password"}
        value={password}
        onChangeText={setPassword}
        isValid={badPassword == '' ? true : false}
      />
      {badPassword != '' && <Text style={styles.errorTxt}>{badPassword}</Text>}

      <LinearGradient colors={[Colors.THEME_COLOR, Colors.THEME_COLOR2]}
        style={styles.btn}>
        <TouchableOpacity style={[styles.btn,
        { justifyContent: 'center', alignItems: 'center', marginTop: 0 }]}
          onPress={() => {
            if (validate()) {
              signup();
            }
          }}
        >
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>
      </LinearGradient>
      <Text style={styles.signUpText} onPress={() => {
        navigation.navigate('Login')
      }}>
        Already have Account?  <Text style={styles.signUp}>Login</Text>
      </Text>
      <Loader visible={loading} />
    </ScrollView>
  )
}

export default Signup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR
  },
  logo: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    marginTop: Dimensions.get('window').height / 10,
  },
  welcomeTxt: {
    color: Colors.TEXT_COLOR,
    fontSize: 30,
    fontWeight: "500",
    alignSelf: 'center'
  },
  welcomeTxt2: {
    color: Colors.THEME_COLOR
  },
  btn: {
    width: "90%",
    height: 55,
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 10
  },
  btnText: {
    color: Colors.BG_COLOR,
    fontSize: 20,
    fontWeight: '600'
  },
  errorTxt: {
    color: 'red',
    marginTop: 5
  },
  signUpText: {
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 40,
    fontWeight: '500',
    marginBottom: 100,
    color: '#000'
  },
  signUp: {
    color: Colors.THEME_COLOR,
    fontWeight: '700'
  },
  heading: {
    color: Colors.TEXT_COLOR,
    marginTop: 20,
    marginLeft: 30
  },
  genderView: {
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    marginTop: 20
  },
  errorBox: {
    width: '100%'
  },
  genderBtn: {
    width: '45%',
    height: 100,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
})