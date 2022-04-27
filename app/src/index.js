import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";

// import {getHeaderPicture} from './rest-call.js';
const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;
    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address,
      );
      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },


  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createStar: async function() {
    const { createStar } = this.meta.methods;
    const name = document.getElementById("starName").value;
    const id = document.getElementById("starId").value;
    await createStar(name, id).send({from: this.account});
    App.setStatus("New Star Owner is " + this.account + ".");
  }
  ,
  getStarsApi: async function() {
    let cardContainer = document.querySelector('.name-stars'); 
    const response = await fetch('https://api.le-systeme-solaire.net/rest/bodies/');
    const result = await response.json();
    const {bodies} = result; 
    bodies.forEach(element => {
      const {name,density,gravity, discoveredBy} = element;

      cardContainer.innerHTML+=(this.createCard(name, density, gravity, discoveredBy))
    })
  },

  createCard: function(name,density,gravity, discoveredBy) {
    let html = `
    <div class="col">
    <div class="card" style="width: 18rem;">
    <div class="card-body">
    <h5 class="card-title"> Name: ${name}</h5>
    <h6 class="card-subtitle mb-2 text-muted">Density: ${density}</h6>
    <p class="card-text">Gravity: ${gravity}</p>
    <p class="card-text">DiscoveredBy: ${discoveredBy ? discoveredBy : "Unknown"}</p>
  
  </div>
  </div>
</div>
    `
    return html;
  }


};


window.App = App;

async function getHeader() {
  try {
    const result = await (await fetch('https://api.nasa.gov/planetary/apod?api_key=ZuHAR2YNKL6i0blRQ6BwuDK4BXanEzPyuQN4xO7O')).json();
    console.log(result)
  } catch(e){
    console.log(e)
  }
}

// function getHeader() {
//   let myData;
//   fetch('https://api.nasa.gov/planetary/apod?api_key=ZuHAR2YNKL6i0blRQ6BwuDK4BXanEzPyuQN4xO7O')
//   .then(response => response.json())
//   .then(data=> {
//       myData = data;
//   })
//   .catch(error => {
//       console.log("I was here")
//       console.log(error) 
//   })
//   return myData;
// }


window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }


  getHeader();

  App.start();
});