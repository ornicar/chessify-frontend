import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeVariations } from '../../actions/index';

function mapDispatchToProps(dispatch) {
  return {
    changeVariations: (variations) => dispatch(changeVariations(variations)),
  };
}

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variations: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { variations } = this.state;
    this.props.changeVariations({ variations });
    this.setState({ variations: '' });
  }
  render() {
    const { variations } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="variations">Variations</label>
          <input
            type="text"
            id="variations"
            value={variations}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit">SAVE</button>
      </form>
    );
  }
}

export default connect(null, mapDispatchToProps)(Form);
