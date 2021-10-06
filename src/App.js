import React, {Component} from 'react';
import loader from './images/loader.svg';
import clearBtn from './images/close-icon.svg';
import Gif from './Gif';

const randomChoice = arr => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex]
}

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    { hasResults ? 
      <button onClick={clearSearch}><img src={clearBtn} alt="clear search" /> </button>
      : <h1 className="title">RandoGif</h1> 
    }
    
  </div>
)

const UserHint = ({loading, hint}) => (
  <div className="user-hint">
    {loading ? <img src={loader} className="block mx-auto" alt="loading" /> : hint}
  </div>
)

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      query: '',
      hint: '',
      gifs: []
    }
  }
  
  searchGiphy = async query => {
    this.setState({
      loading: true
    })

    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=oOcuMqxrXqYQU3FphT16qhe34mwnakPB&q=${query}&limit=25&offset=0&rating=r&lang=en`);
      
      const {data} = await response.json();

      if (!data.length) {
        throw `Sorry! There aren't any gifs for ${query}`
      }

      const randomGif = randomChoice(data)

      this.setState((prevState, props) => ({
        ...prevState,
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hint: `Press enter for more ${query}!`
      }))

    } catch (error) {
      this.setState((prevState, props)=>({
        ...prevState,
        hint: error,
        loading: false
      }))
    }
  }

  handleChange = event => {
    const {value} = event.target

    this.setState((prevState, props) => ({
      ...prevState, 
      query: value,
      hint: value.length > 2 ? `Press enter to search ${value}` : ''
    }))
  }

  handleKeyPress = event => {
    const {value} = event.target

    if (value.length > 2 && event.key === 'Enter'){
      this.searchGiphy(value)
    }
  }

  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      query: '',
      hint: '',
      gifs: []
    }))

    this.textInput.focus()
  }

  render() {
    const { query, gifs } = this.state
    const hasResults = gifs.length

    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />

        <div className="search grid">

          {this.state.gifs.map(gif =>
            <Gif {...gif} />
          )}
          
          <input
            className="input grid-item"
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={query}
            ref={input =>{
              this.textInput = input
            }}
          />
        </div>
        <UserHint {...this.state} />
      </div>
    )
  }
}

export default App;