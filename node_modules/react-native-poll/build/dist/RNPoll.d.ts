import * as React from "react";
import { StyleProp, ViewStyle } from "react-native";
export declare type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
export interface IChoice {
    id: number;
    votes: number;
    choice: string;
}
export interface IRNPollProps {
    totalVotes: number;
    hasBeenVoted?: boolean;
    votedChoiceByID?: number;
    disableBuiltInIncreaseVote?: boolean;
    choices: Array<IChoice>;
    style?: CustomStyleProp;
    pollContainerStyle?: CustomStyleProp;
    PollContainer?: any;
    PollItemContainer?: any;
    onChoicePress: (selectedChoice: IChoice) => void;
}
declare const RNPoll: React.FC<IRNPollProps>;
export default RNPoll;
