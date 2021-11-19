import { Fragment } from 'react';
//This is a component which allows us to add Head elements to the Head section of our page
import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description" content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

//If we need to wait for data, if we need to add data fetching to a page component, we can do so by exporting a special
//function from inside our page component file. Sidenote, this will only works in our page component files, not in other files.
//Only in component files inside of the pages folder. In there, we can export a function, a function called getStaticProps, and 
//it has to be called getStaticProps - this is a reserved name so to say. NextJS will look for a function with that name, and if
//it finds it, it executes this function during this pre-rendering process, so it will then not directly call our component 
//function and use the returned JSX snapshot as HTML content, but it will first of all, call getStaticProps, before it calls the
//component function, and getStaticProps has this name, because indeed. Its job is to prepare props for this page, and these 
//props could then contain the data this page needs, and that's useful, because getStaticProps is allowed to be asynchronous.
//We can return a promise there, and then, NextJS will wait for this promise to resolve, which means it waits until our data is
//loaded. And then we return the props for this component function, and with that we are able to load data before this component
// function is executed, so that this component can be rendered with the required data


//getServerSideProps - that is reserved name, whick NextJS will be looking for, and the difference to getStaticProps, is that 
//this function will now not run during the build process, but instead, always on the server after deployment. Now we will still
// return an object here, an object with a props property, because after all, this function still is about getting the props for
//this page component, and we can still then fetch data from an API here, or from the file system (whatever we want to do). Any 
//code we write in here, will always run on the server, never in the client. So we can run the server side code in here. We can
//also perform operations that use credentials that should not be exposed to our users, because this code only runs on the 
//server, and then ultimately we return our props object, so here an object with a meetups key, which holds my DUMMY_MEETUPS,
//for example. Now we cant revalidate here,  because is doesn't make any sense here - this getServerSideProps function runs for
// every incoming requets anyways, so there is no need to revalidate every X seconds. Now what we can do in here, is we can work
//with a parameter which will receive (context). We actually also get this and getStaticProps, but I will come back to it there
//later. So here in this context argument in this content parameter, we also get access to the request object under direct key
//, and the response ojbect that will be sent back, so we have access to the incoming request and all its headers and the 
//request body if we need to, and that then might give us extra data or information, which we need for the code that executes
//in getServerSideProps. Ultimately, we don't return a response by working on that response object here, but instead, we return
// this object with the props key, which holds the props for this page component function. So that is how we then can use
//getServerSideProps for preparing that data for our page. And if we do use getServerSideProps here, and if we do use 
//getServerSideProps here, if we save everything, if we reload the starting page, we see it works fine (we get the all data)
//like before

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   //fetch data from API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   };
// }


export async function getStaticProps() {
  //fetch data from API

  //We can directly write our code for doing so here inside of getStaticProps or in a helper function, which we then execute
  //here. So we don't need to send the request to our own API route, we can immediatlely execute the code just here, which then
  //avoid this extra unnecessary requests which be sent otherwise, because the code here never in the client - the code here 
  //will also not be exposed to the client, so therefore if we wanna fetch all meetups, we can directly write the code for 
  //doing do
  const client = await MongoClient.connect(
    'mongodb+srv://uriel:uriel0000@cluster0.3d6ko.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  //find method - find will by default find all the documents in that collection, and it's an async task returning a promise
  //which we can await here, becuase I'm using the async keyword here (look up) and then ultimately we'll therefore get our 
  //meetups here. To be precise we should call toArray() here after find(), so that we get back an array of documents, and then
  //we have this array of meetups
  const meetups = await meetupsCollection.find().toArray();

  client.close();

  //Here, in getStaticProps, we can also execute any code that would normally only run on a server. We could access a file 
  //system here or securely connect to a database, because any code we write in here, will never end up on the client side and
  //it will never execute on the client side. Simply because this code is executed during the build process, not on the server
  //and especially not on the clients of our visitors. So the code in here, will never reach the machines of our visitors. It
  //wil never execute on their machines. Now here, we do wahtever we want - fetch data from API, or from a database, or read
  //data from some files in the file system, but then once we done with whatever we did to get the data we need, we need
  //to return an object here in getStaticProps
  return {
    //In this object we can configure various things, but most importantly, we typically set a props property here, and it has
    // to be named props, and that then holds another object, which will be the props object we receive in our componet function
    //here (HomePage), in this page component function. This now receives a props object and the object will be the object we 
    //set as props here
    props: {
      //The meetups here, which I set to my props, could now be the meetups which I'm fetching from mongodb
      meetups: meetups.map(meetup => ({
        //Because the auto-generated ID is not a string (it's this strange object ID thing), and turns out to be a more complex
        //object which can't be returned as data just like this. Therefore what we actually need to do here, is the meetups 
        //which we're getting from database, we wanna map this array, so that we transform every meetup a little bit and we 
        //return an object here for every meetup, except the description, because we don't need this here, so we can avoid it,
        //because we're not outputting the description anyways on this All Meetups page
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString()
      }))
    },
    //revalidate property - when we add this property to the object returned by getStaticProps, we unlock a feature called 
    //incremental Static Generation. revalidate wants a nubmer, let's say 10, and this number is the number of seconds NextJS 
    //will wait until it regenerates this page for an incoming request. That means that with revalidate set to some number,
    //this page will not just be generated during the build process - it will be generated there, but not just. It will also be
    //generated every couple of seconds on the server, at least if there are requets for this page. So that means that this 
    //page, with revalidate set to 10, would be regenerated on the server, at least every 10 seconds if there are requests 
    //coming in for this page. And then these regenerated pages, would replace the old pre-generated pages. And with that, we 
    //would ensure that our data is never older than 10 seconds, and therefore the number of seconds we wanna use here, depends
    //on our data update frequency - if our data change once every hour, then setting this to 3600 might be great. If it changes
    //all the time, one second might be better, but whatever we set this number to, we will ensure that this page will 
    //occasionally be re pre-generated on the server after deployment, so that we don't have to redeploy and rebulid all the 
    //time just because some data changed
    revalidate: 1
  };
}

export default HomePage;