"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
/**
 * ? Local Imports
 */
const RNPoll_style_1 = tslib_1.__importDefault(require("./RNPoll.style"));
const RNPollItem_1 = tslib_1.__importDefault(require("./components/RNPollItem"));
const RNPoll_utils_1 = require("./utils/RNPoll.utils");
const RNPoll = ({ style, choices, totalVotes, pollContainerStyle, hasBeenVoted = false, disableBuiltInIncreaseVote = false, votedChoiceByID = undefined, PollItemContainer = react_native_1.View, PollContainer = react_native_1.View, onChoicePress, ...rest }) => {
    const [_hasBeenVoted, setHasBeenVoted] = React.useState(hasBeenVoted);
    const [votedChoice, setVotedChoice] = React.useState(votedChoiceByID);
    return (<react_native_1.View style={style}>
      <react_native_1.ScrollView style={RNPoll_style_1.default.scrollViewStyle} showsVerticalScrollIndicator={false}>
        <PollContainer style={[RNPoll_style_1.default.pollContainer, pollContainerStyle]} {...rest}>
          {choices.map((eachChoice) => {
        const { choice, id, votes } = eachChoice;
        const percentage = _hasBeenVoted
            ? RNPoll_utils_1.countPercentage(votes, totalVotes)
            : 0;
        return (<RNPollItem_1.default {...rest} id={id} key={id} text={choice} disabled={_hasBeenVoted} percentage={percentage} hasBeenVoted={_hasBeenVoted} votedChoiceByID={votedChoice} PollItemContainer={PollItemContainer} onPress={() => {
            setHasBeenVoted(true);
            setVotedChoice(id);
            !disableBuiltInIncreaseVote &&
                (eachChoice.votes = eachChoice.votes + 1);
            onChoicePress && onChoicePress(eachChoice);
        }}/>);
    })}
        </PollContainer>
      </react_native_1.ScrollView>
    </react_native_1.View>);
};
exports.default = RNPoll;
//# sourceMappingURL=RNPoll.js.map