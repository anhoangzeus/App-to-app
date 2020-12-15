import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, StatusBar, ScrollView, Image,Dimensions,TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {fbApp} from "../firebaseconfig";
import "firebase/auth";
import{ AuthContext } from '../components/context';
import AsyncStorage from '@react-native-community/async-storage';
import { database } from 'firebase';
       

const { width,height } = Dimensions.get('screen');
const ProfileUser =(props)=> {

  const [FullName, setFullName] = useState("username");
  const [Email, setEmail] = useState("name@gmail.com");
  const [CreatedDate, setCreatedDate] = useState("dd/mm/yy hh:mm AM");
  const [Avatar, setAvatar] = useState("https://i.ibb.co/HDzz1rC/avartarnone.png");

  const { signOut } = React.useContext(AuthContext);

  const  LogOut = () => {
    try {
        fbApp.auth().signOut();
        signOut();
    } catch(e) {
    }
  }

  const ProfileItem = ({icon, name}) => (
    <View style={styles.itemContainer}>
      <MaterialCommunityIcons name={icon} size={26} color="#1e1e1e" />
      <Text style={[styles.itemText, {marginLeft: icon ? 20 : 0}]}>{name}</Text>
      <FontAwesome name="angle-right" size={15} color="#1e1e1e" />
    </View>
  );
  const ProfileItem1 = ({icon, name}) => (
    <View style={styles.itemContainer}>
      <Ionicons name={icon} size={26} color="#1e1e1e" />
      <Text style={[styles.itemText, {marginLeft: icon ? 20 : 0}]}>{name}</Text>
      <FontAwesome name="angle-right" size={15} color="#1e1e1e" />
    </View>
  );
  
  useState(()=>{
    if(fbApp.auth().currentUser != null)
    {
      fbApp.database().ref('Users').child(fbApp.auth().currentUser.uid)
      .on('value', (snapshot) => {
        setCreatedDate(snapshot.val().CreatedDate);
        setFullName(snapshot.val().FullName);;
        setEmail(snapshot.val().Email);
        setAvatar(snapshot.val().Avatar);
      });
    };    
  });
    return (
      <View style={styles.screenContainer}>
        <StatusBar backgroundColor='#a2459a' barStyle="light-content"/>
            <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Cá nhân</Text>
            </View>
        <ScrollView>
        <View style={styles.bodyContainer}>
        <TouchableOpacity onPress={()=> {props.navigation.navigate("InfoUser")}}>
          <View style={styles.userContainer}>
            <View style={styles.avatarContainer}>
            <Image source={{uri: Avatar}} size={80} style={styles.avatarContainer}/>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>{FullName}</Text>
                <Text style={styles.authText}>{Email}</Text>
                <Text style={styles.authText}>Thành viên từ {CreatedDate}</Text>
            </View>
            <FontAwesome name="angle-right" size={26} color="#a2459a" />
          </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity>
          <ProfileItem icon="facebook" name="Kết nối mạng xã hội" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity>
          <ProfileItem icon="trophy-outline" name="Săn thưởng" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={()=> {props.navigation.navigate("TopOrder")}}>
          <ProfileItem icon="form-select" name="Quản lí đơn hàng" />
          </TouchableOpacity>         
          <View style={styles.divider1} />
          <TouchableOpacity onPress={()=> {props.navigation.navigate("TopOrder",{screen: "OrderXuli"})}}>
          <ProfileItem name="Đơn hàng đang chờ xác nhận" />
          </TouchableOpacity>
          <View style={styles.divider1} />
          <TouchableOpacity onPress={()=> {props.navigation.navigate("TopOrder",{screen: "Order_LayHangScreen"})}}>
          <ProfileItem name="Đơn hàng đang chờ lấy hàng" />
          </TouchableOpacity>
          <View style={styles.divider1} />
          <TouchableOpacity onPress={()=> {props.navigation.navigate("TopOrder",{screen: "Order_DangVanChuyen"})}}>
          <ProfileItem  name="Đơn hàng đang chờ vận chuyển" />
          </TouchableOpacity>
          <View style={styles.divider1} />
          <TouchableOpacity onPress={()=> {props.navigation.navigate("TopOrder",{screen: "Order_DaGiao"})}}>
          <ProfileItem  name="Đơn hàng thành công" />
          </TouchableOpacity>
          <View style={styles.divider1} />
          <TouchableOpacity onPress={()=> {props.navigation.navigate("TopOrder",{screen: "Order_DaHuy"})}}>
          <ProfileItem  name="Đơn hàng đã huỷ" />
          </TouchableOpacity>
          <View style={styles.divider1} />
          <TouchableOpacity onPress={()=> {props.navigation.navigate("TopOrder",{screen: "Order_Payment"})}}>
          <ProfileItem  name="Đơn hàng trả lại" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={()=> {props.navigation.navigate("AddressScreen")}}>
          <ProfileItem1 icon="location-outline" name="Số địa chỉ" />
          </TouchableOpacity>  
          <View style={styles.divider1} />
          <TouchableOpacity>
          <ProfileItem icon="credit-card-settings-outline" name="Thông tin thanh toán" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity>
          <ProfileItem icon="cart-outline" name="Sản phẩm đã mua" />
          </TouchableOpacity>
          <View style={styles.divider1} />
          <TouchableOpacity>
          <ProfileItem icon="eye-outline" name="Sản phẩm đã xem" />
          </TouchableOpacity>
          <View style={styles.divider1} />
          <TouchableOpacity>
          <ProfileItem icon="heart-outline" name="Sản phẩm yêu thích" />
          </TouchableOpacity>
          <View style={styles.divider1} />
          <TouchableOpacity>
          <ProfileItem icon="clock-outline" name="Sản phẩm mua sau" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity>
          <ProfileItem  name="Ưu đãi cho chủ thẻ ngân hàng" />
          </TouchableOpacity>
          <View style={styles.divider1} />
          <TouchableOpacity>
          <ProfileItem name="Cài đặt" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity>
          <ProfileItem icon="headphones" name="Hỗ trợ" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.divider} />
        
          <TouchableOpacity
                  style={styles.signIn}
                  onPress={() => {LogOut()}}
              >
              <LinearGradient
                    colors={['#a2459a', '#3eafff']}
                  style={styles.signIn}
              >
                  <Text style={[styles.textSign, {
                      color:'#fff'
                  }]}>Đăng xuất</Text>
              </LinearGradient>
              </TouchableOpacity>
              <View style={styles.divider} />
              <View style={styles.divider} />
        </View>
        </ScrollView>
      </View>
    );
  };
export default ProfileUser;
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
    paddingHorizontal: 20,
    paddingVertical: 22,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  authText1: {
    color: '#a2459a',
    fontSize: 18,
    fontWeight: '500',
  },
  welcomeText: {
    color:"black"
  },
  authText: {
    color: '#828282',
    fontWeight: '500',
    marginTop:2
  },
  itemContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    color: '#1e1e1e',
  },
  divider: {
    height: 10,
  },
  divider1:{
      height:1
  },
  button: {
    alignItems: 'center',
    marginTop: 50
},
signIn: {
    width: '95%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10,

},
textSign: {
    fontSize: 18,
    fontWeight: 'bold'
},
headerContainer: {
  flexDirection: 'row',
  paddingTop: 15,
  backgroundColor: '#a2459a',
  justifyContent: 'center',
  paddingBottom: 12,
},
cartContainer: {
  paddingHorizontal: 20,
  alignItems: 'center',
  justifyContent: 'center',
  width:75,
},
cartIcon: {
  width: 24,
},
headerText: {
  color: '#fff',
  fontSize: 20,
  alignItems:'center'
},
});