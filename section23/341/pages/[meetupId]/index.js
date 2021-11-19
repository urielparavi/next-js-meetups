import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetails = () => {
  return (
    <MeetupDetail
      image='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg'
      title="First Meetup"
      address="Some Street 5, Some City"
      description="This is a first meetup"
    />
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
    paths: [
      {
        params: {
          meetupId: 'm1',
        },
      },
      {
        params: {
          meetupId: 'm2',
        },
      },
    ],
  };
}

export async function getStaticProps(context) {
  //fetch data for a single meetup

  const meetupId = context.params.meetupId;
  console.log(meetupId);

  return {
    props: {
      meetupdData: {
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
        id: meetupId,
        title: 'First Meetup',
        address: 'Some Street 5, Some City',
        description: 'This is a first meetup',
      },
    },
  };
}

export default MeetupDetails;