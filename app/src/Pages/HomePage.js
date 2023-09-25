import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Banner from "../components/Banner/Banner";
import NewChat from "../components/NewChat";
import ErrorFallback from "../components/ErrorBoundary";
import { SocketContext, socket } from "../context/socket";
// import CoinsTable from "../components/CoinsTable";
const CoinsTable = React.lazy(() => import("../components/CoinsTable"));

const Homepage = () => {
  return (    
      <SocketContext.Provider value={socket}>
        <Banner />
        <Suspense fallback={<div>Loading...</div>}>
        <NewChat />
        </Suspense>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            // reset the state of your app so the error doesn't happen again
          }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <CoinsTable />
          </Suspense>
        </ErrorBoundary>
      </SocketContext.Provider>    
  );
};

export default Homepage;
