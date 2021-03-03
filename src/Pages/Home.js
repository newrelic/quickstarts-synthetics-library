import React from 'react';
import Preview from '../Shared/Partials/Preview';
import PropTypes from 'prop-types';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };

    this.setSearch = this.setSearch.bind(this);
    this.search = this.search.bind(this);
  }

  setSearch(event) {
    this.setState({
      search: event.target.value,
    });
  }

  search(element) {
    const lowercaseSearch = this.state.search.toLowerCase();
    if (element.name.toLowerCase().includes(lowercaseSearch)) {
      return true;
    }

    return false;
  }

  render() {
    return (
      <div>
        <section className="jumbotron text-center">
          <div className="container">
            <h1>New Relic - Quickstart synthetics library</h1>
            <p className="lead text-muted">
              Library of curated synthetic scripts to use in New Relic Synthetics.
            </p>
          </div>

          <div className="container" id="root">
            <div className="row pt-5">
              <input
                type="text"
                className="form-control"
                id="search"
                aria-describedby="search"
                placeholder="Search for name or technology"
                value={this.state.search}
                onChange={this.setSearch}
              />
            </div>
          </div>
        </section>

        <div className="album bg-light">
          <div className="container-fluid" id="root">
            <div className="row py-3">
              {this.props.data.quickstarts
                .filter(this.search)
                .map((quickstart) => {
                  return (
                    <Preview key={quickstart.name} quickstart={quickstart} />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  data: PropTypes.object,
};

export default Home;
