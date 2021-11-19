import Layout from '../components/layout/Layout';
import '../styles/globals.css'

//This is a special file (_app.js), which exists in this page folder out of the box and which you could create on your own
// as well if it doesn't exist in which should contain content like this. This is kind of our route component - this MyApp
//component, which is defined in there, and that is just a regular React component in the end. This special component acts
// as the root component NextJS will render - it recieves props and uses object de-structuring here, to pull information out
//of the props, and the information it pulls out there, is a component prop and a page prop - this props are passed into this
//MyApp component automatically by NextJS, since NextJs is the thing using that specific component, and component is a prop
// that holds the actual page content that should be renderd, so is will be different whenever we switch a page ,and page props
//are specific props our page might be getting, and at the moment our pages are not getting any props at all, because at the
// moment we have no source that would provide such props  (look at the HomePage for exapmle), but that is something
//we're going to change. But with that, we now know that component here in this _app.js file, will in the end be the actual
//page content of our different pages, and is will change whenever we navigate from page A to page B for example. Now since
// that's the case, we can utilze this _app.js file, and simply wrap this component here with our Layout or with whichever
//wrapper we have, and we then don't have to do it inside of our diffrent page files
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp
