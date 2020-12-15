import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    ScrollView,
    Dimensions,
    Modal
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';
import { AuthContext } from '../components/context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {fbApp} from "../firebaseconfig";
import "firebase/auth";

const {height,width}=Dimensions.get("screen");



const SignUp1 = (navigation) => {

  const [data, setData] = React.useState({
    username: '',
    password: '',
    phone:'',
    fullname:'',
    Createby:"User",
    CreateDate:"06/11/2020",
    Status:"true",
    UserID:"",
    Avatar:"https://i.ibb.co/HDzz1rC/avartarnone.png",
    check_textInputChange: false,
    check_textInputChange1: false, 
    check_textInputChange2: false, 
    check_textInputChange3: false, 
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    modalVisible:false,
    modalVisibleWarning:false,
    textAlert:''
});
const { signUp } = React.useContext(AuthContext);

const GetCurrentDate =()=>{
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1; 
    var year = new Date().getFullYear();
    setData({
        ...data,
        CreateDate: date + '/' +month+ "/" +year 
    }); 
}

const textInputChange2 = (val) => {
    if( val.length !== 0 ) {
        setData({
            ...data,
            phone: val,
            check_textInputChange2: true
        });
    } else {
        setData({
            ...data,
            phone: val,
            check_textInputChange2: false
        });
    }
  }

const textInputChange = (val) => {
  if( val.length !==0 ) {
      setData({
          ...data,
          fullname: val,
          check_textInputChange: true
      });
  } else {
      setData({
          ...data,
          fullname: val,
          check_textInputChange: false
      });
  }
}
const textInputChange1 = (val) => {
    if( val.length >= 6 ) {
        setData({
            ...data,
            username: val,
            check_textInputChange1: true,
            isValidUser: true
        });
    } else {
        setData({
            ...data,
            username: val,
            check_textInputChange1: false,
            isValidUser: false
        });
    }
  }

const handlePasswordChange = (val) => {
    if( val.length >= 6 ) {
        setData({
            ...data,
            password: val,
            check_textInputChange3: true,
            isValidPassword: true
        });
    } else{
        setData({
            ...data,
            password: val,
            check_textInputChange3: false,
            isValidPassword: false
        });
    }
}

const updateSecureTextEntry = () => {
  setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
  });
}
const setModalVisible = async(visible,text) => {
    await(setData({ ...data,
      modalVisible: visible,
      textAlert:text },setTimeout(handleClose,2000)));
      signUp();
};
const setModalVisibleWarning = (visible,text) => {
  setData({ ...data,
    modalVisibleWarning: visible,
    textAlert:text },setTimeout(handleClose,2000));
};
const handleClose = () => {
  setData({  ...data,
    modalVisible: false,
    modalVisibleWarning:false
  });
};
const registerHandle = () => {
    if ( data.username.length <6 || data.password.length <6 || data.fullname.length == 0 
        || data.phone.length == 0) {
            setModalVisibleWarning(true,"Quý khách chưa điền đầy đủ thông tin");
        return;
    }
    GetCurrentDate();
    fbApp
    .auth()
    .createUserWithEmailAndPassword(data.phone,data.password)
    .then(() =>{
        fbApp.database().ref("Users").child(fbApp.auth().currentUser.uid).set({
            FullName: data.fullname,
            CreatedDate: data.CreateDate,
            CreatedBy: data.Createby,
            Status: data.Status,
            UserID: fbApp.auth().currentUser.uid,
            Passwords:data.password,
            Email:data.phone,
            Avatar:data.Avatar,
            UserName:data.username
        });
        setModalVisible(true,"Đăng kí thành công");
    })
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        setModalVisibleWarning(true,"Quý khách vui lòng kiểm tra lại Internet");              
        return;
    });   
}
    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#1ba8ff' barStyle="light-content"/>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <ScrollView >
            <Text style={styles.text_footer}>Họ tên</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Họ tên"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>


            <Text style={[styles.text_footer, {
                            marginTop: 10
                        }]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Email"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange2(val)}
                />
                {data.check_textInputChange2 ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>


            <Text style={[styles.text_footer, {
                            marginTop: 10
                        }]}>Tài khoản</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Tài khoản"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange1(val)}
                />
                {data.check_textInputChange1 ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            { data.isValidUser ? null : 
          <Animatable.View animation="fadeInLeft" duration={500}>
          <Text style={styles.errorMsg}>Tài khoản ít nhất 6 kí tự</Text>
          </Animatable.View>
          }

            <Text style={[styles.text_footer, {
                marginTop: 10
            }]}>Mật khẩu</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Mật khẩu"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                 {data.check_textInputChange3 ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                        style={{marginRight:5}}
                    />
                </Animatable.View>
                : null}
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            { data.isValidPassword ? null : 
          <Animatable.View animation="fadeInLeft" duration={500}>
          <Text style={styles.errorMsg}>Mật khẩu ít nhất 6 kí tự</Text>
          </Animatable.View>
          }
           
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => {registerHandle()}}
                >
                <LinearGradient
                      colors={['red', 'red']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Đăng kí</Text>
                </LinearGradient>
                </TouchableOpacity>

            </View>
            </ScrollView>
        </Animatable.View>
        <Modal
                  animationType="fade"
                  transparent={true}
                  visible={data.modalVisible}
                
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                  }}
               >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <FontAwesome5 name="grin-beam" size={40} color="#a2459a"/>
                      <Text style={styles.modalText}>{data.textAlert}</Text>
                    </View>
                  </View>
             </Modal>  
             <Modal
                  animationType="fade"
                  transparent={true}
                  visible={data.modalVisibleWarning}
                
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                  }}
               >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <FontAwesome5 name="grin-beam-sweat" size={40} color="red"/>
                      <Text style={styles.modalText1}>{data.textAlert}</Text>
                    </View>
                  </View>
             </Modal>  
      </View>
    );
};

export default SignUp1;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#1ba8ff',
  },
  header: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 50
  },
  footer: {
      flex: 3,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 30,
      margin: height / 100
  },
  text_header: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 30
  },
  text_footer: {
      color: 'black',
      fontSize: 18
  },
  action: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      paddingBottom: 5
  },
  actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5
  },
   textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#000',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
  button: {
      alignItems: 'center',
      marginTop: 50
  },
  signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
  },
  textSign: {
      fontSize: 18,
      fontWeight: 'bold'
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent:'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize:20,
    color:'#a2459a'
  },
  modalText1: {
    marginBottom: 15,
    textAlign: "center",
    fontSize:20,
    color:'red'
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    flex:1
  },
});