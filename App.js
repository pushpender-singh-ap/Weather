import React, { Component } from "react";
import { Provider } from "mobx-react";

import Main from "./src/Screen/Main";
import Data from "./src/Function/Functions";

const store = window.store = new Data

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}
export default App;