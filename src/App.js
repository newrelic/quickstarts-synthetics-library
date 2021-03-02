import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import Home from './Pages/Home';
import View from './Pages/View';
import './style.scss';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: undefined,
    };
  }

  componentDidMount() {
    fetch('data.json')
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          loading: false,
          data: response,
        });
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-12 text-center loading">
              <p>Loading ...</p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <HashRouter>
        <main role="main">
          <Switch>
            <Route
              path="/view/:handle"
              render={(props) => <View data={this.state.data} {...props} />}
            />
            <Route
              path="/"
              render={(props) => <Home data={this.state.data} {...props} />}
            />
          </Switch>
        </main>
      </HashRouter>
    );
  }
}

export default App;
