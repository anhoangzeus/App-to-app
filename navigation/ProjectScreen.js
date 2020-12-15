import React from 'react';
import { Easing, Animated, Dimensions, View , StyleSheet, Image, } from 'react-native';
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Block, Text, theme } from "galio-framework";

import ComponentsScreen from '../screens/Components';
import HomeScreen from '../screens/Home';
import ItemsScreen from '../screens/Items';
import ItemsCart from '../screens/ItemsCart';
import ProScreen from '../screens/Pro';
import SettingsScreen from '../screens/Settings';
import ProductScreen from '../screens/Product';
import Login1 from '../screens/Login1';
import Signup1 from '../screens/SignUp1';
import InfoUser from '../screens/InfoUser';
import OrderXuli from '../screens/OrderXuli';
import Order_Payment from '../screens/Order_Payment';
import Order_DaGiao from '../screens/Order_DaGiao';
import Order_DangVanChuyen from '../screens/Order_DangVanChuyen';
import Order_DaHuy from '../screens/Order_DaHuy';
import Order_LayHangScreen from '../screens/Order_LayHangScreen';
import AddressScreen from '../screens/AddressScreen';
import Route_OrderDetail from '../screens/Detail_Order';
import PaymentScreen from '../screens/Payment';
import Route_AddressDetail from '../screens/DetailAddressScreen';
import Cart from '../screens/Cart';
import ZaloPay from '../screens/ZaloPay/ZaloPay'

import CustomDrawerContent from './Menu';
import { Icon, Header } from '../components';
import { Images, materialTheme } from "../constants/";
import { TouchableOpacity } from 'react-native-gesture-handler';
import Profile_User from '../screens/Profile_User';
import ProfileScreen from '../screens/Profile';
import NotificationScreen from '../screens/NotificationScreen ';
import { color } from 'react-native-reanimated';

const { width } = Dimensions.get("screen");


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopStackOrder = createMaterialTopTabNavigator();
const StackProfile = createStackNavigator();

export function TopOrder(props){
  return(
    <View style={styles.containner}>
      <View style={styles.headconteiner}>
        <TouchableOpacity style={{width:60, borderRadius:10}} onPress={() =>props.navigation.navigate("App")}>
        <Ionicons name="arrow-back-outline" color={'white'}  size={30} />
        </TouchableOpacity> 
      <Text style={styles.texthead}>ĐƠN HÀNG CỦA TÔI</Text>
      <Ionicons name="arrow-undo" color={'#a2459a'} size={26} />
      </View>
          <TopStackOrder.Navigator
          tabBarOptions={{
          activeTintColor: '#a2459a',
          scrollEnabled: true,
        }}      
      >
      <Tab.Screen name="OrderXuli" component={OrderXuli}
       options={{
        title :"Chờ xác nhận",
      }}/>
           <Tab.Screen name="Order_LayHangScreen" component={Order_LayHangScreen}
       options={{
        title :"Chờ lấy hàng",
      }}/>
      <Tab.Screen name="Order_DangVanChuyen" component={Order_DangVanChuyen}
       options={{
        title :"Đang vận chuyển",
      }}/>
      <Tab.Screen name="Order_DaGiao" component={Order_DaGiao}
       options={{
        title :"Đã giao",
      }}/>
      <Tab.Screen name="Order_DaHuy" component={Order_DaHuy}
       options={{
        title :"Đã huỷ",
      }}/>
     <Tab.Screen name="Order_Payment" component={Order_Payment}
       options={{
        title :"Trả hàng",
      }}/>
      </TopStackOrder.Navigator>
      </View>
  );
}


export function AppStack(props) {
  return (
    <Tab.Navigator
      style={{ flex: 1 }}
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#a2459a',
      }}      
    >
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              size={24}
              name="home"
              family="ionicons"
              color={focused ? "a2459a" : materialTheme.COLORS.MUTED}
              family="antdesign"
              color={focused ? "#a2459a" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      >
      </Tab.Screen>
      <Tab.Screen
        name="Danh mục"
        component={ProScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              size={24}
              name="appstore1"
              family="ionicons"
              color={focused ? "a2459a" : materialTheme.COLORS.MUTED}
              family="antdesign"
              color={focused ? "#a2459a" : materialTheme.COLORS.MUTED}
             
            />
          )
        }}
      />
      <Tab.Screen
        name="Tìm kiếm"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              size={24}
              name="search"
              family="font-awesome"
              color={focused ? "a2459a" : materialTheme.COLORS.MUTED}
              color={focused ? "#a2459a" : materialTheme.COLORS.MUTED}
              style={{ marginRight: -3 }}
            />
          )
        }}
      />

      <Tab.Screen
        name="Thông báo"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              size={24}
              name="bells"
              family="antdesign"
              color={focused ? "a2459a" : materialTheme.COLORS.MUTED}
              color={focused ? "#a2459a" : materialTheme.COLORS.MUTED}
              style={{ marginRight: -3 }}
            />
          )
        }}
      />
      <Tab.Screen
        name="Cá nhân"
        component={Profile_User}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              size={24}
              name="user"
              family="antdesign"
              color={focused ? "a2459a" : materialTheme.COLORS.MUTED}
              color={focused ? "#a2459a" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />

      
      
    </Tab.Navigator>
  );
}

export default function ProjectStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen name="App" component={AppStack} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Pro" component={ProScreen} />
      <Stack.Screen name="Profile_User" component={Profile_User}/>
      <Stack.Screen name="TopOrder" component={TopOrder}/>
      <Stack.Screen name="Setting" component={SettingsScreen} />
      <Stack.Screen name="Components" component={ComponentsScreen} />
      <Stack.Screen name="Product" component={ProductScreen} 
      options={{
        headerBackTitleVisible:false,
        headerTitle:false,
        headerTransparent:true,

        headerTintColor:'red',
        
     headerLeft: () => (
         <Ionicons name="arrow-back-outline" size={25} backgroundColor="#d02860" />
     )
     }}/>
      <Stack.Screen name="Items" component={ItemsScreen}/>
      <Stack.Screen name="ItemsCart" component={ItemsCart}/>
      <Stack.Screen name="Cart" component={Cart}/>
      <Stack.Screen name='View_OrderDetail' component={Route_OrderDetail}/>
      <Stack.Screen name='InfoUser' component={InfoUser}/>
      <Stack.Screen name='Payment' component={PaymentScreen}/>
      <Stack.Screen name="AddressScreen" component={AddressScreen}/>
      <Stack.Screen name="DetailAddressScreen" component={Route_AddressDetail}/>
      <Stack.Screen name="NotificationScreen" component={NotificationScreen}/>
      <Stack.Screen name="ZaloPayScreen" component={ZaloPay}/>
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
    containner: {
      flex: 1,
      backgroundColor:"#a2459a",
    },
    texthead:{
      color:"white",
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    headconteiner:{
      flexDirection: 'row', 
      justifyContent:'space-between', 
      paddingHorizontal: 5, 
      paddingTop: 15,
      paddingBottom:5
    }
  });