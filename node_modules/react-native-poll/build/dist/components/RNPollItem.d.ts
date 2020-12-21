import * as React from "react";
import { StyleProp, ViewStyle, TextStyle, ImageStyle } from "react-native";
import { IRNBounceableProps } from "@freakycoder/react-native-bounceable";
declare type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
export interface ISource {
    source: string | {
        uri: string;
    };
}
export interface IRNPollItemProps extends IRNBounceableProps {
    id: number;
    text: string;
    disabled?: boolean;
    percentage: number;
    borderColor?: string;
    hasBeenVoted: boolean;
    votedChoiceByID?: number;
    fillBackgroundColor?: string;
    checkMarkIconImageSource?: ISource;
    choiceTextStyle?: TextStyle;
    percentageTextStyle?: TextStyle;
    checkMarkImageStyle?: ImageStyle;
    style?: CustomStyleProp;
    children?: React.ReactNode;
    renderIcon?(): JSX.Element;
    ImageComponent?: any;
    PollItemContainer?: any;
    onPress: () => void;
}
declare const RNPollItem: React.FC<IRNPollItemProps>;
export default RNPollItem;
