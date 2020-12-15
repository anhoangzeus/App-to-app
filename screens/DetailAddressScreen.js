import React, { useState, useEffect} from 'react';
import {StyleSheet, View, Text,Alert,
   StatusBar,Image, Dimensions, ScrollView,Button,TextInput,CheckBox,Modal} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/HeaderComponent';
import {fbApp} from "../firebaseconfig";
import "firebase/auth";
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { HeaderBackButton } from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import DropDownPicker from 'react-native-dropdown-picker';
import AddressScreen from '../screens/AddressScreen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default  function Route_AddressDetail({ route, navigation}) {  
    var searchContent = "";    
    if (route.params != null) {
        const { content } = route.params.id;
        searchContent = route.params.id;
    }
    else{
      const { content } = route.params.id;
      searchContent = "";
      console.log(searchContent);
    }
    return (
        <DetailAddressScreen
            content = {searchContent}
            navigation = {navigation}
        />
    );    
}

const { width, height } = Dimensions.get('screen');

export const DetailAddressScreen =({content,navigation}) =>  {
  const [data, setData] = React.useState({
    ListID:'',
    ShipName:'',
    ShipPhone:'',
    City:'',
    Huyen:'',
    Xa:'',
    NumberAddress:'',
    Main:false,
    check_textInputFullName: true,
    check_textInputSDT: true, 
    check_textInputaddress: true,
    check_textInputcity: true,
    check_textInputhuyen: true,
    check_textInputxa: true,
    modalVisibleWarning:false,
});
const textInputCity = (val) => {
  if( val.trim().length > 0 ) {
      setData({
          ...data,
          City: val,
          check_textInputcity: true,
      });
  } else {
      setData({
          ...data,
          City: val,
          check_textInputcity: false,
      });
  }
}
const textInputHuyen = (val) => {
  if( val.trim().length > 0 ) {
      setData({
          ...data,
          Huyen: val,
          check_textInputhuyen: true,
      });
  } else {
      setData({
          ...data,
          Huyen: val,
          check_textInputhuyen: false,
      });
  }
}
const textInputXa = (val) => {
  if( val.trim().length > 0 ) {
      setData({
          ...data,
          Xa: val,
          check_textInputxa: true,
      });
  } else {
      setData({
          ...data,
          Xa: val,
          check_textInputxa: false,
      });
  }
}
const CheckBoxChange = (val)=>{
  if(data.Main==false){
    setData({
      ...data,
      Main: val
    })
  }
  console.log(data.Main);
}
const textInputFullName = (val) => {
  if( val.trim().length > 0 ) {
      setData({
          ...data,
          ShipName: val,
          check_textInputFullName: true,
      });
  } else {
      setData({
          ...data,
          ShipName: val,
          check_textInputFullName: false,
      });
  }
}
const textInputAddress = (val) => {
  if( val.trim().length > 0 ) {
      setData({
          ...data,
          NumberAddress: val,
          check_textInputaddress: true,
      });
  } else {
      setData({
          ...data,
          NumberAddress: val,
          check_textInputaddress: false,
      });
  }
}
const textInputPhone = (val) => {

  if( val.trim().length > 0 ) {
      setData({
          ...data,
          ShipPhone: val,
          check_textInputSDT: true,
      });
  } else {
      setData({
          ...data,
          ShipPhone: val,
          check_textInputSDT: false,
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
const saveChangesHandle = async() => {
  if ( data.ShipName.length == 0 || data.ShipPhone.length == 0 || data.NumberAddress.length == 0
    || data.City.length == 0|| data.Huyen.length == 0 || data.Xa.length == 0) {
    setModalVisibleWarning(true,'Bạn chưa điền đầy đủ thông tin');
    return;
  }
  if(fbApp.auth().currentUser.uid != null){
    if(data.ListID=="")
    {
      if(data.Main==true){
        await(
          fbApp.database().ref('ListAddress').child(fbApp.auth().currentUser.uid)
          .orderByChild('Main')
          .once('value').then((snapshot) =>{
            snapshot.forEach(function(child) {
              if(child!=data.ListID){
                child.ref.update({Main: false});
              }
            })
          })
        )
        var newPostKey = fbApp.database().ref().child('ListAddress').child(fbApp.auth().currentUser.uid).push().key;
        fbApp.database().ref('ListAddress').child(fbApp.auth().currentUser.uid).child(newPostKey).set({
            ListID:newPostKey,
            ShipName:data.ShipName,
            ShipPhone:data.ShipPhone,
            City:data.City,
            Huyen:data.Huyen,
            Xa:data.Xa,
            NumberAddress:data.NumberAddress,
            Main:true,
          }).then(navigation.navigate('App'),navigation.navigate('AddressScreen')).catch() 
      }else{
        var newPostKey = fbApp.database().ref().child('ListAddress').child(fbApp.auth().currentUser.uid).push().key;
        fbApp.database().ref('ListAddress').child(fbApp.auth().currentUser.uid).child(newPostKey).set({
            ListID:newPostKey,
            ShipName:data.ShipName,
            ShipPhone:data.ShipPhone,
            City:data.City,
            Huyen:data.Huyen,
            Xa:data.Xa,
            NumberAddress:data.NumberAddress,
            Main:false,
          }).then(navigation.navigate('App'),navigation.navigate('AddressScreen')).catch() 
      }
      
    }else{
      if(data.Main == true){
        await(
          fbApp.database().ref('ListAddress').child(fbApp.auth().currentUser.uid)
          .orderByChild('Main')
          .once('value').then((snapshot) =>{
            snapshot.forEach(function(child) {
              if(child!=data.ListID){
                child.ref.update({Main: false});
              }
            })
          })
        )
          fbApp.database().ref('ListAddress').child(fbApp.auth().currentUser.uid).child(data.ListID)
          .update({
          ShipName:data.ShipName,
          ShipPhone:data.ShipPhone,
          City:data.City,
          Huyen:data.Huyen,
          Xa:data.Xa,
          NumberAddress:data.NumberAddress,
          Main:true,
        }).then(navigation.navigate('App'),navigation.navigate('AddressScreen')).catch() 
        
      }else{
        fbApp.database().ref('ListAddress').child(fbApp.auth().currentUser.uid).child(data.ListID)
        .update({
          ShipName:data.ShipName,
          ShipPhone:data.ShipPhone,
          City:data.City,
          Huyen:data.Huyen,
          Xa:data.Xa,
          NumberAddress:data.NumberAddress,
          Main:data.Main,
        }).then(navigation.navigate('App'),navigation.navigate('AddressScreen')).catch() 
      }

    }
  }  
}
  useState(()=>{
    if(fbApp.auth().currentUser.uid != null && content != "")
    {
      fbApp.database().ref('ListAddress').child(fbApp.auth().currentUser.uid).child(content)
      .once('value', snapshot => {
        setData({
          ...data,
          NumberAddress:snapshot.val().NumberAddress,
          ShipName:snapshot.val().ShipName,
          ShipPhone:snapshot.val().ShipPhone,
          City:snapshot.val().City,
          Huyen:snapshot.val().Huyen,
          Xa:snapshot.val().Xa,
          ListID:snapshot.val().ListID,
          Main:snapshot.val().Main,
        })
      
      });
      CheckBoxChange(data.Main);
      console.log(data);
    }
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
              <Text style={styles.headerText}>Cập nhật địa chỉ</Text>
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
                  styles.errtext}>Họ tên</Text>
                  { data.check_textInputFullName ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Vui lòng kiểm tra lại</Text>
                    </Animatable.View>
                  }
                  </View>       
                  <TextInput 
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        onChangeText={(val) => textInputFullName(val)}
                        style={styles.welcomeText}
                        >{data.ShipName}</TextInput>
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
                  styles.errtext}>Số điện thoại</Text>
                  { data.check_textInputSDT ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Vui lòng kiểm tra lại</Text>
                    </Animatable.View>
                  }
                  </View>       
                  <TextInput 
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        onChangeText={(val) => textInputPhone(val)}
                        style={styles.welcomeText}
                        >{data.ShipPhone}</TextInput>
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
                    style={data.check_textInputaddress
                    ? styles.titletext
                    : 
                  styles.errtext}>Địa chỉ</Text>
                  { data.check_textInputaddress ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Vui lòng kiểm tra lại</Text>
                    </Animatable.View>
                  }
                  </View>       
                  <TextInput 
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        onChangeText={(val) => textInputAddress(val)}
                        style={styles.welcomeText}
                        >{data.NumberAddress}</TextInput>
              </View>
          </View>
            {
              data.check_textInputaddress ? 
              <View style={styles.divider} />
              :
              <View style={{height: 2, backgroundColor:'red'}} />
            }
          <View style={styles.divider} />
          <View style={styles.userContainer}>
              <View style={styles.textContainer}>
          
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <Text 
                    style={data.check_textInputcity
                    ? styles.titletext
                    : 
                  styles.errtext}>Tỉnh/Thành Phố</Text>
                  { data.check_textInputcity ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Vui lòng kiểm tra lại</Text>
                    </Animatable.View>
                  }
                  </View>       
                  <TextInput 
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        onChangeText={(val) => textInputCity(val)}
                        style={styles.welcomeText}
                        >{data.City}</TextInput>
              </View>
          </View>
          {
              data.check_textInputcity ? 
              <View style={styles.divider} />
              :
              <View style={{height: 2, backgroundColor:'red'}} />
            }
          <View style={styles.userContainer}>
              <View style={styles.textContainer}>
          
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <Text 
                    style={data.check_textInputhuyen
                    ? styles.titletext
                    : 
                  styles.errtext}>Quận/Huyện</Text>
                  { data.check_textInputhuyen ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Vui lòng kiểm tra lại</Text>
                    </Animatable.View>
                  }
                  </View>       
                  <TextInput 
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        onChangeText={(val) => textInputHuyen(val)}
                        style={styles.welcomeText}
                        >{data.Huyen}</TextInput>
              </View>
          </View>
          {
              data.check_textInputhuyen ? 
              <View style={styles.divider} />
              :
              <View style={{height: 2, backgroundColor:'red'}} />
            }
          <View style={styles.userContainer}>
              <View style={styles.textContainer}>
          
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <Text 
                    style={data.check_textInputxa
                    ? styles.titletext
                    : 
                  styles.errtext}>Xã</Text>
                  { data.check_textInputxa ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Vui lòng kiểm tra lại</Text>
                    </Animatable.View>
                  }
                  </View>       
                  <TextInput 
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        onChangeText={(val) => textInputXa(val)}
                        style={styles.welcomeText}
                        >{data.Xa}</TextInput>
              </View>
              {
              data.check_textInputxa ? 
              <View style={styles.divider} />
              :
              <View style={{height: 2, backgroundColor:'red'}} />
            }
          </View>
          {/* <DropDownPicker
            items={[
              {label: 'USA',value:'usa',  selected: true,disabled: true},
              {label: 'UK',value:'uk'},
            ]}
            searchable={true}
            searchablePlaceholder="Tìm Tỉnh thành"
            searchablePlaceholderTextColor="gray"
            seachableStyle={{}}
            searchableError={() => <Text>Không tìm thấy</Text>}
            containerStyle={{}}
            style={{backgroundColor: '#fafafa'}}
            itemStyle={{
                justifyContent: 'flex-start',
            }}
            
            dropDownStyle={{}}
            // onChangeItem={item => this.setState({
            //     country: item.value
            // })}
          
          /> */}
          <View style={styles.divider} />
          <View style={styles.userContainer}>
              <View style={styles.totalContainer1}>
                    <CheckBox
                value={data.Main}
                onValueChange={CheckBoxChange}
                style={styles.checkbox}
              />
              <View style={{marginHorizontal: 10}}>
                  <Text style={{color:'green', fontSize:20}}>Địa chỉ mặc định</Text>   
              </View>                                     
          </View>
        </View> 
      </View>
       <View style={styles.divider} />
      <TouchableOpacity style={{backgroundColor:'#FF3333',
      marginHorizontal:10,marginVertical:10,height:height/20,}} onPress={()=> {saveChangesHandle()}}>
          <Text style={{fontSize:20, textAlign:'center', color:'white', marginTop:5}}>Lưu địa chỉ</Text>
      </TouchableOpacity >
      </ScrollView>
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
      backgroundColor:'#EEEEEE'
    },
    textContainer: {
      flex: 1,
      marginLeft: 10,
    },
    welcomeText: {
      color: 'black',
      fontSize:15,
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
        width:75
      },
      headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
      },
      titletext:{
        color:'black',
        fontSize:15,
      },
      errtext:{
        color:'red',
        fontSize:15,
      },
      errtext1:{
        color:'red',
        fontSize:15,
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