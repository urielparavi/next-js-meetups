import { useEffect, useState } from 'react';

import MeetupList from '../components/meetups/MeetupList';

const DUMMY_MEETUPS = [
  {
    id: 'm1',
    title: 'A First Meetup',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
    address: 'Some address 5, 12345 Some City',
    description: 'This is a first meetup!'
  },
  {
    id: 'm2',
    title: 'A Second Meetup',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
    address: 'Some address 10, 12345 Some City',
    description: 'This is a second meetup!'
  }
];

const HomePage = () => {
  const [loadedMeetups, setLoadedMeetups] = useState([]);

  //*We simulating that fetch data from a sever, because we wanna show the problem it creates
  //useEffect work such that it executes this function after the component function was executed. So that means that
  //the first time  HomePage component is rendered, loadedMeetups will be an empty array - then this effect function will 
  //execute. It will then update the state, and then this component function will execute again, because the state changed, and
  //it will then re-rendered the list with the actual data, but we'll have two component renders cycles, and in the first 
  //render cycle, the first time this component renders, the loadedMeetups state will be this initial state, this empaty array
  //(look up). Now I'm emphasizing this, because if we would fetch this from a backend, our users might see a loading spinner
  //briefly, which could or could not be the user experience we wanna offer, but in addition, even here where we don't really
  //send the request and where the response in quotes "arrives basically instantly", even this case - because of these two
  //render cycles, we have a problem with search engine optimization. If we viewed a page source, we will notice that the 
  //actual meetup data is missing. We got my unordered list (look at page), and this unordered list is empty. So the items which
  // we see on the screen, these items are missing in the HTML content, in the HTML page we fetched from the server, and they 
  //are missing, because they are only rendered in the second component execution cycle, but the pre-rendered HTML page 
  //generated by NextJS automatically, does not wait for this second cycle. It always takes the result of the first render cycle
  //and return that as the pre-rendered HTML code, and there this data is missing
  useEffect(() => {
    //send a http request and fetch data
    setLoadedMeetups(DUMMY_MEETUPS);
  }, []);

  return (
    <MeetupList meetups={loadedMeetups} />
  );
};

export default HomePage;