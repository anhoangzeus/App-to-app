import React from 'react';
// import { withNavigation } from '@react-navigation/compat';
import { withNavigation } from 'react-navigation';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import materialTheme from '../constants/Theme';

const { width } = Dimensions.get('screen');
const {height} = Dimensions.get('screen');


class Product extends React.Component {
  render() {
    console.log(width);
    const { navigation, product, horizontal, full, style, priceColor, imageStyle } = this.props;
    const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];

    return (
      <Block row={horizontal} card flex style={[styles.product, styles.shadow, style]}>
        <TouchableWithoutFeedback >
          <Block flex style={[styles.imageContainer, styles.shadow]}>
            <Image source={{ uri: product.image }} style={styles.horizontalImage} />
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback >
          <Block flex space="between" style={styles.productDescription}>
            <Text size={14} style={styles.productTitle}>{product.title}</Text>
            <Text size={14} style={styles.productTitle}>{product.metades}</Text>
            <Text size={12} muted={!priceColor} color={priceColor}>${product.price}</Text>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

export default Product;

const styles = StyleSheet.create({
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE/10,
    borderWidth: 0,
    marginLeft:2,
    width:width/1.5 ,
    height:114,
   
  },
  productTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6,
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    // marginHorizontal: theme.SIZES.BASE / 2,
    height:100,
    width:50,
    
  },
  horizontalImage: {
    flex:1,
  },
  fullImage: {
   width:115,
   height:150
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});