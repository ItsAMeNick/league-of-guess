import _ from "lodash";

const initialState = {
    this_player: "",
    player_1: "",
    player_2: "",
    version: "champions",
    stage: "lobby",
    session: {
          key: "",
          db_id: ""
    },
    round: {
      player_1_card: "",
      player_2_card: "",
      board: [],
      player_1_board: [],
      player_2_board: [],
    },
    status: {
        p1: "",
        p2: ""
    }
};

const logReducer = (state = initialState, action) => {
    switch (action.type) {
    case "dump_store": {
        console.log(state);
        return state;
    }

    case "set_session": {
        let newState = _.cloneDeep(state);
        newState.session = action.payload;
        return newState;
    }

    case "set_version": {
        let newState = _.cloneDeep(state);
        newState.version = action.payload;
        return newState;
    }

    case "set_host": {
        let newState = _.cloneDeep(state);
        newState.is_player_1 = true;
        newState.player_1 = action.payload;
        newState.this_player = action.payload
        return newState;
    }

    case "set_player": {
        let newState = _.cloneDeep(state);
        newState.is_player_1 = false;
        newState.player_2 = action.payload;
        newState.this_player = action.payload
        return newState;
    }

    case "update_player": {
        let newState = _.cloneDeep(state);
        newState.this_player = action.payload
        return newState;
    }

    case "update_game": {
        let newState = _.cloneDeep(state);
        newState.version = action.payload.version;
        newState.stage = action.payload.stage;

        newState.player_1 = action.payload.player_1;
        newState.player_2 = action.payload.player_2;

        newState.round.player_1_board = action.payload.round.player_1_board;
        newState.round.player_2_board = action.payload.round.player_2_board;

        newState.round = action.payload.round;
        newState.status = action.payload.status;

        newState.is_player_1 = (state.this_player === newState.player_1);
        return newState;
    }

    case "clear_game": {
        let newState = _.cloneDeep(initialState);
        return newState;
    }

    default:
        return state;
    }
};

export default logReducer;
