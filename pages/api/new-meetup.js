//This is our object which allows us to connect
import { MongoClient } from 'mongodb'

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
async function handler(req, res) {
  if (req.method === 'POST') {
    //Here, we can get our data by accessing req.body - the body field is another built-in field which contains the body of the
    //incoming request, the data of the incoming request, and then we can do whatever we need to do. Now this here will be the 
    //end point for creating a new meetup
    const data = req.body;
    //It's probably fair to expect that this data which we get contains a title, a meetup image and address and a description
    //(because we add data at the form - Add New Meetup)
    // const { title, image, address, description } = data;

    //we can use MongoClient and call the connect method here. Now connect does return a promise, and hence, we can turn on our
    //handler function into async funciton to use await, and then this will give us a connected client eventually
    const client = await MongoClient.connect(
      'mongodb+srv://uriel:uriel0000@cluster0.3d6ko.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    //On the client object we can call the db method - to get hold of that database to which we're connecting here (by the way,
    // if that database doesn't exist yet, it will be created on the fly - look at line up where we add meetups name to our db)
    const db = client.db();
    //Then we can get access to our meetupsCollection, and we get hold of a collection by using our db, and then the collection
    //method (the collection can have any name of our choise, just as the database if it doesn't exist yet, it will be generated on
    //the fly), and it could be named meetups as well
    const meetupsCollection = db.collection('meetups');
    //Now that we got hold of the meetupsCollection, on that collection here, we can call insertOne - which is one of the built-in
    //query commands for inserting one new document into this collection, and now the great thing about MongoDB, is that a document 
    //is just a object in the end, and that now could be an object with title, image address, description, and since that's the 
    //case, since that would make a lot of sense, we can also just directly insert data (instead the object with the entries {}),
    //this full data object into our database, and hence, we don't need to use destrucruting here. Now this also is an async 
    //operation - insertOne return a promise, ahd hence we can await this here as well, to get back the result of this operation
    //(result will be an object with for example the automatically generated ID)
    const result = await meetupsCollection.insertOne(data);

    console.log(result);
    //I call client.close - to close the database connection once wer'e done
    client.close();
    //Now we need to use this response object (res - look up), to send back a response, because we're getting a request, so we're 
    //then storing data in database - Ultimately, we also need send back a response then, and we do this with this response object,
    //and we have a status method which we can call on response to set a HTTP status code of the response which will be returned
    //for example, a 201 status code, to indicate that something was inserted successfully. We can then chain a JSON call here to
    //prepare the JSON data that will be added to the outgoing response, and here we could for example, add a message key where we
    //say 'Meetup inserted!', but of course, it's totally up to us which kind of response we wanna return
    res.status(201).json({ message: 'Meetup inserted!' });
  }
}

export default handler;