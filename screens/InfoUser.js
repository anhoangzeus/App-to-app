import React, { useState, useEffect} from 'react';
import {StyleSheet, View, Text,Alert,
   StatusBar,Image, Dimensions, ScrollView,Button,TextInput,CheckBox,Modal,FlatList,TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {fbApp} from "../firebaseconfig";
import "firebase/auth";
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import{ AuthContext } from '../components/context';
import { colors } from 'react-native-elements';

const { width, height } = Dimensions.get('screen');
const InfoUser =({navigation}) =>  {
  const [isSelected, setSelection] = useState(false);
  const [data, setData] = React.useState({
    pass:'',
    oldpass:'',
    password: '',
    comfirm_pass:'',
    FullName:'',
    Phone:'',
    CMND:'',
    check_textInputFullName: true,
    check_textInputSDT: true, 
    check_textInputCMND: true,
    check_textInputOldpass: true,
    check_textInputNewpass: true,
    check_textInputComfim:  true,
    secureTextOld: true,
    secureTextNew: true,
    secureTextConfirm: true,
    modalVisible:false,
    modalVisibleWarning:false,
    textAlert:''
});
const { signOut } = React.useContext(AuthContext);

const  LogOut = () => {
  try {
      fbApp.auth().signOut();
      signOut();
  } catch(e) {
  }
}  
const updateSecureTextEntryOld = () => {
  setData({
      ...data,
      secureTextOld: !data.secureTextOld
  });
}
const updateSecureTextEntryNew = () => {
  setData({
      ...data,
      secureTextNew: !data.secureTextNew
  });
}
const updateSecureTextEntryConfirm = () => {
  setData({
      ...data,
      secureTextConfirm: !data.secureTextConfirm
  });
}
const textInputOldPass = (val) => {
  if( val.trim().length > 0 ) {
    setData({
      ...data,
      oldpass: val,
      check_textInputOldpass: true,
    });
  } else {
      setData({
          ...data,
          oldpass: val,
          check_textInputOldpass: false,
      });
  }
}
const textInputNewPass = (val) => {
  if( val.trim().length >= 6 ) {
    if(val.trim() == data.comfirm_pass){
      setData({
        ...data,
        password: val,
        check_textInputNewpass: true,
        check_textInputComfim: true,
      });
    }else{
      setData({
        ...data,
        password: val,
        check_textInputComfim: false,
        check_textInputNewpass: true,
    });
    }   
  } else {
    setData({
          ...data,
          password: val,
          check_textInputNewpass: false,
    });
  }
}
const textInputConfirm = (val) => {
  if( val.trim().length > 0 ) {
        if(val.trim() == data.password)
        {
          setData({
            ...data,
            comfirm_pass: val,
            check_textInputComfim: true,
          });
        }else{
          setData({
            ...data,
            comfirm_pass: val,
            check_textInputComfim: false,
        });
        }
  } else {
      setData({
          ...data,
          comfirm_pass: val,
          check_textInputComfim: false,
      });
  }
}

const textInputFullName = (val) => {
  if( val.trim().length > 0 ) {
      setData({
          ...data,
          FullName: val,
          check_textInputFullName: true,
      });
  } else {
      setData({
          ...data,
          FullNames: val,
          check_textInputFullName: false,
      });
  }
}
const textInputCMND = (val) => {
    setData({
      ...data,
      CMND: val,
  });
}
const textInputPhone = (val) => {

  if( val.trim().length > 0 ) {
      setData({
          ...data,
          Phone: val,
          check_textInputSDT: true,
      });
  } else {
      setData({
          ...data,
          Phone: val,
          check_textInputSDT: false,
      });
  }
}

const GetCurrentDate =()=>{
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1; 
  var year = new Date().getFullYear();
  var gio = new Date().getHours();
  var phut = new Date().getMinutes();
  var giay = new Date().getSeconds();
    return date + '/' +month+ "/" +year + " " + gio+":"+ phut+":"+giay;

}

const saveChangesHandle = () => {
  var date = GetCurrentDate();
  if(isSelected == false)
  {
    if ( data.FullName.length <= 1 || data.Phone.length  <= 1 ) {
      setModalVisibleWarning(true,"Bạn chưa điền đầy đủ thông tin")
      return;    
    }
    if(fbApp.auth().currentUser.uid!=null){
      fbApp.database().ref('Users').child(fbApp.auth().currentUser.uid).update({
        FullName:data.FullName,
        Phone:data.Phone,
        CMND:data.CMND,
        ModifiedBy:"User",
        ModifiedDate:date
      }).then(
        setModalVisible(true,"Thay đổi thành công")
      ).catch()
    }else{
      setModalVisibleWarning(true,"Xin quý khách kiểm tra lại Internet")
    }
  }
  else{
    if ( data.FullName.length  <= 1  || data.Phone.length  <= 1  
      || data.oldpass.length  <= 1  || data.password.length  <= 1  || data.comfirm_pass.length  <= 1 ) {
        setModalVisibleWarning(true,"Bạn chưa điền đầy đủ thông tin")
      return;
    }
    if(fbApp.auth().currentUser.uid!=null){

      if(data.oldpass==data.pass){
        if(data.password == data.comfirm_pass){
            fbApp.auth().currentUser.updatePassword(data.password).then(function() {
            }).catch(function(error) {
            });
            fbApp.database().ref('Users').child(fbApp.auth().currentUser.uid).update({
              FullName:data.FullName,
              Phone:data.Phone,
              CMND:data.CMND,
              ModifiedBy:"User",
              ModifiedDate:date,
              Password:data.password
          }).then(
            setModalVisible(true,"Thay đổi thành công")
          ).catch()
          LogOut();
        }         
      } 
      else{
        setModalVisibleWarning(true,"Mật khẩu cũ không chính xác")
        setSelection(false)
      } 
    }else{
      setModalVisibleWarning(true,"Xin quý khách kiểm tra lại Internet")
    }
  }
}
  const setModalVisible = (visible,text) => {
      setData({ ...data,
        modalVisible: visible,
        textAlert:text },setTimeout(handleClose,2000));
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
  const getData=()=>{
    if(fbApp.auth().currentUser != null)
    {
      fbApp.database().ref('Users').child(fbApp.auth().currentUser.uid)
      .once('value', (snapshot) => {
        setData({
          ...data,
          CMND:snapshot.val().CMND,
          FullName:snapshot.val().FullName,
          Phone:snapshot.val().Phone,
          pass:snapshot.val().Password
        })
      });
    }    
  }
  useState(()=>{
    getData();
});
    return (
      <View style={styles.screenContainer}>
      <StatusBar backgroundColor='#a2459a' barStyle="light-content"/>
      <View style={styles.headerContainer}>
              <TouchableOpacity style={styles.cartContainer} onPress={() =>{navigation.goBack()}}>
                <Ionicons 
                  name='arrow-back-outline' 
                  color='white'  
                  size={25}
              />
              </TouchableOpacity>
              <Text style={styles.headerText}>Thông tin tài khoản</Text>
          </View>
          <View style={styles.divider} />
          <ScrollView>
          <View style={styles.bodyContainer}>
          <View style={styles.userContainer}>
              <View style={styles.textContainer}>
          
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <Text 
                    style={data.check_textInputFullName
                    ? styles.titletext
                    : 
                  styles.errtext}>Họ tên   <Entypo name="new-message" size={25} style={{marginHorizontal:10}}/></Text>
                  { data.check_textInputFullName ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Vui lòng nhập Họ tên</Text>
                    </Animatable.View>
                  }
                
                  </View>       
                  <TextInput 
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        onChangeText={(val) => textInputFullName(val)}
                        style={styles.welcomeText}
                        >{data.FullName}</TextInput>
      
              </View>
          </View>
            {
              data.check_textInputFullName ? 
              <View style={styles.divider} />
              :
              <View style={{height: 2, backgroundColor:'red'}} />
            }
      
      <View style={styles.userContainer}>
              <View style={styles.textContainer}>
          
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <Text 
                    style={data.check_textInputSDT
                    ? styles.titletext
                    : 
                  styles.errtext}>Số điện thoại <Entypo name="new-message" size={25} style={{marginHorizontal:10}}/></Text>
                  { data.check_textInputSDT ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Vui lòng nhập Số điện thoại</Text>
                    </Animatable.View>
                  }
                  </View>       
                  <View style={styles.totalContainer1}>
                  <TextInput 
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        onChangeText={(val) => textInputPhone(val)}
                        style={styles.welcomeText}
                        >{data.Phone}</TextInput>
                        <TouchableOpacity style={{width:width/3,height:60}}>
                        <Text style={{fontSize:15, color:'blue', marginEnd: 10}}>Gửi mã xác nhận</Text>
                        </TouchableOpacity>
                     
              </View>
              </View>
          </View>
            {
              data.check_textInputSDT ? 
              <View style={styles.divider} />
              :
              <View style={{height: 2, backgroundColor:'red'}} />
            }
       <View style={styles.userContainer}>
              <View style={styles.textContainer}>
          
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <Text 
                    style={data.check_textInputCMND
                    ? styles.titletext
                    : 
                  styles.errtext}>Căn cước công dân <Entypo name="new-message" size={25} style={{marginHorizontal:10}}/></Text>
                  { data.check_textInputCMND ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Thông tin không được để trống</Text>
                    </Animatable.View>
                  }
                  </View>       
                  <TextInput 
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        onChangeText={(val) => textInputCMND(val)}
                        style={styles.welcomeText}
                        >{data.CMND}</TextInput>
              </View>
          </View>
            {
              data.check_textInputCMND ? 
              <View style={styles.divider} />
              :
              <View style={{height: 2, backgroundColor:'red'}} />
            }
          <View style={styles.divider} />
          <View style={styles.userContainer}>
              <View style={styles.textContainer}>
                  <Text style={styles.titletext}>Email</Text>            
                  <Text numberOfLines={1} style={styles.emailtext}>{fbApp.auth().currentUser.email}</Text>              
              </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.userContainer}>
              <View style={styles.totalContainer1}>
                    <CheckBox
                value={isSelected}
                onValueChange={setSelection}
                style={styles.checkbox}
              />
              <View style={{marginHorizontal: 10}}>
                  <Text style={styles.titletext}>Đổi mật khẩu</Text>   
              </View>                                     
        </View>
      </View>
      <View style={styles.divider} />
      {isSelected ?
      (
        <View style={styles.userContainer1}>
          <View style={{marginHorizontal:10}}>
            <Text style={data.check_textInputOldpass ? styles.welcomeText : styles.errtext1}>Mật khẩu cũ</Text>                        
           <View style={{flexDirection:'row',justifyContent:'space-between' }}>
           <TextInput 
                placeholder= {data.check_textInputOldpass  ?"Mật khẩu cũ" : ""}
                secureTextEntry={data.secureTextOld ? true : false}
                style={styles.welcomeText}
                onChangeText={(val) => textInputOldPass(val)}
                ></TextInput>    
                <TouchableOpacity
                  onPress={updateSecureTextEntryOld}
                     >
                  {data.secureTextOld ? 
                  <Feather 
                      name="eye-off"
                      color="grey"
                      size={20}
                  />
                  :
                  <Feather 
                      name="eye"
                      color="green"
                      size={20}
                  />
                  }
              </TouchableOpacity>
           </View>               
                      { data.check_textInputOldpass ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Vui lòng nhập mật khẩu</Text>
                    </Animatable.View>
                  }            
          </View>
          <View style={{marginHorizontal:10}}>
            <Text style={data.check_textInputNewpass ? styles.welcomeText : styles.errtext1}
            >Mật khẩu mới</Text>        
                    <View style={{flexDirection:'row',justifyContent:'space-between' }}>    
            <TextInput 
              placeholder="Mật khẩu mới" 
              secureTextEntry={data.secureTextNew ? true : false}
              style={styles.welcomeText}
              onChangeText={(val) => textInputNewPass(val)}
              ></TextInput>   
               <TouchableOpacity
                  onPress={updateSecureTextEntryNew}
                     >
                  {data.secureTextNew ? 
                  <Feather 
                      name="eye-off"
                      color="grey"
                      size={20}
                  />
                  :
                  <Feather 
                      name="eye"
                      color="green"
                      size={20}
                  />
                  }
              </TouchableOpacity>
                   </View>  
                { data.check_textInputNewpass ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Vui lòng nhập mật khẩu ít nhất 6 kí tự</Text>
                    </Animatable.View>
                  }                 
          </View>
          <View style={{marginHorizontal:10}}>
            <Text style={data.check_textInputComfim ? styles.welcomeText : styles.errtext1}
            >Xác nhận mật khẩu mới</Text>          
                   <View style={{flexDirection:'row',justifyContent:'space-between' }}>    
            <TextInput 
              placeholder="Xác nhận mật khẩu mới" 
              secureTextEntry={data.secureTextConfirm ? true : false}
              style={styles.welcomeText}
              onChangeText={(val) => textInputConfirm(val)}
              ></TextInput>    
               <TouchableOpacity
                  onPress={updateSecureTextEntryConfirm}
                     >
                  {data.secureTextConfirm ? 
                  <Feather 
                      name="eye-off"
                      color="grey"
                      size={20}
                  />
                  :
                  <Feather 
                      name="eye"
                      color="green"
                      size={20}
                  />
                  }
              </TouchableOpacity>
                  </View>
                { data.check_textInputComfim ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Mật khẩu xác nhận chưa đúng</Text>
                    </Animatable.View>
                  }          
          </View>
        </View>
      ): null}
      </View>   
      </ScrollView>
      <View style={{ justifyContent:'flex-end',height:height/12, backgroundColor:'#fff'}}>
      <TouchableOpacity style={{backgroundColor:'#FF3333',
      marginHorizontal:10,marginVertical:10,height:height/20,borderRadius:10}} onPress={()=> {saveChangesHandle()}}>
          <Text style={{fontSize:20, textAlign:'center', color:'white', marginTop:5,}}>Lưu Thay Đổi</Text>
      </TouchableOpacity >
      </View>
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
export default InfoUser;
const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,

    },
    bodyContainer: {
      flex: 1,
      backgroundColor: '#ededed',
    },
    userContainer: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      paddingHorizontal: 5,
      paddingVertical: 5,
    },
    userContainer1:{
      backgroundColor: '#fff',
      flexDirection: 'column',
      paddingHorizontal: 5,
      paddingVertical: 5,
    },
    totalContainer1:{
      flexDirection: 'row',
      justifyContent:'space-between', 
    },
    totalContainer:{
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor:'#EEEEEE'
    },
    textContainer: {
      flex: 1,
      marginLeft: 10,
    },
    welcomeText: {
      color: 'black',
      fontSize:15
    },
    emailtext:{
      color: 'gray',
      fontSize:15
    },
    divider: {
      height: 2,
    },
    errorMsg: {
      color: '#FF0000',
      fontSize: 15,
   },
    screenContainer: {
        flex: 1,
      },
      headerContainer: {
        flexDirection: 'row',
        paddingTop: 15,
        backgroundColor: '#a2459a',
        paddingBottom: 12,

      },
      cartContainer: {
        paddingHorizontal: 20,
      },
      headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
      },
      titletext:{
        color:'black',
        fontSize:20,
      },
      errtext:{
        color:'red',
        fontSize:20,
      },
      errtext1:{
        color:'red',
        fontSize:15,
      },
      textorder:{
        fontSize:20,
        paddingLeft: 10 ,
      },
      centeredView: {
        justifyContent: "center",
        alignItems: "center",
        flex:1
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
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
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
      }
  });