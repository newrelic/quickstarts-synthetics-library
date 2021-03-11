import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import Home from './Pages/Home';
import View from './Pages/View';
import CookieConsent from 'react-cookie-consent';
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
        <CookieConsent buttonText="Yes">
          <p>
            This site uses cookies{' '}
            <span role="img" aria-label="a yummie cookie">
              🍪
            </span>
          </p>
          <p>
            We use cookies and other similar technologies ("Cookies") on our
            websites and services to enhance your experience and to provide you
            with relevant content. By using our websites and services you are
            agreeing to the use of cookies.
          </p>
          <p>
            You can read more{' '}
            <a
              href="https://newrelic.com/termsandconditions/cookie-policy"
              target="_BLANK"
              rel="noopener noreferrer"
            >
              here
            </a>
            . If you consent to our cookies, please click Yes.
          </p>
        </CookieConsent>
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
