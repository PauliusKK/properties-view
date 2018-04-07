/*eslint-disable */
/* global google */

import React, { Component } from 'react';
import { Header, Table, Message } from 'semantic-ui-react';
import API_KEY from '../data/api_key.js';
import serviceArea from '../data/serviceArea.js';
import allProperties from '../data/properties.json';
import HouseIcon from '../assets/images/house.svg';
import geolib from 'geolib'
import { withScriptjs, withGoogleMap, GoogleMap, Circle, Marker } from "react-google-maps"

var googleMapURL = "https://maps.googleapis.com/maps/api/js?key="+ API_KEY +"&v=3.exp&libraries=geometry,drawing,places";

var propertiesFiltered = {
  allIncome: 0,
  properties: []
};

class Properties extends Component {

  constructor(props) {
    super(props)

    this.state = {
      properties: []
    }

    let properties = allProperties.map((property, index) => {

      function addressLine(line) {
        switch (line) {
            case 1:
                return property.address.line1 ? property.address.line1 : null
            case 2:
                return property.address.line2 ? property.address.line2 : null
            case 3:
                return property.address.line3 ? property.address.line3 : null
            case 4:
                return property.address.line4 ? property.address.line4 : null
            default:
                return null
        }
      }

      // updating allIncome every time.
      propertiesFiltered.allIncome += property.incomeGenerated

      fetch("https://maps.googleapis.com/maps/api/geocode/json?key="+ API_KEY +"&address=" + property.address.postCode)
        .then((response) => response.json())
        .then((Geocode) => {

            var position = {
              lat: Geocode.results[0].geometry.location.lat,
              lng: Geocode.results[0].geometry.location.lng
            }

            propertiesFiltered.properties.push({
              airbnbID: property.airbnbId,
              owner: property.owner,
              incomeGenerated: property.incomeGenerated,
              numberOfBedrooms: property.numberOfBedrooms,
              numberOfBathrooms: property.numberOfBathrooms,
              inServiceArea: geolib.isPointInCircle(
                {latitude: position.lat, longitude: position.lng},
                {latitude: serviceArea.lat, longitude: serviceArea.lng},
                serviceArea.radius
              ),
              address: {
                // if addressLine output === 'null', that address line doesn't exist.
                line1: addressLine(1),
                line2: addressLine(2),
                line3: addressLine(3),
                line4: addressLine(4),
                postCode: property.address.postCode,
                city: property.address.city,
                country: property.address.country
              },
              position: position
            })

            // after pushed
            this.setState({ properties: propertiesFiltered.properties })
        })
        .catch((error) => {
            console.log(error)
        })
    });
  }

  render() {

    const GeolocationExampleGoogleMap = withScriptjs(
      withGoogleMap(props =>
        <GoogleMap
          defaultZoom={9}
          defaultCenter={{ lat: serviceArea.lat, lng: serviceArea.lng }}
          ref={()=>{props.onMapLoad}}
        >
          <Circle
            center={{ lat: serviceArea.lat, lng: serviceArea.lng }}
            radius={serviceArea.radius}
            options={{
              fillColor: '#c6eceb',
              strokeColor: '#64ccc9',
              strokeOpacity: 0.8,
              strokeWeight: 2
            }}
          >
          </Circle>

          {this.state.properties.map((property, index) => {
            return (
              <Marker
                position={property.position}
                icon={{
                  url: HouseIcon,
                  scaledSize: new google.maps.Size(31, 43)
                }}
                key={property.airbnbID}
              />
            )
          })}
        </GoogleMap>,
      ),
    );

    return (
      <div style={{'width': '100%', 'marginBottom': '50px'}}>
        <Header as='h2' style={{'textAlign': 'center', 'margin': '35px 0'}}>All Properties</Header>

        <GeolocationExampleGoogleMap
          onMapLoad={this.onMapLoad}
          onReady={this.onMapLoad}
          googleMapURL={googleMapURL}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />

        {
          this.state.properties ? <div className="properties-table">
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Owner</Table.HeaderCell>
                  <Table.HeaderCell>Address</Table.HeaderCell>
                  <Table.HeaderCell><i className="icon bed"></i> Bedrooms</Table.HeaderCell>
                  <Table.HeaderCell><i className="icon bath"></i> Bathrooms</Table.HeaderCell>
                  <Table.HeaderCell>Generated income</Table.HeaderCell>
                  <Table.HeaderCell>in Service Area</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.properties.map( (property, index) =>
                  <Table.Row key={index}>
                    <Table.Cell style={{'textTransform': 'capitalize'}}>{property.owner}</Table.Cell>
                    <Table.Cell>
                      {property.address.line1 !== null ? ( <span>{property.address.line1}</span> ) : null}
                      {property.address.line2 !== null ? ( <span>{property.address.line2}</span> ) : null}
                      {property.address.line3 !== null ? ( <span>{property.address.line3}</span> ) : null}
                      {property.address.line4 !== null ? ( <span>{property.address.line4}</span> ) : null}
                      {property.address.postCode} <br />
                      {property.address.city} <br />
                      {property.address.country}
                    </Table.Cell>
                    <Table.Cell>{property.numberOfBedrooms} <i className="icon bed"></i></Table.Cell>
                    <Table.Cell>{property.numberOfBathrooms} <i className="icon bath"></i></Table.Cell>
                    <Table.Cell>{property.incomeGenerated}£</Table.Cell>
                    <Table.Cell>{property.inServiceArea ? ( <span>Yes</span> ) : ( <span>No</span> )}</Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>

              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell>{this.state.properties.length} Properties</Table.HeaderCell>
                  <Table.HeaderCell />
                  <Table.HeaderCell />
                  <Table.HeaderCell />
                  <Table.HeaderCell>{propertiesFiltered.allIncome}£ Total Generated</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Footer>
            </Table>

          </div> : <Message hidden>There's 0 properties!</Message>
        }
      </div>
    );
  }
}

export default Properties;
