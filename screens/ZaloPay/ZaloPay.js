import * as React from 'react';
import { StyleSheet, Text, ScrollView, KeyboardAvoidingView, NativeModules,Dimensions, NativeEventEmitter,Image} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';
import CryptoJS from 'crypto-js';
import NumberFormat from 'react-number-format';
import { View } from 'react-native';

const { height, width } = Dimensions.get('screen');
const { PayZaloBridge } = NativeModules;
const payZaloBridgeEmitter = new NativeEventEmitter(PayZaloBridge);
let apptransid;

const subscription = payZaloBridgeEmitter.addListener(
    'EventPayZalo',
    (data) => {
      console.log("kết quả giao dịch:"+ data);
      if(data.returnCode == 1){
        alert('Pay success!');
      }else{
        alert('Pay errror! ' + data.returnCode);
      }
    }
);

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
  const [money,setMoney] = React.useState('10000')
  const [token,setToken] = React.useState('')
  const [returncode,setReturnCode] = React.useState('')
  function getCurrentDateYYMMDD() {
    var todayDate = new Date().toISOString().slice(2,10);
    return todayDate.split('-').join('');
  }
  async function createOrder() {
    apptransid = getCurrentDateYYMMDD()+ '_'+new Date().getTime()
    console.log("App transit khoi tao: "+apptransid);
    let appid = 553
    let amount = route.params.amount;
    let appuser = "TiAn"
    let apptime = (new Date).getTime()
    let embeddata = "{}"
    let item = "[id : 12]"
    
    let description = "mua san pham tren TiAn" + apptransid
    let hmacInput = appid +"|"+ apptransid +"|"+ appuser +"|"+ amount +"|" + apptime +"|"+ embeddata +"|" +item
    let mac = CryptoJS.HmacSHA256(hmacInput, "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q")
    console.log('====================================');
    console.log("hmacInput: " + hmacInput);
    console.log("mac: " + mac)
    console.log('====================================');
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
    console.log(formBody);
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
      payOrder()
      
    })
    .catch((error)=>{
      console.log("error ", error)
    })
  }

  async function getStatus(){
    var payZP = NativeModules.PayZaloBridge;
    // console.log("kết quả sub: "+ subscription.listener());
    let appid = 553;
    let key = "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q"
    let hmacinput =  appid+"|"+apptransid+"|"+key
    let mac = CryptoJS.HmacSHA256(hmacinput, "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q")
    console.log("mac: "+mac);
    var order = {
      'appid':appid,
      'apptransid': apptransid,
      'mac': mac
    }
    let formBody = [];
    for (let i in order) {
      var encodedKey = encodeURIComponent(i);
      var encodedValue = encodeURIComponent(order[i]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    // console.log(formBody);
    await fetch('https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: formBody
    }).then(response => response.json())
    .then(resJson => {  
      console.log("giá trị đơn hàng: "+resJson.amount);
      console.log("trạng thái đơn hàng trả về: "+resJson.returnmessage);
    })
    .catch((error)=>{
      console.log("error ", error)
    })
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

