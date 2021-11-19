// /api/new-meetup => This would be the URL of this file, and if a request is sent to this URL, it will trigger the function
// which we have to define in this file

// POST /api/new-meetup => Only post request trigger this code in this route

//Often these function named handler, but the name up to us. The important thing is that it's exported, so we export this 
//handler function here, and this function will receive a request and a response object - the request object contains data
//about the incoming request, the response object will be needed for sending back a response. Now from that request object,
// we can get things like the headers or the request body, and also the request method, to the method property here - this allow
//us to find out which kind of request was sent, and we could for example, check if we are receiving a post request here, so
//if the request method is POST, and we only execute the code in this if check, if it is a incoming POST request. For other 
//kinds of requests, we don't do anything
function handler(req, res) {
  if (req.method === 'POST') {
    //Here, we can get our data by accessing req.body - the body field is another built-in field which contains the body of the
    //incoming request, the data of the incoming request, and then we can do whatever we need to do. Now this here will be the 
    //end point for creating a new meetup
    const data = req.body;
    //It's probably fair to expect that this data which we get contains a title, a meetup image and address and a description
    //(because we add data at the form - Add New Meetup)
    const { title, image, address, description } = data;
  }
}

export default Handler;