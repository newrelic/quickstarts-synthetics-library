import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Preview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="col-sm-12 col-lg-6">
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row">
              <div className="col-8">
                <h5 className="card-title">
                  <Link className="" to={`/view/${this.props.quickstart.id}`}>
                    {this.props.quickstart.name}{' '}
                  </Link>
                  <span className="badge bg-dark text-light">
                    {this.props.quickstart.type}
                  </span>
                  {this.props.quickstart.authors.length > 0 && (
                    <span className="d-block">
                      <small className="text-muted text-small">
                        Created by {this.props.quickstart.authors.join(', ')}
                      </small>
                    </span>
                  )}
                </h5>
              </div>
              <div className="col-4 text-right">
                <small>
                  {this.props.quickstart.monitorType === 'SCRIPT_BROWSER' && (
                    <a
                      href="https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/scripting-monitors/introduction-scripted-browser-monitors"
                      target="_BLANK"
                      rel="noopener noreferrer"
                    >
                      Browser script
                    </a>
                  )}
                  {this.props.quickstart.monitorType === 'SCRIPT_API' && (
                    <a
                      href="https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/scripting-monitors/write-synthetic-api-tests"
                      target="_BLANK"
                      rel="noopener noreferrer"
                    >
                      API test
                    </a>
                  )}
                </small>
              </div>
            </div>
            <p className="card-text">{this.props.quickstart.description}</p>
          </div>
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  quickstart: PropTypes.object,
};

export default Preview;
