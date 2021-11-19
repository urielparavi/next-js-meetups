import { MongoClient, ObjectId } from 'mongodb';
import { Fragment } from 'react';
import Head from 'next/head';

import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
};

//To understand getStaticPath, let's think about the fact that with getStaticProps, a page is pre-generated during the build 
//process - this mean that of course, NextJS needs to pre-generate all versions of this dynamic page in advance for all the 
//supported IDs, because since this dynamic, NextJS needs to know for which ID values it should pre-generate the page, because
//how would it pre-generate this page otherwise? - we get the ID from the URL here (meetupId), greate, but keep it mind that
//this in not pre-generated when a user visits this page with a specific value in the URL, but during the build process. So here
// we need to pre-generated for all the URLs, for all the meetupId values users might be entering at runtime, and if they enter
//an ID for which we diden't pre-generate the page, they will see a 404 error. But because that is how it works, we need to add
//getStaticPaths, which has the job of returning an ojbect where we describe all the dynamic segment values - so all the meetup
//IDs in this case, for which this page should be pre-generated. 
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    'mongodb+srv://uriel:uriel0000@cluster0.3d6ko.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  //find() - gives us access to all meetups (documents/objects). Now actually here, I'm only interested in the IDs, and 
  //therefore we can tweak find and pass an empty object as a first argument - here we could define our filter criteria if we 
  //wanna not find all documents, but filter for certain field values, but I do wanna find all here, hence we use a empty object
  //which means give us all the objects, so we have no filter criteria, but then we can pass a second argument where we can 
  //define which fields should be extracted for every document. And by default all the fields will be returned, so all the 
  //field values - title, image and so on, but if we're only interested in the ID, we can also add underscore id and set this to
  //one, which means only include the ID, but no other field values. And with that, we're only fetching the IDs , so we fetch
  //the document objects, but they each will only contain the ID nothing else. Now again, we should call toArray() here to
  //convert this to a JS array of objects, and now we got our meetups 
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();
  //For this, this object needs to have a paths key, which is an array, and in that array, we must have multiple objects - one
  //object per version of this dynamic page, where this object has a params key, that's a must have, which then itself again is 
  //an object with all the key value pairs that might lead to our dynamic page. So if we have multiple dynamic segments, then
  // we would have multiple keys in this nested object. Here we only have meetupId as a single dynamic sgement, and hence here 
  // in this params object, we would add a meetupId key, and then enter concrete value for meetupId for which this page should
  //be pre-generated, and if we have multiple possible values like in this case where I have m1 and m2, we would return a paths
  // array with two objects inside of it, where the other one uses m2 as a meetupId. Now in reality, we would of course not hard
  //-code this as a developer, but we will also fetch our supported IDs from a database or from an API and generate this array
  //dynamically
  return {
    //fallback - this key tells NextJS whether our paths array contains all supported parameter values or just some of them. If
    //we set fallback to false, we say that our paths contains all supported meetupId values - that means that if the user 
    //enteres enything that's not supported here, for example m3, he see a 404 error. If we set fallback to true on the other 
    //hand, NextJS would try to generated a page for this meetupId dynamically on the server for the incoming request. fallback
    // is a nice feature, because it allows us to pre-generated some of our pages for specific meetupId values - for example the
    // pages which are visited most frequently, and then pre-generate the missing ones dynamically when requests for them are 
    //coming in
    fallback: false,
    //We can use meetups here, and then map every meetup item, which is a document with an id into an object, because paths 
    //should be an array of objects where every object has this params key, and then we have a nested object in there where we
    //define our meetupId values. And the values for meetupId should now be our IDs here, so here we can access meetup, so this 
    //parameter (the meetup in map), which map gives us automatically so meetup._id.toString(). With that, we're generating our
    //array of paths dynamically. And as a result if I now save this, if we reload the starting page is we click on Show 
    //Details, we're taken to the page for this specific object - for this specific meetup, and we will see this cryptic ID, 
    //which is this autogenerated ID MongoDB generated for us
    paths: meetups.map(meetup => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  //fetch data for a single meetup

  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    'mongodb+srv://uriel:uriel0000@cluster0.3d6ko.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');
  //Here we want to get access to a single meetup, not to all meetups. So I want to get access to my selectedMeetup, and we do 
  //this by using the meetupsCollection, and then using the findOne method - findOne finds one single document. And to fineOne, we
  //need to pass an object where we define how to filter, how to search for that document. On this object we can pass our field 
  //names like title, image, and so on as a keys, and then the values for which we wanna search as values. Here we wanna serach by
  //ID. So I wanna make sure that _id - the automatically added and generated ID field has a value of meetupId, so this meetupId
  //which we extract from the params up there. This then finds us this single meetup. This returns a promise because it's an
  //asynchronous task and hence we sould await this and with that we got the selectedMeetup. ObjectId - because I'm looking for an
  //id, which is equal to the id I'm getting out of my URL, but that of course will be a string - keep in mind that in MongoDB 
  //actually, our IDs are these strange object ID things. To ensure that we can currectly look for a specific ID, we need to 
  //convert it from string to such a object ID thing
  const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

  client.close();

  return {
    props: {
      //We also wanna go to selectedMeetup, and make sure that there we convert this id - this _id field back to a string, 
      //because otherwise we'll get that serialization error we saw before, and for this I'll set meetupData actually to an 
      //object where I do add an id field, which is equal to selectedMeetup._id.toString(), and where I then add all the other
      //data, and with all that done, if we now save this, if we reload a single meetup page, we see the data for that single
      //meetup, and that works for all tee meetups now, and now these meetup detail pages are pre-rendered on the server 
      //dynamically
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      }
    },
  };
}

export default MeetupDetails;