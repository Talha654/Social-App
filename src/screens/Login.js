import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity }
  from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../utils/Colors'
import CustomTextInput from '../components/CustomTextInput'
import LinearGradient from 'react-native-linear-gradient'
import { BASE_URL, Login_USER } from '../utils/Strings'
import Loader from '../components/Loader'
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux'
import { setAuthData } from '../redux/AuthSlice'

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badEmail, setBadEmail] = useState('');
  const [badPassword, setBadPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

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
    return isvalid;
  };
  // console.log(BASE_URL + Login_USER)
  const login = () => {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");
    fetch(BASE_URL + Login_USER, {
      body: JSON.stringify({
        emailId: email,
        password: password
      }),
      method: "post",
      headers: myHeaders,
    }).then(res => res.json()).then(json => {
      setLoading(false);
      if (!json.status) {
        if (json.messgae == 'Wrong password') {
          setBadPassword(json.messgae);
          console.log(json.messgae);
        } else {
          setBadEmail(json.messgae);
          console.log(json.messgae);
        }
      } else {
        dispatch(setAuthData(json));
        navigation.navigate('Main');
      }
      console.log(json)
    }).catch(err => {
      setLoading(false);
      console.log(err);
    })
  };

  return (
    <View style={styles.container}>
      <Image source={require("../images/icon.png")} style={styles.logo} />
      <Text style={[styles.welcomeTxt, { marginTop: 30 }]}>Welcome Back</Text>
      <Text style={[styles.welcomeTxt, { marginTop: 10 }]}>
        to <Text style={styles.welcomeTxt2}>Social</Text></Text>

      <CustomTextInput
        placeholder={"Enter Email"}
        value={email}
        onChangeText={setEmail}
        isValid={badEmail == '' ? true : false}
      />
      {badEmail != '' && <Text style={styles.errorTxt}>{badEmail}</Text>}
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
              login();
            }
          }}
        >
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
      </LinearGradient>
      <Text style={styles.signUpText} onPress={() => {
        navigation.navigate('Signup')
      }}>
        Create new Account?   <Text style={styles.signUp}>Sign up</Text>
      </Text>
      <Loader visible={loading} />
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR
  },
  logo: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    marginTop: Dimensions.get('window').height / 8,
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
    marginLeft: 30,
    marginTop: 5
  },
  signUpText: {
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 40,
    fontWeight: '500',
    color:'#000'
  },
  signUp: {
    color: Colors.THEME_COLOR,
    fontWeight: '700'
  }
})