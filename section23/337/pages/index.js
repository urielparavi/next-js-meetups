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

const HomePage = (props) => {
  return (
    <MeetupList meetups={props.meetups} />
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
      //Here we could have meetups key - the structure of this props object is totaly up to us, which holds our DUMMY_MEETUPS.
      //With that, those DUMMY_MEETUPS would be loaded and prepared in getStaticProps, and then thay would be set as props for
      //this page component. And that's how we can move the data fetching away from the client to the server-side, or to be 
      //precise to the during the build process side
      meetups: DUMMY_MEETUPS
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
    revalidate: 10
  };
}

export default HomePage;