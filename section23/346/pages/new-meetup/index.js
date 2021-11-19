//our-domain.com/new-meetup
import { Fragment } from "react";
import Head from 'next/head';
import { useRouter } from "next/router";

import NewMeetupForm from "../../components/meetups/NewMeetupForm";

const NewMeetupPage = () => {
  const router = useRouter();

  const addMeetupHandler = async (enteredMeetupData) => {
    const response = await fetch('/api/new-meetup', {
      method: 'POST',
      //That has to be JS object which carries the data we wanna store in our database - a title, a image , an address and the
      //description field. Now here, enteredMeetupData which we're getting from NewMeetupForm (look at meetupData), does have
      //those fields already - it has a title, image, description, address field, and since that's the case,  in the end we can
      // simply pass enteredMeetupData as a body
      body: JSON.stringify(enteredMeetupData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    console.log(data);

    router.push('/');
  };

  return (
    <Fragment>
      <Head>
        <title>Add a New Meetup</title>
        <meta
          name="description" content="Add your own meetups and create amazing networking opportunities."
        />
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </Fragment>
  );
};

export default NewMeetupPage;