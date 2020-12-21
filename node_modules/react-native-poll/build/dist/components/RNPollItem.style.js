"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._animatedViewStyle = exports._container = void 0;
const react_native_1 = require("react-native");
exports._container = (borderColor, borderWidth) => ({
    flex: 1,
    borderWidth,
    borderColor,
    opacity: 1,
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
});
exports._animatedViewStyle = (backgroundColor, animatedWidth) => ({
    backgroundColor,
    width: animatedWidth,
});
exports.default = react_native_1.StyleSheet.create({
    container: {},
    choiceTextStyle: {
        flexShrink: 1,
        flexWrap: "wrap",
        color: "#19191a",
        paddingHorizontal: 16,
    },
    pollItemContainer: {
        marginRight: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    percentageTextStyle: {
        fontSize: 12,
        lineHeight: 24,
        color: "#19191a",
        fontWeight: "700",
    },
    checkMarkImageStyle: {
        width: 18,
        height: 18,
        marginRight: 12,
        tintColor: "#19191a",
    },
});
//# sourceMappingURL=RNPollItem.style.js.map