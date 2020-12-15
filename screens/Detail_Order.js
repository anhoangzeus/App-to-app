import React, { Component} from 'react';
import {StyleSheet, View, Text, StatusBar,Image, Dimensions, ScrollView} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/HeaderComponent';
import {fbApp} from "../firebaseconfig";
import "firebase/auth";
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { HeaderBackButton } from '@react-navigation/stack';
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

const { width, height } = Dimensions.get('screen');

export default function Route_OrderDetail({ route, navigation}) {  
    var searchContent = "";    
    if (route.params != null) {
        const { content } = route.params.id;
        console.log(content);
        searchContent = route.params.id;
    }
    return (
        <Detail_Order
            content = {searchContent}
            navigation = {navigation}
        />
    );    
};

export class Detail_Order extends Component{
    constructor(props) {
        super(props);
        this.state = {
          OrderID: "",
          CreatedDate: "",
          Status: "",
          ShipName:"",
          ShipMoblie:"",
          ShipAddress:"",
          Payment:"",
          Total:0,
          ListProduct: [],
        };
      }
      getListOrder =async()=>{
        fbApp.database().ref('Orders').child(this.props.content)
        .on('value',snapshot => {
          if(snapshot.val().Status=="1"){
            this.setState({Status:"Chờ xác nhận"})
          } else if(snapshot.val().Status=="2"){
            this.setState({Status:"Chờ lấy hàng"})
          } else if(snapshot.val().Status=="3"){
            this.setState({Status:"Đang vận chuyển"})
          } else if(snapshot.val().Status=="4"){
            this.setState({Status:"Đã giao"})
          } else if(snapshot.val().Status=="5"){
            this.setState({Status:"Đã huỷ"})
          } else if(snapshot.val().Status=="6"){
            this.setState({Status:"Trả hàng"})
          }       
          if(snapshot.val().Payment =="01"){
            this.setState({Payment:"Thanh toán khi nhận hàng"})
          } else if(snapshot.val().Payment=="02"){
            this.setState({Payment:"Thanh toán bằng thẻ tín dụng"})
          } 
          this.setState({
            OrderID:snapshot.val().OrderID,
            CreatedDate:snapshot.val().CreatedDate,
            ShipName:snapshot.val().ShipName,
            ShipMoblie:snapshot.val().ShipMoblie,
            ShipAddress:snapshot.val().ShipAddress,
          }) 
          fbApp.database().ref('OrderDetails').once('value').then((snapshot_detail)=>{
            var list_Details=[];
            var ToTalPrice = 0;       
            snapshot_detail.forEach(function(snapshot_detail){  
              var product = {
                ProductName:'',
                ProductImage:'https://ibb.co/mbtRJGd',
                Brand_Product:'',
                Quantity:'',
                Price: '',
                id:'',
                cate_Name:'',
              } 
              if(snapshot_detail.val().OrderID == snapshot.val().OrderID){
                ToTalPrice += parseInt(snapshot_detail.val().Price) * parseInt(snapshot_detail.val().Quantity)  
                product.Price = snapshot_detail.val().Price;
                product.Quantity = snapshot_detail.val().Quantity;      

                fbApp.database().ref('Products').child(snapshot_detail.val().ProductID)
                .on('value',snapshot_product =>{   

                  product.ProductName = snapshot_product.val().Name;
                  product.ProductImage = snapshot_product.val().Image;
               
                  fbApp.database().ref('Brands').child(snapshot_product.val().BrandID)
                  .on('value',snapshot_brand =>{
                    product.Brand_Product = snapshot_brand.val().Name;       
                  })
                  fbApp.database().ref('Catogorys').child(snapshot_product.val().CategoryID)
                  .on('value',snapshot_cate =>{
                    product.cate_Name = snapshot_cate.val().Name;       
                  })
                })
                product.id=snapshot_detail.val().OrderDetailID;
                list_Details.push(product); 
              }                        
            })
            this.setState({ListProduct: list_Details});
            this.setState({Total: ToTalPrice});
          })      
        })   
      }
      huy_Order =()=>{
          // fbApp.database().ref('OrderDetails').child()
      }
      componentDidMount(){
        this.getListOrder();
      }            
      RenderList = ({ProductName, BrandName, ProductImage, Quantity, Price,cate_Name}) =>(
        <View style={styles.userContainer}>
        <View>
            <Image source={{uri: ProductImage}} style={styles.sectionImage}/>              
        </View>
        <View style={{marginHorizontal: 10}}>      
            <Text style={{...styles.titletext,marginRight:width/4}}>{ProductName}</Text>
            <Text numberOfLines={3} style={styles.welcomeText}>Sản phẩm: {cate_Name}</Text>
            <Text style={styles.welcomeText}>Nhà cung cấp: {BrandName}</Text>
            <Text style={{color:'#1e88e5', fontWeight:'bold', fontSize:20, marginTop:10}}><ReactNativeNumberFormat value={Price} /> 
            <Text style={{fontSize:15, color:"black"}}>  x {Quantity}</Text></Text>          
        </View>
      </View>
      );
    render(){
        return(
            <View style={styles.screenContainer}>
                <StatusBar backgroundColor='#a2459a' barStyle="light-content"/>
                <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.cartContainer} onPress={()=>this.props.navigation.goBack()}>
                          <Ionicons 
                            name='arrow-back-outline' 
                            color='white' 
                            size={25}
                          />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Chi tiết đơn hàng</Text>
                    </View>
                    <ScrollView >
                    <View style={styles.bodyContainer}>
                    <View style={styles.userContainer}>
                        <View style={styles.textContainer}>                  
                            <Text style={styles.titletext}>Mã đơn hàng: {this.state.OrderID}</Text>                                       
                            <Text style={styles.welcomeText}>Ngày đặt hàng: {this.state.CreatedDate}</Text>
                            <Text style={styles.welcomeText}>Trạng thái: {this.state.Status}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.userContainer}>
                        <View style={styles.textContainer}>
                          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Text style={styles.titletext}>Địa chỉ người nhận</Text>
                            {this.state.Status == "Chờ xác nhận" ? 
                              <TouchableOpacity
                                onPress={()=> {this.props.navigation.navigate("AddressScreen")}}
                              >
                                  <Text style={{color:'green', fontSize:20}}>Sửa</Text>
                              </TouchableOpacity>
                              : null
                            }
                            </View>  
                            <Text style={styles.welcomeText}>Họ tên: {this.state.ShipName}</Text>
                            <Text style={styles.welcomeText}>Số điện thoại: {this.state.ShipMoblie}</Text>
                            <Text style={styles.welcomeText}>Địa chỉ: {this.state.ShipAddress}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.userContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.titletext}>Hình thức thanh toán</Text>
                            <Text style={styles.welcomeText}>{this.state.Payment}</Text>
                        </View>
                    </View>                   
                    <View style={styles.divider} />
                    <View style={{backgroundColor:'#fff',paddingVertical:5, paddingHorizontal:15,flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={styles.textorder}>Thông tin đơn hàng</Text>
                       <Text style={styles.textorder}>{this.state.ListProduct.length} Loại</Text>
                    </View>
                    <View style={{height: 2, backgroundColor:'#1e88e5', marginHorizontal:10}}/>
                    {/*  */}
                  <FlatList
                    pagingEnabled={false}
                    data={this.state.ListProduct}
                    renderItem={({item})=>
                      <this.RenderList
                        ProductName={item.ProductName}
                        BrandName={item.Brand_Product}
                        ProductImage={item.ProductImage}
                        Price={item.Price}
                        Quantity={item.Quantity}
                        cate_Name={item.cate_Name}
                      />}               
                  />    
                  </View>
                  <View style={styles.divider} />
                    <View style={{backgroundColor:'#fff',paddingTop:5,paddingBottom:10, paddingHorizontal:10,}}>            
                      <Text style={styles.textorder}>Thông tin thanh toán</Text>
                      <View style={{height: 2, backgroundColor:'#1e88e5',marginTop:2}}/>
                        <Text style={{margin:10,fontSize:20}}>Phí vận chuyển: 0 đ</Text>
                        <Text style={{marginHorizontal:10,fontSize:20}}>Tổng tiền: <ReactNativeNumberFormat value={this.state.Total} /></Text>        
                  </View>                          
                    {this.state.Status == "Chờ xác nhận" ? 
                  <TouchableOpacity
                    style={styles.totalContainer}
                    onPress={()=> {}}
                  >
                    <Text style={styles.titletext2}>Huỷ đơn hàng</Text>
                  </TouchableOpacity>
                  :
                  this.state.Status == "Đang vận chuyển" ? 
                  <View
                    style={styles.totalContainer}
                    onPress={()=> {huy_Order()}}
                  >
                    <Text style={styles.titletext2}>Đang vận chuyển</Text>
                  </View>
                  :null
                }
                </ScrollView>
            </View>
        );
    }
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
      paddingHorizontal: 15,
      paddingVertical: 15,
    },
    totalContainer:{
      paddingHorizontal: 10,
      paddingVertical: 10,
      margin:5,
      borderRadius:4,
      marginBottom:2,
      borderColor:'#1e88e5',
      borderWidth:2
    },
    textContainer: {
      flex: 1,
      marginLeft: 10,
    },
    welcomeText: {
      color: 'black',
    },
    divider: {
      height: 10,
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
        width:70
      },
      headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
      },
      titletext:{
        fontWeight: 'bold',
        color:'black',
        fontSize:20,
      },
      titletext1:{
        fontWeight: 'bold',
        color:'white',
        fontSize:20
      },
      textorder:{
        fontWeight: 'bold',
        fontSize:20,
        paddingLeft: 10 ,
        color:'#1e88e5'
      },
      sectionImage: {
        width:  width / 4,
        height: height / 8,
        borderRadius: 4,
        resizeMode:'contain'
      },
      titletext2:{
        fontSize:20,
        alignSelf:'center',
        color:'#1e88e5'
      }
  });
  