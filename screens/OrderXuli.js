import React,{Component, useEffect, useState} from 'react';
import { View, Text, Button, StyleSheet,FlatList, TouchableOpacity, ActivityIndicator,Image} from 'react-native';
import { fbApp } from '../firebaseconfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NumberFormat from 'react-number-format';
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
const noOder = require('../assets/process3.jpg');

export default class Order_Xuli extends Component{
  constructor(props) {
    super(props);
    this.state = { 
     listOrder:[],
     status:false,
     loading:true
    }; 
  }
  RenderList = ({CreatedDate,ShipAddress,ShipName,ShipMoblie,ToTalPrice,id}) =>(
    <TouchableOpacity style={styles.listItem} onPress={()=> {this.props.navigation.navigate('View_OrderDetail', {id: id})}}>
      <View style={{flex:1, margin: 10}}>
         <Text style={{fontSize: 20, fontWeight:'bold',textAlign:'center'}}>{ShipName}</Text>
         <View style={{height:1,backgroundColor:'silver',marginTop:5}}/>
         <View style={{flexDirection:'row',marginTop:10}} >
            <MaterialIcons name='phone-in-talk' size={20} color="#1e88e5"/>
            <Text style={{marginLeft: 10}}>{ShipMoblie}</Text>
         </View>
         <View style={{flexDirection:'row'}} >
            <MaterialIcons name='event-available' size={20} color="#1e88e5"/>
            <Text style={{marginLeft: 10}}>{CreatedDate}</Text>
         </View>
         <View style={{flexDirection:'row'}} >
            <MaterialIcons name='location-on' size={20} color="#1e88e5"/>
            <Text numberOfLines={1} style={styles.address}>{ShipAddress}</Text>
         </View>
          <Text style={{fontSize:20, color:"#1e88e5", fontWeight:'bold'}}>Tổng tiền: <ReactNativeNumberFormat value={ToTalPrice} /></Text>
      </View >  
      <Text style={{color:"white", textAlign:'center'}}>Xem</Text>
  </TouchableOpacity>
  );
  componentDidMount(){
    this.ListenForOrder();
  }
  ListenForOrder = () =>{    
    fbApp.database().ref('Orders').once('value').then((snapshot) => {
      var items=[];
      snapshot.forEach( function(childSnapshot){       
        if(childSnapshot.val().CustomerID == fbApp.auth().currentUser.uid){
          var order={
            CreatedDate:'',
            ShipAddress:'',
            ShipName:'',
            ShipMoblie:'',
            id: '',
            ToTalPrice:0,
          }        
          if(childSnapshot.val().Status =="1"){
            order.CreatedDate = childSnapshot.val().CreatedDate;
            order.ShipAddress=childSnapshot.val().ShipAddress;
            order.ShipName=childSnapshot.val().ShipName;
            order.ShipMoblie=childSnapshot.val().ShipMoblie;
            order.id=childSnapshot.val().OrderID;
            order.ToTalPrice=childSnapshot.val().Total;    
            items.push(order);     
          }                 
        }     
    });
    this.setState({
      listOrder:items,
      loading:false
    })
    if(items[0].id==''){
      this.setState({status:false})
    }else{
      this.setState({status:true})
    }
  })
}
renderNull = () =>{
  return(
    <View style={{flex:1, justifyContent:'center', alignItems:"center", backgroundColor:'white'}}>
    <Image source={noOder} style={{width:50, height:50, }}/>
    <Text style={{fontSize:20, color:"#1ba8ff"}}>Chưa có đơn hàng</Text>
  </View>
  )
}
render(){
  if (this.state.loading) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <ActivityIndicator size="large" color="dodgerblue" />
      </View>
    )
  }
  return (
    this.state.status == false ? 
        <this.renderNull/>
   : (
    <View>
    <FlatList
        pagingEnabled={false}
        data={this.state.listOrder}
        initialNumToRender={10}
        renderItem={({item})=>
        <this.RenderList
        CreatedDate={item.CreatedDate}
        ShipAddress={item.ShipAddress}
        ShipName={item.ShipName}
        ShipMoblie={item.ShipMoblie}
        ToTalPrice={item.ToTalPrice}
        id={item.id}
        key={item.id}
      /> 
      }
    />
  </View> )
  );
}
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'silver',
    marginTop:60
  },
  listItem:{
    margin:5,
    backgroundColor:"#fff",
    width:"90%",
    flex:1,
    alignSelf:"center",
    flexDirection:"row",
    borderRadius:5
  },
  loader:{
    marginTop:10,
    alignItems:"center"
  },
  address:{
    fontWeight: '400',
    marginLeft: 10
  },
  buttonXem:{
    paddingHorizontal: 10,
    justifyContent:"center",
    alignItems:"center", 
    backgroundColor:'#FF00FF'
  }
});