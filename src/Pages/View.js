import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import * as config from '../config';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class View extends React.Component {
  static getState(props) {
    return {
      quickstart: props.data.quickstarts.find(
        (element) => element.id === props.match.params.handle
      ),
      path: props.match.path,
      loading: true,
      githubUrl: '',
      script: '',
      copyText: View.copyTextDefault,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (
      !state.quickstart ||
      state.quickstart.id !== props.match.params.handle
    ) {
      return View.getState(props);
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.copySuccess = this.copySuccess.bind(this);

    this.state = View.getState(props);
  }

  componentDidMount() {
    this.loadScript();
  }

  static copyTextDefault = 'Copy to clipboard';

  loadScript() {
    this.setState((prevState) => ({
      ...prevState,
      loading: true,
      githubUrl: `${config.URL_GITHUB_LIBRARY}/${prevState.quickstart.id}/script.js`,
      githubIssue: `${config.URL_GITHUB_ISSUE}?labels=bug&title=Problem%20with%20${prevState.quickstart.id}`,
    }));
    fetch(`${config.URL_DATA_FOLDER}/${this.state.quickstart.id}/script.js`)
      .then((response) => response.text())
      .then((response) => {
        this.setState({
          loading: false,
          script: response,
        });
      });
  }

  copySuccess() {
    this.setState({
      copyText: 'Done!',
    });

    setTimeout(() => {
      this.setState({
        copyText: View.copyTextDefault,
      });
    }, 1500);
  }

  render() {
    if (!this.state.quickstart) {
      return (
        <div className="container" id="root">
          <div className="album py-2">
            <div className="container" id="root">
              <div className="row py-4">
                <div className="col-8">
                  <h2>Quickstart not found</h2>
                </div>
                <div className="col-4 text-right">
                  <Link className="btn btn-info" to="/">
                    Back to listing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="container" id="root">
          <div className="row header">
            <div className="col-8">
              <h1>New Relic Quickstarts</h1>
            </div>
            <div className="col-4 text-right">
              <Link className="btn btn-info" to="/">
                Back to listing
              </Link>
            </div>
          </div>
          <div className="row pt-4">
            <div className="col-12">
              <h2 className="pt-2 pb-2">{this.state.quickstart.name}</h2>
            </div>
            <div className="col-8">
              <p className="description">{this.state.quickstart.description}</p>
            </div>
            <div className="col-4 text-right pt-1">
              <a
                className="btn btn-primary"
                href="https://one.newrelic.com/launcher/synthetics-nerdlets.home?pane=eyJuZXJkbGV0SWQiOiJzeW50aGV0aWNzLW5lcmRsZXRzLm1vbml0b3ItY3JlYXRlIiwiYWNjb3VudElkIjo4NDY3MjN9&platform[timeRange][duration]=1800000&platform[$isFallbackTimeRange]=true"
                target="_BLANK"
                rel="noopener noreferrer"
              >
                Open New Relic Synthetics
              </a>
            </div>
            <div className="col-12 pl-4">
              {this.state.loading && (
                <p>
                  <small>Loading..</small>
                </p>
              )}
              {!this.state.loading && (
                <>
                  <div className="row">
                    <div className="col-6">
                      <CopyToClipboard
                        text={this.state.script}
                        onCopy={this.copySuccess}
                      >
                        <button className="btn btn-link" type="button">
                          {this.state.copyText}
                        </button>
                      </CopyToClipboard>
                    </div>
                    <div className="col-6 text-right">
                      <a
                        href={this.state.githubUrl}
                        target="_BLANK"
                        rel="noopener noreferrer"
                        className="btn btn-link"
                      >
                        Source code
                      </a>
                      <a
                        href={this.state.githubIssue}
                        target="_BLANK"
                        rel="noopener noreferrer"
                        className="btn btn-link"
                      >
                        Report an issue
                      </a>
                    </div>
                  </div>
                  <SyntaxHighlighter language="javascript" style={docco}>
                    {this.state.script}
                  </SyntaxHighlighter>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

View.propTypes = {
  match: PropTypes.object,
};

export default View;
