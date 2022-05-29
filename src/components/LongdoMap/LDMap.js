import React, { Component } from 'react';
import { longdo, map, LongdoMap } from 'longdo-map/LongdoMap';
import $ from 'jquery';
import firebaseApp from 'firebase.js';
import { usePosition } from 'use-position';
//replace a LongdoMap.js file

class App extends Component {

  initMap(){
    navigator.geolocation.getCurrentPosition(function(position) { 
     var lat = position.coords.latitude
     var lon = position.coords.longitude
    
     const db = firebaseApp.firestore()
          const LocationCollection = db.collection('Rest') 
          const unsubscribe = LocationCollection.onSnapshot(ss => {
            // ตัวแปร local
            const Location = {}
  
            ss.forEach(document => {
                // manipulate ตัวแปร local
                Location[document.id] = document.data()
            })
  

            for(var i = 0, len = Location.lxNYmRhLwIY6ioxFfqoV.locations.length; i < len; i++){
              var data = new longdo.Marker({ lon: Location.lxNYmRhLwIY6ioxFfqoV.locations[i].lon, lat: Location.lxNYmRhLwIY6ioxFfqoV.locations[i].lat },
                {
                  title: Location.lxNYmRhLwIY6ioxFfqoV.locations[i].name,
                  span: '1m',
                  icon: {
                    url: 'https://res.cloudinary.com/daxwfdlwj/image/upload/v1617373816/Food/rest_hyxyso.png',
                    offset: { x: 43, y: 50 }
                  },
                });
              map.Overlays.add(data);
            }
            
        })
  
          
    map.Layers.setBase(longdo.Layers.GRAY);
    map.location({ lon:lon, lat:lat }, true);
    map.zoom(20, true);
    map.Ui.Zoombar.visible(false);
    map.Ui.Toolbar.visible(false);
    map.Ui.DPad.visible(false);
    map.Ui.Geolocation.visible(false);

    var circle = new longdo.Circle({
      lon: lon, lat: lat
    }, 0.0005, {
      title: 'Geom 3',
      detail: '-',
      lineWidth: 2,
      lineColor: 'rgba(70, 204, 230, 0.8)',
      fillColor: 'rgba(70, 204, 230, 0.4)'
    });
    
    map.Overlays.add(circle); //add geometry object

    var user = new longdo.Marker({ lon: lon, lat: lat },
      {
        title: 'Me',
        icon: {
          url: 'https://res.cloudinary.com/daxwfdlwj/image/upload/v1617373117/Food/test_vvzlfc.png',
          offset: { x: 43, y: 50 }
        },
      });
    map.Overlays.add(user);

//    map.Tags.add('restaurant',{
//      visibleRange: { min: 10, max: 20 },
//      icon: { url: 'https://res.cloudinary.com/daxwfdlwj/image/upload/v1617373816/Food/rest_hyxyso.png' }
//    });
    
    function searchNearby() { 
      $.ajax({ 
              url: "https://mmmap15.longdo.com/POIService/json/search?span=50m&tag=restaurant&key=12a0ec23ac86a8c19e41937423f34e96", 
              dataType: "jsonp", 
              type: "GET", 
              contentType: "application/json", 
              data: {
                  key: "12a0ec23ac86a8c19e41937423f34e96",
                  lon: lon,
                  lat: lat,
          },
          success: function (results)
          {
//            for(var i = 0, len = results.data.length; i < len; i++){
//              var data = new longdo.Marker({ lon: results.data[i].lon, lat: results.data[i].lat },
//                {
//                  title: results.data[i].name,
//                  icon: {
//                    url: 'https://res.cloudinary.com/daxwfdlwj/image/upload/v1617373816/Food/rest_hyxyso.png',
//                    offset: { x: 43, y: 50 }
//                  },
//                });
//              map.Overlays.add(data);
//            }
//

          },

      });
    }
    searchNearby()


  });
  }

  render() {
    const mapKey = '12a0ec23ac86a8c19e41937423f34e96'
    return (

          <LongdoMap id="longdo-map" mapKey={mapKey} callback={this.initMap}/>

    );
  }
}

export default App;