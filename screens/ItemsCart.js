import React from 'react';
import Payscreen from './Payment';
export default function Payment({ route, navigation}){

    var para = 0;
    var _listItem=[];
    var address={};
    if (route.params != null) {
        para =route.params.content;
        _listItem = route.params.listItem;  
        address = route.params.address;
    }
    return (
      <Payscreen
        amount = {para}
        _listItem = {_listItem}
        address = {address}
        navigation = {navigation}
      />
    );    
  }