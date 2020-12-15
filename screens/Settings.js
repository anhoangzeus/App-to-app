import React from 'react';
import { ImageBackground, Image, StyleSheet,ScrollView, StatusBar, Dimensions, TextInput,View,LogBox } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import NumberFormat from 'react-number-format';

const { height, width } = Dimensions.get('screen');
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

import {fbApp} from "../firebaseconfig";
import "firebase/auth";
import { SafeAreaView } from 'react-navigation';

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

export function bodau(str){
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g," ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
  return str;
}

const ProductItem = ({image, name, price,PromotionPrice}) => (
  <View style={styles.itemContainer1}>
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
export default class Setting extends React.Component {
  constructor(props) {
    super(props);
    LogBox.ignoreAllLogs();
    this.itemRef = fbApp.database();
    this.state = { 
      listcate:[],
      searchText:"",
      numcart:0,
    }; 
    this.timer;
  }
 
  searchDictionary=()=>{
    var st = this.state.searchText.toLowerCase();
    bodau(st);
    this.itemRef.ref('/Products').once('value').then((snapshot) => {
      var items=[];
      snapshot.forEach( function(childSnapshot){       
        var product={
          title:'',
          price:'',
          metades:'',
          image:'',
          id: '',
          BrandID:'',
          CategoryID:'',
          PromotionPrice:0
        }
        var rs = childSnapshot.val().Name.toLowerCase();
        var des = childSnapshot.val().MetaDescription.toLowerCase();
        bodau(rs);bodau(des);
        if (rs.indexOf(st) != -1 || des.indexOf(st) != -1){        
          product.title = childSnapshot.val().Name;
          product.price=childSnapshot.val().Price;
          product.metades=childSnapshot.val().MetaDescription;
          product.image=childSnapshot.val().Image;
          product.id=childSnapshot.val().ProductID;
          product.BrandID=childSnapshot.val().BrandID;
          product.CategoryID=childSnapshot.val().CategoryID;
          product.PromotionPrice = childSnapshot.val().PromotionPrice;
          items.push(product);     
        }              
    });
 
    this.setState({
      listcate:items,
    })
  })
  }
  componentWillUnmount() {
    clearInterval(this.timer); 
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
  componentDidMount(){
    this.timer = setInterval(() => {
      this.getnumcart();
    }, 1500);
  }
  renderNofiCart = () =>{
    if(this.state.numcart == 0){
      return null;
    }
    else{
      return(
        <View style={{position:"absolute", borderRadius:25,backgroundColor:"red",alignItems:"center",marginLeft:width/13,width:width/20,marginTop:5 }}>
              <Text style={{alignSelf:'center', fontSize:10,margin:1,fontWeight:'bold',color:"white" }} numberOfLines={1}>{this.state.numcart}</Text>
        </View>
      )
    }
  };
  renderTextnull= ()=>{
    if(this.state.searchText != null && this.state.listcate == null){
      return(
        <View>
          <Text>Không tìm thấy sản phẩm</Text>
        </View>
      )
    }
    else
      return null
  }
  render() {
    const { navigation } = this.props;

    return (
    <View style={styles.screenContainer}>
    <StatusBar barStyle="light-content" />
    <View style={styles.headerContainer}>   
      <View style={styles.inputContainer}>
        <FontAwesome name="search" size={24} color="#969696" />
        <TextInput style={styles.inputText} placeholder="Bạn tìm gì hôm nay?" 
        autoFocus={true}
        onChangeText={(text) => this.setState({searchText:text})}
        onSubmitEditing={() => this.searchDictionary()}
        />
      </View>
        <TouchableOpacity style={styles.cartContainer} onPress={() => navigation.navigate("Cart")}>
           <FontAwesome name="shopping-cart" size={24} color="#fff" /> 
           {this.renderNofiCart()}
        </TouchableOpacity> 
    </View>
    <View style={styles.bodyContainer}>     
    <View style={styles.sectionContainer}>    
    <Text style={styles.sectionTitle}>Kết quả tìm kiếm</Text>
      <SafeAreaView>
      <ScrollView>
      <View style={styles.listItemContainer}>
        {this.renderTextnull()}
      <FlatList 
        horizontal={false}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        data={this.state.listcate}
        renderItem={({item})=>
        <TouchableOpacity onPress={() => navigation.navigate('Items', {id: item.id, CategoryID: item.CategoryID, BrandID: item.BrandID})}>
             <ProductItem
            name={item.title}
            image={item.image}
            price={item.price}
            PromotionPrice={item.PromotionPrice}
      />
        </TouchableOpacity>    
        }
        ></FlatList>           
      </View>  
      <View style={{height:height/7}}></View>  
      </ScrollView>
      </SafeAreaView>
      </View>
    </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  
  headerContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: '#a2459a',
  },
  inputContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 2,
    height:height/16,
  },
  inputText: {
    color: '#969696',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
    height:height/16,
    width:width*0.7,
    padding:height/125,
  },
  cartContainer: {
    paddingHorizontal: 20,
    borderRadius:15,
    width:70,
    paddingTop:10,
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollCate:{
    height: height/10,
    flexDirection: 'row',
    },
  itemContainer: {
    width: 100,
    marginRight: 12,
    marginTop: 10,
  },
  listItemContainer: {
    flexDirection: 'row',
  },
  itemImage: {
    width: width/2.5,
    height: height/4,
    resizeMode:'contain',
    alignSelf:'center'
  },
  itemName: {
    fontSize: 14,
    color: 'black',
    marginHorizontal:10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginHorizontal:10
  },
  reviewimg:{
    width:width/4,
    height:height/50,
    marginLeft:width/60
  },
  sectionContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#2f2f2f',
    marginVertical: 12,
  },
  sectionImage: {
    width: width - 24,
    height: 130,
    borderRadius: 4,
  },
  itemContainer1:{
    width: width/2.2,
    height:height/2.8,
    borderColor:'silver',
    borderWidth:1,
    borderRadius:25,
    marginRight:5,
    marginEnd:2
  },
  //
  filterContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  filterActiveButtonContainer: {
    backgroundColor: '#242424',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 10,
  },
  filterInactiveButtonContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderColor: '#5a5a5a',
    borderWidth: 1,
    marginRight: 10,
  },
  filterActiveText: {
    color: '#fff',
  },
  filterInactiveText: {
    color: '#5a5a5a',
  },
  cateImage:{
    marginTop:5,
    width:100,
    height:height/11,
    resizeMode:"center",
  }
});

 