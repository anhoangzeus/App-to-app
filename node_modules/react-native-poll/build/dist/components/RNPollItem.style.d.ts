import { ViewStyle, ImageStyle, TextStyle, Animated } from "react-native";
export declare const _container: (borderColor: string, borderWidth: number) => ViewStyle;
export declare const _animatedViewStyle: (backgroundColor: string, animatedWidth: Animated.AnimatedInterpolation) => ViewStyle;
interface Style {
    container: ViewStyle;
    choiceTextStyle: TextStyle;
    pollItemContainer: ViewStyle;
    percentageTextStyle: TextStyle;
    checkMarkImageStyle: ImageStyle;
}
declare const _default: Style;
export default _default;
