import * as React from 'react';
import { StyleSheet, Text, ScrollView, KeyboardAvoidingView, NativeModules,Dimensions, NativeEventEmitter,Image} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';
import CryptoJS from 'crypto-js';
import NumberFormat from 'react-number-format';
import { View } from 'react-native';
import {fbApp} from "../../firebaseconfig";
import "firebase/auth";

const { height, width } = Dimensions.get('screen');
const { PayZaloBridge } = NativeModules;
const payZaloBridgeEmitter = new NativeEventEmitter(PayZaloBridge);
let apptransid;

function GetCurrentDate(){
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1; 
  var year = new Date().getFullYear();
  var gio = new Date().getHours();
  var phut = new Date().getMinutes();
  var giay = new Date().getSeconds();
    return date + '/' +month+ "/" +year + " " + gio+":"+ phut+":"+giay;
}

 
function ReactNativeNumberFormat({ value }) {
  return (
    <NumberFormat
      value={value}
      displayType={'text'}
      thousandSeparator={true}
      renderText={formattedValue => <Text>{formattedValue} đ</Text>} 
    />
  );
}

export default function App({route,navigation}) {
 
  const subscription = payZaloBridgeEmitter.addListener(
    'EventPayZalo',
    (data) => {
      console.log("kết quả giao dịch:"+ data);
      if(data.returnCode == 1){
        alert('Pay success!');
        thanhToan();
      }else{
        alert('Pay errror! ' + data.returnCode);
      }
    }
);

  const [token,setToken] = React.useState('')
  const [returncode,setReturnCode] = React.useState('')
  const address = route.params.Address;
  console.log("address: "+address.ShipName);
  console.log("dia chi va gia "+address +" + "+route.params.amount );
  const diachi = address.NumberAddress+", "+address.Xa+", "+address.Huyen+", "+ address.City;
  function getCurrentDateYYMMDD() {
    var todayDate = new Date().toISOString().slice(2,10);
    return todayDate.split('-').join('');
  }
  async function createOrder() {
    apptransid = getCurrentDateYYMMDD()+ '_'+new Date().getTime()
    
    let appid = 553
    let amount = route.params.amount;
    let appuser = "TiAn"
    let apptime = (new Date).getTime()
    let embeddata = "{}"
    let item = "[id : 12]"
    let description = "mua san pham tren TiAn" + apptransid
    let hmacInput = appid +"|"+ apptransid +"|"+ appuser +"|"+ amount +"|" + apptime +"|"+ embeddata +"|" +item
    let mac = CryptoJS.HmacSHA256(hmacInput, "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q")
    var order = {
      'appid':appid,
      'appuser': appuser,
      'apptime' : apptime,
      'amount' : amount,
      'apptransid': apptransid,
      'embeddata' : embeddata,
      'item':item,
      'description': description,
      'mac': mac
    }
    let formBody = []
    for (let i in order) {
      var encodedKey = encodeURIComponent(i);
      var encodedValue = encodeURIComponent(order[i]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    await fetch('https://sandbox.zalopay.com.vn/v001/tpe/createorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(response => response.json())
    .then(resJson => {
      setToken(resJson.zptranstoken)
      setReturnCode(resJson.returncode)
    })
    .catch((error)=>{
      console.log("error ", error)
    })
    payOrder() 
  }

  function getStatus(){
    navigation.navigate("App");
  }
  function thanhToan(){ 
    var key = fbApp.database().ref().child('Orders/').push().key;  
      fbApp.database().ref('Orders/'+key).set({
          Status:1,
          CreatedDate:GetCurrentDate(),
          ShipAddress:diachi,
          ShipName:address.ShipName,
          ShipMoblie:address.ShipPhone,
          OrderID: key,
          Payment:"01",
          Total:"Đã thanh toán",
          CustomerID:fbApp.auth().currentUser.uid,       
      });
      fbApp.database().ref("Cart/"+fbApp.auth().currentUser.uid).once("value").then((snapshot)=>{                
        snapshot.forEach(function(childSnapshot){
        var keyDetail = fbApp.database().ref().child('OrderDetails/').push().key;
        fbApp.database().ref('/OrderDetails/'+keyDetail).set({
         OrderDetailID:keyDetail,
         OrderID:key,
         Price:childSnapshot.val().Price,
         ProductID: childSnapshot.val().Id,
         Quantity:childSnapshot.val().Quantity
        });
        fbApp.database().ref("Cart/"+fbApp.auth().currentUser.uid).child(childSnapshot.key).set({})
      })
     })
     navigation.navigate("App"); 
  }
  

  function payOrder() {
    var payZP = NativeModules.PayZaloBridge;
    payZP.payOrder(token);
  }

  return (
    <ScrollView>
      <KeyboardAvoidingView style={styles.container}>
      <Image source={require("../../assets/zalopay.png")} style={{width:width/3,height:height/7, resizeMode:'contain', marginTop:height/5}}/>
        <Text style={styles.welcomeHead} >
          Thanh toán qua ZaloPay
        </Text>
        <Text style={styles.welcome} >
          Tổng hóa đơn: <ReactNativeNumberFormat value={route.params.amount} />
        </Text>
        <Button
          title="Mở ZaloPay để thanh toán"
          type="outline"
          style={{width:width*0.9, height:height/10}}
          onPress={() => {createOrder()}}
        />
      </KeyboardAvoidingView>
      <View>
        <Button title="Về lại trang chủ" 
        type="outline"
        style={{width:width*0.9, height:height/10}}
          onPress={() => {getStatus()}}/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor:"#fff",
  },
  welcomeHead: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
    backgroundColor:"#fff",
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
    marginTop:height/4,
    color:"#484848"
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  inputText: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center'
  },
});

