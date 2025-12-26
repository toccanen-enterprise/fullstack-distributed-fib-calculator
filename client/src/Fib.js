import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: '',
  };
  fetchValuesIntervalId = null;
  fetchIndexesIntervalId = null;

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }
  componentWillUnmount() {
    clearInterval(this.fetchIndexesIntervalId);
    clearInterval(this.fetchValuesIntervalId);
  }

  async fetchValues() {
    const values = await axios.get('/api/values/current');
    this.setState({ values: values.data });
    this.fetchValuesIntervalId = setInterval(async () => {
      const values = await axios.get('/api/values/current');
      this.setState({ values: values.data });
    }, 5000);
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get('/api/values/all');
    this.setState({
      seenIndexes: seenIndexes.data,
    });
    this.fetchIndexesIntervalId = setInterval(async () => {
      const seenIndexes = await axios.get('/api/values/all');
      this.setState({
        seenIndexes: seenIndexes.data,
      });
    }, 5000);
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    await axios.post('/api/values', {
      index: this.state.index,
    });
    this.setState(prev => ({ 
      ...prev, 
      index: '', 
      seenIndexes: [...prev.seenIndexes, {number: prev.index}] 
    }));
  };

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(', ');
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
