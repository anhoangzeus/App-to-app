import React from 'react';
import { Animated, Dimensions, View, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
import ZaloPay from '../screens/ZaloPay/ZaloPay';
import Rating from '../screens/Rating';
import RatingDone from '../screens/RatingDone';
import CustomDrawerContent from './Menu';
import { Icon, Header } from '../components';
import { Images, materialTheme } from "../constants/";
import Profile_User from '../screens/Profile_User';
import ProfileScreen from '../screens/Profile';
import NotificationScreen from '../screens/NotificationScreen ';

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const TopStackOrder = createMaterialTopTabNavigator();
const StackProfile = createStackNavigator();

export function TopOrder(props) {
  return (
    <View style={styles.containner}>
      <View style={styles.headconteiner}>
        <TouchableOpacity style={{ width: 60, borderRadius: 10 }} onPress={() => props.navigation.navigate("App")}>
          <FontAwesome name="angle-left" size={30} color="#fff" style={{ marginLeft: width / 40 }} />
        </TouchableOpacity>
        <Text style={styles.texthead}>ĐƠN HÀNG CỦA TÔI</Text>
      </View>
      <TopStackOrder.Navigator
        tabBarOptions={{
          activeTintColor: '#a2459a',
          scrollEnabled: true,
        }}
      >
        <Tab.Screen name="OrderXuli" component={OrderXuli}
          options={{
            title: "Chờ xác nhận",
          }} />
        <Tab.Screen name="Order_LayHangScreen" component={Order_LayHangScreen}
          options={{
            title: "Chờ lấy hàng",
          }} />
        <Tab.Screen name="Order_DangVanChuyen" component={Order_DangVanChuyen}
          options={{
            title: "Đang vận chuyển",
          }} />
        <Tab.Screen name="Order_DaGiao" component={Order_DaGiao}
          options={{
            title: "Đã giao",
          }} />
        <Tab.Screen name="Order_DaHuy" component={Order_DaHuy}
          options={{
            title: "Đã huỷ",
          }} />
        <Tab.Screen name="Order_Payment" component={Order_Payment}
          options={{
            title: "Trả hàng",
          }} />
      </TopStackOrder.Navigator>
    </View>
  );
}

export function TopTabScreen(props) {
  return (
    <View style={styles.screenContainer}>
      <StatusBar backgroundColor='#a2459a' barStyle="light-content" />
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.cartContainer} onPress={() => { props.navigation.navigate("App") }}>
          <FontAwesome name="angle-left" size={30} color="#fff" style={{ marginLeft: width / 40 }} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Đánh giá sản phẩm</Text>
      </View>
      <TopTab.Navigator
        tabBarOptions={{
          activeTintColor: '#a2459a',
        }}
      >
        <TopTab.Screen name="Rating" component={Rating} options={{
          title: 'Chưa đánh giá',
        }}
        />
        <TopTab.Screen name="RatingDone" component={RatingDone} options={{
          title: "Đã đánh giá",
        }} />
      </TopTab.Navigator>
    </View>

  )
}
export function AppStack(props) {
  return (
    <Tab.Navigator
      style={{ flex: 1 }}
      initialRouteName="Trang chủ"
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
              color={focused ? "#a2459a" : null}
              family="antdesign"
              color={focused ? "#a2459a" : null}
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
              family="antdesign"
              color={focused ? "#a2459a" : null}

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
              color={focused ? "#a2459a" : null}
              color={focused ? "#a2459a" : null}
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
              color={focused ? "#a2459a" : null}
              color={focused ? "#a2459a" : null}
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
              color={focused ? "#a2459a" : null}
              color={focused ? "#a2459a" : null}
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
      <Stack.Screen name="Profile_User" component={Profile_User} />
      <Stack.Screen name="TopOrder" component={TopOrder} />
      <Stack.Screen name="Setting" component={SettingsScreen} />
      <Stack.Screen name="Components" component={ComponentsScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Items" component={ItemsScreen} />
      <Stack.Screen name="ItemsCart" component={ItemsCart} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name='View_OrderDetail' component={Route_OrderDetail} />
      <Stack.Screen name='InfoUser' component={InfoUser} />
      <Stack.Screen name="TopTabScreen" component={TopTabScreen} />
      <Stack.Screen name='Payment' component={PaymentScreen} />
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="DetailAddressScreen" component={Route_AddressDetail} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="ZaloPayScreen" component={ZaloPay} />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  containner: {
    flex: 1,
    backgroundColor: "#a2459a",
  },
  texthead: {
    color: "white",
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: width / 20
  },
  headconteiner: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingTop: 15,
    paddingBottom: 5
  },
  screenContainer: {
    flex: 1,
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
    width: 72,
    borderRadius: 15
  },
  headerText: {
    color: '#fff',
    textAlignVertical: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },

});