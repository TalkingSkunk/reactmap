import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';

import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Col } from "react-bootstrap";

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = 'pk.eyJ1IjoidGFsa2luZ3NrdW5rIiwiYSI6ImNrbXYyYTAyNDAwejMydm52aThnZ3BvY3kifQ.ER8YYxoj5YJD_-8m1hNdxg';


import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080');

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

socket.emit('lol', 'haha')



// This defines Map then specifies that it should be rendered in the <div> with the ID of app.
const Map = () => {
    //The state stores the longitude, latitude, and zoom for the map. These values will all change as your user interacts with the map.
    const mapContainer = useRef();

    const [lng, setLng] = useState(-79.47181);
    const [lat, setLat] = useState(43.67081);
    const [zoom, setZoom] = useState(11.5);

    
    
    useEffect(() => {
        socket.on('connect_failed', function() {
            console.log("Sorry, there seems to be an issue with the connection!");
         })

            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom
            });

    
        if (!navigator.geolocation){
            return alert('Geolocation not supported by your browser :(')
        }
        navigator.geolocation.watchPosition(position => {
            const userCoordinates = [parseFloat(position.coords.longitude.toFixed(5)), parseFloat(position.coords.latitude.toFixed(5))];
            console.log('your location:', userCoordinates)
            
            socket.emit('medicPosition', {
                longitude: userCoordinates[0],
                latitude: userCoordinates[1],
                timestamp: position.timestamp,
            })
            console.log('after socket')
            new mapboxgl.Marker({
                color: "#FFFFFF",
                draggable: false,
                }).setLngLat(userCoordinates)
                .addTo(map)
            map.flyTo({
                center: userCoordinates,
                zoom: 13
            });
    
            setLng(userCoordinates[0])
            setLat(userCoordinates[1])
    
            
        }, err=>{console.log(err)}, {enableHighAccuracy: true});


        map.on('load', () => {
            // Add navigation control (+/- top right, and directions on top left)
            map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        })


        // Clean up on unmount
        return () => map.remove();
    }, []);

  // The mapContainer ref specifies that map should be drawn to the HTML page in a new <div> element.
  return (
    <Col xs={12} md={6}>
    {/* <div> to display the longitude, latitude, and zoom of the map. The return statement will look like this now: */}
    <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
    </div>
      <div className="map-container" ref={mapContainer} />
    </Col>
  );
}

export default Map;
