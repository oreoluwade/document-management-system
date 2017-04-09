import React from 'react';
import { connect } from 'react-redux';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.search}>
          <div className="input-field">
            <input
              id="search"
              type="search"
              value={this.state.search}
              onChange={this.handleChange}
              required
            />
            <label htmlFor="search"><i className="material-icons">search</i></label>
            <i className="material-icons">close</i>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(SearchForm);
