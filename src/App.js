import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { clientID, clientSecret } from './credential';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

const App = () => {
  const [token, setToken] = useState('');
  const [categories, setCategories] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(clientID + ':' + clientSecret),
      },
      data: 'grant_type=client_credentials',
      method: 'POST',
    })
      .then(res => {
        setToken(res.data.access_token);
        axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + res.data.access_token,
          },
          method: 'GET',
        }).then(res => {
          console.log(res.data.categories.items);

          setCategories(res.data.categories.items);
        });
      })
      .catch(err => console.error(err));
  }, []);

  const setValue = e => {
    axios(
      `https://api.spotify.com/v1/browse/categories/${e.target.value}/playlists?limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      }
    )
      .then(res => {
        setPlaylists(res.data.playlists.items);
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <Form.Control
        className="margin"
        as="select"
        name="Categories"
        onChange={setValue}
      >
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Form.Control>
      {playlists ? (
        <div className="padding">
          <ListGroup>
            {playlists.map((playlist, index) => (
              <ListGroup.Item key={index}>
                <a key={index} href={playlist.external_urls.spotify}>
                  {playlist.name}
                </a>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      ) : (
        <h1>Please select playlist</h1>
      )}
    </div>
  );
};

export default App;
