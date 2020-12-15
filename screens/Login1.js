
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
    Image,
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
const Login1 = ({navigation}) => {
    const [data, setData] = React.useState({
        username: '',
        password: '',
        email:'',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        modalVisibleWarning:false,
        textAlert:''
    });

    const { colors } = useTheme();
    const { signIn } = React.useContext(AuthContext);

    const textInputChange = (val) => {
        if( val.trim().length >= 6 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if( val.trim().length >= 6
         ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
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

    const handleValidUser = (val) => {
        if( val.trim().length >= 6 ) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }
    const setModalVisibleWarning = (visible,text) => {
        setData({ ...data,
          modalVisibleWarning: visible,
          textAlert:text },setTimeout(handleClose,2000));
    };
      const handleClose = () => {
        setData({  ...data,
          modalVisibleWarning:false
        });
      };

    const loginHandle = (userName, password) => {
        if ( data.username.length < 6 || data.password.length <6 ) {
            setModalVisibleWarning(true,"Quý khách chưa nhập đầy đủ thông tin");
            return;
        }
        fbApp.database().ref('Users').on('value',snapshot=>{
            var temp = false;
            snapshot.forEach((child)=>{
                if(child.val().UserName==userName) {
                    temp= true;
                    if(child.val().Passwords==password){
                        fbApp.auth().signInWithEmailAndPassword(child.val().Email,password)
                        .then(()=> signIn())
                        .catch(function(error) {
                            setModalVisibleWarning(true,"Quý khách vui lòng kiểm tra lại Internet");         
                            return;
                        });      
                    }else{
                        setModalVisibleWarning(true,"Mật khẩu không chính xác");
                    }    
                }
            })
            if(temp==false){
                setModalVisibleWarning(true,"Tài khoản không tồn tại");
            }
        });                              
    }
    
    return (
        <View style={styles.container}>
        <StatusBar backgroundColor='#1ba8ff' barStyle="light-content"/>
      <Animatable.View 
          animation="fadeInUpBig"
          style={[styles.footer, {
              backgroundColor: colors.background
          }]}
      >
          <Text style={[styles.text_footer, {
              color: colors.text
          }]}>Tài khoản</Text>
          <View style={styles.action}>
              <FontAwesome 
                  name="user-o"
                  color={colors.text}
                  size={20}
              />
              <TextInput 
                  placeholder="Tài khoản"
                  placeholderTextColor="#666666"
                  style={[styles.textInput, {
                      color: colors.text
                  }]}
                  autoCapitalize="none"
                  onChangeText={(val) => textInputChange(val)}
                  onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
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
          { data.isValidUser ? null : 
          <Animatable.View animation="fadeInLeft" duration={500}>
          <Text style={styles.errorMsg}>Tài khoản ít nhất 6 kí tự</Text>
          </Animatable.View>
          }
          

          <Text style={[styles.text_footer, {
              color: colors.text,
              marginTop: 35
          }]}>Mật khẩu</Text>
          <View style={styles.action}>
              <Feather 
                  name="lock"
                  color={colors.text}
                  size={20}
              />
              <TextInput 
                  placeholder="Mật khẩu"
                  placeholderTextColor="#666666"
                  secureTextEntry={data.secureTextEntry ? true : false}
                  style={[styles.textInput, {
                      color: colors.text
                  }]}
                  autoCapitalize="none"
                  onChangeText={(val) => handlePasswordChange(val)}
              />
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
          <TouchableOpacity
                onPress={()=> fbApp.auth().sendPasswordResetEmail}                   
          >
              <Text style={{color: '#009387', marginTop:15}}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <View style={styles.button}>
              <TouchableOpacity
                  style={styles.signIn}
                  onPress={() => {loginHandle( data.username, data.password )}}
              >
              <LinearGradient
                    colors={['red', 'red']}
                  style={styles.signIn}
              >
                  <Text style={[styles.textSign, {
                      color:'#fff'
                  }]}>Đăng nhập</Text>
              </LinearGradient>
              </TouchableOpacity>
          </View>         
      </Animatable.View>
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

export default Login1;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#1ba8ff'
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
        color: '#1ba8ff',
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
        color: '#1ba8ff',
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