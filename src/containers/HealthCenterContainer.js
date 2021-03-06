import React from 'react';
import { HealthCenterComponent } from '../components/HealthCenterComponent';

const HealthCenterContainer = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <HealthCenterComponent
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${
          process.env.REACT_APP_GOOGLE_KEY !== undefined
            ? process.env.REACT_APP_GOOGLE_KEY
            : 'AIzaSyCJEqkjxBs_65tsJuM_nJKVYkfe5O38kM8'
        }`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
};

export default HealthCenterContainer;
