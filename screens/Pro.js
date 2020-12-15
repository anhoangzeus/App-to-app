  import React from 'react';
  import { 
    Image, 
    StyleSheet,
    ScrollView, 
    StatusBar, 
    Dimensions, 
    Platform,
    View,
    ActivityIndicator,
    Text,
    SafeAreaView,
    Button,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ImageBackground,
  } from 'react-native';
  import NumberFormat from 'react-number-format';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
  import {fbApp} from "../firebaseconfig";
  import "firebase/auth";
  import Swiper from 'react-native-swiper';
 

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
  };
  const ProductItem = ({image, name, price,PromotionPrice}) => (
    <View style={styles.itemContainer}>
      <Image source={{uri:image}} style={styles.itemImage} />
      <Text style={styles.itemName} numberOfLines={2}>
        {name}
      </Text>
      <Text style={styles.itemPrice}><ReactNativeNumberFormat value={price}/> 
          {price === PromotionPrice? null:
          <Text style={{color:"red"}}>  -{((PromotionPrice-price)/PromotionPrice*100).toFixed(0)}%</Text>
          }
      </Text>
      <View style={{flexDirection:'row'}}>
        <Image source={require("../assets/images/star.jpg")} style={styles.reviewimg}/>
        <Text style={{color:'green',}}>(500)</Text>
      </View>
    </View>
  );
  export default class Pro extends React.PureComponent {
    constructor(props) {
      super(props);
      this.itemRef = fbApp.database();
      this.state = { 
        listcate:[],
        listbrand:[],
        listcategory:[],
        listcontents:[],
        BrandID:"",
        CatogoryID:"AIzaSyDSWIekvpvwQbRiGh4WF88H91tqFzL6OWI",
        Price:0,
        Date:"",
        loading:true,
        refreshing: false,
        numcart:0,
      }; 
      this.timer;
    };

    BrandItem = ({image,id}) => {
      return(
      <View>
        <TouchableOpacity onPress={()=> this.setState({BrandID :id})} style={styles.branditemContainer}>
              <Image source={{uri:image}} style={styles.cateImage} />
        </TouchableOpacity>
      </View>
      );
    };
    CategoryItem = ({name,id,icon}) => {
      const colorText = id === this.state.CatogoryID ? "#6e3b6e" : "#1ba8ff";
      return(
        <TouchableOpacity  onPress={()=> this.setState({CatogoryID: id})} >
          <View style={{width:width/7,height:height/15,marginHorizontal:10,
          marginVertical:5,
          justifyContent:"center"}
          }>
          <ImageBackground style={{width:width/6,height:height/13.6,
          marginVertical:5,
          justifyContent:"center"}
          }
            source={require('../assets/bg.png')}>
          <Icons name={icon} color="#fff" size={width/12} 
            style={styles.cateIcon}/>
          </ImageBackground>
          </View>

          <Text style={{textAlign:'center', fontWeight:'bold',color:colorText }}>{name}</Text>
        </TouchableOpacity>
        )
    };
    componentDidUpdate(prevProps, prevState){
      if(this.state.BrandID != prevState.BrandID || this.state.CatogoryID != prevState.CatogoryID){
        this.ListenForItemsSamsung();
      } 
    };
    componentWillUnmount() {
      clearInterval(this.timer); 
    }
    componentDidMount(){
      this.ListenForItemsSamsung();
      this.GetAllBrand();
      this.GetAllCate();
      this.getListBanner();
      this.timer = setInterval(() => {
        this.getnumcart();
      }, 1500);
    };
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
    _onRefresh = () => {
      this.setState({refreshing: true,loading:true});
      this.getListBanner();
      this.ListenForItemsSamsung();
      this.GetAllBrand();
      this.GetAllCate();
      this.getnumcart();
    };
    GetAllBrand =() =>{
      var items= [];
      this.itemRef.ref('/Brands').once('value').then((snapshot) => {
        snapshot.forEach(function (childSnapshot){
          items.push({
            image:childSnapshot.val().Image,
            id: childSnapshot.val().BrandID,
          });         
        });
        this.setState({
          listbrand:items,
      });      
    });
  };
  
  getListBanner =() =>{
    this.itemRef.ref('Contents').once('value').then((snapshot)=>{
      var items=[];
      snapshot.forEach((childSnapshot) => {
        items.push({           
          id:childSnapshot.key,
          Detail:childSnapshot.val().Detail,
          Image:childSnapshot.val().Image,
          Name:childSnapshot.val().Name,
        });
      });
      this.setState({
        listcontents:items,
        refreshing: false,
      });
    });
  };
    GetAllCate =() =>{
      var items= [];
      this.itemRef.ref('/Catogorys').once('value').then((snapshot) => {
        snapshot.forEach(function (childSnapshot){
          items.push({
            name:childSnapshot.val().Name,
            id: childSnapshot.val().CateProductID,
            icon:childSnapshot.val().Icon,
          })           
        })
        this.setState({
          listcategory:items,
          loading:false
      });  
    });
  };
  ListenForItemsSamsung = ()=>{
    var items=[];
      this.itemRef.ref('/Products').once('value').then((snapshot) => {
      var brandid = this.state.BrandID;
      var cateid = this.state.CatogoryID;
      snapshot.forEach(function (childSnapshot){
        if(brandid == ""){
          if(cateid == ""){
            items.push({
              title:childSnapshot.val().Name,
              price:childSnapshot.val().Price,
              metades:childSnapshot.val().MetaDescription,
              image:childSnapshot.val().Image,
              id: childSnapshot.val().ProductID,
              BrandID:childSnapshot.val().BrandID,
              CategoryID:childSnapshot.val().CategoryID,
              PromotionPrice : childSnapshot.val().PromotionPrice
            })    
          }else{
              if(childSnapshot.val().CategoryID == cateid){
                items.push({
                  title:childSnapshot.val().Name,
                  price:childSnapshot.val().Price,
                  metades:childSnapshot.val().MetaDescription,
                  image:childSnapshot.val().Image,
                  id: childSnapshot.val().ProductID,
                  BrandID:childSnapshot.val().BrandID,
                  CategoryID:childSnapshot.val().CategoryID,
                  PromotionPrice : childSnapshot.val().PromotionPrice
                })                
              }  
            }                    
          }else{
            if(cateid == ""){
              if(childSnapshot.val().BrandID == brandid){
                items.push({
                  title:childSnapshot.val().Name,
                  price:childSnapshot.val().Price,
                  metades:childSnapshot.val().MetaDescription,
                  image:childSnapshot.val().Image,
                  id: childSnapshot.val().ProductID,
                  BrandID:childSnapshot.val().BrandID,
                  CategoryID:childSnapshot.val().CategoryID,
                  PromotionPrice : childSnapshot.val().PromotionPrice
                })                
              }  
            }else{
              if(childSnapshot.val().BrandID == brandid && childSnapshot.val().CategoryID == cateid ){
                items.push({
                  title:childSnapshot.val().Name,
                  price:childSnapshot.val().Price,
                  metades:childSnapshot.val().MetaDescription,
                  image:childSnapshot.val().Image,
                  id: childSnapshot.val().ProductID,
                  BrandID:childSnapshot.val().BrandID,
                  CategoryID:childSnapshot.val().CategoryID,
                  PromotionPrice : childSnapshot.val().PromotionPrice
                })                
              }  
            }                
          }
        })
      this.setState({
        listcate:items,
      });    
    });    
  };
  renderNofiCart = () =>{
    if(this.state.numcart == 0){
      return null;
    }
    else{
      return(
        <View style={{position:"absolute", borderRadius:25,backgroundColor:"red",alignItems:"center",marginLeft:width/30,width:width/20}}>
         <Text style={{alignSelf:'center', fontSize:10,margin:1,fontWeight:'bold',color:'white'}} numberOfLines={1}>{this.state.numcart}</Text>
    </View>
      )
    }
  };
  render() {
    const { navigation } = this.props;
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, backgroundColor:'#fff', justifyContent:'center'}}>
        <StatusBar barStyle='light-content' backgroundColor='#a2459a'/>
        <Image source={require('../assets/homeloading.png')} style={{width:width,height:height,resizeMode:'contain'}}/>
        <ActivityIndicator size='large' color="'#a2459a" style={{position:'absolute', alignSelf:'center'}}/>
      </View>
      )
    }
    return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
      <TouchableOpacity  onPress={()=> navigation.navigate("Tìm kiếm")}>
      <View style={styles.inputContainer}>
            <FontAwesome name="search" size={24} color="#969696" />
            <Text style={styles.inputText}>Bạn tìm gì hôm nay?</Text>
        </View>
        </TouchableOpacity>
        <View style={styles.cartContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Cart")}>    
              <FontAwesome name="shopping-cart" size={24} color="#fff" /> 
              {this.renderNofiCart()}
            </TouchableOpacity>       
      </View>     
    </View>
      <View style={styles.bodyContainer}> 
    <ScrollView
       refreshControl={
        <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
        />}
      >
          <Swiper 
            autoplay={true}
            autoplayTimeout={2}
            loop={true}
            showsPagination={true}
            showsButtons={true}
            index={0}
            width={width}
            height={height / 4.2}>
            {this.state.listcontents.map((item)=>
              <TouchableOpacity 
                key={item.id}
                onPress={() => {}}>
                  <View style={styles.sectionContainer}>
                    <Image source={{uri: item.Image}} style={styles.sectionImage} />
                  </View>
              </TouchableOpacity>)}
          </Swiper>
        <View style={{backgroundColor:'#fff'}}>
        <View style={{height:2, backgroundColor:'#a2459a'}}/>
          <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            data={this.state.listcategory}
            renderItem={({item })=>
              <this.CategoryItem           
                name={item.name}
                id={item.id}
                icon={item.icon}
              />}
            keyExtractor={(item) => item.id}
            extraData={this.state.CatogoryID}
          />    
          <FlatList 
            style={{marginTop:10}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={this.state.listbrand}
            renderItem={({item})=>
              <this.BrandItem           
                image={item.image}
                id={item.id}
              />}
            keyExtractor={item => item.id}
          /> 
          <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false} style={{marginVertical:15}}>
          <TouchableOpacity style={{marginHorizontal:5}}>
            <Text style={styles.textnum}>Dưới 2 triệu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginHorizontal:5}}>
            <Text style={styles.textnum}>Từ 2 - 4 triệu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginHorizontal:5}}>
            <Text style={styles.textnum}>Từ 4 - 7 triệu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginHorizontal:5}}>
            <Text style={styles.textnum}>Từ 7 - 13 triệu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginHorizontal:5}}>
            <Text style={styles.textnum}>Từ 13 - 20 triệu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginHorizontal:5}}>
            <Text style={styles.textnum}>Trên 20 triệu</Text>
          </TouchableOpacity>
     </ScrollView>                                          
      <View style={{height:5, backgroundColor:'#a2459a'}}/>
        <View style={styles.listItemContainer}>
          <FlatList 
            initialNumToRende={3}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={this.state.listcate}
            renderItem={({item})=>
              <TouchableOpacity onPress={() => navigation.navigate('Items', {id: item.id, CategoryID: item.CategoryID, BrandID: item.BrandID})}>
                <ProductItem
                  name={item.title}
                  image={item.image}
                  price={item.price}
                  PromotionPrice={item.PromotionPrice}
                />                   
              </TouchableOpacity>}
            keyExtractor={item => item.id}
          />     
        </View>   
      </View>  
      <View style={{height:20, backgroundColor:'#fff'}}></View>
    </ScrollView>  
    </View>   
    </View>
      );
    };
  };
  const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: 'row',
      paddingTop: 15,
      paddingBottom: 4,
      backgroundColor: '#a2459a',
    },
    inputContainer: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      flex: 1,
      marginLeft: 10,
      alignItems: 'center',
      paddingVertical: height/50,
      paddingHorizontal: 12,
      borderRadius: 2,
      height:height/10,
      width:width*0.8,
    },
    inputText: {
      color: '#969696',
      fontSize: 14,
      marginLeft: 8,
      fontWeight: '500',
    },
    cartContainer: {
      paddingHorizontal: 15, 
      justifyContent: 'center',
      width:75,
      borderRadius:15,
      paddingTop:5,
    },
    bodyContainer: {
      flex: 1,
      backgroundColor: '#a2459a',
      marginTop:1,
    },
    scrollCate1:{
        height: height/12,
        flexDirection: 'row',
    },
    itemContainer: {
      alignItems:'center',
      width: width/2,
      height:height/3.6,
      margin: -0.2,
      borderColor:'#a2459a',
      borderWidth: 1,     
    },
    listItemContainer: {
      flexDirection: 'row',
    },
    itemImage: {
      width: 150,
      height: 150,
      marginTop:5,
      resizeMode: 'contain'
    },
    itemName: {
      fontSize: 14,
      color: '#484848',
    },
    itemPrice: {
      fontSize: 16,
      fontWeight: '500',
      color: '#2a2a2a',
    },
    cateImage:{
      marginVertical:5,
      width:width/6.5,
      height:height/20,
      resizeMode:"contain",
    },
    cate:{
      margin:5,
      width:width/3,
      height:height/10,
      resizeMode:"center",
    },
    cate1:{
      margin:5,
      width:width/4.25,
      height:height/12,
      resizeMode:"center",
    },
    button1:{
      borderColor:'#1ba8ff', 
      borderLeftWidth:5
    },
    sectionImage: {
      width: width - 24,
      height: height/4.5,
      borderRadius: 10,
      resizeMode:'center',
      margin:10
    },
    textnum:{
      fontSize:15,
      color:'#1ba8ff'
    },
    itemImage1: {
      width: 100,
      height: 120,
      resizeMode:'contain'
    },
    reviewimg:{
      width:width/4,
      height:height/50,
      marginLeft:width/60
    },
    branditemContainer:{
      marginHorizontal:5,
      borderStyle:"solid",
      width:width/4.5,
      height:height/13,
      justifyContent:"center",
      alignItems:'center',
      borderWidth:2,
      borderRadius:70, 
      borderColor:'#a2459a'
    },
    cateIcon:{
      marginHorizontal:14, 
      borderRadius:30,
      marginVertical:5,
      marginLeft:width/40,
      alignSelf:'center'
    },
  });
  
   