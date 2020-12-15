import React, { Component } from 'react';
import {
  Image, 
  StyleSheet,
  ScrollView, 
  StatusBar, 
  Dimensions, 
  Platform,
  View,
  ActivityIndicator, 
  Alert ,
  FlatList,
  TouchableOpacity,
  Text,
  Modal
} from 'react-native';
import {  Button} from 'galio-framework';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {fbApp} from "../firebaseconfig";
import "firebase/auth";
import { element } from 'prop-types';
import NumberFormat from 'react-number-format';
import Entypo from 'react-native-vector-icons/Entypo';
const { height, width } = Dimensions.get('screen');

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
export default class Cart extends Component{
    constructor(props) {
        super(props);
        this.itemRef = fbApp.database();
        this.state = { 
         CartItem:[],
         Address:{},
         amount:0,
         loading:true,
         hasAddress:false,
         modalVisible:false,
         modalPayment:false,
         refesh:true,
         _idCanXoa:''
        }; 
      }
    componentDidMount(){
      this.ListenCart();       
      this.GetAddress();
    };
    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible });
    };
    handleClose = () => {
      this.setState({
        modalVisible: false 
      });
    };
    setmodalPayment = (visible) => {
      if(fbApp.auth().currentUser){
        this.setState({ modalPayment: visible },()=> {setTimeout(this.handleClosemodalPayment,1000)});
      }
    };
    handleClosemodalPayment = () => {
      this.setState({
        modalPayment: false 
      });
    };
    
    GetCurrentDate =()=>{
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1; 
      var year = new Date().getFullYear();
      var gio = new Date().getHours();
      var phut = new Date().getMinutes();
      var giay = new Date().getSeconds();
        return date + '/' +month+ "/" +year + " " + gio+":"+ phut+":"+giay;
    }
      GetAddress =() =>{
        if(fbApp.auth().currentUser)
        {
            this.itemRef.ref('ListAddress').child(fbApp.auth().currentUser.uid).once('value').then((snapshot)=>{
              var item;
              snapshot.forEach(function(childSnapshot){
                var Address={
                  ShipName:'',
                  ShipPhone:'',
                  NumberAddress:'',
                  Xa:'',
                  Huyen:'',
                  City:'',
                }
                if(childSnapshot.val().Main==true){
                  Address.ShipName= childSnapshot.val().ShipName;
                  Address.ShipPhone= childSnapshot.val().ShipPhone;
                  Address.NumberAddress= childSnapshot.val().NumberAddress;
                  Address.Xa= childSnapshot.val().Xa;
                  Address.Huyen= childSnapshot.val().Huyen;
                  Address.City= childSnapshot.val().City;
                  item=Address;
                }
              });
              if(item != null){
                this.setState({hasAddress:true})
              }
              this.setState({
                Address:item,
                loading:false
            });
          });
        };
      };
      ListenCart = () => {
        if(fbApp.auth().currentUser){
          this.itemRef.ref('Cart/'+fbApp.auth().currentUser.uid).once('value').then((snapshot) => {
            var items =[];
            snapshot.forEach((childSnapshot)=>{
              items.push({
                Id : childSnapshot.val().Id,
                Name : childSnapshot.val().Name,
                Picture : childSnapshot.val().Picture,
                Price : childSnapshot.val().Price,
                Quantity : childSnapshot.val().Quantity,
                BrandID : childSnapshot.val().BrandID,
                CategoryID : childSnapshot.val().CategoryID,
              });
            });
           
            this.setState({
              CartItem:items,
            });  
          });  
        };
      };
      _checkGioHang=()=>{
        if(this.state.amount!=0 && this.state.hasAddress==true)
        {
          this.props.navigation.navigate("ItemsCart",{content : this.state.amount,listItem : this.state.CartItem, address: this.state.Address })
        }else{
            this.setmodalPayment(true);
        }
      };
      _tangSoLuong=(item)=>{
          this.itemRef.ref('Cart/'+fbApp.auth().currentUser.uid+"/"+item.Id).set({
            Id:item.Id,
            Name:item.Name,
            Picture:item.Picture,
            Price:item.Price,
            Quantity:item.Quantity+1,
            BrandID : item.BrandID,
            CategoryID : item.CategoryID,
          })
          this.state.CartItem.forEach(element => {if(element.Id == item.Id){element.Quantity=item.Quantity+1}});
          this.setState({ 
            refesh: !this.state.refesh
        });
      };
      _giamSoLuong=(item)=>{
        if(item.Quantity>1){
          this.itemRef.ref('Cart/'+fbApp.auth().currentUser.uid+"/"+item.Id).set({
            Id:item.Id,
            Name:item.Name,
            Picture:item.Picture,
            Price:item.Price,
            Quantity:item.Quantity-1,
            BrandID : item.BrandID,
            CategoryID : item.CategoryID,
           });
          this.state.CartItem.forEach(element => {if(element.Id == item.Id){element.Quantity=item.Quantity-1}});
          this.setState({ 
            refesh: !this.state.refesh
        });
        }else{
          this.setModalVisible(true),
          this.setState({ 
            _idCanXoa: item.Id
        });
        }
      };
      _xoaGioHang=()=>{
        this.itemRef.ref('Cart/'+fbApp.auth().currentUser.uid).child(this.state._idCanXoa).remove();
        this.ListenCart();
        this.setState({ 
          modalVisible:false,
          refesh: !this.state.refesh
      });
    }; 
    renderItem=({item})=>{
      const { navigation } = this.props;
      const { modalVisible } = this.state;
      return(
        <View style={styles.itemcard}>
        <View style={{paddingLeft:10,paddingTop:5,flexDirection:"row"}}>
          <TouchableOpacity onPress={() =>navigation.navigate('Items', {id: item.Id, CategoryID: item.CategoryID, BrandID: item.BrandID})}>
          <Text style={styles.itemName}>{item.Name} </Text>
          </TouchableOpacity>
        <View style={{marginTop:0}}>
        <FontAwesome name="angle-right" size={30} />
        </View>
        </View>
        <View style={{flexDirection:"row"}}>
        <FontAwesome name="gift" color="green" size={24} style={styles.itemGift} ></FontAwesome>
        <Text style={{marginLeft:5, color:"green", fontSize:18}}>nhận một phần quà may mắn</Text>
        </View>
        <View style={styles.itemInfo}>
          <Image style={styles.itemImage} source={{uri:item.Picture }}></Image>
          <View style={styles.itemDec}>
            <Text style={{marginVertical:4,fontSize:16}} numberOfLines={2}> </Text>
            <Text style={{marginVertical:4,fontSize:19, color:"red"}}><ReactNativeNumberFormat value={item.Price}/></Text>
            <View style={{flexDirection:"row"}}>            
                <Button style={styles.buttonUpDown} color='#ff3333' onPress={()=>{this._giamSoLuong(item)}}>-</Button>
              <View style={{marginTop:10}}><Text style={{fontSize:20, marginHorizontal:10}} >{item.Quantity}</Text></View>
              <Button style={styles.buttonUpDown} color='#ff3333' onPress={()=>{this._tangSoLuong(item)}}>+</Button>
            </View>
          </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}     
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.centeredView}>
                  <View style={{...styles.modalView, padding: width/15,}}>
                    <Text style={styles.modalText}>Bạn có chắc bỏ sản phẩm này khỏi giỏ hàng?</Text>
                    <View style={{flexDirection:'row'}}>
                    <TouchableOpacity
                      style={{ ...styles.openButton, backgroundColor: "#2196F3", width:width/2.5 }}
                      onPress={() => {
                        this.handleClose();
                      }}
                    >
                      <Text style={styles.textStyle}>Giữ lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ ...styles.openButton, backgroundColor: "#2196F3",width:width/2.5,marginLeft:5, }}
                      onPress={() => {
                        this._xoaGioHang();
                      }}
                    >
                      <Text style={styles.textStyle}>Xác nhận</Text>
                    </TouchableOpacity>
                  
                    </View>                  
                  </View>
                </View>
          </Modal>  
            <TouchableOpacity style={{marginLeft:width/15,width:50,height:50, borderRadius:20}} 
                  onPress={() =>{this.setModalVisible(true); this.setState({_idCanXoa:item.Id})}}>
            <FontAwesome  name="remove" size={30} color="red" />
            </TouchableOpacity>       
        </View>
      </View>
      );
    }
    render(){
      const { navigation } = this.props;
      const { modalPayment } = this.state;
      
      this.state.amount=0;
      this.state.CartItem.forEach(element =>{      
        const a = Number(element.Price);        
        this.state.amount+=(Number(element.Price) * element.Quantity);
      });
      if (this.state.loading) {
        return (
          <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <ActivityIndicator size="large" color="dodgerblue" />
          </View>
        );
      }
    return(      
     <View style={styles.screenContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#a2459a"/>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={{width:75}} onPress={() => navigation.navigate('App')}>
          <FontAwesome name="chevron-left" size={24} color="#fff" style={{marginLeft:width/40}}/>
          </TouchableOpacity>
        
          <Text style={styles.headerText}>Giỏ hàng</Text>  
        </View>
        <ScrollView style={{height:height}}>
        { this.state.hasAddress ? 
          <View style={styles.listItem}>
          <View style={{flex:1, margin: 10}}>   
            <View style={{flexDirection:'row',justifyContent:'space-between' }}>
            <Text style={styles.addresstitle}>Địa chỉ nhận hàng</Text>
            <TouchableOpacity
              onPress={()=> {this.props.navigation.navigate("AddressScreen")}}
              >
              <Text style={{color:'green', marginRight:5, fontSize:17}}>Thay đổi</Text>
            </TouchableOpacity>
            </View>
           
            <Text style={styles.address}>{this.state.Address.NumberAddress}, {this.state.Address.Xa}, {this.state.Address.Huyen}, {this.state.Address.City}</Text>
            <Text style={styles.address}>{this.state.Address.ShipName} - {this.state.Address.ShipPhone}</Text>
            <View style={{justifyContent:'space-between', flexDirection:'row',marginTop:10}}>
              </View>             
            </View>                   
          </View>
          :
          <View style={styles.listItem}>
                <TouchableOpacity 
                    onPress={()=> {this.props.navigation.navigate('DetailAddressScreen', {id: ""})}}
                    style={{flex:1, margin: 10, flexDirection:'row'}}>
                  <FontAwesome name="plus" color="green" size={25}/>
                     <Text style={{color: 'green',fontSize:20, marginLeft:10}}>Thêm địa chỉ nhận hàng</Text>
               </TouchableOpacity>
          </View>
        }
             <View style={styles.centeredView}>
              <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalPayment}   
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                  }}
               >
                  <View style={styles.centeredView}>
                  <View style={{...styles.modalView,  padding: 35,alignItems: "center",}}>
                      <Entypo name="emoji-flirt" size={40} color="#a2459a"/>
                      <Text style={styles.modalText1}>Mua sắm ngay nào!!!</Text>
                    </View>
                  </View>
             </Modal>  
        </View>
        {
          this.state.amount==0 ? 
          <View style={{height:height/1.7, justifyContent:'center',backgroundColor:'#fff', marginTop:5,width:width}}>
              <Image source={require('../assets/logoAn-03.png')} style={{height:width/3,width:width/3,alignSelf:'center'}}/>
              <Text style={{textAlign:'center',color:'#a2459a', fontSize:20}}>Chưa có sản phẩm nào trong giỏ</Text>
              <TouchableOpacity style={{backgroundColor:'#a2459a', margin:20, borderRadius:20,height:height/18,justifyContent:'center',}}
                onPress={() => navigation.navigate('App')}
              >
                <Text style={{color:'#fff',fontSize:20,textAlign:'center'}}>Tiếp tục mua sắm</Text>
              </TouchableOpacity>
          </View>:null
        }
        <FlatList 
          data={this.state.CartItem}
          renderItem={ ({item})=>
            <this.renderItem 
                item={item}
            />
          }
          extraData={this.state.refesh}
          keyExtractor={(item) => item.Id}
        />
        </ScrollView>
        <View style={{backgroundColor:"#fff",marginBottom:5}}>
          <View flexDirection="row"   justifyContent="space-between">
              <Text style={{marginLeft:10, fontSize:16}}>Thành tiền: </Text>
              <Text color="red" style={{fontSize:20,marginHorizontal:10}}><ReactNativeNumberFormat value={this.state.amount} /></Text>
          </View>
          <TouchableOpacity style={styles.btnSubmit}  onPress={() =>{this._checkGioHang()}} >
            <Text style={{color:"white",alignSelf:'center',fontSize:20}}>Tiến hành đặt hàng</Text></TouchableOpacity>
        </View>
      <View style={styles.bodyContainer}></View>
    </View>
        )
    }
}
const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor:"silver"
    },
    
    headerContainer: {
      flexDirection: 'row',
      paddingTop: 10,
      paddingBottom: 4,
      backgroundColor: '#a2459a',
    },
    headerText:{
      color:"white",
      textAlignVertical: 'center',
      marginLeft:width*0.23,
      fontSize:20,
    },
    itemcard:{
      backgroundColor:'#fff',
      width:width,
      height:height*0.3,
      marginTop:width/100,
    },
    listItem:{
      backgroundColor:"#fff",
      flex:1,
      alignSelf:"center",
      flexDirection:"row",
      borderRadius:5,
      width:width,
      height:height/7
    },
    bodyContainer: {
      flex: 1,
      backgroundColor: 'silver',
    },
    itemGift:{
      marginLeft:10,
      flexDirection:"row"
    },
    itemImage: {
      width: width/4,
     height:height/6,
     resizeMode:'contain'
    },
    itemInfo: {
      flexDirection: 'row',
      marginTop:height/35,
      marginLeft:5
    },
    
    itemName: {
      fontSize: 16,
      color: '#484848',
      marginVertical: 4,
      fontWeight:"bold",
    },
    itemDec:{
      marginLeft: width/20,
      marginRight:20,
      width:width*0.45,
    },
    buttonUpDown:{
     width:width/10,
     height:height/30,
    },
    btnSubmit:{
      width:width*0.9,
      height:height/18,
      marginLeft:width*0.05,
      backgroundColor:'#a2459a',
      borderRadius:10,
      marginVertical:10,
      justifyContent:'center'
    },
    address:{
      marginTop:5,
      fontSize:17
    },
    addresstitle:{
      fontWeight:'bold',
      fontSize:17
    },
    centeredView: {
      justifyContent: "center",
      alignItems: "center",
      flex:1,
    },
    modalView: {
      margin: 20,
      backgroundColor: "#fff",
      borderRadius: 20,
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
      elevation: 2,

    },
    modalText: {
      marginBottom: 15,
      fontSize:20,
      color:'#2196F3'
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText1: {
      marginBottom: 15,
      textAlign: "center",
      fontSize:20,
      color:'#a2459a'
    }
});