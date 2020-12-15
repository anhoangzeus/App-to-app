import React, {useState, useEffect, Component} from 'react';
import {StyleSheet, View, Text, StatusBar, ScrollView,FlatList,Alert,ActivityIndicator,Modal,Dimensions,TouchableOpacity} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/HeaderComponent';
import {fbApp} from "../firebaseconfig";
import "firebase/auth";

const { height, width } = Dimensions.get('screen');
export default class AddressScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
         listAddress:[],
         status:false,
         loading:true,
         modalVisible:false,
         _idCanXoa:'',
         isMain:false
        }; 
      }
    RenderList = ({NumberAddress,Xa, City, Huyen,ShipName,ShipMoblie,id,Main}) =>(
        <View style={styles.listItem}>
          <View style={{flex:1, margin: 10}}>   
            <Text style={styles.address}>{NumberAddress}, {Xa}, {Huyen}, {City}</Text>
            <Text style={{marginLeft: 10}}>{ShipName} - {ShipMoblie}</Text>
            <View style={{justifyContent:'space-between', flexDirection:'row',marginTop:10}}>
            {Main ? <Text style={{marginLeft: 10, color:'#FFCC00'}}>Địa chỉ mặc định</Text>:<Text/>}
              <View style={{flexDirection:'row'}}>
                <Feather 
                  style={{marginRight:5}}
                  name='edit' 
                  color="green" 
                  size={25}
                  onPress={()=> {this.props.navigation.navigate('DetailAddressScreen', {id: id})}}
                  />
                  {
                    Main ? null:
                    <MaterialIcons 
                      name='delete' 
                      color="red" 
                      size={25}
                      onPress={()=> {this.setModalVisible(true),this.setState({
                        _idCanXoa: id, 
                        isMain: Main})}}
                    />
                  }           
              </View>             
            </View>                   
          </View >
      </View>
    );
    componentDidMount(){
      this.ListenForListAddress();
   }   
   setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };
    handleClose = () => {
      this.setState({
        modalVisible: false 
      });
    };
    _deleteAddress=()=>{
      if(this.state.isMain == false){
        fbApp.database().ref('ListAddress').child(fbApp.auth().currentUser.uid).child(this.state._idCanXoa).remove();
      }
      this.handleClose();
      this.ListenForListAddress();
    }
    ListenForListAddress = () =>{           
        fbApp.database().ref('ListAddress').child(fbApp.auth().currentUser.uid)
        .once('value').then((snapshot) => {
          var items=[];
          var items1=[];
            snapshot.forEach(function(childSnapshot){ 
              var Address= {
                  ShipName:"",
                  ShipPhone:"",
                  NumberAddress:"",
                  Xa:"",
                  Huyen:"",
                  City:"",
                  ListID:"",
                  Main: false,
              }
              var Address1= {
                  ShipName:"",
                  ShipPhone:"",
                  NumberAddress:"",
                  Xa:"",
                  Huyen:"",
                  City:"",
                  ListID:"",
                  Main: true,
            } 
            if(childSnapshot.val().Main==true){
              Address1.ShipName= childSnapshot.val().ShipName;
              Address1.ShipPhone= childSnapshot.val().ShipPhone;
              Address1.NumberAddress= childSnapshot.val().NumberAddress;
              Address1.Xa= childSnapshot.val().Xa;
              Address1.Huyen= childSnapshot.val().Huyen;
              Address1.City= childSnapshot.val().City;
              Address1.ListID= childSnapshot.val().ListID;
              items1.push(Address1);
            }else{
              Address.ShipName= childSnapshot.val().ShipName;
              Address.ShipPhone= childSnapshot.val().ShipPhone;
              Address.NumberAddress= childSnapshot.val().NumberAddress;
              Address.Xa= childSnapshot.val().Xa;
              Address.Huyen= childSnapshot.val().Huyen;
              Address.City= childSnapshot.val().City;
              Address.ListID= childSnapshot.val().ListID;
              items.push(Address);
            }          
            }) 
            var list = items1.concat(items);
            this.setState({
              listAddress:list,
              loading:false
            }) 
            if(items1[0].ListID==''){
              this.setState({status:false})
            }else{
              this.setState({status:true})
            }
        });   
    }
    renderNull = () =>{
      return(
        <View style={{flex:1, justifyContent:'center', alignItems:"center", backgroundColor:'white'}}>
        <Text style={{fontSize:20, color:"#1ba8ff"}}>Thêm địa chỉ nhận hàng ngay nào!</Text>
        <TouchableOpacity 
                      onPress={()=> {this.props.navigation.navigate('DetailAddressScreen', {id: ""})}}
                      style={styles.userContainer}>
                        <View style={styles.textContainer}>      
                            <Text style={{color:'white',fontSize:25,textAlign:'center'}}>Thêm địa chỉ mới</Text>                                
                        </View>
        </TouchableOpacity>
      </View>
      )
    }
    render(){
        const {modalVisible} = this.state;
        if (this.state.loading) {
          return (
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
              <ActivityIndicator size="large" color="dodgerblue" />
            </View>
          )
        }
        return(
            <View style={styles.screenContainer}>
            <StatusBar backgroundColor='#a2459a' barStyle="light-content"/>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.cartContainer} onPress={() =>{this.props.navigation.goBack()}}>
                        <Ionicons 
                            name='arrow-back-outline' 
                            color='white'  
                            size={25}
                            />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Thông tin địa chỉ</Text>   
                </View>
               {this.state.status ==false? 
                <this.renderNull/>            
                :
                <View style={styles.bodyContainer}>
                <ScrollView>
                <FlatList
                        pagingEnabled={false}
                        data={this.state.listAddress}
                        renderItem={({item})=>
                        <this.RenderList
                            NumberAddress={item.NumberAddress}
                            Xa={item.Xa}
                            City={item.City}
                            Huyen={item.Huyen}
                            ShipName={item.ShipName}
                            ShipMoblie={item.ShipPhone}
                            id={item.ListID}
                            Main={item.Main}
                            key={item.ListID}
                    /> 
                    }
                /> 
                  </ScrollView>  
                   
                  <TouchableOpacity 
                      onPress={()=> {this.props.navigation.navigate('DetailAddressScreen', {id: ""})}}
                      style={styles.userContainer}>
                        <View>      
                            <View style={{flexDirection:'row'}}>
                            <Ionicons name='add-circle-outline' color='green' size={28}/>
                            <Text style={styles.titletext}>Thêm địa chỉ mới</Text>            
                            </View>                       
                        </View>
                  </TouchableOpacity>
                 
              </View>                           
               }         
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
                        <Text style={styles.modalText}>Bạn có chắc bỏ xoá địa chỉ này?</Text>
                        <View style={{flexDirection:'row'}}>
                        <TouchableOpacity
                          style={{ ...styles.openButton, backgroundColor: "#2196F3", width:width/2.5 }}
                          onPress={() => {this.handleClose()}}
                        >
                          <Text style={styles.textStyle}>Giữ lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ ...styles.openButton, backgroundColor: "#2196F3",width:width/2.5,marginLeft:5}}
                          onPress={() => {this._deleteAddress()}}
                        >
                          <Text style={styles.textStyle}>Xác nhận</Text>
                        </TouchableOpacity>
                        </View>                  
                      </View>
                    </View>
              </Modal>                      
            </View>
        );
    }
}                     
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
      paddingHorizontal: 10,
      paddingVertical: 10,
      margin:10
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
        width:72,
        borderRadius:15
      },
      headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
      },
      titletext:{
        color:'green',
        fontSize:20,
        marginLeft: 20
      },
      listItem:{
        margin:10,
        backgroundColor:"#fff",
        flex:1,
        alignSelf:"center",
        flexDirection:"row",
        borderRadius:5
      },
      address:{
        marginLeft: 10,
        fontSize: 25
      },
      buttonXem:{
        paddingHorizontal: 10,
        justifyContent:"center",
        alignItems:"center", 
        backgroundColor:'#FF00FF'
      },
      textContainer:{
        backgroundColor:'green',
        width:250,
        borderRadius:5
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