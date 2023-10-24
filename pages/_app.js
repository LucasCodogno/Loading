import '@/styles/globals.css';
import { Context as ResponsiveContext } from 'react-responsive';
import { UserProvider } from '@/context/UserContext';

function MyApp({ Component, pageProps, userAgent }) {
  const isServer = typeof window === 'undefined';
  const isMobile = isServer ? /Mobile|Android|iP(ad|hone|od)|webOS|BlackBerry|Windows Phone/i.test(userAgent) : window.innerWidth <= 767;



  return (
    <UserProvider>
     <ResponsiveContext.Provider value={{ isMobile }}>
        <Component {...pageProps} />
        </ResponsiveContext.Provider>
    </UserProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  let userAgent;
  if (ctx.req) { // Server side
    userAgent = ctx.req.headers['user-agent'];
  } else { // Client side
    userAgent = navigator.userAgent;
  }
  return { userAgent };
};

export default MyApp;
