import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, FlatList, Text, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl, } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fbApp } from "../firebaseconfig";
import Header from '../components/HeaderComponent';

const { width, height } = Dimensions.get('screen');
const renderTrangThai = (Status) => {
  if (Status == 1) {
    return (
      <View>
        <Text style={{ color: "green" }}>Đơn hàng đang chờ xác nhận</Text>
      </View>
    )
  } else if (Status == 2) {
    return (
      <View>
        <Text style={{ color: "green" }}>Đơn hàng đang chờ lấy hàng</Text>
      </View>
    )
  } else if (Status == 3) {
    return (
      <View>
        <Text style={{ color: "green" }}>Đơn hàng đang giao hàng</Text>
      </View>
    )
  } else if (Status == 4) {
    return (
      <View>
        <Text style={{ color: "green" }}>Đơn hàng đã giao thành công.
        <Text style={{ color: '#000' }}> Bạn hãy đánh giá để giúp người dùng khác hiểu hơn về sản phẩm.</Text>
        </Text>
      </View>
    )
  } else if (Status == 5) {
    return (
      <View>
        <Text style={{ color: "green" }}>Đơn hàng đã bị huỷ</Text>
      </View>
    )
  } else {
    return (
      <View>
        <Text style={{ color: "green" }}>Đơn hàng bị trả</Text>
      </View>
    )
  }

}
const renderTimeLine = (name, item) => {
  return (
    <View style={{ flexDirection: 'row', marginVertical: 8 }}>
      <View style={{ width: 2, backgroundColor: '#a2459a' }} />
      <View style={{ marginLeft: 10 }}>
        <Text>{name}</Text>
        <Text>Ngày {item}</Text>
      </View>
    </View>

  );
}
export default class NotificationScreen extends Component {
  constructor (props) {
    super(props);
    this.itemRef = fbApp.database();
    this.state = {
      listThongBao: [],
      listOrder: [],
      loading: true,
      ischoose: 1,
      isdropdownid: "",
      refreshing: false,
    };
  }
  componentDidMount() {
    this.getThongBao();
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getThongBao();
    this.getListOrder();
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.state.ischoose != prevState.ischoose) {
      this.getThongBao();
    }
  };
  getListOrder = () => {
    this.itemRef.ref('Orders').once('value').then((snapshot) => {
      var items = [];
      snapshot.forEach((child) => {
        var order = {
          orderId: "",
          createdated: "",
          payment: "",
          Status: "",
          TimeLine: {
            ChoXacNhan: "",
            ChoLayHang: "",
            DangVanChuyen: "",
            DaGiaoHang: "",
            DaHuy: "",
            TraHang: ""
          },
        }
        if (child.val().CustomerID == fbApp.auth().currentUser.uid) {
          order.orderId = child.val().OrderID;
          order.createdated = child.val().CreatedDate;
          order.payment = child.val().Payment;
          order.Status = child.val().Status;
          order.TimeLine.ChoXacNhan = child.child('TimeLine').val().ChoXacNhan;
          order.TimeLine.ChoLayHang = child.child('TimeLine').val().ChoLayHang;
          order.TimeLine.DangVanChuyen = child.child('TimeLine').val().DangVanChuyen;
          order.TimeLine.DaGiaoHang = child.child('TimeLine').val().DaGiaoHang;
          order.TimeLine.DaHuy = child.child('TimeLine').val().DaHuy;
          order.TimeLine.TraHang = child.child('TimeLine').val().TraHang;
          items.push(order);
        }
      });
      this.setState({ listOrder: items, refreshing: false });
    });
  }
  getThongBao = () => {
    this.itemRef.ref('Announces').once('value').then((snapshot) => {
      var items = [];
      snapshot.forEach((child) => {
        if (child.val().Status == true)
          if (this.state.ischoose == 2) {
            if (child.val().Type == 2) {
              items.push({
                Id: child.val().Id,
                Details: child.val().Details,
                Title: child.val().Title,
                CreatedDate: child.val().CreatedDate,
                Type: child.val().Type,
                Url: child.val().Url,
              })
            }
          } else if (this.state.ischoose == 3) {
            if (child.val().Type == 1) {
              items.push({
                Id: child.val().Id,
                Details: child.val().Details,
                Title: child.val().Title,
                CreatedDate: child.val().CreatedDate,
                Type: child.val().Type,
                Url: child.val().Url,
              })
            }
          } else if (this.state.ischoose == 1) {
            items.push({
              Id: child.val().Id,
              Details: child.val().Details,
              Title: child.val().Title,
              CreatedDate: child.val().CreatedDate,
              Type: child.val().Type,
              Url: child.val().Url,
            })
          }
      });
      this.setState({ listThongBao: items, loading: false, refreshing: false });
    })
  }
  renderOrder = ({ item }) => {
    const { isdropdownid } = this.state;
    return (
      <View style={{ justifyContent: 'space-between' }}>
        <View style={{ ...styles.itemContainer, flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => {
            item.Status == 4 ? this.props.navigation.navigate("TopTabScreen") :
              this.props.navigation.navigate('View_OrderDetail', { id: item.orderId })
          }}
            style={{ width: width / 1.5 }}>
            <Text style={{ color: "#1ba8ff" }}>Mã đơn hàng {item.orderId}</Text>
            <Text style={{ color: "#000" }}>{item.payment == "01" ? "Thanh toán khi nhận hàng" : "Đã thanh toán trực tuyến"}</Text>
            {renderTrangThai(item.Status)}
            <Text style={{ color: '#000' }}><MaterialCommunityIcons name="clock" size={13} />  {item.createdated}</Text>
          </TouchableOpacity>
          {isdropdownid == item.orderId ?
            <TouchableOpacity onPress={() => this.setState({ isdropdownid: "" })}
              style={{ justifyContent: 'center', alignSelf: 'center', height: width / 12, width: width / 12 }}>
              <MaterialCommunityIcons name="apple-keyboard-control" size={25} color="#000" />
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => this.setState({ isdropdownid: item.orderId })}
              style={{ justifyContent: 'center', alignSelf: 'center', height: width / 12, width: width / 12 }}>
              <MaterialCommunityIcons name="chevron-down" size={25} color="#000" />
            </TouchableOpacity>
          }
        </View>
        {isdropdownid == item.orderId ?
          <View style={{ backgroundColor: '#dddddd', paddingHorizontal: 10 }}>
            {item.TimeLine.ChoXacNhan == "" ? null :
              renderTimeLine("Xác nhận đã nhận đơn hàng", item.TimeLine.ChoXacNhan)
            }
            {item.TimeLine.ChoLayHang == "" ? null :
              renderTimeLine("Nhận kiện hàng thành công", item.TimeLine.ChoLayHang)
            }
            {item.TimeLine.DangVanChuyen == "" ? null :
              renderTimeLine("Đang vận chuyển", item.TimeLine.DangVanChuyen)
            }
            {item.TimeLine.DaGiaoHang == "" ? null :
              renderTimeLine("Đã giao hàng thành công", item.TimeLine.DaGiaoHang)
            }
            {item.TimeLine.DaHuy == "" ? null :
              renderTimeLine("Xác nhận huỷ đơn hàng", item.TimeLine.DaHuy)
            }
            {item.TimeLine.TraHang == "" ? null :
              renderTimeLine("Xác nhận trả hàng", item.TimeLine.TraHang)
            }
          </View>
          : null}
      </View>
    );
  }
  NotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => this.props.navigation.navigate("Contents", { id: item.Url })} >
      <View style={styles.itemTopContainer}>
        <View
          style={[
            styles.itemTypeContainer,
            {
              backgroundColor: item.Type === 1 ? '#a2459a' : '#dc3988',
            },
          ]}>
          <MaterialCommunityIcons
            name={item.Type === 1 ? 'sale' : 'backup-restore'}
            color="#fff"
            size={22}
          />
        </View>
        <View style={styles.itemTopTextContainer}>
          <Text style={styles.itemName}>{item.Title}</Text>
          <Text style={styles.itemDate}>{item.CreatedDate}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.itemDetail}>{item.Details}</Text>
      </View>
    </TouchableOpacity>
  );
  render() {
    const { listThongBao, loading, ischoose, listOrder } = this.state;
    return (
      <View style={styles.screenContainer}>
        <StatusBar barStyle="light-content" />
        <Header title="Thông báo" />
        <View style={styles.bodyContainer}>
          <View>
            <TouchableOpacity onPress={() => this.setState({ ischoose: 1 })}
              style={ischoose == 1 ? styles.buttonActiveContainer : styles.buttonInactiveContainer}>
              {ischoose == 1 ? <View style={styles.activeMark} /> : null}
              {ischoose == 1 ? null :
                <View style={{ backgroundColor: 'red', width: 10, height: 10, borderRadius: 10, marginLeft: width / 28 }} />
              }
              <MaterialCommunityIcons
                name="home"
                color={ischoose == 1 ? "#a2459a" : "#949494"}
                size={25}
                style={ischoose == 1 ? styles.activeIcon : null}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ ischoose: 2 })}
              style={ischoose == 2 ? styles.buttonActiveContainer : styles.buttonInactiveContainer}>
              {ischoose == 2 ? <View style={styles.activeMark} /> : null}
              {ischoose == 2 ? null :
                <View style={{ backgroundColor: 'red', width: 10, height: 10, borderRadius: 10, marginLeft: width / 28 }} />
              }
              <MaterialCommunityIcons
                name="backup-restore"
                color={ischoose == 2 ? "#a2459a" : "#949494"}
                size={25}
                style={ischoose == 2 ? styles.activeIcon : null}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ ischoose: 3 })}
              style={ischoose == 3 ? styles.buttonActiveContainer : styles.buttonInactiveContainer}>
              {ischoose == 3 ? <View style={styles.activeMark} /> : null}
              {ischoose == 3 ? null :
                <View style={{ backgroundColor: 'red', width: 10, height: 10, borderRadius: 10, marginLeft: width / 28 }} />
              }
              <MaterialCommunityIcons
                name="sale"
                color={ischoose == 3 ? "#a2459a" : "#949494"}
                size={25}
                style={ischoose == 3 ? styles.activeIcon : null}
              />
            </TouchableOpacity>
            {fbApp.auth().currentUser ?
              <TouchableOpacity onPress={() => { this.getListOrder(), this.setState({ ischoose: 4 }) }}
                style={ischoose == 4 ? styles.buttonActiveContainer : styles.buttonInactiveContainer}>
                {ischoose == 4 ? <View style={styles.activeMark} /> : null}
                {ischoose == 4 ? null :
                  <View style={{ backgroundColor: 'red', width: 10, height: 10, borderRadius: 10, marginLeft: width / 28 }} />
                }
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  color={ischoose == 4 ? "#a2459a" : "#949494"}
                  size={25}
                  style={ischoose == 4 ? styles.activeIcon : null}

                />
              </TouchableOpacity> : null}

          </View>
          {loading ?
            <View style={{ ...styles.listContainer, justifyContent: 'center', backgroundColor: '#fff' }}>
              <ActivityIndicator size='large' color="'#a2459a" style={{ position: 'absolute', alignSelf: 'center' }} />
            </View>
            :
            ischoose == 4 ?
              <View style={styles.listContainer}>
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                  }
                  data={listOrder}
                  keyExtractor={(item) => item.Id}
                  renderItem={({ item }) => <this.renderOrder item={item} />}
                />
              </View>
              :
              <View style={styles.listContainer}>
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                  }
                  data={listThongBao}
                  keyExtractor={(item) => item.orderId}
                  renderItem={({ item }) => <this.NotificationItem item={item} />}
                />
              </View>
          }
        </View>
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
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  buttonActiveContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  buttonInactiveContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  activeMark: {
    backgroundColor: '#a2459a',
    width: 4,
  },
  activeIcon: {
    padding: 12,
    marginLeft: -4,
  },
  listContainer: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#e5e5e5',
  },
  itemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomColor: '#ededed',
    borderBottomWidth: 1,
  },
  itemTopContainer: {
    flexDirection: 'row',
  },
  itemTypeContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTopTextContainer: {
    marginRight: 40,
    marginLeft: 4,
  },
  itemName: {
    color: '#000',
    fontWeight: '500',
  },
  itemDate: {
    color: '#787878',
    fontSize: 12,
    marginTop: 8,
  },
  itemDetail: {
    color: '#787878',
    // fontSize: 12,
    marginTop: 12,
  },
});
