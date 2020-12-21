"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateProgressBarAnimation = exports.convertPercentageString = exports.countPercentage = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
exports.countPercentage = (value, sum) => {
    if (!sum || !value)
        return 0;
    return (value / sum) * 100;
};
exports.convertPercentageString = (percentage) => " " + Math.round(percentage) + "%";
exports.calculateProgressBarAnimation = ({ percentage, hasBeenVoted, }) => {
    const initialPercentage = hasBeenVoted ? percentage : 0;
    const progress = React.useRef(new react_native_1.Animated.Value(initialPercentage)).current;
    React.useEffect(() => {
        react_native_1.Animated.timing(progress, {
            duration: 1250,
            toValue: percentage,
            useNativeDriver: false,
        }).start();
    }, [percentage]);
    const width = progress.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
    });
    return { width };
};
//# sourceMappingURL=RNPoll.utils.js.map