const getHeaderPicture = ()=> {
    let myData;
    fetch('https://api.nasa.gov/planetary/apod?api_key=ZuHAR2YNKL6i0blRQ6BwuDK4BXanEzPyuQN4xO7O')
    .then(response => response.json())
    .then(data=> {
        myData = data;
    })
    .catch(error => {
        console.log("I was here")
        console.log(error) 
    })
    return myData;
}

getHeaderPicture();
// export {getHeaderPicture}