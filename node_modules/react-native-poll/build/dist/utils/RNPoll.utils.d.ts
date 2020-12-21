import { Animated } from "react-native";
import { IRNPollItemProps } from "../components/RNPollItem";
export declare const countPercentage: (value: number, sum: number) => number;
export declare const convertPercentageString: (percentage: number) => string;
export declare const calculateProgressBarAnimation: ({ percentage, hasBeenVoted, }: Pick<IRNPollItemProps, "percentage" | "hasBeenVoted">) => {
    width: Animated.AnimatedInterpolation;
};
