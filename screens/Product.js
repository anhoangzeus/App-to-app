import React,{Component} from 'react';
import { 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Alert,
  View,
  Button,
  Text,
  StatusBar,
  FlatList,
  Modal,
  TouchableHighlight,
  Animated
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {fbApp} from "../firebaseconfig";
import "firebase/auth";
import NumberFormat from 'react-number-format';
import { HeaderBackButton } from '@react-navigation/stack';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;
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
export default class Product extends React.Component {
  constructor(props) {
    super(props);
    this.itemRef = fbApp.database();
    this.state = {
      numcart:0,
      Decription: "",
      Image: "",
      Name: "",
      Price: "",
      Waranty:"",
      PromotionPrice:"",
      MetaDescription:"",
      List_Productlienquan:[],
      List_MoreImage:[],
      idsanpham:this.props.content,
      listcart:[],
      modalVisible:false,
      scrollY: new Animated.Value(0),
    };
    this.timer;
  };
  addCart =()=>{
    const Id_Item = this.state.idsanpham;
    var key;
    var product={
      image:'https://i.ibb.co/dj6fBrX/empty.jpg',
      Name:'',
      Price:'',
      ProductID:'',
      Quantity:0,
    }
    var temp =0;
    this.state.listcart.forEach(function(element){
      console.log("id san pham trong gio hang:"+ element.Id);
      if(element.Id == Id_Item){
        console.log("đã trùng");
        element.Quantity+=1;
        temp +=1;
        product.image=element.Picture;
        product.Name=element.Name;
        key=element.key;
        product.Price=element.Price;
        product.ProductID=element.Id;
        product.Quantity=element.Quantity;
      }
    })
    if(fbApp.auth().currentUser != null){ 
    if(temp == 0){
      this.itemRef.ref('/Cart/'+fbApp.auth().currentUser.uid).child(this.props.content).set({
        Id :this.props.content,
        CategoryID :this.props.CategoryID,
        BrandID : this.props.BrandID,
        Name:this.state.Name,
        Picture:this.state.Image,
        Price: this.state.Price,
        Quantity:1,
      })
    }
    else {
      this.itemRef.ref('/Cart/'+fbApp.auth().currentUser.uid+"/"+key).set({
        Id:product.ProductID,
        CategoryID :this.props.CategoryID,
        BrandID : this.props.BrandID,
        Name:product.Name,
        Picture:product.image,
        Price:product.Price,
        Quantity:product.Quantity,
      })
    }
    this.GetCartData();
  }
  else{
    this.props.navigation.navigate("Top");
  }
  this.setModalVisible(true);
}
getnumcart=()=> {
  if(fbApp.auth().currentUser){ 
    this.itemRef.ref('Cart/'+fbApp.auth().currentUser.uid).once('value').then((snapshot) => {
      var dem = 0;
      snapshot.forEach(function(childSnapshot){
      dem += childSnapshot.val().Quantity;
      });
      this.setState({
      numcart:dem,
      });  
    });  
  }
}
getItemRespon=()=>{
  var CategoryID = this.props.CategoryID;
  var BrandID = this.props.BrandID;
  var ProductID = this.state.idsanpham;
  this.itemRef.ref('Products').once('value').then((snapshot)=>{
      var items= [];
      snapshot.forEach(function(snapshot){
        if(snapshot.val().ProductID != ProductID){
          if(snapshot.val().CategoryID == CategoryID){
            if(snapshot.val().BrandID == BrandID){
              items.push({
                image : snapshot.val().Image,
                Name : snapshot.val().Name,
                Price : snapshot.val().Price,
                proid : snapshot.val().ProductID,
              });    
            }                      
          }
        }
      });
      this.setState({
        List_Productlienquan:items
      });
    });
  };
getData =()=>{
    var ImageItems=[];
    this.itemRef.ref('/Products/').child(this.state.idsanpham)
    .on('value',snapshot => {
      this.setState({
        Decription:snapshot.val().Description,
        Image:snapshot.val().Image,
        Name:snapshot.val().Name,
        Price:snapshot.val().Price,
        Waranty:snapshot.val().Warranty,
        MetaDescription:snapshot.val().MetaDescription,
        PromotionPrice:snapshot.val().PromotionPrice,
      });
      ImageItems.push(snapshot.val().Image);
    });
    this.itemRef.ref('/Products/').child(this.state.idsanpham).child('MoreImages')
    .once('value').then((snapshot)=>{
      snapshot.forEach((child)=>{
        ImageItems.push(
          child.val().Image
        )
      })
    })
    this.setState({
      List_MoreImage:ImageItems
    })
};
  GetCartData = ()=>{
    if(fbApp.auth().currentUser){
      this.itemRef.ref('Cart/'+fbApp.auth().currentUser.uid).once('value').then((snapshot) => {
        var items =[];
        snapshot.forEach(function(childSnapshot){
          var product={
          key:'',
          Id:'',
          Name:'',
          Picture:'',
          Price:'',
          Quantity:0,
          }
          product.key=childSnapshot.key;
          product.Id=childSnapshot.val().Id;
          product.Name=childSnapshot.val().Name;
          product.Picture=childSnapshot.val().Picture;
          product.Price=childSnapshot.val().Price;
          product.Quantity=childSnapshot.val().Quantity;
          items.push(product);
        });
        this.setState({
          listcart:items,
        });   
      });  
    };
  };
  ProductItem = ({image, Name, Price}) => (
    <View style={styles.itemContainer}>
      <Image source={{uri: image}} style={styles.itemImage1}/>
      <Text style={styles.itemName} numberOfLines={2}>{Name}</Text>
      <ReactNativeNumberFormat value={Price} />
    </View>
  );
  renderNofiCart = () =>{
    if(this.state.numcart == 0){
      return null;
    }
    else{
      return(
        <View style={styles.cartposition}>
          <Text style={{color:"white"}}>{this.state.numcart}</Text>
        </View>
      );
    }
  };
  setModalVisible = (visible) => {
    if(fbApp.auth().currentUser){
      this.setState({ modalVisible: visible },()=> {setTimeout(this.handleClose,1000)});
    }
  };
  handleClose = () => {
    this.setState({
      modalVisible: false 
    });
  };
  componentDidMount(){
    this.getData();
    this.getItemRespon();
    this.GetCartData();
    this.timer = setInterval(() => {
      this.getnumcart();
    }, 1500);
  };

  componentDidUpdate(prevProps, prevState){
    if(this.state.idsanpham != prevState.idsanpham){
      this.getData();
      this.getItemRespon();
    }
  };

  render() {
    console.log(this.state.List_MoreImage);
    const { navigation } = this.props;
    const { modalVisible ,PromotionPrice,Price,List_Productlienquan} = this.state;
    const HEADER_MAX_HEIGHT = height/10;
    const HEADER_MIN_HEIGHT = height/30;
    const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT + HEADER_MIN_HEIGHT;
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [HEADER_MAX_HEIGHT/2.5, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MIN_HEIGHT,HEADER_MAX_HEIGHT],
      extrapolate: 'clamp',
    });
    return (
      <View  style={{flex:1,backgroundColor:"#ededed"}}>
        <StatusBar barStyle='dark-content'  backgroundColor="transparent" translucent={true}/>
        <Animated.View style={[styles.headerFont1,{height: headerHeight}]} >
            <TouchableOpacity style={{width:50,height:30,backgroundColor:'#a2459a', borderRadius:25,alignItems:'center',marginLeft:5,justifyContent:'center',marginTop:10}} onPress={()=> navigation.goBack()}> 
              <FontAwesome name="chevron-left" size={25} color="white"/>
            </TouchableOpacity>
            <TouchableOpacity style={{width:50,height:30,backgroundColor:'#a2459a', borderRadius:25,marginLeft:width*0.45,alignItems:'center',justifyContent:'center',marginTop:10}} onPress={()=> navigation.navigate("Setting")}> 
              <FontAwesome name="search" size={25} color="white"/>
            </TouchableOpacity>
            <TouchableOpacity style={{width:50,height:30,backgroundColor:'#a2459a', borderRadius:25,marginLeft:width*0.01,alignItems:'center',justifyContent:'center',marginTop:10}} onPress={() => navigation.navigate("App")}>
              <FontAwesome name="home" size={30} color="white" />
            </TouchableOpacity>
          <View>
            <TouchableOpacity style={{width:50,height:30,backgroundColor:'#a2459a', borderRadius:25,marginLeft:width*0.01,alignItems:'center',justifyContent:'center',marginTop:10}} onPress={() => navigation.navigate("Cart")} >
              <FontAwesome name="shopping-cart" size={30} color="white" />
            </TouchableOpacity>  
            {this.renderNofiCart()}    
            </View>
        </Animated.View>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
         )}
        >
            <Swiper 
              loop={true}
              showsPagination={true}
              index={0}
              width= {width}
              height= {height/2}
            >
              {this.state.List_MoreImage.map((item)=>
                    <View backgroundColor="white"  style={styles.profileContainer}>
                    <Image source={{uri : item}} 
                            style={styles.profileImage}/>
                      </View>
              )}
            </Swiper>
         <View style={styles.headerFont} >
            <TouchableOpacity style={{width:50,backgroundColor:'#a2459a', borderRadius:25,alignItems:'center',marginLeft:5,justifyContent:'center',marginTop:10}} onPress={()=> navigation.goBack()}> 
              <FontAwesome name="chevron-left" size={25} color="white"/>
            </TouchableOpacity>
            <TouchableOpacity style={{width:50,backgroundColor:'#a2459a', borderRadius:25,marginLeft:width*0.45,alignItems:'center',justifyContent:'center',marginTop:10}} onPress={()=> navigation.navigate("Setting")}> 
              <FontAwesome name="search" size={25} color="white"/>
            </TouchableOpacity>
            <TouchableOpacity style={{width:50,backgroundColor:'#a2459a', borderRadius:25,marginLeft:width*0.01,alignItems:'center',justifyContent:'center',marginTop:10}} onPress={() => navigation.navigate("App")}>
              <FontAwesome name="home" size={30} color="white" />
            </TouchableOpacity>
          <View>
            <TouchableOpacity style={{width:50,backgroundColor:'#a2459a', borderRadius:25,marginLeft:width*0.01,alignItems:'center',justifyContent:'center',marginTop:10}} onPress={() => navigation.navigate("Cart")} >
              <FontAwesome name="shopping-cart" size={30} color="white" />
            </TouchableOpacity>  
                {this.renderNofiCart()}    
                </View>
                </View>
          <View  style={styles.options}>
          <View>
              <View >
              <Text color="Black"  style={{ paddingBottom: 8 ,fontSize:18,marginLeft:width/40}}>{this.state.Name}</Text>
              <View style={{flexDirection:'row'}}>
                <Image source={require("../assets/images/star.jpg")} style={{width:width/4,height:height/40,marginLeft:width/40}}/>
                <TouchableOpacity style={{marginLeft:10,}}><Text style={{ color:'green'}}>(Xem 518 đánh giá)</Text></TouchableOpacity>
              </View>
              <Text  style={{marginVertical: 10,fontSize:25,fontWeight:"bold",marginLeft:width/40}}>{this.state.MetaDescription}</Text>
              <View style={{flexDirection:'row', alignItems:'center', marginBottom:10}}>
                <Text color="Black"  style={{ fontSize:24,marginLeft:width/40, color:'black', fontWeight:'bold' }}><ReactNativeNumberFormat value={Price}/> </Text>
                {Price === PromotionPrice ? 
                  null:
                  <View style={{flexDirection:'row'}}>
                  <Text style={{textDecorationLine:"line-through", fontSize:15, marginLeft:15, color:"#696969"}}>
                  <ReactNativeNumberFormat value={PromotionPrice}/>
                  </Text>
                  <Text style={{marginLeft:5, color:'red'}}>
                    -{((PromotionPrice-Price)/PromotionPrice*100).toFixed(0)}%</Text>
                </View>
                }               
              </View>   
                <View>  
                    <Text  style={{marginBottom: 10,fontSize:15,fontWeight:"bold",marginLeft:width/40}}>{this.state.Waranty} tháng bảo hành</Text>
              </View>    
              </View>
            </View>
          <View> 
        </View>    
        </View>
        <View style={styles.centeredView}>
              <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                  }}
               >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <FontAwesome5 name="cart-plus" size={40} color="#a2459a"/>
                      <Text style={styles.modalText}>Thêm thành công!</Text>
                    </View>
                  </View>
             </Modal>  
        </View>    
        <View style={{height:5}}/>
        {List_Productlienquan.length==0 ? null:
        <View style={{backgroundColor:'#fff',height:height/3.5}}>
        <Text bold size={12} style={{marginVertical: 10,marginLeft:width/40, fontWeight:'bold'}}>Sản phẩm tương tự</Text>
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginHorizontal:10}}
            data={List_Productlienquan}
                renderItem={({item})=>
                <TouchableOpacity  onPress={() => this.setState({idsanpham:item.proid})}>
                    <this.ProductItem           
                    image={item.image}
                    Name={item.Name}
                    Price={item.Price}
                    
                />
                </TouchableOpacity>                    
            }
            keyExtractor={item => item.proid}                
        />        
      </View>   
        }
       
          <View style={{height:5}}/>
          <View style={{backgroundColor:'#fff'}}>
          <Text bold size={12} style={{marginVertical: 10,marginLeft:width/40,fontWeight:'bold'}}>Mô tả sản phẩm</Text>
          <Text muted size={12} style={{marginHorizontal:width/40}}>  {this.state.Decription}</Text>         
          <View style={{height:25}}/>
          </View>
        </ScrollView>
   
        <View style={styles.centeredView}>
              <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                  }}
               >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <FontAwesome5 name="cart-plus" size={40} color="#a2459a"/>
                      <Text style={styles.modalText}>Thêm thành công!</Text>
                    </View>
                  </View>
             </Modal>  
        </View>  
        <View style={styles.devide} />
        <View style={{backgroundColor:"#fff",flexDirection:"row",height:height/16, justifyContent:'center'}}>
          <TouchableOpacity style={styles.btnmua} onPress={this.addCart}>
            <Text style={{color:'#fff', fontSize:20,  fontWeight:'bold'}}>Chọn mua</Text>
          </TouchableOpacity>
        </View>
      </View> 
    );
  };
};
const styles = StyleSheet.create({
  headerFont:{
    flexDirection:"row",
    position:'absolute',
    width:width
  },
  headerFont1:{
    flexDirection:"row",
    paddingTop:height/30,
    overflow: 'hidden',
    backgroundColor:'#fff',
    width:width
  },
  devide:{
    height:2
  },
  profileImage: {
    width: width,
    height: height/2,
    resizeMode:'contain',
  },
  profileContainer: {
    width: width,
    height: height/2,
  },
  options: {
    position: 'relative',
    paddingTop: -5,
    backgroundColor: "#fff",
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure,
    resizeMode: 'contain',
    marginLeft:10
  },
  itemContainer: {
    width: width/3.5,
    marginRight: 12,
    marginTop: 10,
  },
  itemImage1: {
    width: 100,
    height: 120,
    resizeMode:'contain',

  },
  cartposition:{
    position:"absolute", 
    borderRadius:15,
    backgroundColor:"red",
    height:15,
    width:20,
    alignItems:"center",
    justifyContent:"center",
    marginLeft:width/11,
    marginTop:height/70
  },
  btnmua:{
    width:width/1.1, 
    backgroundColor:"#a2459a", 
    justifyContent:'center',
    borderRadius:5, 
    marginVertical:5,
    alignItems:'center',
  
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

});